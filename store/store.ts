import { create } from "zustand";

interface Todo {
  title: string;
  details: string;
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
}
export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (todo) =>
    set((state: TodoState) => ({ todos: [...state.todos, todo] })), // state typed
}));
