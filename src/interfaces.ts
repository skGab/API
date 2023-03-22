import { RouteGenericInterface } from 'fastify';
export interface TodoParams {
  // Defines the shape of the TodoParams object, which contains an 'id' property
  id: string;
}
export interface CreateTodoRequest extends TodoParams {
  // Defines the shape of the CreateTodoRequest object, which extends TodoParams and adds 'text', 'userID', and 'complete' properties
  text: string;
  userID: string;
  complete: boolean;
}
export interface CreateUserRequest {
  // Defines the shape of the CreateUserRequest object, which contains 'user', 'email', and 'password' properties
  user: string;
  email: string;
  password: string;
}
export interface NewTodoRequestRouteInterface extends RouteGenericInterface {
  // Defines the shape of the NewTodoRouteGenericInterface object, which extends RouteGenericInterface and specifies the request body shape as CreateTodoRequest
  Body: CreateTodoRequest;
}
