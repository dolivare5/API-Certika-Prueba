import {Module} from '@nestjs/common';
import {BooksService} from './books.service';
import {BooksController} from './books.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Author} from "./entities/author.entity";
import {Book} from "./entities/book.entity";
import {Editorial} from "./entities/editorial.entity";
import {Category} from "./entities/category.entity";

@Module({
    controllers: [BooksController],
    providers: [BooksService],
    imports: [
        TypeOrmModule.forFeature([Editorial, Category, Book, Author])
    ],
})
export class BooksModule {
}
