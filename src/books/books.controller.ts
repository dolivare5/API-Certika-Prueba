/**
 * Importando los decoradores desde el módulo nestjs/common. Estos decoradores
 * permiten definir una clase como controlador de una entidad y además,
 * permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
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
     */
    constructor(private readonly booksService: BooksService) {
    }
    
    @ApiResponse({status: 201, description: 'Libro creado correctamente', type: Book})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del libro sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que los campos del libro sea válido.'})
    /**
     * Creando un nuevo libro.
     */
    @Post()
    create(@Body() createBookDto: CreateBookDto) {
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
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(+id, updateBookDto);
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
}
