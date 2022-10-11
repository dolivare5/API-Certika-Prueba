import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import {Loan} from "./entities/loan.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {InventoriesModule} from "../inventories/inventories.module";
import {BooksModule} from "../books/books.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [LoansController],
    providers: [LoansService],
    imports: [
        TypeOrmModule.forFeature([Loan, User]),
        InventoriesModule,
        BooksModule,
        UsersModule
    ]
})
export class LoansModule {}
