import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { TripType } from '../../common/enums';

export class StartTripDto {
  @IsUUID()
  routeId: string;

  @IsUUID()
  busId: string;

  @IsUUID()
  @IsOptional()
  driverId?: string;

  @IsUUID()
  @IsOptional()
  supervisorId?: string;

  @IsEnum(TripType)
  @IsOptional()
  tripType?: TripType;
}
