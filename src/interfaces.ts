import { RouteGenericInterface } from "fastify";

export interface TodoParams {
  id: string;
}

export interface CreateTodoRequest extends TodoParams {
  text: string;
  userID: string;
  complete: string;
}

export interface CreateUserRequest {
  user: string;
  email: string;
  password: string;
}

export interface NewTodoRouteGenericInterface extends RouteGenericInterface {
  Body: CreateTodoRequest;
}
