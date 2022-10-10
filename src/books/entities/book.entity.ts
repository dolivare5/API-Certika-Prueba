/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Libro.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Category, Editorial, Author, Inventory y Loan son entidades importadas de
 * sus respectivos archivos. Estas entidades son importadas para poder
 * relacionarlas con la entidad Book.
 */
import {Category} from "../../categories/entities/category.entity";
import {Editorial} from "../../editorials/entities/editorial.entity";
import {Author} from "../../authors/entities/author.entity";
import {Inventory} from "../../inventories/entities/inventory.entity";
import {Loan} from "../../loans/entities/loan.entity";
import {IsOptional} from "class-validator";
/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Editorial. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'books'})
/**
 * La clase Book es la entidad que se encarga de definir la estructura de la
 * tabla books en la base de datos. Esta entidad tiene como finalidad contener
 * los datos de los libros que se encuentran en la base de datos.
 */
export class Book {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * Identificador único de cada libro.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada libro',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Book_id: number;
    
    /**
     * Título del libro.
     */
    @ApiProperty({
        example: 'Fundamentos de programación',
        description: 'Titulo del libro',
        nullable: false,
    })
    @Column('varchar', {nullable: false})
    Book_name: string;
    
    /**
     * Lugar de publicación del libro.
     */
    @ApiProperty({
        example: 'Barranquilla - Colombia',
        description: 'Lugar de publicación del libro',
        nullable: false
    })
    
    @Column('varchar', {nullable: false})
    Book_placeOfEdition: string;
    
    /**
     * Año de publicación del libro.
     */
    @ApiProperty({
        example: 2022,
        description: 'Año de publicación del libro',
        nullable: false
    })
    
    @Column('int', {nullable: false})
    Book_yearOfEdition: number;
    
    /**
     * Número de páginas del libro.
     */
    @ApiProperty({
        example: 300,
        description: 'Número de páginas del libro',
        nullable: false
    })
    
    @Column('int', {nullable: false})
    Book_numPag: number;
    
    /**
     * Foto de portada del libro.
     */
    @ApiProperty({
        example: 'http://localhost:3000/books/portada.jpg',
        description: 'Url de la imagen del libro',
        nullable: false
    })
    
    @Column('varchar', {nullable: true})
    Book_gatePhotoUrl: string;
    
    /**
     * Descripción del libro.
     */
    @Column('varchar', {default: 'No tiene descripción'})
    Book_description: string;
    
    
    /**
     * Estado del libro.
     */
    @ApiProperty({
        example: 'Disponible',
        description: 'Estado del libro (Disponible, Prestado, No disponible)',
    })
    @Column('enum', {
        enum: ['Disponible', 'Prestado', 'No disponible'],
        default: 'Disponible'
    })
    Book_status: string;
    
    /**
     * Relación con la entidad Category. Un libro puede tener una sola
     * categoría.
     */
    @ManyToOne(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Category,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Category */
        category => category.booksBooksId,
    )
    @JoinColumn({name: 'categoryCatId'})
    categoryCatId: number;
    
    /**
     * Relación con la entidad Editorial. Un libro puede tener una sola
     * editorial.
     */
    @ManyToOne(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Editorial,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Editorial */
        editorial => editorial.booksBookId,
    )
    @JoinColumn({name: 'editorialEditId'})
    editorialEditId: number;
    
    /**
     * Relación con la entidad Author. Un libro puede tener un solo autor.
     */
    @ManyToOne(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Author,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Autor */
        author => author.booksBookId,
    )
    @JoinColumn({name: 'authorAutId'})
    authorAuthId: number;
    
    /**
     * Relación con la entidad Loan. Un libro puede tener varios préstamos, siempre
     * y cuando no se haya eliminado el libro y la cantidad de préstamos sea menor.
     */
    @OneToMany(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Loan,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Editorial */
        loan => loan.bookBookId
    )
    loansLoanId: number;
    
    /**
     * Relación con la entidad Inventory. Un libro puede tener un solo inventario.
     * Cascade sirve para que cuando se elimine un libro se elimine el inventario
     */
    @ManyToOne(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Inventory,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Editorial */
        inventory => inventory.bookBookId,
    )
    @JoinColumn({name: 'inventoryInvId'})
    inventoryInvId: number;
    
}
