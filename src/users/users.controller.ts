/**
 * Permiten definir el comportamiento de los endpoints de la entidad.
 */
import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
/**
 * Se importan los servicios y DTOs que se utilizarán en el controlador.
 */
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
/**
 * ApiResponses y ApiTags son decoradores que permiten definir la documentación
 * de los endpoints de la entidad y el controlador.
 */
import {ApiResponse, ApiTags} from "@nestjs/swagger";
/**
 * El ApiTags es un decorador que permite agrupar los endpoints de una misma
 * entidad.
 */

@ApiTags("Users")
@Controller('users')
export class UsersController {
    /**
     * Constructor de la clase. Aquí se inyectan las dependencias.
     * En este caso, inyectamos el servicio de usuarios.
     * @param usersService
     */
    constructor(private readonly usersService: UsersService) {}
    
    @ApiResponse({ status: 201, description: 'Usuario creado correctamente', type: User})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del usuario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del usuario sea válido.'})
    /**
     * Este endpoint permite crear un usuario.
     */
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    
    @ApiResponse({ status: 200, description: 'Usuarios encontrados correctamente', type: User})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del usuario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del usuario sea válido.'})
    /**
     * Este endpoint permite obtener todos los usuarios.
     */
    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    
    
    @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente', type: User})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del usuario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del usuario sea válido.'})
    /**
     * Este endpoint permite obtener un usuario por su id.
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: User})
    @ApiResponse({ status: 400, description: 'Bad request. Verifique que el id del usuario sea válido.'})
    @ApiResponse({ status: 403, description: 'Forbidden. Verifique que el token sea válido o que no haya expirado.'})
    @ApiResponse({ status: 404, description: 'Not found. Verifique que el id del usuario sea válido.'})
    /**
     * Este endpoint permite actualizar un usuario por su id.
     */
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }
    /**
     * Este endpoint permite eliminar un usuario por su id.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}
