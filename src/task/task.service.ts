import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Response } from './Response';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async create(createTaskDto: Task): Promise<Response> {
    try {
      const task = this.repository.create(createTaskDto);
      return {
        status: 201,
        ok: true,
        message: 'Tarea creada con exito',
        data: await this.repository.save(task),
      };
    } catch (error) {
      console.log(error);
      throw new Error('error al crear la reserva');
    }
  }

  async findOne(id: number): Promise<Response> {
    try {
      const project = await this.repository.find({
        where: {
          id: id,
          isActive: true,
        },
      });
      if (!project) {
        throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
      }

      return {
        status: 200,
        ok: true,
        message: 'Tarea encontrada con exito',
        data: project,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(
    page: number,
    pageSize: number,
    id: number,
  ): Promise<{ data: Task[]; total: number }> {
    /*const [result, total] = await this.repository
      .createQueryBuilder()
      .where('Project.isActive = :estado', { estado: true })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();*/

    const [result, total] = await this.repository.findAndCount({
      where: {
        isActive: true,
        project: { id },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data: result, total: total };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.repository.findOneBy({ id: id });

    if (!task) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }
    this.repository.merge(task, updateTaskDto);

    const result = await this.repository.save(task);

    return result;
  }

  async remove(id: number): Promise<boolean> {
    try {
      const task = await this.repository.findOne({
        where: { id, isActive: true },
      });

      if (!task) {
        throw new Error('Tarea no encontrado no encontrada');
      }

      const rs = await this.repository
        .createQueryBuilder()
        .update(Task)
        .set({ isActive: false })
        .where('id =:id', { id })
        .execute();

      return rs.affected != undefined && rs.affected > 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('error al borrar el proyecto');
    }
  }
}
