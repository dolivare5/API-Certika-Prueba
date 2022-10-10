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
export class CreateBookDto {
    /**
     * Utilizo decoradores para indicar las validaciones que se deben aplicar
     * a los datos de entrada.
     */
    
    @ApiProperty({
        example: 'Fundamentos de programación',
        description: 'Nombre del libro',
        nullable: false
    })
    @IsString({ message: 'El nombre del libro debe ser un texto' })
    @MinLength(3, { message: 'El nombre del libro debe tener al menos 3 caracteres' })
    Book_name: string;
    
    @ApiProperty({
        example: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        description: 'Descripción del libro',
        nullable: true
    })
    @IsString({ message: 'La descripción del libro debe ser un texto' })
    @IsOptional()
    Book_description: string;
    
    @ApiProperty({
        example: 'Barranquilla - Colombia',
        description: 'Lugar de publicación del libro',
        nullable: false
    })
    @IsString({ message: 'El lugar de publicación del libro debe ser un texto' })
    @MinLength(3, { message: 'El lugar de publicación del libro debe tener al menos 3 caracteres' })
    Book_placeOfEdition: string;
    
    @ApiProperty({
        example: 2021,
        description: 'Año de publicación del libro',
        nullable: false
    })
    @IsInt({ message: 'El año de publicación del libro debe ser un número entero' })
    Book_yearOfEdition: number;
    
    @ApiProperty({
        example: 300,
        description: 'Número de páginas del libro',
        nullable: false
    })
    @IsInt({ message: 'El número de páginas del libro debe ser un número entero' })
    Book_numPag: number;
    
    @ApiProperty({
        example: 'moto.jpg',
        description: 'Imagen del libro',
        nullable: true
    })
    @IsString({ message: 'La imagen del libro debe ser un texto' })
    @IsOptional()
    Book_gatePhotoUrl: string;
    
    @ApiProperty({
        example: 1,
        description: 'Id del autor de la categoría',
        nullable: false
    })
    @IsInt({ message: 'El id de la categoría debe ser un número entero' })
    @IsOptional()
    categoryCatId: number;
    
    @ApiProperty({
        example: 1,
        description: 'Id del autor del libro',
        nullable: false
    })
    @IsInt({ message: 'El id del autor debe ser un número entero' })
    @IsOptional()
    authorAutId: number;
    
    @ApiProperty({
        example: 1,
        description: 'Id del editorial del libro',
        nullable: false
    })
    @IsOptional()
    @IsInt({ message: 'El id del editorial debe ser un número entero' })
    editorialEditId: number;
    
    @ApiProperty({
        example: 1,
        description: 'Id del inventario del libro',
        nullable: false
    })
    @IsOptional()
    @IsInt({ message: 'El id del inventario debe ser un número entero' })
    inventoryInvId: number;
    
}
