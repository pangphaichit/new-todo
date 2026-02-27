import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, ColorUtils } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
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
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  index,
  isOpen,
  onOpen,
  onClose,
  onDelete,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const checked = todo.done;

  // Card X position
  const translateX = useSharedValue(0);
  const isDeleteOpen = useSharedValue(false);

  const isPressingCheckbox = useSharedValue(false);

  const hasDetails = !!todo.details?.trim();

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(-150);
      isDeleteOpen.value = true;
    } else {
      translateX.value = withSpring(0);
      isDeleteOpen.value = false;
    }
  }, [isOpen]);

  const handleTapToEdit = () => {
    if (!isOpen) {
      router.push(`/modal?screen=create-to-do&id=${todo.id}`);
    }
  };

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
      if (event.translationX < -50) {
        translateX.value = withSpring(-150);
        isDeleteOpen.value = true;
        runOnJS(onOpen)();
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
        runOnJS(onClose)();
        return;
      }

      // default reset
      translateX.value = withSpring(isDeleteOpen.value ? -150 : 0);
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      if (!isPressingCheckbox.value && !isOpen) {
        runOnJS(handleTapToEdit)();
      }
    });

  const composedGesture = Gesture.Exclusive(swipeGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const confirmDelete = () => {
    onClose();
    Alert.alert(
      "Delete task?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            // optional: close swipe
            onClose();
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete?.();
            onClose();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View>
      {isOpen && (
        <TouchableOpacity
          style={styles.tapToClose}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <View style={styles.container}>
        <View style={styles.deleteBackground} pointerEvents="box-none">
          <TouchableOpacity onPress={confirmDelete} activeOpacity={0.7}>
            <IconSymbol name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <GestureDetector gesture={composedGesture}>
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
                  onPressIn={() => {
                    isPressingCheckbox.value = true;
                  }}
                  onPressOut={() => {
                    isPressingCheckbox.value = false;
                  }}
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
                  numberOfLines={1}
                >
                  {todo.title}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.todoDetails,
                  !hasDetails && styles.placeholderDetails,
                  checked && {
                    color: "#c6c2c2ff",
                    textDecorationLine: "line-through",
                  },
                ]}
                numberOfLines={2}
              >
                {hasDetails ? todo.details : "Tap to add details"}
              </ThemedText>
              {checked && (
                <View style={styles.confettiWrapper} pointerEvents="none">
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
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  todoCard: {
    position: "relative",
    backgroundColor: "#F5F5F5",
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
  placeholderDetails: {
    color: "#9E9E9E",
    fontStyle: "italic",
    opacity: 0.8,
    fontSize: 14,
  },
  confettiWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "120%",
    overflow: "visible",
  },
  tapToClose: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
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
