import { IsIn, IsString } from 'class-validator';

const ACCESS_DATA_FIELDS = ['tg-token', 'tg-chat-id', 'wb-token'] as const;
type AccessDataField = (typeof ACCESS_DATA_FIELDS)[number];

export class UpdateAccessDataDto {
  @IsIn(ACCESS_DATA_FIELDS)
  field: AccessDataField;

  @IsString()
  value: string;
}
