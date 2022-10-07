/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
*/
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { AuthorService } from './authores.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {Author} from "./entities/author.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";

/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Authors")
@Controller('authors')
export class AuthorsController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias. En este caso,
     * inyectamos el servicio de autores.
     * @param authorService
     */
    constructor(private readonly authorService: AuthorService) {}
    
    @ApiResponse({status: 201, description: 'Autor creado correctamente', type: Author})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del autor sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que el id del autor sea válido.'})
    /**
     * Este endpoint permite crear un autor.
     */
    @Post()
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorService.create(createAuthorDto);
    }
    
    @ApiResponse({status: 200, description: 'Autores encontrados correctamente', type: Author})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del autor sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que el id del autor sea válido.'})
    /**
     * Este endpoint permite buscar los autores registrados en la base de datos
     */
    @Get()
    findAll() {
        return this.authorService.findAll();
    }
    
    @ApiResponse({status: 200, description: 'Autor encontrado correctamente', type: Author})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del autor sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que el id del autor sea válido.'})
    /**
     * Este endpoint permite buscar un autor por su id.
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.findOne(id);
    }
    
    @ApiResponse({status: 200, description: 'Autor actualizado correctamente', type: Author})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del autor sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que el id del autor sea válido.'})
    /**
     * Este endpoint permite actualizar un autor por su id.
     */
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
        return this.authorService.update(id, updateAuthorDto);
    }
    
    @ApiResponse({status: 200, description: 'Autor eliminado correctamente', type: Author})
    @ApiResponse({status: 400, description: 'Bad request. Verifique que los campos del autor sean válido.'})
    @ApiResponse({status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({status: 404, description: 'Not found. Verifique que el id del autor sea válido.'})
    /**
     * Este endpoint permite eliminar un autor por su id.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.remove(id);
    }
}
