import { create } from "zustand";

interface Todo {
  title: string;
  details: string;
  category: "deep" | "easy";
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  deepTasks: () => Todo[];
  easyTasks: () => Todo[];
}
export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  addTodo: (todo) =>
    set((state: TodoState) => ({ todos: [...state.todos, todo] })),
  deepTasks: () => get().todos.filter((t) => t.category === "deep"),

  easyTasks: () => get().todos.filter((t) => t.category === "easy"),
}));
