import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Todo {
  id: string;
  title: string;
  details: string;
  category: "deep" | "easy";
  done: boolean;
}

interface TodoState {
  userName: string | null;
  todos: Todo[];
  setUserName: (name: string) => void;
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
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      userName: null,
      todos: [],
      setUserName: (name) => set({ userName: name.trim() }),
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
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
