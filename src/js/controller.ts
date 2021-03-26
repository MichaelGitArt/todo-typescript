import { IModel, Todo } from "./model";
import { IView } from "./view";

export interface IController {
  model: IModel;
  view: IView;

  addItem: (name: Todo["name"]) => void;
  removeItem: (id: Todo["id"]) => void;
  toggleItem: (obj: { id: Todo["id"]; completed: Todo["completed"] }) => void;
  editItem: (todoFiled: { id: Todo["id"]; name: Todo["name"] }) => void;
}

export class Controller implements IController {
  model: IModel;
  view: IView;

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;

    this.view.on("add", this.addItem.bind(this));
    this.view.on("remove", this.removeItem.bind(this));
    this.view.on("toggle", this.toggleItem.bind(this));
    this.view.on("edit", this.editItem.bind(this));

    this.view.show(this.model.getList());
  }

  addItem(name: Todo["name"]) {
    const todo = this.model.addItem(name);

    this.view.addItem(todo);
  }

  removeItem(id: Todo["id"]) {
    this.model.removeItem(id);
    this.view.removeItem(id);
  }

  toggleItem({ id, completed }: Todo) {
    let todo: Todo = this.model.toggleItem({ id, completed });
    this.view.toggleItem(todo);
  }

  editItem({ id, name }: Todo) {
    let todo: Todo = this.model.updateItem({ id, name });
    this.view.editItem(todo);
  }
}
