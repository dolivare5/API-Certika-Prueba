import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {User} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        // Importamos el módulo de TypeOrm para la entidad User.
        TypeOrmModule.forFeature([User]),
    ]
})
export class UsersModule {}
