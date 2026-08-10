import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@school.com' })
  @IsEmail({}, { message: 'يجب إدخال بريد إلكتروني صحيح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;

  @ApiPropertyOptional({ example: 'iPhone 13 - iOS 15' })
  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @ApiPropertyOptional({
    example: 'school-slug',
    description: 'Required when the email exists in more than one school',
  })
  @IsString()
  @IsOptional()
  schoolSlug?: string;
}
