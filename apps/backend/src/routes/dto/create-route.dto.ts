import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { TripType } from '../../common/enums';

export class CreateRouteDto {
  @IsString()
  nameAr: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TripType)
  tripType: TripType;

  @IsUUID()
  @IsOptional()
  busId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
