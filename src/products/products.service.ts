import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/indext';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger: Logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const offset: number = (page - 1) * limit;

    const totalPages = await this.product.count(
      {
        where: {
          available: true // soft delete
        }
      }
    );
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany(
        {
          take: limit,
          skip: offset,
          where: {
            available: true // soft delete
          }
        }
      ),
      meta: {
        total: totalPages,
        page: page,
        lastPage
      }
    };
  }

  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`);
    const product: Product = await this.product.findUnique(
      {
        where: {
          id,
          available: true // soft deleted
        }
      }
    );

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findOne2(id: number): Promise<Product> {
    this.logger.log(`findOne2: ${id}`);

    const product: Product = await this.product.findFirst({
      where: { id }
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update(
      {
        where: { id },
        data
      }
    );
  }

  // Hard delete
  // async remove(id: number) {
  //   this.logger.log(`remove: ${id}`);
  //   await this.findOne(id);
  //   return await this.product.delete(
  //     {
  //       where: { id }
  //     }
  //   );
  // }

  // Soft delete
  async remove(id: number) {
    this.logger.log(`remove: ${id}`);

    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: { available: false }
    });
  }
}
