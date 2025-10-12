import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './dto/create-playList-dto';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,
    @InjectRepository(Song)
    private songsRepo: Repository<Song>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(playListDto: CreatePlayListDto): Promise<Playlist> {
    const playList = new Playlist();
    playList.name = playListDto.name;

    const songs = await this.songsRepo.findBy({ id: In(playListDto.songs) });

    playList.songs = songs;

    const user = await this.userRepo.findOneBy({ id: playListDto.user });

    playList.user = user as User; //type assertion
    // if (!user) {
    //   throw new Error(`User with id ${playListDto.user} not found`);
    // }
    // playList.user = user;

    return this.playListRepo.save(playList);
  }
}
