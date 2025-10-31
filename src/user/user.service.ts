import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.save(createUserDto);
  }

  async findAll(
    page: number,
    pageSize: number,
  ): Promise<{ data: User[]; total: number }> {
    const [result, total] = await this.repository
      .createQueryBuilder()
      .where('User.isActive = :estado', { estado: true })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data: result, total: total };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const project = await this.repository.findOneBy({ id: id });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    this.repository.merge(project, updateUserDto);

    

    const result = await this.repository.save(project);

    return result;
  }

  async remove(id: number): Promise<boolean> {
    try {
      const user = await this.repository.findOne({
        where: { id, isActive: true },
      });

      if (!user) {
        throw new Error('cancha no encontrada');
      }

      const rs = await this.repository
        .createQueryBuilder()
        .update(User)
        .set({ isActive: false })
        .where('id =:id', { id })
        .execute();

      return rs.affected != undefined && rs.affected > 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('error al borrar la cancha');
    }
  }
}
