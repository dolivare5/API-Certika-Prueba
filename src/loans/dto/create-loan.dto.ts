/**
 * Decoradores importados de la librería class-validator los cuales nos permiten
 * validar los datos de entrada de las rutas.
 */
import {IsDate, IsEmail, IsInt, IsOptional, IsString, MinLength} from "class-validator";
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
export class CreateLoanDto {
    /**
     * Utilizo decoradores para indicar las validaciones que se deben aplicar
     * a los datos de entrada.
     */
    
    @ApiProperty({
        example: 'Préstamo para entregar en 3 días',
        description: 'Descripción del préstamo',
        nullable: null,
    })
    @IsString({ message: 'La descripción del préstamo debe ser un texto' })
    @MinLength(3, { message: 'La descripción del préstamo debe tener al menos 3 caracteres' })
    @IsOptional()
    Loan_description: string;
    
    @ApiProperty({
        example: '2021-05-01',
        description: 'Fecha de Devolución',
        nullable: false,
    })
    @IsDate({ message: 'La fecha de devolución debe ser una fecha' })
    Loan_returnDate: Date;
    
    @ApiProperty({
        example: '1',
        description: 'Id del Libro',
        nullable: false,
    })
    @IsInt({ message: 'El id del libro debe ser un número' })
    bookBookId: number;
}
