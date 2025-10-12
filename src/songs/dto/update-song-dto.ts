import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
} from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title;

  @IsOptional()
  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  readonly artists;

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;
  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
