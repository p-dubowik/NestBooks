import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Password } from '@prisma/client';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    public getAll(): Promise<User[]> {
        return this.prismaService.user.findMany({
            include: {
                books: {
                    include: {
                        book: true
                    },
                },
            },
        });
    }

    public getById(id: User['id']): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {id}
        });
    }

    public getByEmail(email: User['email']): Promise<(User & {password: Password}) | null> {
        return this.prismaService.user.findUnique({
            where: {email},
            include: {
                password: true
            }
        });
    }

    public async create(userData: CreateUserDTO, password: string): Promise<User> {
        try {
            
            return await this.prismaService.user.create({
                data: {
                    ...userData,
                    password: {
                        create: {
                            hashedPassword: password,
                        },
                    },
                },
            });
        } catch(error) {
            if(error.code === 'P2002') {
                throw new ConflictException('Email already in use');
            }
            throw error;
        }
    }

    public async updateById(userId: User['id'], userData: UpdateUserDTO, password: string | undefined): Promise<User> {
        if(password){
            return await this.prismaService.user.update({
                where: { id: userId },
                data: {
                    ...userData,
                    password: {
                        update: {
                            hashedPassword: password,
                        },
                    },
                },
            });
        } else {
            return await this.prismaService.user.update({
                where: { id: userId },
                data: userData
            })
        }
    }

    public deleteById(id: User['id']): Promise<User> {
        return this.prismaService.user.delete({
            where: { id }
        });
    };
}
