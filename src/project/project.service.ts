import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Response } from '../Response';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto): Response {
    return {
      status: 201,
      ok: true,
      message: 'Proyecto creado con exito',
      data: this.repository.create(createProjectDto),
    };
  }

  async findAll(page: number, pageSize: number): Promise<Response> {
    const [result, total] = await this.repository
      .createQueryBuilder()
      .where('Project.isActive = :estado', { estado: true })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      status: 200,
      ok: true,
      message: 'Proyectos encontrados con exito',
      data: result,
      total: total,
    };
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.repository.findOne({
        where: {
          id: id,
          isActive: true,
        },
        relations: {
          task: true,
        },
      });
      if (!project) {
        throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
      }

      return project;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al buscar el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Response> {
    const project = await this.repository.findOneBy({ id: id });

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    this.repository.merge(project, updateProjectDto);

    const result = await this.repository.save(project);

    return {
      status: 200,
      ok: true,
      message: 'Proyecto actualizado con exito',
      data: result,
    };
  }

  async remove(id: number): Promise<Response> {
    try {
      const project = await this.repository.findOne({
        where: { id, isActive: true },
      });

      if (!project) {
        throw new Error('proyecto no encontrado no encontrada');
      }

      const rs = await this.repository
        .createQueryBuilder()
        .update(Project)
        .set({ isActive: false })
        .where('id =:id', { id })
        .execute();

      return {
        status: 200,
        ok: true,
        message: 'Proyecto eliminado con exito',
        data: rs.affected != undefined && rs.affected > 0,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('error al borrar el proyecto');
    }
  }
}
