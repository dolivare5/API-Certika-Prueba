import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import {InventoriesService} from "../inventories/inventories.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Loan} from "./entities/loan.entity";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {BooksService} from "../books/books.service";
import {UpdateInventoryDto} from "../inventories/dto/update-inventory.dto";
import {Inventory} from "../inventories/entities/inventory.entity";
import {isValidDate} from "rxjs/internal/util/isDate";

@Injectable()
export class LoansService {
    
    /**
     * Inyectamos el servicio de inventarios y el repositorio de préstamos.
     * @param loanRepository
     * @param inventoriesService
     * @param usersService
     * @param booksService
     */
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,
        private readonly inventoriesService: InventoriesService,
        private readonly usersService: UsersService,
        private readonly booksService: BooksService
    ) {}
    
    /**
     * Método que permite crear un nuevo préstamo. Este método recibe un DTO con los
     * datos del préstamo a crear.
     * @param createLoanDto - DTO con los datos del préstamo a crear.
     * @returns Loan | BadRequestException - Devuelve el préstamo creado o una excepción
     */
    async lendBook(createLoanDto: CreateLoanDto) {
        try {
            const {Inv_id} : Inventory = await this.inventoriesService.findOneByBookId(createLoanDto.bookBookId);
            if (await this.checkPrimaryKeys(createLoanDto, Inv_id)) {
                const fecha = new Date(createLoanDto.Loan_returnDate);
                if(!isValidDate(fecha)){
                    throw new BadRequestException("La fecha ingresada no es válida");
                }
                /**
                 * Creo el préstamo a través del repositorio.
                 */
                createLoanDto.Loan_returnDate = fecha;
                const loan = await this.loanRepository.create(createLoanDto);
                /**
                 * Se verifica que no exista un préstamo con el mismo usuario, libro y fecha de devolución.
                 */
                const loanExists = await this.loanRepository.findOneBy({
                    userUserId: createLoanDto.userUserId,
                    bookBookId: createLoanDto.bookBookId,
                    Loan_returnDate: createLoanDto.Loan_returnDate,
                    Loan_state: "prestado"
                });
                if (loanExists) {
                    throw new BadRequestException(`Ya existe un préstamo con el mismo usuario, libro y fecha de devolución`);
                }
                /**
                 * Creo un objeto con el DTO del inventario.
                 */
                const inventoryDto = new UpdateInventoryDto();
                /**
                 * Se indica la cantidad de unidades prestadas.
                 */
                inventoryDto.Inv_LoanedUnits = createLoanDto.Loan_quantity;
                /**
                 * Se busca el inventario del libro a prestar.
                 */
                const inventory = await this.inventoriesService.findOneByBookId(createLoanDto.bookBookId);
    
                /**
                 * Se actualiza el inventario.
                 */
                await this.inventoriesService.loanBook(inventory.Inv_id, inventoryDto);
    
                /**
                 * Se guarda el préstamo.
                 */
                await this.loanRepository.save(loan);
                
                /**
                 * Devuelvo detalles del préstamo creado.
                 */
                return loan;
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
     * Método que permite devolver un libro prestado. Este método recibe el ID del préstamo
     * y el ID del inventario.
     * @param Loan_id
     * @returns Loan | BadRequestException - Devuelve el préstamo actualizado o una excepción
     */
    async returnBook(Loan_id: number) {
        try {
            const loan = await this.loanRepository.findOneBy({Loan_id});
            if (!loan) {
                throw new NotFoundException(`El préstamo con el ID ${Loan_id} no existe`);
            }
            const inventoryDto = new UpdateInventoryDto();
            inventoryDto.Inv_LoanedUnits = loan.Loan_quantity;
            const inventory = await this.inventoriesService.findOneByBookId(loan.bookBookId);
            await this.inventoriesService.returnBook(inventory.Inv_id, inventoryDto);
            /**
             * No se elimina el préstamo, sino que se actualiza la fecha de devolución.
             */
            // await this.loanRepository.delete(loanId);
            loan.Loan_returnDate = new Date();
            loan.Loan_state = "devuelto";
            return await this.loanRepository.save(loan);
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    
    /**
     * Método que muestra todos los préstamos con sus detalles.
     */
    async findAll() {
        /**
         * Se obtienen todos los préstamos.
         */
        const loans = await this.loanRepository.find();
        /**
         * Se recorren los préstamos para obtener los detalles de los usuarios y libros.
         */
        const arrayLoans = [];
        for (const loan of loans) {
            const user = await this.usersService.findOneById(loan.userUserId);
            const book = await this.booksService.findOne(loan.bookBookId);
            const {Inv_LoanedUnits, Inv_unitsAvailable, Inv_unitsPurchased} = await this.inventoriesService.findOneByBookId(loan.bookBookId);
            arrayLoans.push({
                user: user,
                book: book,
                Loan_quantity: loan.Loan_quantity,
                Loan_returnDate: loan.Loan_returnDate,
                Loan_state: loan.Loan_state,
                Inv_LoanedUnits: Inv_LoanedUnits,
                Inv_unitsAvailable: Inv_unitsAvailable,
                Inv_unitsPurchased: Inv_unitsPurchased
            });
        }
        return arrayLoans;
    }
    
    /**
     * Método que permite buscar un préstamo por su ID y mostrar sus detalles.
     */
    async findOne(Loan_id: number) {
        const loan = await this.loanRepository.findOneBy({Loan_id});
        if (!loan) {
            throw new NotFoundException(`El préstamo con el ID ${Loan_id} no existe`);
        }
        const user = await this.usersService.findOneById(loan.userUserId);
        const book = await this.booksService.findOne(loan.bookBookId);
        const inventory = await this.inventoriesService.findOneByBookId(loan.bookBookId);
        return { user, loan, book, inventory };
    }
    
    /**
     * Método que check que existan las claves primarias de un préstamo.
     * @param createLoanDto
     * @param inventoryInvId
     * @private
     */
    private async checkPrimaryKeys(createLoanDto: CreateLoanDto, inventoryInvId: number) {
        const inventory = await this.inventoriesService.findOne(inventoryInvId);
        const user = await this.usersService.findOneById(createLoanDto.userUserId);
        const book = await this.booksService.findOne(createLoanDto.bookBookId);
        if (!inventory) {
            throw new BadRequestException(`El inventario con el ID ${inventoryInvId} no existe`);
        }
        if (!user) {
            throw new BadRequestException(`El usuario con el ID ${createLoanDto.userUserId} no existe`);
        }
        if (!book) {
            throw new BadRequestException(`El libro con el ID ${createLoanDto.bookBookId} no existe`);
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
