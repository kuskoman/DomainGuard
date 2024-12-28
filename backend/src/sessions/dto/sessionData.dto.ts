import { ApiProperty } from '@nestjs/swagger';

export class SessionDataDto {
  @ApiProperty()
  sessionId!: string;

  @ApiProperty()
  createdAt!: Date;
}
