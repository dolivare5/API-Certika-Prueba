/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Author.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Book y Users son clases que se encargan de definir la estructura de la tabla en
 * la base de datos. En este caso las tablas y las entidades se llaman Books y Users.
 * Sirven para definir la estructura de las tablas en la base de datos.
 */
import {Book} from "../../books/entities/book.entity";
import {User} from "../../users/entities/user.entity";

/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama loans y la entidad
 * loans. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'loans' })
/**
 * Loan es la clase que se encarga de crear una entidad para administrar los
 * préstamos de los libros.
 */
export class Loan {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * ID del préstamo
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada préstamo',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Loan_id: number;
    
    /**
     * Observaciones del préstamo
     */
    @ApiProperty({
        example: 'El libro debe ser devuelto en 3 días',
        description: 'Observaciones del préstamo',
    })
    @Column('varchar', {  nullable: false })
    Loan_Observations: string;
    
    /**
     * Fecha de inicio del préstamo
     */
    @ApiProperty({
        example: '2021-05-05',
        description: 'Fecha de préstamo',
    })
    @Column('datetime', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    Loan_dateLoan: Date;
    
    /**
     * Fecha de devolución del préstamo
     */
    @ApiProperty({
        example: '2021-05-05',
        description: 'Fecha de devolución',
    })
    @Column('datetime', { nullable: false })
    Loan_returnDate: Date;
    
    /**
     * Estado del préstamo
     */
    @ApiProperty({
        example: 'prestado',
        description: 'Estado del préstamo',
    })
    @Column('enum', {
        enum: ['prestado', 'devuelto'],
        default: 'prestado' }
    )
    Loan_state: string;
    
    /**
     * Relación de muchos a uno con la entidad Book. En este caso un préstamo
     * puede tener un libro.
     */
    @ManyToOne(
        () => Book, book => book.loansLoanId
    
    )
    @JoinColumn({name: 'bookBookId'})
    bookBookId: Book[];
    
    /**
     * Relación de muchos a uno con la entidad User. En este caso un préstamo
     * tiene un usuario.
     */
    @ManyToOne(
        () => User, user => user.loansLoanId
    )
    @JoinColumn({name: 'userUserId'})
    userUserId: User;
}