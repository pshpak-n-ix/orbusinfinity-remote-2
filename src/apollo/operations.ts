import { gql } from '@apollo/client';

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TodoSortField {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  DUE_DATE = 'DUE_DATE',
  TITLE = 'TITLE',
  PRIORITY = 'PRIORITY',
}

export const GET_TODOS = gql`
  query GetTodos($pagination: PaginationInput) {
    todos(pagination: $pagination) {
      data {
        id
        title
        description
        completed
        priority
        dueDate
        createdAt
        updatedAt
      }
      pagination {
        page
        limit
        total
        totalPages
      }
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      description
      completed
      priority
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      title
      description
      completed
      priority
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
    }
  }
`;
