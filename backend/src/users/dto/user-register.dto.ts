import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    required: true,
    example: 'test@example.com',
  })
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
    example: 'testPassword',
  })
  password!: string;
}
