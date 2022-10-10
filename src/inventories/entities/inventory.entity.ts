/**
 * Decoradores importados de typeorm los cuales nos permiten definir la entidad
 * de la base de datos.
 */
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
/**
 * ApiProperty es un decorador que nos permite definir la documentación de la
 * API. En este caso se utiliza para definir la documentación de la entidad
 * Inventory.
 */
import { ApiProperty } from "@nestjs/swagger";
import {Book} from "../../books/entities/book.entity";
import {BadRequestException} from "@nestjs/common";
import {Author} from "../../authors/entities/author.entity";

;
/**
 * @Entity es una clase que se encarga de definir la estructura de la tabla en
 * la base de datos. En este caso la tabla se llama categories y la entidad
 * Editorial. Sirve para definir la estructura de la tabla en la base de datos.
 */
@Entity({ name: 'inventories'})
export class Inventory {
    /**
     * @ApiProperty es un decorador que nos permite definir la documentación de
     * la API. En este caso se utiliza para definir la documentación de ca una
     * de las columnas. El decorador @PrimaryGeneratedColumn es un decorador de
     * typeorm que nos permite definir una propiedad como una columna
     * autoincrement y el decorador @Column es un decorador de typeorm que nos
     * permite definir la propiedad de esta entidad en la base de datos.
     */
    
    /**
     * ID único de la entidad Inventory.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada libro',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('increment')
    Inv_id: number;
    
    /**
     * Unidades compradas de un libro.
     */
    
    @ApiProperty({
        example: 2,
        description: 'Unidades compradas del libro',
        nullable: false
    })
    
    @Column("int", {
        nullable: false,
        default: 1
    })
    Inv_unitsPurchased: number;
    
    /**
     * Unidades prestadas de un libro.
     */
    @ApiProperty({
        example: 1,
        description: 'Unidades prestadas del libro',
        nullable: false
    })
    
    @Column("int", {
        nullable: false,
        default: 0
    })
    Inv_LoanedUnits: number;
    
    
    /**
     * Unidades disponibles de un libro.
     */
    @ApiProperty({
        example: 1,
        description: 'Unidades disponibles del libro',
        nullable: false
    })
    
    @Column("int", {
        nullable: false,
        default: 0
    })
    Inv_unitsAvailable: number;
    
    @OneToMany(
        /* Se le pasa la entidad a la que se va a relacionar */
        () => Book,
        /* Se le pasa el nombre de la propiedad que se va a relacionar. La propiedad books se encuentra
        en la entidad Autor */
        book => book.inventoryInvId
    )
    bookBookId: Book;
    
    @BeforeInsert()
    @BeforeUpdate()
    updateUnitsAvailable() {
        if (this.Inv_LoanedUnits === undefined){
            this.Inv_LoanedUnits = 0;
        }
        
        if (this.Inv_unitsPurchased < this.Inv_LoanedUnits) {
            throw new BadRequestException("No se puede prestar más libros de los que se han comprado");
        }
        
        else if (this.Inv_LoanedUnits > this.Inv_unitsPurchased) {
            throw new BadRequestException("No hay unidades disponibles");
        }else{
            console.log("Actualizando unidades disponibles: ", this.Inv_unitsPurchased, this.Inv_LoanedUnits);
            this.Inv_unitsAvailable = this.Inv_unitsPurchased - this.Inv_LoanedUnits;
        }
    }
}
