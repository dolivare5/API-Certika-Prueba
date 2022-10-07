/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Author.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Book es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama books y la entidad Book.
 * Sirve para definir la estructura de la tabla en la base de datos.
 */
import {Book} from "./book.entity";
/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Category. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'authors'})
/**
 * Author es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama authors y la entidad Author.
 */
export class Author {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * Identificador único de cada autor
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada autor',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Auth_id: number;
    
    /**
     * Nombre del autor
     */
    @ApiProperty({
        example: 'Deiber Duban',
        description: 'Nombre del autor',
    })
    @Column('varchar', {  nullable: false })
    Aut_firstName: string;
    
    /**
     * Apellido del autor
     */
    @ApiProperty({
        example: 'Olivares Olivares',
        description: 'Apellido del autor',
    })
    @Column('varchar', { nullable: false })
    Aut_lastName: string;
    
    /**
     * Correo del autor
     */
    @ApiProperty({
        example: 'olivaresdei6@gmail.com',
        description: 'Correo electrónico del autor',
    })
    @Column('varchar', { nullable: true, default: 'No tiene correo' })
    Aut_email: string;
    
    /**
     * Relación de uno a muchos con la entidad Book. En este caso un autor
     * puede tener muchos libros.
     */
    @OneToMany(
        () => Book, book => book.authorAuthId
    )
    booksBookId: Book[];
}
