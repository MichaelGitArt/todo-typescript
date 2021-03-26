import { Todo } from "../model";

function save(todos: Todo[]) {
  let jsonData = JSON.stringify(todos);

  localStorage.setItem("todolist", jsonData);
}

function load() {
  let jsonData = localStorage.getItem("todolist");

  return JSON.parse(jsonData);
}

export default {
  save,
  load,
};
