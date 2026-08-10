import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyOtpDto {
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
}
