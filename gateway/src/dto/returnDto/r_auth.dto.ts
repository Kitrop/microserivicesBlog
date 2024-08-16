import { ApiResponseProperty } from '@nestjs/swagger'

export class DataAuth {
  @ApiResponseProperty()
  id: number

  @ApiResponseProperty()
  username: string

  @ApiResponseProperty()
  email: string

  @ApiResponseProperty()
  accessToken: string
}

export class ReturnedAuthDto {
  @ApiResponseProperty()
  statusCode: number
  @ApiResponseProperty({ type: DataAuth })
  data: {
    id: number
    username: string
    email: string
    accessToken: string
  }
}