import { TodoPriority } from './operations';

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: string;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TodosResponse {
  data: Todo[];
  pagination: PaginationResponse;
}
