import { Module } from '@nestjs/common';
import { AuthorService } from './authores.service';
import { AuthorsController } from './authores.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Author} from "./entities/author.entity";

@Module({
    controllers: [AuthorsController],
    providers: [AuthorService],
    imports: [
        TypeOrmModule.forFeature([Author])
    ],
    exports: [AuthorService]
})
export class AuthorsModule {}
