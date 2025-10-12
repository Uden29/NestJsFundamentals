import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findArtist(userId: number): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({
      user: { id: userId },
    });
    if (!artist) {
      throw new NotFoundException('Artist not Found');
    }
    return artist;
  }
}
