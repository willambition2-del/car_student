import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min, IsString } from 'class-validator';

export class ProximitySuggestionDto {
  @ApiProperty({ description: 'Latitude of the target center point', example: 24.7136 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  targetLat: number;

  @ApiProperty({ description: 'Longitude of the target center point', example: 46.6753 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  targetLon: number;

  @ApiPropertyOptional({ description: 'Search radius in meters (100 to 10000)', default: 500 })
  @IsNumber()
  @Min(100)
  @Max(10000)
  @IsOptional()
  radiusMeters?: number = 500;

  @ApiPropertyOptional({ description: 'Max capacity of the bus to flag overflow', default: 30 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxCapacity?: number = 30;
}
