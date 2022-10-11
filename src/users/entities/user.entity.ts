/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Author.
 */
import { ApiProperty } from "@nestjs/swagger";
/**
 * Loan es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama loans y la entidad
 * loan. Esta entidad es la que almacena la información de los préstamos de los
 * libros.
 */
import {Loan} from "../../loans/entities/loan.entity";

/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama Users y la entidad
 * users. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'users' })
/**
 * La clase User es la que se encarga de definir la estructura de la entidad
 * users. Esta entidad es la que almacena la información de los usuarios.
 */
export class User {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * Identificador único de cada usuario.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada Usuario',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    User_id: number;
    
    /**
     * Nombre del usuario.
     */
    @ApiProperty({
        example: 'Juan',
        description: 'Nombre del usuario',
    })
    @Column('varchar', {  nullable: false, })
    User_firstName: string;
    
    /**
     * Apellido del usuario.
     */
    @ApiProperty({
        example: 'Perez',
        description: 'Apellido del usuario',
    })
    @Column('varchar', { nullable: false })
    User_lastName: string;
    
    /**
     * Identificación del usuario.
     */
    @ApiProperty({
        example: '1009876543',
        description: 'Cédula del usuario',
    })
    @Column('varchar', {
        nullable: false,
        unique: true
    })
    User_identification: string;
    
    /**
     * Observaciones del usuario.
     */
    @ApiProperty({
        example: 'Juan no entrega los libros a tiempo',
        description: 'Observaciones del Usuario',
    })
    @Column('varchar', {
        nullable: false,
        default: 'Sin observaciones'
    })
    User_Observations: string;
    
    /**
     * Correo del usuario.
     */
    @ApiProperty({
        example: 'juan78@gmail.com',
        description: 'Correo del Usuario',
    })
    @Column('varchar', {
        nullable: false,
        unique: true
    })
    User_email: string;
    
    /**
     * Estado del usuario.
     */
    @ApiProperty({
        example: 'Activo',
        description: 'Estado del Usuario',
    })
    @Column('enum', {
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    })
    User_status: string;
    
    /**
     * Relación entre la entidad User y la entidad Loan. Un usuario puede tener
     * varios préstamos.
     */
    @OneToMany(
        () => Loan, loan => loan.Loan_id,
        /**
         * Cascade es una propiedad que nos permite definir que si se elimina
         * un usuario se eliminen todos los préstamos asociados a ese usuario.
         * Eager es una propiedad que nos permite definir que si se hace una
         * consulta a la entidad User se traigan todos los préstamos asociados
         * a ese usuario.
         */
    )
    @JoinColumn({ name: 'UserUserid' })
    loansLoanId: number[];
}