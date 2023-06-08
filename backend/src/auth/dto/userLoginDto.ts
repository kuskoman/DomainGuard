import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the user',
    example: 'test@example.com',
  })
  readonly email!: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: 'testPassword',
  })
  readonly password!: string;
}
