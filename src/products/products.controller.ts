import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/indext';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {

  private readonly logger: Logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({ cmd: "create" })
  create(@Payload() createProductDto: CreateProductDto) {
    this.logger.log('Begin create', { createProductDto });
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: "find_all" })
  findAll(
    @Payload() paginationDto: PaginationDto
  ) {
    this.logger.log(`findAll: ${JSON.stringify(paginationDto)}`);
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: "find_one" })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Get('find2/:id')
  @MessagePattern({ cmd: "find_one2" })
  findOne2(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne2(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: "update" })
  update(
    // @Payload('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) {
    this.logger.log('Begin update', { updateProductDto });
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: "delete" })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
