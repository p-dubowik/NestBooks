import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { CreateBookDTO } from './dtos/create-book.dto';


@Injectable()
export class BooksService {
    constructor(private prismaService: PrismaService) {}

    public getAll(): Promise<Book[]> {
        return this.prismaService.book.findMany();
    }

    public getById(id: Book['id']): Promise<Book | null> {
        return this.prismaService.book.findUnique({
            where: {id},
            include: {
                author: true
            }
        });
    }

    public async create(bookData: CreateBookDTO): Promise<Book> {
        try {
            return this.prismaService.book.create({
                data: bookData
            });
        } catch(error) {
            if(error.code === 'P2002') {
                throw new ConflictException('Title is already taken');
            }
            throw error;
        }
    }

    public async updateById(id: Book['id'], bookData: UpdateBookDTO): Promise<Book> {
        try{
            return this.prismaService.book.update({
                data: bookData,
                where: {id}
            });
        } catch(error) {
            if(error.code === 'P2002') {
                throw new ConflictException('Title is already taken');
            }
            throw error;
        }
    }

    public deleteById(id: Book['id']): Promise<Book> {
        return this.prismaService.book.delete({
            where: {id}
        });
    }
}
