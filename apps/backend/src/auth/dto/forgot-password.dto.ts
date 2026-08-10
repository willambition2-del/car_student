import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@school.com' })
  @IsEmail({}, { message: 'يجب إدخال بريد إلكتروني صحيح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;
  @ApiPropertyOptional({
    example: 'school-slug',
    description: 'Required when the email exists in more than one school',
  })
  @IsString()
  @IsOptional()
  schoolSlug?: string;
}
