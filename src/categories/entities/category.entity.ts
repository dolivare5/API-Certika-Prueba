/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Category.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Book es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama books y la entidad
 * Book. Sirve para definir la estructura de la tabla en la base de datos.
 */
import {Book} from "../../books/entities/book.entity";
/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Category. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'categories'})
/**
 * Category es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Category. Sirve para definir la estructura de la tabla en la base de datos.
 * Esta clase se encarga de contener los atributos de la entidad Category.
 */
export class Category {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * Identificador único de cada categoría.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada categoría',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Cat_id: number;
    
    /**
     * Nombre de la categoría.
     */
    @ApiProperty({
        example: 'Programación',
        description: 'Nombre de la categoría',
        uniqueItems: true,
    })
    @Column('varchar', {
        unique: true, nullable: false
    })
    Cat_name: string;
    
    /**
     * Descripción de la categoría.
     */
    @ApiProperty({
        example: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        description: 'Descripción de la categoría',
        nullable: true
    })
    @Column('varchar', {default: 'No tiene descripción'})
    Cat_description: string;
    
    /**
     * Estado de la categoría.
     */
    @ApiProperty({
        example: 1,
        description: 'Estado de la categoría (1: Activo, 0: Inactivo)',
    })
    @Column('enum', {
        enum: ['Activa', 'Inactiva'],
        default: 'Activa'
    })
    Cat_status: string;
    
    /**
     * Relación de uno a muchos con la entidad Book. En este caso una categoría
     * puede tener muchos libros.
     * Eager es una propiedad que nos permite cargar los datos de la relación
     * en la consulta.
     */
    @OneToMany(
        () => Book, book => book.categoryCatId
    )
    booksBooksId: Book[];
}
