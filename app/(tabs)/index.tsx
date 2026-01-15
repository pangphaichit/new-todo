import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TodoCard } from "@/components/todo-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTodoStore } from "@/store/store";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const todos = useTodoStore((state) => state.todos);
  const undoneTodos = todos.filter((t) => !t.done);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const deepTasks = todos.filter((t) => t.category === "deep");
  const easyTasks = todos.filter((t) => t.category === "easy");

  const MAX_DEEP = 3;
  const MAX_EASY = 7;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={{ flex: 1, position: "relative" }}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
          >
            <Pressable
              style={styles.listContainer}
              onPress={() => {
                if (openCardId !== null) {
                  setOpenCardId(null);
                }
              }}
            >
              <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">willing to do...</ThemedText>
              </ThemedView>

              {/* Task Counter */}
              {todos.length > 0 && (
                <ThemedView style={styles.counterContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.counterText}>
                    only {undoneTodos.length}{" "}
                    {undoneTodos.length === 1 ? "task" : "tasks"} today
                  </ThemedText>
                </ThemedView>
              )}

              {/* Empty State */}
              {todos.length === 0 ? (
                <ThemedView style={styles.emptyContainer}>
                  <IconSymbol
                    name="face.smiling.inverse"
                    size={65}
                    color="gray"
                  />
                  <ThemedText type="subtitle" style={styles.emptyTitle}>
                    No tasks yet
                  </ThemedText>
                  <ThemedText style={styles.emptyText}>
                    Tap "+" to create your first task and organize your to-do
                    list!
                  </ThemedText>
                </ThemedView>
              ) : (
                /* To-Do List */
                <Pressable
                  style={styles.listContainer}
                  onPress={() => {
                    if (openCardId) setOpenCardId(null);
                  }}
                >
                  {/* Deep Tasks */}
                  {deepTasks.length > 0 && (
                    <>
                      <ThemedText type="subtitle" style={styles.taskType}>
                        Deep Tasks ({deepTasks.length}/{MAX_DEEP})
                      </ThemedText>
                      {deepTasks.map((item, index) => (
                        <TodoCard
                          key={item.id}
                          todo={item}
                          index={index}
                          isOpen={openCardId === item.id}
                          onOpen={() => setOpenCardId(item.id)}
                          onClose={() => setOpenCardId(null)}
                          onDelete={() => deleteTodo(item.id)}
                        />
                      ))}
                    </>
                  )}

                  {/* Easy Tasks */}
                  {easyTasks.length > 0 && (
                    <>
                      <ThemedText type="subtitle" style={styles.taskType}>
                        Easy Tasks ({easyTasks.length}/{MAX_EASY})
                      </ThemedText>
                      {easyTasks.map((item, index) => (
                        <TodoCard
                          key={item.id}
                          todo={item}
                          index={index}
                          isOpen={openCardId === item.id}
                          onOpen={() => setOpenCardId(item.id)}
                          onClose={() => setOpenCardId(null)}
                          onDelete={() => deleteTodo(item.id)}
                        />
                      ))}
                    </>
                  )}
                </Pressable>
              )}
            </Pressable>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  counterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(161, 206, 220, 0.2)",
    borderRadius: 12,
    marginBottom: 24,
  },
  counterText: {
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 4,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
  },
  listContainer: {
    gap: 2,
    flex: 1,
  },
  taskType: {
    fontSize: 15,
    marginBottom: 15,
    marginTop: 10,
  },
});
