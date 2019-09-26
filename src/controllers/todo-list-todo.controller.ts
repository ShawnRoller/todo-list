// Uncomment these imports to begin using these cool features!

import {repository, getModelRelations, Count, CountSchema, Filter, Where} from '@loopback/repository';
import {TodoListRepository} from '../repositories';
import {del, get, post, param, requestBody, getModelSchemaRef, getWhereSchemaFor, patch} from '@loopback/rest';
import {Todo} from '../models';

export class TodoListTodoController {
  constructor(
    @repository(TodoListRepository) protected todoListRepo: TodoListRepository
  ) {}

  @post('todo-lists/{id}/todos')
  async create(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {exclude: ['id']})
        }
      }
    })
    todo: Omit<Todo, 'id'>
  ) {
    return this.todoListRepo.todos(id).create(todo);
  }

  @get('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: "Array of Todo's belonging to TodoList",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todo)}
          }
        }
      }
    }
  })
  async find(@param.path.number('id') id: number, @param.query.object('filter') filter?: Filter<Todo>):
  Promise<Todo[]> {
    return this.todoListRepo.todos(id).find(filter);
  }

  @patch('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: 'TodoList.Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoListRepo.todos(id).patch(todo, where);
  }

  @del('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: 'TodoList.Todo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoListRepo.todos(id).delete(where);
  }
}
