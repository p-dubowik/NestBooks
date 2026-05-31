import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userservice: UsersService) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.userservice.getAll();
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const user = await this.userservice.getById(id);
        if(!user) throw new NotFoundException('User not found');
        return user;
    }
}
