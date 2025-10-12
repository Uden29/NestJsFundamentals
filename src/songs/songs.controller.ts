import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  DefaultValuePipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from './song.entity';
import { DeleteResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { UpdateResult } from 'typeorm/browser';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {
  constructor(private songsSerive: SongsService) {}
  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Request() req): Promise<Song> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('req.user => ', req.user);
    return this.songsSerive.create(createSongDTO);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsSerive.paginate({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    try {
      return this.songsSerive.findOne(id);
    } catch (error) {
      console.log('er => ', error);
      throw new Error('not found');
    }
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsSerive.update(id, updateSongDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsSerive.remove(id);
  }
}
