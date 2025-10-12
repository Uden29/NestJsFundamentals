import { Body, Controller, Post } from '@nestjs/common';
import { PlayListsService } from './playlist.service';
import { CreatePlayListDto } from './dto/create-playList-dto';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}

  @Post()
  create(
    @Body()
    playListDto: CreatePlayListDto,
  ): Promise<Playlist> {
    return this.playListService.create(playListDto);
  }
}
