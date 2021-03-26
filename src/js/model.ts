import { EventEmmiter, IEmmiter } from "./utils";

export interface Todo {
  name: string;
  completed: boolean;
  id: number;
}

type Events = {
  change: Todo[];
};

export interface IModel extends IEmmiter<Events, keyof Events> {
  getList: () => Todo[];

  addItem: (todoStr: string) => Todo;
  getItem: (id: Todo["id"]) => Todo;
  updateItem: (obj: { id: Todo["id"]; name: Todo["name"] }) => Todo;
  toggleItem: (obj: { id: Todo["id"]; completed: Todo["completed"] }) => Todo;
  removeItem: (id: Todo["id"]) => void;
}

export class Model extends EventEmmiter<Events> implements IModel {
  private todos: Array<Todo> = [];

  constructor(saveList: Todo[]) {
    super();
    this.todos = saveList;
  }

  getList(): Todo[] {
    return this.todos;
  }

  addItem(todoStr: string): Todo {
    const todo: Todo = {
      name: todoStr,
      completed: false,
      id: Date.now(),
    };

    this.todos.push(todo);
    this.emit("change", this.todos);

    return todo;
  }

  getItem(id: Todo["id"]): Todo {
    return this.todos.find((todo) => todo.id === id);
  }

  updateItem({ id, name }: Todo): Todo {
    let item = this.getItem(id);
    item.name = name;
    this.emit("change", this.todos);

    return item;
  }

  toggleItem({ id, completed }: Todo): Todo {
    let item = this.getItem(id);
    item.completed = completed;
    this.emit("change", this.todos);

    return item;
  }

  removeItem(id: number): void {
    let itemIndex = this.todos.findIndex((todo) => todo.id === id);

    this.todos.splice(itemIndex, 1);
    this.emit("change", this.todos);
  }
}
