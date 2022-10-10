/**
 * Decoradores importados de la librería class-validator los cuales nos permiten
 * validar los datos de entrada de las rutas.
 */
import {IsInt, IsNumber, IsOptional, IsString, MinLength} from "class-validator";
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
export class CreateInventoryDto {
    
    @IsNumber()
    Inv_unitsPurchased: number
}
