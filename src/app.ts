// Import main styles
import "./scss/main";
import { Model } from "./js/model";
import { View } from "./js/view";
import { Controller } from "./js/controller";
import { helpers } from "./js/utils";

let saveList = helpers.load() || [];

const model = new Model(saveList);
const view = new View("#app");
model.on("change", (list) => {
  helpers.save(list);
});
const controller = new Controller(model, view);
