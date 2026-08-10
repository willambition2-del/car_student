import { IsString, IsOptional, IsInt, IsUUID, IsBoolean } from 'class-validator';

export class CreateBusDto {
  @IsString()
  busNumber: string;

  @IsString()
  plateNumber: string;

  @IsInt()
  capacity: number;

  @IsUUID()
  @IsOptional()
  driverId?: string;

  @IsUUID()
  @IsOptional()
  supervisorId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
