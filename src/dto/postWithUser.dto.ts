import { userDataDTO } from './userData.dto';
export class PostWithUserDTO {
  id: number;
  title: string;
  content: string;
  description: string;
  user: userDataDTO;
}