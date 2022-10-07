/**
 * Decoradores importados de la librería class-validator los cuales nos permiten
 * validar los datos de entrada de las rutas.
 */
import {IsEmail, IsInt, IsOptional, IsString, MinLength} from "class-validator";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API.
 */
import { ApiProperty } from "@nestjs/swagger";

/**
 * Esta clase es un DTO que se utiliza para crear una categoría.
 * Un DTO es un objeto que se usa para transferir datos entre diferentes capas
 * de la aplicación.
 */
export class CreateAuthorDto {
    /**
     * Utilizo decoradores para indicar las validaciones que se deben aplicar
     * a los datos de entrada.
     */

    @ApiProperty({
        example: 'Deiber',
        description: 'Nombre del autor',
        nullable: false
    })
    @IsString({ message: 'El nombre del autor debe ser un texto' })
    @MinLength(3, { message: 'El nombre del autor debe tener al menos 3 caracteres' })
    Aut_firstName: string;
    
    @ApiProperty({
        example: 'Olivares',
        description: 'Apellido del autor',
        nullable: false
    })
    @IsString({ message: 'El apellido del autor debe ser un texto' })
    @MinLength(3, { message: 'El apellido del autor debe tener al menos 3 caracteres' })
    Aut_lastName: string;
    
    @ApiProperty({
        example: 'olivares45@gmail.com',
        description: 'Correo del autor',
    })
    @IsString({ message: 'El correo del autor debe ser un texto' })
    @MinLength(3, { message: 'El correo del autor debe tener al menos 3 caracteres' })
    @IsOptional()
    @IsEmail({}, { message: 'El correo del autor debe ser un correo válido' })
    Aut_email: string;
}
