import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import {Loan} from "./entities/loan.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";

@Module({
    controllers: [LoansController],
    providers: [LoansService],
    imports: [
        TypeOrmModule.forFeature([Loan, User])
    ]
})
export class LoansModule {}
