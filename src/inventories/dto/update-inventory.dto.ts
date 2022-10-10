import { PartialType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';
import {IsNumber, IsOptional} from "class-validator";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    @IsNumber()
    @IsOptional()
    Inv_LoanedUnits: number
    
    @IsNumber()
    @IsOptional()
    Inv_unitsAvailable: number
    
    @IsNumber()
    @IsOptional()
    Inv_unitsPurchased: number
    
}
