import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      return this.projectService.create(createProjectDto);
    } catch (error) {
      console.log(error)
      return {
      status: 500,
      ok: true,
      message: 'Error ene l servidor',
      data: error,
    };
      
    }
    
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    try {
      return this.projectService.findAll(+page, +pageSize);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
