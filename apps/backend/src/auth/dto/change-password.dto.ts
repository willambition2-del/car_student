import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الحالية مطلوبة' })
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(8, { message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  newPassword: string;
}
