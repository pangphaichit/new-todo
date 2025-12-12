import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

interface Todo {
  title: string;
  details: string;
}

interface TodoCardProps {
  todo: Todo;
  index: number;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, index }) => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [checked, setChecked] = useState(false);
  const [confetti, setConfetti] = useState(false);

  return (
    <ThemedView style={[styles.todoCard, { marginTop: index === 0 ? 0 : 16 }]}>
      <View style={styles.todoHeader}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            checked && {
              backgroundColor: tintColor,
              borderColor: tintColor,
            },
            checked && styles.checkedCheckbox,
          ]}
          onPress={() => setChecked(!checked)}
        >
          {checked && (
            <IconSymbol name="checkmark" size={16} color="#ffffffff" />
          )}
        </TouchableOpacity>
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
      {checked && (
        <View style={styles.confettiWrapper}>
          <ConfettiCannon
            count={80}
            explosionSpeed={10}
            fadeOut
            origin={{ x: 0, y: 0 }}
            fallSpeed={2500}
          />
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  todoCard: {
    padding: 5,
    gap: 5,
    position: "relative",
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
    marginTop: 4,
  },
  checkedCheckbox: {
    justifyContent: "center",
    alignItems: "center",
  },
  todoTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 26,
  },
  todoDetails: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    marginLeft: 36,
  },
  confettiWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "120%",
    overflow: "visible",
  },
});
