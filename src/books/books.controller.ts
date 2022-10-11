/**
 * Importando los decoradores desde el módulo nestjs/common. Estos decoradores
 * permiten definir una clase como controlador de una entidad y además,
 * permiten definir el comportamiento de los endpoints de la entidad.
 */
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post, Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import {BooksService} from './books.service';
import {CreateBookDto} from './dto/create-book.dto';
import {UpdateBookDto} from './dto/update-book.dto';
import {Book} from "./entities/book.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {ConfigService} from "@nestjs/config";
import {fileFilter, fileNamer} from "./helpers";

/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Books")
@Controller('books')
export class BooksController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de libros.
     * @param booksService
     * @param configService
     */
    constructor(
        private readonly booksService: BooksService,
        private readonly configService: ConfigService
    ) {
    }
    
    @ApiResponse({status: 201, description: 'Libro creado correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    /**
     * Creando un nuevo libro.
     */
    @Post()
    create(
        @Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }
    
    
    @ApiResponse({status: 200, description: 'Libros encontrados correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    @Get()
    findAll() {
        return this.booksService.findAll();
    }
    
    
    @ApiResponse({status: 200, description: 'Libro encontrado correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    /**
     * Este método se encarga de buscar un libro por su id
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findOne(id);
    }
    
    
    @ApiResponse({status: 200, description: 'Libro actualizado correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    /**
     * Este método se encarga de eliminar un libro por su id
     */
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }
    
    
    @ApiResponse({status: 200, description: 'Libro eliminado correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    /**
     * Este método se encarga de eliminar un libro por su id
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.remove(id);
    }
    
    /* Este es un método que se encarga de subir archivos al servidor */
    @Post('photo/:id')
    /**
     *  UseInterceptors es un decorador que se encarga de interceptar la petición y ejecutar el interceptor
     *  En este caso, el interceptor es FileInterceptor, que se encarga de subir archivos al servidor y
     *  guardarlos en la carpeta uploads
     *  */
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFilter,
        storage: diskStorage({
            destination: './static/uploads/books',
            filename: fileNamer
        })
    }))
    async uploadFile(
        /**
         *  Este es el archivo que se va a subir al servidor. Este archivo es de tipo multipart/form-data
         *  y se llama file
         *  */
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number
    ) {
        /**
         * Si el archivo no existe, se lanza una excepción
         */
        if (!file){
            throw new BadRequestException('La imagen es requerida');
        }
        const secureUrl = `${ this.configService.get('HOST_API')}/books/photo/${file.filename}`;
        return await this.booksService.update(id, undefined, secureUrl, file.filename);
    }
    
    
    @Get('photo/:imageName')
    findProductImage(
        @Res() res: Response,
        @Param('imageName') imageName: string
    ) {
        const path = this.booksService.getStaticProductsImage(imageName);
        // @ts-ignore
        res.sendFile(path);
    }
}
