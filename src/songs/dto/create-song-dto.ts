/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateSongDTO {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists: string[];

  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
