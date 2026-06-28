import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessLog, AccessLogDocument } from './schemas/access-log.schema';

@Injectable()
export class AccessLogsService {
  private readonly logger = new Logger(AccessLogsService.name);

  constructor(
    @InjectModel(AccessLog.name) private accessLogModel: Model<AccessLogDocument>,
  ) {}

  async create(createLogDto: any): Promise<AccessLog | null> {
    try {
      const createdLog = new this.accessLogModel(createLogDto);
      return await createdLog.save();
    } catch (error) {
      this.logger.error('Failed to create access log', error);
      return null;
    }
  }

  async findAll(query: any): Promise<{ data: AccessLog[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, date } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (date) {
      // date is YYYY-MM-DD
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const [data, total] = await Promise.all([
      this.accessLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(),
      this.accessLogModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }
}
