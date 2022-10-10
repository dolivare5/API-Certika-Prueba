import { Module } from '@nestjs/common';
import { EditorialsService } from './editorials.service';
import { EditorialsController } from './editorials.controller';
import {Editorial} from "./entities/editorial.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    controllers: [EditorialsController],
    providers: [EditorialsService],
    imports: [
        TypeOrmModule.forFeature([Editorial])
    ],
    exports: [EditorialsService]
})
export class EditorialsModule {}
