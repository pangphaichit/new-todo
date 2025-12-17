import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, ColorUtils } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Todo {
  id: string;
  title: string;
  details: string;
  category: "deep" | "easy";
  done: boolean;
}

interface TodoCardProps {
  todo: Todo;
  index: number;
  onDelete?: () => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  index,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const checked = todo.done;

  // Card X position
  const translateX = useSharedValue(0);
  const isDeleteOpen = useSharedValue(false);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";

      if (event.translationX > 0) {
        return;
      }

      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      "worklet";

      // DELETE (right → left)
      if (event.translationX < -20) {
        translateX.value = withSpring(-150);
        isDeleteOpen.value = true;
        return;
      }

      // MARK DONE (left → right) ONLY if delete is closed
      if (event.translationX > 100 && !isDeleteOpen.value) {
        runOnJS(toggleTodo)(todo.id);
        translateX.value = withSpring(0);
        return;
      }

      // CLOSE delete if open and user swipes back
      if (isDeleteOpen.value && event.translationX > 0) {
        translateX.value = withSpring(0);
        isDeleteOpen.value = false;
        return;
      }

      // default reset
      translateX.value = withSpring(isDeleteOpen.value ? -150 : 0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        <View style={styles.deleteBackground}>
          <TouchableOpacity
            onPress={() => {
              onDelete?.();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.todoCard, animatedStyle]}>
          <ThemedView style={styles.todoCard}>
            <View style={styles.todoHeader}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  { borderColor: tintColor },
                  checked && {
                    backgroundColor: ColorUtils.adjustOpacity(tintColor, 0.5),
                    borderColor: ColorUtils.adjustOpacity(tintColor, 0.1),
                  },
                  checked && styles.checkedCheckbox,
                ]}
                onPress={() => toggleTodo(todo.id)}
              >
                {checked && (
                  <IconSymbol name="checkmark" size={16} color="#ffffffff" />
                )}
              </TouchableOpacity>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.todoTitle,
                  checked && {
                    color: "#c6c2c2ff",
                    textDecorationLine: "line-through",
                  },
                ]}
                numberOfLines={2}
              >
                {todo.title}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.todoDetails,
                checked && {
                  color: ColorUtils.adjustOpacity(tintColor, 0.5),
                  textDecorationLine: "line-through",
                },
              ]}
              numberOfLines={3}
            >
              {todo.details}
            </ThemedText>
            {checked && (
              <View style={styles.confettiWrapper}>
                <ConfettiCannon
                  count={80}
                  fadeOut
                  origin={{ x: 0, y: 0 }}
                  fallSpeed={2500}
                />
              </View>
            )}
          </ThemedView>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  todoCard: {
    height: 70,
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
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 150,
    backgroundColor: "#ff3b30",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
