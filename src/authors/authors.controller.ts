import { Controller, Get, Delete, Post, Put, Param, Body, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CreateAuthorDTO } from './dtos/create-author.dto';
import { UpdateAuthorDTO } from './dtos/update-author.dto';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
    constructor (private authorsService: AuthorsService) {}

    @Get('/')
    getAll() {
        return this.authorsService.getAll();
    }

    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const author = await this.authorsService.getById(id);
        if(!author) throw new NotFoundException('Author not found');
        return author;
    }

    @Post('/')
    create(@Body() authorData: CreateAuthorDTO) {
        return this.authorsService.create(authorData);
    }

    @Put('/:id')
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() authorData: UpdateAuthorDTO) {
        const author = await this.authorsService.getById(id);
        if(!author) throw new NotFoundException('Author not found');

        await this.authorsService.updateById(id, authorData);
        return { success: true };
    }

    @Delete('/:id')
    async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
        const author = await this.authorsService.getById(id);
        if(!author) throw new NotFoundException('Author not found');

        await this.authorsService.deleteById(id);
        return { success: true };
    }
}
