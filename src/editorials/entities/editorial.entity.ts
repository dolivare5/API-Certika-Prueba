/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Editorial.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Book es una entidad importada de su respectivo archivo. Esta entidad es
 * utilizada para definir la relación entre la entidad Editorial y Book.
 */
import {Book} from "../../books/entities/book.entity";
/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Editorial. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'editorials'})
/**
 * La clase Editorial es la entidad que se encarga de definir la estructura de
 * la tabla editorials en la base de datos. Esta entidad tiene como finalidad
 * contener los datos de las editoriales que se encuentran en la base de datos.
 */
export class Editorial {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * Identificador único de cada editorial.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada editorial',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Edit_id: number;
    
    /**
     * Nombre de la editorial.
     */
    @ApiProperty({
        example: 'Alfa omega',
        description: 'Nombre del editorial',
        uniqueItems: true,
    })
    @Column('varchar', {
        unique: true, nullable: false
    })
    Edit_name: string;
    
    /**
     * Descripción de la editorial.
     */
    @ApiProperty({
        example: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        description: 'Descripción de la categoría',
        nullable: true
    })
    @Column('varchar', {default: 'No tiene descripción'})
    Edit_description: string;
    
    /**
     * Estado de la editorial.
     */
    @ApiProperty({
        example: 1,
        description: 'Estado de la categoría (Activa, Inactiva)',
    })
    @Column('enum', {
        enum: ['Activa', 'Inactiva'],
        default: 'Activa'
    })
    Edit_status: string;
    
    /**
     * Relación entre la entidad Editorial y Book. En este caso se define que
     * una editorial puede tener muchos libros.
     */
    @OneToMany(
        () => Book, book => book.editorialEditId
    
    )
    booksBookId: Book[];
}
