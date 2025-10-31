import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService, TaskStatus } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectService } from 'src/project/project.service';
import { Task } from './entities/task.entity';

@Controller('api/task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      const project = await this.projectService.findOne(
        createTaskDto.projectId,
      );

      if (!project) {
        throw new Error('El proyecto no existe');
      }

      const task = new Task();
      task.title = createTaskDto.title;
      task.description = createTaskDto.description;
      task.status = createTaskDto.status;
      task.project = project;

      return this.taskService.create(task);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('id') id: string,
  ) {
    return this.taskService.findAll(
      parseInt(page),
      parseInt(pageSize),
      parseInt(id),
    );
  }

  @Get('two')
  findForParams(
    @Query('project') project: string,
    @Query('estado') estado: TaskStatus,
  ) {
    return this.taskService.findForParametros(parseInt(project), estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
