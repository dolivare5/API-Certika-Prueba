import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Editorial} from "./entities/editorial.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class EditorialsService {
    /**
     * La función constructora se usa para inyectar el repositorio de
     * editoriales en la clase EditorialService.
     * @param editorialRepository
     * @param dataSource
     */
    constructor(
        /**
         * Inyectar el repositorio de editoriales en la clase EditorialService.
         */
        @InjectRepository(Editorial)
        private editorialRepository: Repository<Editorial>,
        private readonly dataSource: DataSource
    ) {
    }
    
    /**
     * Método para crear una nueva editorial. Este método recibe un objeto
     * de tipo CreateEditorialDto, que es un objeto que contiene los datos
     * de la editorial que se va a generar.
     * @param createEditorialDto
     * @return Editorial
     */
    async create(createEditorialDto: CreateEditorialDto) {
        try {
            /**
             * Crear una nueva instancia de la entidad Editorial y llenarla con
             * los datos del DTO.
             * */
            const editorial = await this.editorialRepository.create(createEditorialDto);
            
            /* Guardando la editorial en la base de datos. */
            await this.editorialRepository.save(editorial);
            
            /* Devolver el objeto de editorial. */
            return editorial;
        } catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método para obtener todas las editoriales.
     * @return Editorial[]
     */
    findAll() {
        /**
         * Se obtienen todas las editoriales de la base de datos.
         */
        return this.editorialRepository.find();
    }
    
    
    /**
     * Método para obtener una editorial por su id.
     * @param Edit_id
     * @return Editorial
     */
    findOne(Edit_id: number) {
        /**
         * Se obtiene la editorial con el id especificado.
         */
        const editorial = this.editorialRepository.findOneBy({Edit_id});
        /**
         * Si no se encuentra la editorial, se lanza una excepción.
         */
        if (!editorial) {
            throw new BadRequestException(`No existe una editorial con el id ${Edit_id}`);
        }
        /**
         * Si se encuentra la editorial, se devuelve.
         */
        return editorial;
    }
    
    
    /**
     * Método para actualizar una editorial.
     * @param Edit_id
     * @param updateEditorialDto
     */
    async update(Edit_id: number, updateEditorialDto: UpdateEditorialDto) {
        /**
         * Se obtiene la editorial de la base de datos. El método preload permite
         * obtener una editorial de la base de datos, pero sin guardarla en la
         * base de datos.
         */
        const editorial = await this.editorialRepository.preload({Edit_id, ...updateEditorialDto});
        /**
         * Si no se encuentra la editorial, se lanza una excepción.
         */
        if (!editorial) {
            throw new BadRequestException(`No existe una editorial con el id ${Edit_id}`);
        }
        /**
         * Se hace uso del dataSource para guardar la editorial en la base de datos.
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
             * Se actualiza la editorial en la base de datos.
             */
            await queryRunner.manager.save(editorial);
            /**
             * Se confirman los cambios
             */
            await queryRunner.commitTransaction();
            /**
             * Se devuelve la editorial actualizada.
             */
            return editorial;
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
    
    
    /**
     * Método para eliminar una editorial.
     * @param Edit_id
     * @return Editorial
     */
    async remove(Edit_id: number) {
        try {
            /**
             * Se busca la editorial en la base de datos por su id.
             */
            const editorial = await this.editorialRepository.findOneBy({Edit_id});
            /**
             * Si no se encuentra la editorial, se lanza una excepción.
             */
            await this.editorialRepository.delete(editorial);
            /**
             * Se devuelve la editorial eliminada.
             */
            return editorial;
        } catch (error) {
            /**
             * Se manejan las excepciones.
             */
            this.handleDBExceptions(error);
        }
        
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
            throw new BadRequestException("Ya existe una editorial con ese nombre");
        }
        if (error.errno === 1265) {
            throw new BadRequestException("El valor ingresado en el estado de la editorial no es válido");
        }
        
        throw new InternalServerErrorException(error);
    }
}
