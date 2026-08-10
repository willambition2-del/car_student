import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  schoolNumber: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  gender?: any;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsString()
  @IsOptional()
  classSection?: string;

  @IsString()
  @IsOptional()
  medicalNotes?: string;

  @IsUUID()
  @IsOptional()
  guardianId?: string;
}
