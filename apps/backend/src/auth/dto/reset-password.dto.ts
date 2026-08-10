import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'admin@school.com' })
  @IsEmail({}, { message: 'يجب إدخال بريد إلكتروني صحيح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'رمز التحقق مطلوب' })
  otp: string;

  @ApiPropertyOptional({
    example: 'school-slug',
    description: 'Required when the email exists in more than one school',
  })
  @IsString()
  @IsOptional()
  schoolSlug?: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(8, { message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  newPassword: string;
}
