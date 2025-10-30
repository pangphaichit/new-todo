import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Toast from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

export default function ModalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const todos = useTodoStore((state) => state.todos);

  const maxTasks = { deep: 3, easy: 7 };
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isDeepFull =
    todos.filter((t) => t.category === "deep").length >= maxTasks.deep;
  const isEasyFull =
    todos.filter((t) => t.category === "easy").length >= maxTasks.easy;

  const handleAdd = (category: "deep" | "easy") => {
    const isFull = category === "deep" ? isDeepFull : isEasyFull;

    if (isFull) {
      setToastMessage(
        `${
          category === "deep" ? "Deep" : "Easy"
        } task slots full! Complete some first`
      );
      setToastVisible(true);
      return;
    }

    addTodo({ title, details, category });
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Create New To-Do</ThemedText>

      <TextInput
        style={[styles.input, { width: width * 0.8, height: 50 }]}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { width: width * 0.8, height: 100 }]}
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        multiline
      />

      <View style={[styles.buttonContainer, { width: width * 0.8 }]}>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: isDeepFull ? "#c0bbbbff" : tintColor,
              },
            ]}
            onPress={() => handleAdd("deep")}
            disabled={!title.trim()}
          >
            <IconSymbol size={40} name="brain" color="white" />
            <Text style={styles.buttonText}>Add Deep Task</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: isEasyFull ? "gray" : "#ff8025ff",
              },
            ]}
            onPress={() => handleAdd("easy")}
            disabled={!title.trim()}
          >
            <IconSymbol size={40} name="bolt" color="white" />
            <Text style={styles.buttonText}>Add Easy Task</Text>
          </Pressable>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 0,
    gap: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
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
    height: 125,
    padding: 12,
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
