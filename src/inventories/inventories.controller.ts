/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";
/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Inventories")
@Controller('inventories')
export class InventoriesController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de inventarios.
     * @param inventoriesService
     */
    constructor(private readonly inventoriesService: InventoriesService) {}
    
    @ApiResponse({ status: 201, description: 'Inventario creado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite crear un inventario.
     */
    @Post()
    create(@Body() createInventoryDto: CreateInventoryDto) {
        return this.inventoriesService.create(createInventoryDto);
    }
    
    
    
    
    @ApiResponse({ status: 201, description: 'Inventario encontrado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite obtener un inventario de un usuario.
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.inventoriesService.findOne(+id);
    }
    
    
    @ApiResponse({ status: 201, description: 'Inventario actualizado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite actualizar un inventario de un usuario.
     */
    @Patch('addUnits/:id')
    update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
        return this.inventoriesService.addPurchase(+id, updateInventoryDto);
    }
    
    
    @ApiResponse({ status: 201, description: 'Inventario actualizado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite registrar el préstamo de un libro.
     */
    @Patch('loan/:id')
    loan(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
        return this.inventoriesService.loanBook(+id, updateInventoryDto);
    }
    
    
    @ApiResponse({ status: 201, description: 'Inventario actualizado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite registrar el préstamo de un libro.
     */
    @Patch('return/:id')
    return(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
        return this.inventoriesService.returnBook(+id, updateInventoryDto);
    }
    
    
    
    
    
    @ApiResponse({ status: 201, description: 'Inventario eliminado correctamente', type: Inventory})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del inventario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del inventario sea válido.'})
    /**
     * Este endpoint permite eliminar un inventario de un usuario.
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoriesService.remove(+id);
    }
}
