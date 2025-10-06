import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    return this.repository.save(createProjectDto);
  }

  async findAll(
    page: number,
    pageSize: number,
  ): Promise<{ data: Project[]; total: number }> {
    const [result, total] = await this.repository
      .createQueryBuilder()
      .where('Project.isActive = :estado', { estado: true })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data: result, total: total };
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.repository.findOneBy({ id: id });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    this.repository.merge(project, updateProjectDto);

    const result = await this.repository.save(project);

    return result;
  }

  async remove(id: number) {
    const project = await this.repository.find({
      where: {
        id: id,
        isActive: true,
      },
    });
    if (!project) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    const rs = await this.repository
      .createQueryBuilder()
      .update(Project)
      .set({ isActive: false })
      .where('id = :id', { id: id })
      .execute();

    if (rs.affected !== undefined && rs.affected > 0) {
      throw new HttpException('User usessfuly', HttpStatus.OK);
    }

    throw new HttpException('Error al borar el item', HttpStatus.BAD_REQUEST);
  }
}
