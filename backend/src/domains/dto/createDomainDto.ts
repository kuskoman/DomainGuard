import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  @ApiProperty({
    description: 'Full domain name',
    example: 'www.google.com',
  })
  readonly name!: string;
}
