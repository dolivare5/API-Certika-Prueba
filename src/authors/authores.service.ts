import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Author} from "./entities/author.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class AuthorService {
    /**
     * La función constructora se usa para inyectar el repositorio de
     * autores en la clase AuthorService
     * @param authorRepository - Repositorio<Author>
     * @param dataSource - Fuente de datos
     */
    constructor(
        /* Inyectar el repositorio de categorías en la clase CategoryService. */
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        private readonly dataSource: DataSource
    ) {}
    
    /**
     * Método para crear una nueva autor. Este método recibe un objeto
     * de tipo CreateAuthorDto, que es un objeto que contiene los datos
     * del autor que se va a generar.
     * @param createAuthorDto
     * @return Author
     */
    async create(createAuthorDto: CreateAuthorDto) {
        try {
            /**
             * Crear una nueva instancia de la entidad Author y llenarla con
             * los datos del DTO.
             * */
            const author = await this.authorRepository.create(createAuthorDto);
        
            /* Guardando el autor en la base de datos. */
            await this.authorRepository.save(author);
        
            /* Devolver el objeto de Author. */
            return author;
        } catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método para obtener todas Autores.
     * @return Author[]
     */
    findAll() {
        /**
         * Se devuelven todos los autores de la base de datos.
         */
        return this.authorRepository.find();
    }
    
    /**
     * Método para obtener un autor por su id.
     * @return Author
     * @param Aut_id
     */
    async findOne(Aut_id: number) {
        /**
         * Se obtiene el author de la base de datos.
         */
        const author = await this.authorRepository.findOneBy({ Aut_id });
        /**
         * Si el autor no existe, se lanza una excepción.
         */
        if (!author) {
            throw new NotFoundException(`El autor con el Id ${Aut_id} no existe`);
        }
        /**
         * Si el autor existe, se devuelve.
         */
        return author;
    }
    
    /**
     * Método para actualizar un autor.
     * @param Aut_id
     * @param updateAuthorDto
     */
    async update(Aut_id: number, updateAuthorDto: UpdateAuthorDto) {
        /**
         * Se obtiene el autor de la base de datos. El método preload permite
         * obtener una categoría de la base de datos, pero no la guarda en la
         * base de datos.
         */
        const autor = await this.authorRepository.preload({ Aut_id, ...updateAuthorDto });
        /**
         * Si el autor no existe, se lanza una excepción.
         */
        if (!autor) {
            throw new NotFoundException(`El autor con el ID ${Aut_id} no existe`);
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
             * Se guarda el autor en la base de datos.
             */
            await queryRunner.manager.save(autor);
            /**
             * Se confirman los cambios en la base de datos.
             */
            await queryRunner.commitTransaction();
            /**
             * Se cierra la conexión a la base de datos.
             */
            await queryRunner.release();
            /**
             * Se devuelve el autor actualizado.
             */
            return this.findOne(Aut_id);
        
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
     * Método para eliminar un autor.
     * @param Aut_id
     */
    async remove(Aut_id: number) {
        try {
            /**
             * Se busca el autor por su ID para verificar que exista.
             * */
            const author : Author = await this.findOne(Aut_id);
            /**
             * Se elimina el autor de la base de datos.
             */
            await this.authorRepository.delete(author);
            return author;
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
        /**
         * Comprobando si el código de error es 23505, que es el código para
         * una violación de restricción única.
         * */
        if (error.errno === 1062) {
            throw new BadRequestException("Ya existe una autor con los datos ingresados. Intente con otros datos.");
        }
        if (error.response.statusCode === 404) {
            throw new NotFoundException(error.response.message);
        }
        
        throw new InternalServerErrorException(error);
    }
}
