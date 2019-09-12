import {DefaultCrudRepository, Filter, Options, BelongsToAccessor, repository} from '@loopback/repository';
import {Todo, TodoRelations, TodoWithRelations, TodoList} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import { TodoListRepository } from './todo-list.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  public readonly todoList: BelongsToAccessor<TodoList, typeof Todo.prototype.id>;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TodoListRepository')
    protected todoListRepositoryGetter: Getter<TodoListRepository>
  ) {
    super(Todo, dataSource);
    this.todoList = this.createBelongsToAccessorFor('todoList', todoListRepositoryGetter);
  }

  async find(
    filter?: Filter<Todo>,
    options?: Options
  ): Promise<TodoWithRelations[]> {
    const include = filter && filter.include;
    filter = {...filter, include: undefined};
    const result = await super.find(filter, options);

    if (include && include.length && include[0].relation === 'todoList') {
      await Promise.all(
        result.map(async r => {
          r.todoList = await this.todoList(r.id);
        })
      );
    }
    return result;
  }

  async findById(
    id: typeof Todo.prototype.id,
    filter?: Filter<Todo>,
    options?: Options
  ): Promise<TodoWithRelations> {
    const include = filter && filter.include;
    filter = {...filter, include: undefined};
    const result = await super.findById(id, filter, options);

    if (include && include.length && include[0].relation === 'todoList') {
      result.todoList = await this.todoList(result.id);
    }

    return result;
  }
}
