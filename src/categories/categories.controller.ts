/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {Category} from "./entities/category.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";

/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Categories")
@Controller('categories')
export class CategoriesController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de categorías.
     * @param categoriesService
     */
    constructor(private readonly categoriesService: CategoriesService) {}
    
    @ApiResponse({ status: 201, description: 'Categoría creada correctamente', type: Category})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la categoría sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la categoría sea válido.'})
    /**
     * Este endpoint permite crear categorías.
     */
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    
    @ApiResponse({ status: 200, description: 'Categorías encontradas correctamente', type: Category})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la categoría sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la categoría sea válido.'})
    /**
     * Este endpoint permite obtener las categorías que se encuentran activas.
     */
    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }
    
    @ApiResponse({ status: 200, description: 'Categoría encontrada correctamente', type: Category})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la categoría sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la categoría sea válido.'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }
    
    
    @ApiResponse({ status: 200, description: 'Categoría actualizada correctamente', type: Category})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la categoría sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la categoría sea válido.'})
    /**
     * Este endpoint permite actualizar una categoría.
     */
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(+id, updateCategoryDto);
    }
    
    
    @ApiResponse({ status: 200, description: 'Categoría eliminada correctamente', type: Category})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id de la categoría sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id de la categoría sea válido.'})
    /**
     * Este endpoint permite Eliminar una categoría.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}
