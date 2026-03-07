import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CalculateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  memberCard?: string;
}
