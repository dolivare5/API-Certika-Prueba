import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Inventory} from "./entities/inventory.entity";
import {DataSource, Repository} from "typeorm";
import {log} from "util";

@Injectable()
export class InventoriesService {
    
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository:Repository<Inventory>,
        private readonly dataSource: DataSource
    ){}
    
    /**
     * Método para crear el inventario de un libro
     * @param createInventoryDto
     */
    async create(createInventoryDto: CreateInventoryDto) {
        try {
            /**
             * Se comprueba de que no exista un libro con el mismo id que el que se
             * quiere registrar en el inventario.
             */
            const book = await this.inventoryRepository.findOneBy({BookBookId: createInventoryDto.BookBookId});
            if (book) {
                throw new BadRequestException(`Ya existe un libro con el id ${createInventoryDto.BookBookId}`);
            }
            /**
             * Crear una nueva instancia de la entidad Inventories y llenarla con
             * los datos del DTO.
             * */
            const inventory = await this.inventoryRepository.create(createInventoryDto);
        
            /* Guardando la editorial en la base de datos. */
            await this.inventoryRepository.save(inventory);
        
            /* Devolver el objeto de inventory. */
            return inventory;
        } catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método que muestra los inventarios de un libro.
     * @param Inv_id Identificador del inventario.
     * @returns Devuelve un inventario.
     */
    async findOne(Inv_id: number) {
        /**
         * Se obtiene la inventory con el id especificado.
         */
        const inventory = await this.inventoryRepository.findOneBy({Inv_id});
        /**
         * Si no se encuentra el inventario, se lanza una excepción.
         */
        if (!inventory) {
            throw new BadRequestException(`No existe un inventario con el id ${Inv_id}`);
        }
        /**
         * Si se encuentra el inventario, se devuelve.
         */
        return inventory;
    }
    
    /**
     * Método que muestra los inventarios de un libro.
     * @returns Devuelve un inventario.
     * @param BookBookId
     */
    async findOneByBookId(BookBookId: number) {
        /**
         * Se obtiene la inventory con el id del libro.
         */
        const inventory = await this.inventoryRepository.findOneBy({BookBookId});
        /**
         * Si no se encuentra el inventario, se lanza una excepción.
         */
        if (!inventory) {
            throw new BadRequestException(`No existe un libro registrado en el inventario con el id ${BookBookId}`);
        }
        /**
         * Si se encuentra el inventario, se devuelve.
         */
        return inventory;
    }
    
    /**
     * Método que permite agregar unidades compradas a un inventario.
     * @param Inv_id
     * @param updateInventoryDto
     */
    async addPurchase(Inv_id: number, updateInventoryDto: UpdateInventoryDto) {
        /**
         * Se obtiene el inventario de la base de datos. El método preload permite
         * obtener una inventory de la base de datos, pero sin guardarla en la
         * base de datos.
         */
        const inventory = await this.inventoryRepository.preload({Inv_id});
        /**
         * Si no se encuentra el inventory, se lanza una excepción.
         */
        if (!inventory) {
            throw new BadRequestException(`No existe un inventario con el id ${Inv_id}`);
        }
        /**
         * Si se recibe NaN, se lanza una excepción.
         */
        if (isNaN(updateInventoryDto.Inv_unitsPurchased)) {
            throw new BadRequestException("La cantidad de unidades a comprar no es válida");
        }
        
        
        /**
         * Se actualiza la cantidad de libros prestados.
         */
        inventory.Inv_unitsPurchased+=updateInventoryDto.Inv_unitsPurchased;
        console.log(updateInventoryDto)
        console.log(inventory)
        return await this.handleDBUpdate(inventory);
    }
    
    async loanBook(Inv_id: number, updateInventoryDto: UpdateInventoryDto) {
        /**
         * Se obtiene el inventario de la base de datos. El método preload permite
         * obtener una inventory de la base de datos, pero sin guardarla en la
         * base de datos.
         */
        const inventory = await this.inventoryRepository.preload({Inv_id});
        
        /**
         * Si no se encuentra el inventory, se lanza una excepción.
         */
        if (!inventory) {
            throw new BadRequestException(`No existe un inventario con el id ${Inv_id}`);
        }
        /**
         * Se actualiza la cantidad de libros prestados.
         */
        if (inventory.Inv_unitsAvailable === 0){
            throw new BadRequestException("Ya se agotaron las unidades disponibles");
        }
        inventory.Inv_LoanedUnits+=updateInventoryDto.Inv_LoanedUnits;
        
        return await this.handleDBUpdate(inventory);
    }
    
    async returnBook(Inv_id: number, updateInventoryDto: UpdateInventoryDto) {
        /**
         * Se obtiene el inventario de la base de datos. El método preload permite
         * obtener una inventory de la base de datos, pero sin guardarla en la
         * base de datos.
         */
        console.log('Return: ', updateInventoryDto)
        const inventory = await this.inventoryRepository.preload({Inv_id});
        
        /**
         * Si no se encuentra el inventory, se lanza una excepción.
         */
        if (!inventory) {
            throw new BadRequestException(`No existe un inventario con el id ${Inv_id}`);
        }
        /**
         * Se actualiza la cantidad de libros prestados y unidades disponibles.
         */
        inventory.Inv_LoanedUnits-=updateInventoryDto.Inv_LoanedUnits;
        inventory.Inv_unitsAvailable+=updateInventoryDto.Inv_LoanedUnits;
        if (inventory.Inv_LoanedUnits<=0){
            throw new BadRequestException("Ya se han devuelto todas las unidades del libro");
        }
        return  await this.handleDBUpdate(inventory);
    }
    
    remove(id: number) {
        return `This action removes a #${id} inventory`;
    }
    
    /**
     * Método para manejar las excepciones que puede generar la base de datos.
     * @param error
     * @private
     */
    private handleDBExceptions(error: any) {
        /**
         * Comprobando si el código de error es 23505, que es el código para
         * una violación de restricción única.
         * */
        if (error.errno === 1062) {
            throw new BadRequestException("Ya existe una inventarío para ese ese libro");
        }
        if (error.errno === 1265) {
            throw new BadRequestException("Los datos del inventario no son válidos");
        }
        
        throw new InternalServerErrorException(error);
    }
    
    private async handleDBUpdate(inventory: UpdateInventoryDto){
        /**
         * Se hace uso del dataSource para guardar el inventory en la base de datos.
         * El query runner es un objeto que permite ejecutar queries en la base de datos.
         */
        const queryRunner = this.dataSource.createQueryRunner();
        /**
         * Se realiza la conexión con la base de datos.
         */
        await queryRunner.connect();
        /**
         * Se inicia una transacción. Esto permite que si ocurre un error, se deshagan
         * los cambios realizados en la base de datos.
         */
        await queryRunner.startTransaction();
        try {
            /**
             * Se actualiza la inventory en la base de datos.
             */
            await queryRunner.manager.save(inventory);
            /**
             * Se confirman los cambios
             */
            await queryRunner.commitTransaction();
            /**
             * Se devuelve la inventory actualizada.
             */
            return inventory;
        } catch (error) {
            /**
             * Si ocurre un error, se deshacen los cambios.
             */
            await queryRunner.rollbackTransaction();
            /**
             * Se cierran las conexiones con la base de datos.
             */
            await queryRunner.release();
            /**
             * Se manejan las excepciones.
             */
            this.handleDBExceptions(error);
        }
    }
}
