import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccessLogsService } from './access-logs.service';
import * as geoip from 'geoip-lite';

const requestCache = new Map<string, number>();

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  constructor(
    private readonly accessLogsService: AccessLogsService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS' || !req.originalUrl.startsWith('/api/')) {
      return next();
    }

    // Lấy IP thật từ Vercel Header
    const forwarded = req.headers['x-forwarded-for'];
    let ipString = forwarded 
      ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0]) 
      : (req.socket.remoteAddress || req.ip || '127.0.0.1');
      
    if (ipString === '::1' || ipString === '::ffff:127.0.0.1' || !ipString) {
      ipString = '127.0.0.1';
    }

    // Chặn lưu rác từ Localhost (Anh em dev làm việc)
    const origin = req.headers.origin || '';
    if (ipString === '127.0.0.1' || origin.includes('localhost')) {
      return next();
    }

    // Throttling / Session Check (30 phút)
    const cacheKey = `${ipString}-${req.headers['user-agent']}`;
    const lastLogged = requestCache.get(cacheKey);
    const now = Date.now();
    if (lastLogged && (now - lastLogged) < 30 * 60 * 1000) {
      return next(); // Bỏ qua nếu chưa đủ 30 phút
    }
    requestCache.set(cacheKey, now);

    // Xử lý background để không block request
    this.processLog(req, ipString).catch(err => console.error('Log Error:', err));
    next();
  }

  private async processLog(req: Request, ipString: string) {
    // Thông tin User (Ưu tiên đọc từ Body nếu là endpoint tracking)
    let userName = req.body?.userName || 'Khách truy cập';
    let userEmail = req.body?.userEmail || '';
    let userRole = req.body?.userRole || 'Guest';
    let userId = req.body?.userId || '';

    // Nếu không có trong body, check từ token header
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const payloadBase64 = token.split('.')[1];
          const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
          if (decoded) {
            userId = decoded.identifier || decoded.sub || decoded._id || '';
            userName = decoded.name || decoded.full_name || decoded.fullName || 'Người dùng';
            userEmail = decoded.email || '';
            userRole = decoded.role || 'Customer';
          }
        } catch (e) {}
      }
    }

    // Thông tin thiết bị
    let browser = 'Unknown';
    let os = 'Unknown';
    let deviceType = 'Desktop';

    const userAgentString = req.headers['user-agent'] || '';
    if (userAgentString) {
      const expressUseragent = require('express-useragent');
      const ua = expressUseragent.useragent.parse(userAgentString);
      if (ua) {
        browser = `${ua.browser} ${ua.version}`;
        os = ua.os;
        if (ua.isMobile) deviceType = 'Mobile';
        else if (ua.isTablet) deviceType = 'Tablet';
        else if (ua.isBot) deviceType = 'Bot';
      }
    }

    // Gọi API lấy ISP và Location
    let location = 'Không xác định';
    let isp = 'Unknown ISP';
    try {
      const axios = require('axios');
      const response = await axios.get(`http://ip-api.com/json/${ipString}`);
      const geoData = response.data;
      if (geoData && geoData.status === 'success') {
        location = `${geoData.city ? geoData.city + ', ' : ''}${geoData.country}`;
        isp = geoData.isp || geoData.org || 'Unknown ISP';
      }
    } catch (err) {
      console.error('Failed to fetch from ip-api.com', err.message);
    }

    // Nguồn truy cập
    const referer = req.headers.referer || '';
    let entrySource = 'Direct';
    if (referer.includes('zalo')) entrySource = 'Zalo Traffic';
    else if (referer.includes('facebook') || referer.includes('fb.com')) entrySource = 'Facebook Ads';
    else if (referer.includes('google')) entrySource = 'Google';
    else if (referer) entrySource = referer;

    // Lưu DB
    this.accessLogsService.create({
      ip: ipString,
      isp,
      location,
      browser,
      os,
      deviceType,
      entrySource,
      resolution: 'Unknown',
      userId,
      userName,
      userEmail,
      userRole,
      userAgent: userAgentString
    });
  }
}
