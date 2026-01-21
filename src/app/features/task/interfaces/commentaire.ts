import {User} from '../../../core/auth/interfaces/user';

export interface Commentaire {
  id?: number;
  content: string;
  author: User;
  createdAt: string;
  taskId?: number;
}
