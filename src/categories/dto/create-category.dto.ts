/**
 * Decoradores importados de la librería class-validator los cuales nos permiten
 * validar los datos de entrada de las rutas.
 */
import { IsInt, IsOptional, IsString, MinLength } from "class-validator";
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

export class CreateCategoryDto {
    /**
     * Utilizo decoradores para indicar las validaciones que se deben aplicar
     * a los datos de entrada.
     */
    @IsString({ message: 'El nombre de la categoría debe ser un texto' })
    @MinLength(3, { message: 'El nombre de la categoría debe tener al menos 3 caracteres' })
    Cat_name: string;
    
    @ApiProperty({
        example: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        description: 'Descripción de la categoría',
        nullable: true
    })
    @IsString({ message: 'La descripción de la categoría debe ser un texto' })
    @IsOptional()
    Cat_description: string;
}
