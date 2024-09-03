import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderTodos, renderPending } from "./use-cases";

const ElementIDs = {
  // ClearCompleted: ".clear-completed",
  TodoList: ".todo-list",
  NewTodoInput: "#new-todo-input",
  ClearCompletedButton: ".clear-completed",
  ToDoFilters: ".filtro",
  PendingCountLabel: "#pending-count",
};
/**
 *
 * @param {String} elementId
 */
export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    console.log(todos);
    renderTodos(ElementIDs.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPending(ElementIDs.PendingCountLabel);
  };
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //Referencias HTML

  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);

  const todoListUL = document.querySelector(ElementIDs.TodoList);

  const clearCompletedButton = document.querySelector(
    ElementIDs.ClearCompletedButton
  );

  const filtersLIs = document.querySelectorAll(ElementIDs.ToDoFilters);

  //Listeners
  newDescriptionInput.addEventListener("keyup", (event) => {
    console.log(event);

    if (event.keyCode !== 13) return;
    if (event.target.value.trim().length === 0) return;
    todoStore.addTodo(event.target.value);

    displayTodos();
    event.target.value = "";
  });

  todoListUL.addEventListener("click", (event) => {
    // console.log(event.target);
    const element = event.target.closest("[data-id]");
    // console.log(element.getAttribute("data-id"));

    todoStore.togleTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  todoListUL.addEventListener("click", (event) => {
    // console.log(event.target.className);

    const isDestroyElement = event.target.className === "destroy";

    const element = event.target.closest("[data-id]");
    if (!element || !isDestroyElement) return;
    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
    // console.log({ isDestroyElement });
  });

  clearCompletedButton.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  filtersLIs.forEach((element) => {
    element.addEventListener("click", (element) => {
      filtersLIs.forEach((el) => el.classList.remove("selected"));
      element.target.classList.add("selected");
      // console.log(element.target.text);
      switch (element.target.text) {
        case "Todos":
          todoStore.setFilter(Filters.All);
          break;
        case "Pendientes":
          todoStore.setFilter(Filters.Pending);
          break;
        case "Completados":
          todoStore.setFilter(Filters.Completed);
          break;
      }
      displayTodos();
    });
  });
};
