import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class UsersService {
    
    /**
     * La función constructora se usa para inyectar el repositorio de
     * editoriales en la clase EditorialService.
     * @param userRepository
     * @param dataSource
     */
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly dataSource: DataSource
    ) { }
    
    /**
     * Método para crear un nuevo usuario. Este método recibe un objeto
     * de tipo CreateUserDto, que es un objeto que contiene los datos
     * del usuario que se va a generar.
     * @param createUserDto
     * @return User
     */
    async create(createUserDto: CreateUserDto) {
        try {
            /**
             * Crear una nueva instancia de la entidad User y llenarla con
             * los datos del DTO.
             * */
            const user = await this.userRepository.create(createUserDto);
            
            /* Guardando la editorial en la base de datos. */
            await this.userRepository.save(user);
            
            /* Devolver el objeto de editorial. */
            return user;
        }catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método para obtener todos los usuarios.
     * @return User[]
     */
    findAll() {
        /**
         * Obtener todos los usuarios de la base de datos.
         * */
        return this.userRepository.find();
    }
    
    /**
     * Método para obtener un usuario por su identificación.
     * @return User
     * @param User_identification
     */
    async findOne(User_identification: string) {
        /**
         * Se obtiene el usuario a través de su identificación.
         */
        const usuario = await this.userRepository.findOneBy({User_identification});
        /**
         * Si no se encuentra el usuario, se lanza una excepción.
         */
        if (!usuario) {
            throw new BadRequestException(`No existe un usuario con la identificación ${User_identification}`);
        }
        /**
         * Si se encuentra el usuario, se devuelve.
         */
        return usuario;
    }
    
    /**
     * Método para obtener un usuario por su id.
     * @return User
     * @param User_id
     */
    async findOneById(User_id: number) {
        /**
         * Se obtiene el usuario a través de su identificación.
         */
        const usuario = await this.userRepository.findOneBy({User_id});
        /**
         * Si no se encuentra el usuario, se lanza una excepción.
         */
        if (!usuario) {
            throw new BadRequestException(`No existe un usuario con el id ${User_id}`);
        }
        /**
         * Si se encuentra el usuario, se devuelve.
         */
        const {User_firstName, User_lastName, User_identification} = usuario;
        return {User_firstName, User_lastName, User_identification};
    }
    
    /**
     * Método para actualizar un usuario.
     * @param User_id
     * @param updateUserDto
     */
    async update(User_id: number, updateUserDto: UpdateUserDto) {
        /**
         * Se obtiene el de la base de datos. El método preload permite
         * obtener una editorial de la base de datos, pero sin guardarla en la
         * base de datos.
         */
        const user = await this.userRepository.preload({User_id, ...updateUserDto});
        /**
         * Si no se encuentra el usuario, se lanza una excepción.
         */
        if (!user) {
            throw new BadRequestException(`No existe una usuario con el id ${User_id}`);
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
             * Se actualiza el usuario en la base de datos.
             */
            await queryRunner.manager.save(user);
            /**
             * Se confirman los cambios
             */
            await queryRunner.commitTransaction();
            /**
             * Se devuelve la editorial actualizada.
             */
            return user;
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
     * Método para eliminar un usuario.
     * @param User_id - Identificador del usuario.
     * @return User | undefined - El usuario eliminado.
     */
    async remove(User_id: number) {
        try {
            /**
             * Se busca el usuario en la base de datos por su id.
             */
            const user = await this.userRepository.findOneBy({User_id});
            
            /**
             * Si no se encuentra el usuario, se lanza una excepción.
             */
            //@ts-ignore
            await this.userRepository.delete(user);
            /**
             * Se devuelve el usuario eliminado.
             */
            return user;
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
