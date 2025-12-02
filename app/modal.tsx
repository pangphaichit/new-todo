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
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState<"deep" | "easy" | null>(null);
  const addTodo = useTodoStore((state) => state.addTodo);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const todos = useTodoStore((state) => state.todos);

  const maxTasks = { deep: 3, easy: 7 };
  const deepTasks = todos.filter((t) => t.category === "deep");
  const easyTasks = todos.filter((t) => t.category === "easy");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isDeepFull = deepTasks.length >= maxTasks.deep;
  const isEasyFull = easyTasks.length >= maxTasks.easy;

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
    <Pressable
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()} // closes keyboard when tapping outside
      accessible={false} // prevents screen reader focus issues
    >
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Create New To-Do</ThemedText>
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
            <Text style={styles.buttonText}>Add Deep Task</Text>
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
            <Text style={styles.buttonText}>Add Easy Task</Text>
            <Text style={styles.buttonText}>
              ({easyTasks.length}/{maxTasks.easy})
            </Text>
          </Pressable>
        </View>
        <TextInput
          style={[styles.input, { width: width * 0.9, height: 50 }]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          editable={!!category}
          onPress={() => {
            if (!category) {
              setToastMessage("Please select Deep or Easy task first");
              setToastVisible(true);
              return;
            }
          }}
        />

        <TextInput
          style={[styles.input, { width: width * 0.9, height: 100 }]}
          placeholder="Details"
          value={details}
          onChangeText={setDetails}
          multiline
          editable={!!category}
          onPress={() => {
            if (!category) {
              setToastMessage("Please select Deep or Easy task first");
              setToastVisible(true);
              return;
            }
          }}
        />

        <View
          style={[styles.buttonContainer, { width: width * 0.9, height: 120 }]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.7 : 1, backgroundColor: "green" },
            ]}
            onPress={() => {
              if (!category) {
                setToastMessage("Please select Deep or Easy task first");
                setToastVisible(true);
                return;
              }
              handleAdd(category);
            }}
          >
            <Text style={styles.buttonText}>Add</Text>
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
