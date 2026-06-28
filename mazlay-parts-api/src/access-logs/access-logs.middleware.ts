import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccessLogsService } from './access-logs.service';
import * as geoip from 'geoip-lite';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  constructor(
    private readonly accessLogsService: AccessLogsService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Only log API requests, ignore static files or preflight
    if (req.method === 'OPTIONS' || !req.originalUrl.startsWith('/api/')) {
      return next();
    }

    // Try to get user info from token
    let userName = 'Khách truy cập';
    let userEmail = '';
    let userRole = 'Guest';
    let userId = '';

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        if (decoded) {
          userId = decoded.sub || decoded._id || '';
          userName = decoded.name || decoded.fullName || 'Người dùng';
          userEmail = decoded.email || '';
          userRole = decoded.role || 'Customer';
        }
      } catch (e) {
        // ignore
      }
    }

    // Get IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
    let ipString = Array.isArray(ip) ? ip[0] : ip;
    if (ipString === '::1' || ipString === '::ffff:127.0.0.1' || !ipString) {
      ipString = '127.0.0.1';
    }

    // Get Location using geoip-lite
    let location = 'Không xác định';
    if (ipString !== '127.0.0.1') {
      const geo = geoip.lookup(ipString);
      if (geo) {
        location = `${geo.city ? geo.city + ', ' : ''}${geo.country}`;
      }
    } else {
      location = 'Localhost';
    }

    // Get User Agent info
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

    // Entry source
    const referer = req.headers.referer || '';
    let entrySource = 'Direct';
    if (referer.includes('zalo')) entrySource = 'Zalo';
    else if (referer.includes('facebook') || referer.includes('fb.com')) entrySource = 'Facebook';
    else if (referer.includes('google')) entrySource = 'Google';
    else if (referer) entrySource = referer;

    // We don't want to flood DB with every single API call. 
    // Let's log if it's a login request OR just random sampling/specific endpoints if we wanted.
    // For now, we will log all as requested, but maybe exclude frequent ones like GET /api/v1/products
    const isLogin = req.originalUrl.includes('/auth/login');
    const isRegister = req.originalUrl.includes('/auth/register');
    
    // As a simple heuristic to not flood DB, we could only log auth events or checkout events, 
    // but the prompt says "mỗi khi có người dùng đăng nhập hoặc gửi request".
    // Let's log it asynchronously.
    
    this.accessLogsService.create({
      ip: ipString,
      isp: 'Unknown ISP', // geoip-lite doesn't provide ISP easily without ASN db, we leave it as Unknown or we can use another DB
      location,
      browser,
      os,
      deviceType,
      entrySource,
      resolution: 'Unknown', // Backend can't know resolution unless sent by frontend
      userId,
      userName,
      userEmail,
      userRole,
      userAgent: req.headers['user-agent'] || ''
    });

    next();
  }
}
