import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Toast from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

export default function ModalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const existingTodo = id ? todos.find((t) => t.id === id) : null;
  const isEditing = !!existingTodo;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState<"deep" | "easy" | null>(null);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const maxTasks = { deep: 3, easy: 7 };
  const deepTasks = todos.filter((t) => t.category === "deep");
  const easyTasks = todos.filter((t) => t.category === "easy");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isDeepFull = deepTasks.length >= maxTasks.deep;
  const isEasyFull = easyTasks.length >= maxTasks.easy;

  const trimmedTitle = title.trim();
  const isTitleValid = trimmedTitle.length >= 2;
  const isAddDisabled = !category || !isTitleValid;

  const TITLE_LIMIT = 40;
  const DETAILS_LIMIT = 120;

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setDetails(existingTodo.details);
      setCategory(existingTodo.category);
    }
  }, [existingTodo]);

  const handleSave = () => {
    if (!category) return;

    if (isEditing) {
      updateTodo(id!, {
        title: title.trim(),
        details: details.trim(),
        category,
      });
    } else {
      addTodo({
        title: title.trim(),
        details: details.trim(),
        category,
        done: false,
      });
    }

    router.back();
  };

  const requireCategory = () => {
    if (!category) {
      setToastMessage("Please select Deep or Easy task first");
      setToastVisible(true);
      Keyboard.dismiss();
      return false;
    }

    if (category === "deep" && isDeepFull) {
      setToastMessage("Please clear Deep tasks first");
      setToastVisible(true);
      Keyboard.dismiss();
      return false;
    }

    if (category === "easy" && isEasyFull) {
      setToastMessage("Please clear Easy tasks first");
      setToastVisible(true);
      Keyboard.dismiss();
      return false;
    }

    return true;
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        if (Platform.OS !== "web") {
          Keyboard.dismiss();
        }
      }}
      accessible={false} // prevents screen reader focus issues
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.container}>
            <ThemedText type="subtitle">
              {" "}
              {isEditing ? "Edit To-Do" : "Create New To-Do"}
            </ThemedText>
            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: isDeepFull
                      ? "#c0bbbbff" // full → gray
                      : category === "deep"
                        ? "#1b8dffff" // clicked → bright blue
                        : "#a3ccf6ff", // default → bright
                  },
                ]}
                onPress={() => {
                  if (isDeepFull) {
                    setToastMessage("Please clear Deep task first");
                    setToastVisible(true);
                    return;
                  }
                  setCategory(category === "deep" ? null : "deep");
                }}
              >
                <IconSymbol size={40} name="brain" color="white" />
                <Text style={styles.buttonText}>Deep Task</Text>
                <Text style={styles.buttonText}>
                  ({deepTasks.length}/{maxTasks.deep})
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: isEasyFull
                      ? "gray" // full → gray
                      : category === "easy"
                        ? "#ff8025ff" // clicked → bright orange
                        : "#f9c9a8ff", // default → orange
                  },
                ]}
                onPress={() => {
                  if (isEasyFull) {
                    setToastMessage("Please clear Easy task first");
                    setToastVisible(true);
                    return;
                  }
                  setCategory(category === "easy" ? null : "easy");
                }}
              >
                <IconSymbol size={40} name="bolt" color="white" />
                <Text style={styles.buttonText}>Easy Task</Text>
                <Text style={styles.buttonText}>
                  ({easyTasks.length}/{maxTasks.easy})
                </Text>
              </Pressable>
            </View>
            <View style={styles.titleInputContainer}>
              <Text style={styles.titleInputCounter}>
                {TITLE_LIMIT - title.length} characters left
              </Text>
              <TextInput
                style={[styles.input, { width: width * 0.9, height: 85 }]}
                placeholder="Title"
                value={title}
                multiline
                maxLength={TITLE_LIMIT}
                onChangeText={setTitle}
                editable={!!category || isEditing}
                onFocus={() => {
                  requireCategory();
                }}
              />
            </View>
            <View style={styles.detailsInputContainer}>
              <Text style={styles.detailsInputCounter}>
                {DETAILS_LIMIT - details.length} characters left
              </Text>

              <TextInput
                style={[styles.input, { width: width * 0.9, height: 110 }]}
                placeholder="Details"
                value={details}
                maxLength={DETAILS_LIMIT}
                onChangeText={setDetails}
                multiline
                editable={!!category || isEditing}
                onFocus={() => {
                  requireCategory();
                }}
              />
            </View>
            <View
              style={[
                styles.buttonContainer,
                { width: width * 0.9, height: 130 },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    opacity: pressed || isAddDisabled ? 0.5 : 1,
                    backgroundColor: isAddDisabled ? "#ccc" : tintColor,
                  },
                ]}
                onPress={() => {
                  if (!requireCategory()) return;

                  if (title.trim().length === 0) {
                    setToastMessage("Please enter a title");
                    setToastVisible(true);
                    return;
                  }

                  handleSave();
                }}
              >
                <Text style={styles.buttonText}>
                  {" "}
                  {isEditing ? "Save" : "Add"}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { opacity: pressed ? 0.7 : 1, backgroundColor: "gray" },
                ]}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>

            {/* Animated Toast */}
            <Toast
              visible={toastVisible}
              message={toastMessage}
              onDismiss={() => setToastVisible(false)}
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 0,
    gap: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 10,
    fontSize: 15,
  },
  titleInputContainer: { position: "relative" },
  detailsInputContainer: { position: "relative" },
  titleInputCounter: {
    position: "absolute",
    right: 8,
    top: 0,
    fontSize: 12,
    color: "#b9b7b7ff",
    padding: 5,
  },
  detailsInputCounter: {
    position: "absolute",
    right: 8,
    top: 0,
    fontSize: 12,
    color: "#b9b7b7ff",
    padding: 5,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  toast: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  toastText: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
});
