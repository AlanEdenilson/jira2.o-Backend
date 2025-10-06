import { ProjectStatus } from '../Type/Type';

export class CreateProjectDto {
  name: string;

  description: string;

  status: ProjectStatus;

  color: string;
}
