import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

interface Todo {
  id: string;
  title: string;
  details: string;
  category: "deep" | "easy";
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id">) => void;
  updateTodo: (
    id: string,
    data: Pick<Todo, "title" | "details" | "category">,
  ) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  deepTasks: () => Todo[];
  easyTasks: () => Todo[];
}
export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  addTodo: (todo) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          ...todo,
          id: uuidv4(),
          done: false,
        },
      ],
    })),
  updateTodo: (id, data) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  deleteTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),

  toggleTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),

  deepTasks: () => get().todos.filter((t) => t.category === "deep"),

  easyTasks: () => get().todos.filter((t) => t.category === "easy"),
}));
