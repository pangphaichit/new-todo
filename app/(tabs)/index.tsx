import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTodoStore } from "@/store/store";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Todo {
  id: number;
  title: string;
  details: string;
}

export default function HomeScreen() {
  const todos = useTodoStore((state) => state.todos);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">willing to do...</ThemedText>
        </ThemedView>

        {/* Task Counter */}
        <ThemedView style={styles.counterContainer}>
          <ThemedText type="defaultSemiBold" style={styles.counterText}>
            {todos.length} {todos.length === 1 ? "task" : "tasks"} today
          </ThemedText>
        </ThemedView>

        {/* Empty State */}
        {todos.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="face.dissatisfied" size={65} color="gray" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No tasks yet
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Tap "Add To Do" to create your first task and start being
              productive!
            </ThemedText>
          </ThemedView>
        ) : (
          /* To-Do List */
          <ThemedView style={styles.listContainer}>
            <FlatList
              data={todos}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <ThemedView
                  style={[styles.todoCard, { marginTop: index === 0 ? 0 : 16 }]}
                >
                  <View style={styles.todoHeader}>
                    <View style={styles.checkbox} />
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.todoTitle}
                      numberOfLines={2}
                    >
                      {item.title}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.todoDetails} numberOfLines={3}>
                    {item.details}
                  </ThemedText>
                </ThemedView>
              )}
            />
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
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
    gap: 16,
  },
  todoCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(161, 206, 220, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(161, 206, 220, 0.3)",
    gap: 12,
  },
  todoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#A1CEDC",
    marginTop: 2,
  },
  todoTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
  },
  todoDetails: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    marginLeft: 36,
  },
});
