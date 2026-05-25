import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    public getAll(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    public getById(id: User['id']): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {id}
        });
    }

    public getByEmail(email: User['email']): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {email},
            include: {
                password: true
            }
        });
    }

    public async create(email: User['email'], password: string): Promise<User> {
        try {
            
            return await this.prismaService.user.create({
                data: {
                    email,
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

    public async updateById(userId: User['id'], userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, password: string | undefined): Promise<User> {
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
