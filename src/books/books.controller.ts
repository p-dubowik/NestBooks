import { Controller, Get, Post, Put, Delete, Param, ParseUUIDPipe, NotFoundException, Body, UseGuards } from '@nestjs/common';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService, private prismaService: PrismaService, private usersService: UsersService) {}

    @Get('/')
    getAll() {
        return this.booksService.getAll();
    }

    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if(!book) throw new NotFoundException('404 not found');
        return book;
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    create(@Body() bookData: CreateBookDTO) {
        return this.booksService.create(bookData);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() bookData: UpdateBookDTO) {
        const book = await this.booksService.getById(id);
        if(!book) throw new NotFoundException('404 not found');

        await this.booksService.updateById(id, bookData);
        return { success: true };
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if(!book) throw new NotFoundException('404 not found');

        await this.booksService.deleteById(id);
        return { success: true };
    }

    @Post('/like')
    @UseGuards(JwtAuthGuard)
    async like(@Param('bookId', new ParseUUIDPipe()) bookId: string,
               @Param('userId', new ParseUUIDPipe()) userId: string)
    {
        const book = await this.booksService.getById(bookId);
        const user = await this.usersService.getById(userId);

        if(!book) throw new NotFoundException('Book not found');
        if(!user) throw new NotFoundException('User not found');

        return await this.prismaService.book.update({
            where: {id: bookId},
            data: {
                users: {
                    create: {
                        user: {
                            connect: {id: userId}
                        },
                    },
                },
            },
        });
    }
}
