import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Todo {
  title: string;
  details: string;
}

interface TodoCardProps {
  todo: Todo;
  index: number;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, index }) => {
  return (
    <ThemedView style={[styles.todoCard, { marginTop: index === 0 ? 0 : 16 }]}>
      <View style={styles.todoHeader}>
        <View style={styles.checkbox} />
        <ThemedText
          type="defaultSemiBold"
          style={styles.todoTitle}
          numberOfLines={2}
        >
          {todo.title}
        </ThemedText>
      </View>
      <ThemedText style={styles.todoDetails} numberOfLines={3}>
        {todo.details}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
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
