/**
 * Decoradores importados de la librería class-validator los cuales nos permiten
 * validar los datos de entrada de las rutas.
 */
import { IsOptional, IsString, MinLength } from "class-validator";
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

export class CreateEditorialDto {
    /**
     * Utilizo decoradores para indicar las validaciones que se deben aplicar
     * a los datos de entrada.
     */
    
    @ApiProperty({
        example: 'Alfa Omega',
        description: 'Nombre del editorial',
        uniqueItems: true,
        nullable: false,
    })
    @IsString({ message: 'El nombre del editorial debe ser un texto' })
    @MinLength(3, { message: 'El nombre del editorial debe tener al menos 3 caracteres' })
    Edit_name: string;
    
    @ApiProperty({
        example: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        description: 'Descripción del editorial',
        nullable: true
    })
    @IsString({ message: 'La descripción del editorial debe ser un texto' })
    @IsOptional()
    Edit_description: string;
    
    @ApiProperty({
        example: 'Activa',
        description: 'Estado del editorial (Activa, Inactiva)',
    })
    @IsString({ message: 'El estado del editorial debe ser un texto' })
    @IsOptional()
    Edit_status: string;
}
