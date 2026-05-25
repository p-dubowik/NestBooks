import { Controller, Get, Post, Put, Delete, Param, ParseUUIDPipe, NotFoundException, Body } from '@nestjs/common';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

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
    create(@Body() bookData: CreateBookDTO) {
        return this.booksService.create(bookData);
    }

    @Put('/:id')
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() bookData: UpdateBookDTO) {
        const book = await this.booksService.getById(id);
        if(!book) throw new NotFoundException('404 not found');

        await this.booksService.updateById(id, bookData);
        return { success: true };
    }

    @Delete('/:id')
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if(!book) throw new NotFoundException('404 not found');

        await this.booksService.deleteById(id);
        return { success: true };
    }
}
