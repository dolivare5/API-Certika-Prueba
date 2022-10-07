/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { EditorialsService } from './editorials.service';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import {Editorial} from "./entities/editorial.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";

/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Editorials")
@Controller('editorials')
export class EditorialsController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de editoriales.
     * @param editorialsService
     */
    constructor(private readonly editorialsService: EditorialsService) {}
    
    @ApiResponse({ status: 201, description: 'Editorial creada correctamente', type: Editorial})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la editorial sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la editorial sea válido.'})
    /**
     * Este endpoint permite Crear editoriales.
     */
    @Post()
    create(@Body() createEditorialDto: CreateEditorialDto) {
        return this.editorialsService.create(createEditorialDto);
    }
    
    
    @ApiResponse({ status: 201, description: 'Editorial creada correctamente', type: Editorial})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la editorial sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la editorial sea válido.'})
    /**
     * Este endpoint permite obtener las editoriales que se encuentran activas.
     */
    @Get()
    findAll() {
        return this.editorialsService.findAll();
    }
    
    
    @ApiResponse({ status: 201, description: 'Editorial encontrada correctamente', type: Editorial})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la editorial sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la editorial sea válido.'})
    /**
     * Este endpoint permite obtener una editorial por su id.
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.editorialsService.findOne(id);
    }
    
    
    @ApiResponse({ status: 201, description: 'Editorial actualiza correctamente', type: Editorial})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la editorial sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la editorial sea válido.'})
    /**
     * Este endpoint permite actualizada una editorial por su id.
     */
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateEditorialDto: UpdateEditorialDto) {
        return this.editorialsService.update(+id, updateEditorialDto);
    }
    
    
    
    @ApiResponse({ status: 201, description: 'Editorial eliminada correctamente', type: Editorial})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la editorial sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la editorial sea válido.'})
    /**
     * Este endpoint permite eliminar una editorial por su id.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.editorialsService.remove(id);
    }
}
