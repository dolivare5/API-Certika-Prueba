import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DataSource, Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoriesService {
    /**
     * La función constructora se usa para inyectar el repositorio de
     * categorías en la clase CategoryService
     * @param categoryRepository - Repositorio<Categoría>
     * @param dataSource
     */
    constructor(
        /* Inyectar el repositorio de categorías en la clase CategoryService. */
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private readonly dataSource: DataSource
    ) {}
    
    
    /**
     * Método para crear una nueva categoría. Este método recibe un objeto
     * de tipo CreateCategoryDto, que es un objeto que contiene los datos
     * de la categoría que se va a generar.
     * @param createCategoryDto
     * @return Category
     */
    async create(createCategoryDto: CreateCategoryDto) {
        
        try {
            /**
             * Crear una nueva instancia de la entidad Categoría y llenarla con
             * los datos del DTO.
             * */
            const category = this.categoryRepository.create(createCategoryDto);
            
            /* Guardando la categoría en la base de datos. */
            await this.categoryRepository.save(category);
            
            /* Devolver el objeto de categoría. */
            return category;
        } catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método para obtener todas las categorías.
     * @return Category[]
     */
    findAll() {
        /**
         * Se obtienen todas las categorías de la base de datos.
         * @return - un arreglo de categorías.
         */
        return this.categoryRepository.find();
    }
    
    /**
     * Método para obtener una categoría por su ID.
     * @return Category
     * @param Cat_id
     */
    async findOne(Cat_id: number) {
        /**
         * Se obtiene la categoría de la base de datos.
         */
        const category = await this.categoryRepository.findOneBy({ Cat_id });
        /**
         * Si la categoría no existe, se lanza una excepción.
         */
        if (!category) {
            throw new NotFoundException(`La categoría con el ID ${Cat_id} no existe`);
        }
        /**
         * Si la categoría existe, se devuelve.
         */
        return category;
        
    }
    
    /**
     * Método que permite actualizar una categoría.
     * @param Cat_id
     * @param updateCategoryDto
     * @return Category
     */
    async update(Cat_id: number, updateCategoryDto: UpdateCategoryDto) {
        /**
         * Se obtiene la categoría de la base de datos. El método preload permite
         * obtener una categoría de la base de datos, pero no la guarda en la
         * base de datos.
         */
        const category = await this.categoryRepository.preload({ Cat_id, ...updateCategoryDto });
        /**
         * Si la categoría no existe, se lanza una excepción.
         */
        if (!category) {
            throw new NotFoundException(`La categoría con el ID ${Cat_id} no existe`);
        }
        /**
         * Se hace uso del dataSource para obtener la conexión a la base de datos.
         * El query runner permite ejecutar queries en la base de datos.
         */
        const queryRunner = this.dataSource.createQueryRunner();
        /**
         * Se realiza la conexión a la base de datos.
         */
        await queryRunner.connect();
        /**
         * Se inicia una transacción. Esto permite que si ocurre un error, se
         * deshagan los cambios que se hayan hecho en la base de datos.
         */
        await queryRunner.startTransaction();
        
        try {
            /**
             * Se guarda la categoría en la base de datos.
             */
            await queryRunner.manager.save(category);
            /**
             * Se confirman los cambios en la base de datos.
             */
            await queryRunner.commitTransaction();
            /**
             * Se cierra la conexión a la base de datos.
             */
            await queryRunner.release();
            /**
             * Se devuelve la categoría actualizada.
             */
            return this.findOne(Cat_id);
            
        } catch (error) {
            /**
             * Se deshacen los cambios en la base de datos si ocurre un error.
             */
            await queryRunner.rollbackTransaction();
            /**
             * Se cierra la conexión a la base de datos.
             */
            await queryRunner.release();
            
            /**
             * Se ejecuta el método que maneja las excepciones de la base de datos.
             */
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método que permite eliminar una categoría.
     * @param Cat_id
     * @return Category
     */
    async remove(Cat_id: number) {
        try {
            /**
             * Se busca la categoría por su ID para verificar que exista.
             * */
            const category : Category = await this.findOne(Cat_id);
            /**
             * Se elimina la categoría de la base de datos.
             */
            await this.categoryRepository.delete(category);
            return category;
        } catch (error) {
            /**
             * Se ejecuta el método que maneja las excepciones de la base de datos.
             */
            this.handleDBExceptions(error);
            
        }
    }
    
    /**
     * Maneja las excepciones que puede generar la base de datos.
     * @param error
     * @private
     */
    private handleDBExceptions(error: any) {
        console.log(error);
        /**
         * Comprobando si el código de error es 23505, que es el código para
         * una violación de restricción única.
         * */
        if (error.errno === 1062) {
            throw new BadRequestException("Ya existe una categoría con ese nombre");
        }
        if (error.errno === 1265) {
            throw new BadRequestException("El valor ingresado en el estado de la categoría no es válido");
        }
        
        throw new InternalServerErrorException(error);
    }
}
