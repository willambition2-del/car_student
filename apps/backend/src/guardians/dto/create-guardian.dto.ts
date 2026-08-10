import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateGuardianDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  relation?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
