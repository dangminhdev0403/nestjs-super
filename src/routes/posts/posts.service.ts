import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPost() {
    return this.prismaService.post.findMany();
  }

  create(createPostDto: CreatePostDto) {
    return this.prismaService.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: 1,
      },
    });
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
