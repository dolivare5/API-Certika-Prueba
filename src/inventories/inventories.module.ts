import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Inventory} from "./entities/inventory.entity";

@Module({
  controllers: [InventoriesController],
  providers: [InventoriesService],
  imports: [
      TypeOrmModule.forFeature([Inventory])
  ]
})
export class InventoriesModule {}
