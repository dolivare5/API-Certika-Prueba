import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {CreateBookDto} from './dto/create-book.dto';
import {ConfigService} from "@nestjs/config";
import {join} from "path";
import {existsSync} from "fs";
import {Book} from "./entities/book.entity";
import {DataSource, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateAuthorDto} from "../authors/dto/update-author.dto";
import {Author} from "../authors/entities/author.entity";
import {UpdateBookDto} from "./dto/update-book.dto";
import {EditorialsService} from "../editorials/editorials.service";
import {CategoriesService} from "../categories/categories.service";
import {AuthorService} from "../authors/authores.service";

@Injectable()
export class BooksService {
    /**
     * Inyectamos el servicio de configuración y el servicio de libros.
     * @param bookRepository
     * @param configService
     * @param editorialsService
     * @param categoriesService
     * @param authorService
     * @param dataSource
     */
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private readonly configService: ConfigService,
        private readonly editorialsService: EditorialsService,
        private readonly categoriesService: CategoriesService,
        private readonly authorService: AuthorService,
        private readonly dataSource: DataSource,
    ) {}
    
    
    /**
     * Método que permite crear un nuevo libro. Este método recibe un DTO con los
     * datos del libro a crear.
     * @param createBookDto
     */
    async create(createBookDto: CreateBookDto) {
        try {
           if (await this.checkPrimaryKeys(createBookDto)) {
               /**
                * Creo una nueva instancia de libro y le asigno los valores del DTO.
                */
    
               const book = this.bookRepository.create(createBookDto);
    
               /**
                * Guardo el libro en la base de datos.
                */
               await this.bookRepository.save(book);
    
               /**
                * Devuelvo el libro creado.
                */
               return book;
           }
        }catch (error) {
            /**
             * Un método que maneja las excepciones que puede generar la base
             * de datos.
             **/
            this.handleDBExceptions(error);
        }
    
    }
    
    /**
     * Método para obtener todos los libros.
     * @return Book[]
     */
    async findAll() {
        /**
         * Se devuelven todos los autores de la base de datos.
         */
        const books = await this.bookRepository.find();
        /**
         * Se recorren los libros y se obtiene la categoría y la editorial de cada uno.
         */
        const arrayBooks = [];
        for (let book of books) {
            const {Cat_name} = await this.categoriesService.findOne(book.categoryCatId);
            const {Edit_name} = await this.editorialsService.findOne(book.editorialEditId);
            const {Aut_firstName, Aut_lastName} = await this.authorService.findOne(book.authorAuthId);
            const {Book_name, Book_numPag, Book_placeOfEdition} = book;
            arrayBooks.push({
                Book_name, Book_numPag, Book_placeOfEdition, Cat_name,
                Edit_name, Aut_firstName, Aut_lastName,
            });
        }
        return arrayBooks;
    }
    
    /**
     * Método para obtener un libro por su id.
     * @return Author
     * @param Book_id
     */
    async findOne(Book_id: number) {
        /**
         * Se obtiene el libro de la base de datos.
         */
        const book = await this.bookRepository.findOneBy({ Book_id });
        /**
         * Si el libro no existe, se lanza una excepción.
         */
        if (!book) {
            throw new NotFoundException(`El libro con el Id ${Book_id} no existe`);
        }
        /**
         * Si el libro existe, se devuelve.
         */
        const category = await this.categoriesService.findOne(book.categoryCatId);
        const editorial = await this.editorialsService.findOne(book.editorialEditId);
        const author = await this.authorService.findOne(book.authorAuthId);
        return {book, category, editorial, author};
    }
    
    /**
     * Método para actualizar un libro.
     * @param Book_id
     * @param updateBookDto
     * @param secureUrl
     * @param nameFile
     */
    async update(Book_id: number, updateBookDto: UpdateBookDto, secureUrl?: string, nameFile?:string) {
        /**
         * Se obtiene el libro de la base de datos. El método preload permite
         * obtener una categoría de la base de datos, pero no la guarda en la
         * base de datos.
         */
        const book = await this.bookRepository.preload({  Book_id, ...updateBookDto, Book_gatePhotoUrl: nameFile });
        /**
         * Si el libro no existe, se lanza una excepción.
         */
        if (!book) {
            throw new NotFoundException(`El libro con el ID ${Book_id} no existe`);
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
            await queryRunner.manager.save(book);
            /**
             * Se confirman los cambios en la base de datos.
             */
            await queryRunner.commitTransaction();
            /**
             * Se cierra la conexión a la base de datos.
             */
            await queryRunner.release();
            /**
             * Se devuelve el libro actualizado.
             */
            const img = await this.findOne(Book_id);
            return {
                img,
                secureUrl
            };
            
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
     * Método para eliminar un libro.
     * @param Book_id
     */
    async remove(Book_id: number) {
        try {
            /**
             * Se busca el Libro por su ID para verificar que exista.
             * */
            const book: Book = await this.bookRepository.findOneBy({ Book_id });
            /**
             * Se elimina el libro de la base de datos.
             */
            await this.bookRepository.delete(book);
            return book;
        } catch (error) {
            /**
             * Se ejecuta el método que maneja las excepciones de la base de datos.
             */
            this.handleDBExceptions(error);
            
        }
    }
    
    
    /**
     * Método que permite subir una imagen a un libro.
     * @param photoName
     */
    getStaticProductsImage( photoName: string) {
        const path = join(__dirname, '../../static/uploads/books', photoName);
        if (!existsSync(path)) throw new BadRequestException(`No product image with name ${photoName}`);
        return path;
    }
    
    /**
     * Método que permite verificar que los campos que son llaves primarias y únicas estén relacionadas
     * con un registro en la base de datos.
     * @param createBookDto
     * @private
     */
    private async checkPrimaryKeys(createBookDto: CreateBookDto) {
        const editorial = await this.editorialsService.findOne(createBookDto.editorialEditId);
        const category = await this.categoriesService.findOne(createBookDto.categoryCatId);
        const author = await this.authorService.findOne(createBookDto.authorAutId);
        if (!editorial) {
            throw new BadRequestException(`La editorial con el ID ${createBookDto.editorialEditId} no existe`);
        }
        if (!category) {
            throw new BadRequestException(`La categoría con el ID ${createBookDto.categoryCatId} no existe`);
        }
        if (!author) {
            throw new BadRequestException(`El autor con el ID ${createBookDto.authorAutId} no existe`);
        }
        return true;
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
        //console.log(error);
        if (error.errno === 1062) {
            throw new BadRequestException("Ya existe un libro con los datos ingresados. Intente con otros datos.");
        }
        if (error.errno === 1364) {
            throw new BadRequestException("Debe ingresar todos los datos obligatorios.");
        }
        if (error.response.statusCode === 404) {
            throw new NotFoundException(error.response.message);
        }
        
        throw new InternalServerErrorException(error);
    }
}
