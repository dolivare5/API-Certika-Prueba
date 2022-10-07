/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import {Loan} from "./entities/loan.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";
/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */
@ApiTags("Loans")
@Controller('loans')
export class LoansController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de préstamos.
     * @param loansService
     */
    constructor(private readonly loansService: LoansService) {}
    
    
    @ApiResponse({ status: 201, description: 'Préstamo creado correctamente', type: Loan})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del préstamo sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del préstamo sea válido.'})
    /**
     * Este endpoint permite crear un préstamo.
     */
    @Post()
    create(@Body() createLoanDto: CreateLoanDto) {
        return this.loansService.create(createLoanDto);
    }
    
    
    
    @ApiResponse({ status: 200, description: 'Préstamos encontrados correctamente', type: Loan})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del préstamo sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del préstamo sea válido.'})
    /**
     * Este endpoint permite obtener todos los préstamos.
     */
    @Get()
    findAll() {
        return this.loansService.findAll();
    }
    
    
    
    @ApiResponse({ status: 200, description: 'Préstamo encontrado correctamente', type: Loan})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del préstamo sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del préstamo sea válido.'})
    /**
     * Este endpoint permite obtener un préstamo por su id.
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.loansService.findOne(id);
    }
    
    
    @ApiResponse({ status: 200, description: 'Préstamo actualizado correctamente', type: Loan})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del préstamo sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del préstamo sea válido.'})
    /**
     * Este endpoint permite actualizar un préstamo por su id.
     */
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLoanDto: UpdateLoanDto) {
        return this.loansService.update(+id, updateLoanDto);
    }
    
    
    @ApiResponse({ status: 200, description: 'Préstamo eliminado correctamente', type: Loan})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del préstamo sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del préstamo sea válido.'})
    /**
     * Este endpoint permite eliminar un préstamo por su id.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.loansService.remove(id);
    }
}
