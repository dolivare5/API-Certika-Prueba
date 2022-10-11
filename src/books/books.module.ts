import {Module} from '@nestjs/common';
import {BooksService} from './books.service';
import {BooksController} from './books.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Book} from "./entities/book.entity";
import {ConfigModule} from "@nestjs/config";
import {EditorialsModule} from "../editorials/editorials.module";
import {CategoriesModule} from "../categories/categories.module";
import {AuthorsModule} from "../authors/authores.module";
import {InventoriesModule} from "../inventories/inventories.module";

@Module({
    controllers: [BooksController],
    providers: [BooksService],
    imports: [
        TypeOrmModule.forFeature([Book]),
        ConfigModule,
        EditorialsModule,
        CategoriesModule,
        AuthorsModule,
        InventoriesModule,
    ],
    exports: [BooksService]
})
export class BooksModule {
}
