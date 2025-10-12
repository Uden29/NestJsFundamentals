import { Injectable } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Song } from './song.entity';
import { DeleteResult } from 'typeorm/browser';
import { UpdateSongDto } from './dto/update-song-dto';
import { UpdateResult } from 'typeorm/browser';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepoistory: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  private readonly songs: CreateSongDTO[] = [];

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepoistory.createQueryBuilder('c');
    queryBuilder.orderBy('c.releaseDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();

    song.title = songDTO.title;
    // song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releaseDate = songDTO.releaseDate;

    const artists = await this.artistRepository.findBy({
      id: In(songDTO.artists),
    });
    song.artists = artists;

    return await this.songRepoistory.save(song);
  }

  findAll(): Promise<Song[]> {
    return this.songRepoistory.find();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepoistory.findOneBy({ id });

    if (!song) {
      throw new Error(`Song with this ${id} not Found.`);
    }

    return song;
  }

  remove(id: number): Promise<DeleteResult> {
    return this.songRepoistory.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    return this.songRepoistory.update(id, recordToUpdate);
  }
}
