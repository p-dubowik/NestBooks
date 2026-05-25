import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [BooksService, PrismaService],
  controllers: [BooksController]
})
export class BooksModule {}
