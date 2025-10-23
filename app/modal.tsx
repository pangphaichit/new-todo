import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTodoStore } from "@/store/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function ModalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAdd = () => {
    addTodo({ title, details });
    router.back();
  };
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create New To-Do</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Add To-Do"
          onPress={handleAdd}
          disabled={!title.trim()}
        />
        <Button title="Cancel" color="gray" onPress={() => router.back()} />
      </View>
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
  },
});
