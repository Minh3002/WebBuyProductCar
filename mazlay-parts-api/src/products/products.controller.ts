import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { memoryStorage } from 'multer';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

// Cấu hình Cloudinary bằng biến môi trường (Sẽ được nạp từ .env hoặc Vercel)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const uploadStorage = hasCloudinaryConfig ? cloudinaryStorage : memoryStorage();

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: uploadStorage,
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new Error('Chỉ cho phép upload file ảnh'), false);
          return;
        }
        callback(null, true);
      },
      limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImages(@UploadedFiles() files: any[]) {
    return {
      urls: files.map((file) => {
        if (file.path) return file.path;
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }),
    };
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('oem/:oemCode')
  findByOem(@Param('oemCode') oemCode: string) {
    return this.productsService.findByOem(oemCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    if (!body.ids || !Array.isArray(body.ids)) {
      return { message: 'Invalid data' };
    }
    return this.productsService.bulkDelete(body.ids);
  }
}
