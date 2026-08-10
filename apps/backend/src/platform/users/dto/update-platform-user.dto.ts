import { PartialType } from '@nestjs/swagger';
import { CreatePlatformUserDto } from './create-platform-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlatformUserDto extends PartialType(CreatePlatformUserDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
