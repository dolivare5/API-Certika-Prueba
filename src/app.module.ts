import {join}  from 'path';
import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import { BooksModule } from './books/books.module';
import {ConfigModule} from "@nestjs/config";
import {JoiValidationSchema} from "./config/joi.validation";
import {ServeStaticModule} from "@nestjs/serve-static";
import {TypeOrmModule} from "@nestjs/typeorm";
import { InventoriesModule } from './inventories/inventories.module';
import { LoansModule } from './loans/loans.module';
import { AuthorsModule } from './authors/authores.module';
import { CategoriesModule } from './categories/categories.module';
import { EditorialsModule } from './editorials/editorials.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(__dirname, '..', '.env'),
            validationSchema: JoiValidationSchema
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        
        TypeOrmModule.forRoot({
            type: 'mysql',
            port: +process.env.MYSQL_PORT,
            username: process.env.MYSQL_USER_ROOT,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [join(__dirname, '**/**.entity{.ts,.js}')],
            synchronize: true,
            autoLoadEntities: true
        }),
        BooksModule,
        InventoriesModule,
        LoansModule,
        AuthorsModule,
        CategoriesModule,
        EditorialsModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
