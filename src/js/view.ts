import { Todo } from "./model";
import { createElement, EventEmmiter, IEmmiter } from "./utils";

export interface IView extends IEmmiter<Events, keyof Events> {
  wrapper: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  list: HTMLElement;

  show: (todos: Todo[]) => void;

  handleAdd: (event: Event) => void;
  handleRemove: (target: HTMLButtonElement) => void;
  handleEdit: (target: HTMLButtonElement) => void;
  handleToggle: (target: HTMLButtonElement) => void;

  addItem: (todo: Todo) => void;
  removeItem: (id: Todo["id"]) => void;
  editItem: (todo: Todo) => void;
  toggleItem: (todo: Todo) => void;

  createElement: (todo: Todo) => HTMLElement;
}

interface Events {
  add: string;
  remove: number;
  toggle: {
    completed: Todo["completed"];
    id: Todo["id"];
  };
  edit: {
    name: Todo["name"];
    id: Todo["id"];
  };
}

export class View extends EventEmmiter<Events> implements IView {
  wrapper: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  list: HTMLElement;
  constructor(selector: string) {
    super();

    this.wrapper = document.querySelector(selector);
    this.form = this.wrapper.querySelector(".todo-header__form");
    this.input = this.form.querySelector(".todo-header__form-input");
    this.list = this.wrapper.querySelector(".todo-list");

    this.form.addEventListener("submit", this.handleAdd.bind(this));

    this.list.addEventListener("click", (ev) => {
      let target = ev.target as HTMLElement;

      if (target.classList.contains("todo-list-item__remove")) {
        this.handleRemove(target as HTMLButtonElement);
      } else if (target.classList.contains("todo-list-item__edit")) {
        this.handleEdit(target as HTMLButtonElement);
      }
    });

    this.list.addEventListener("change", (ev) => {
      ev.preventDefault();
      let target = ev.target as HTMLElement;

      if (target.matches('[type="checkbox"]')) {
        this.handleToggle(target as HTMLInputElement);
      }
    });
  }

  // Handlers
  handleAdd(event: Event) {
    event.preventDefault();
    let value = this.input.value;
    if (!value) return alert("Введіть щось у поле");

    this.emit("add", value);
  }

  handleRemove(target: HTMLButtonElement) {
    let listItem = target.parentNode as HTMLElement;
    let id: Todo["id"] = parseInt(listItem.dataset.id);

    this.emit("remove", id);
  }

  handleEdit(target: HTMLButtonElement) {
    let listItem = target.parentNode as HTMLElement;
    let id: Todo["id"] = parseInt(listItem.dataset.id);
    let input = listItem.querySelector(
      ".todo-list-item__input"
    ) as HTMLInputElement;
    let editButton = listItem.querySelector(".todo-list-item__edit");

    let isEditing = listItem.classList.contains("todo-list-item--editing");

    if (isEditing) {
      this.emit("edit", { id, name: input.value });
    } else {
      listItem.classList.add("todo-list-item--editing");
      editButton.textContent = "Зберегти";
      input.focus();
    }
  }

  handleToggle(target: HTMLInputElement) {
    let completed: Todo["completed"] = target.checked;
    let listItem = target.closest(".todo-list-item") as HTMLElement;
    let id: Todo["id"] = parseInt(listItem.dataset.id);

    this.emit("toggle", { completed, id });
  }

  // Actions
  addItem(todo: Todo) {
    const item = this.createElement(todo);
    this.input.value = "";

    this.list.appendChild(item);
  }

  removeItem(id: Todo["id"]) {
    let listItem = this.list.querySelector(`[data-id="${id}"]`);
    this.list.removeChild(listItem);
  }

  editItem({ id, name }: Todo) {
    let listItem = this.list.querySelector(`[data-id="${id}"]`);
    let editButton = listItem.querySelector(".todo-list-item__edit");
    let text = listItem.querySelector(".todo-list-item__text");

    listItem.classList.remove("todo-list-item--editing");
    text.textContent = name;
    editButton.textContent = "Змінити";
  }

  toggleItem({ completed, id }: Todo) {
    let listItem = this.list.querySelector(`[data-id="${id}"]`);
    let checkbox = listItem.querySelector(
      '[type="checkbox"]'
    ) as HTMLInputElement;

    checkbox.checked = completed;

    if (completed) {
      listItem.classList.add("todo-list-item--completed");
    } else {
      listItem.classList.remove("todo-list-item--completed");
    }
  }

  show(todos: Todo[]) {
    todos.forEach((todo) => {
      const listItem = this.createElement(todo);

      this.list.appendChild(listItem);
    });
  }

  // Create todo list item
  createElement(todo: Todo): HTMLElement {
    let checkbox = createElement("input", {
      type: "checkbox",
      checked: todo.completed,
    });
    checkbox = createElement("div", { className: "todo-list-item__toggle" }, [
      checkbox,
    ]);

    let text = createElement(
      "span",
      { className: "todo-list-item__text" },
      todo.name
    );

    let deleteButton = createElement(
      "button",
      {
        className:
          "todo-list-item__action todo-list-item__remove a-btn a-btn--danger",
      },
      "Видалити"
    );
    let editButton = createElement(
      "button",
      { className: "todo-list-item__action todo-list-item__edit a-btn" },
      "Змінити"
    );
    let editInput = createElement("input", {
      type: "text",
      className: "todo-list-item__input a-input",
      value: todo.name,
    });

    const elem = createElement(
      "div",
      {
        className: `todo-list-item ${
          todo.completed ? "todo-list-item--completed" : ""
        }`,
        "data-id": todo.id,
      },
      [checkbox, text, editInput, deleteButton, editButton]
    );

    return elem;
  }
}
