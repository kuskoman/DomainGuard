import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJzdWIiOiI0ZTk0OGFlNi1hY2Y1LTRhZjAtOGEyZi1hMDAxMjFlNDMxOTkiLCJpYXQiOjE2OTAyNzM0MTQsImV4cCI6MTY5MDI3NDMxNH0.7_2T9VF0HVN-ZEvk99eDKDeSWAa8sfxMW-ZrYmz87HQ',
  })
  access_token!: string;
}
