import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  useWindowDimensions,
  View,
} from "react-native";

export default function NameSetupScreen() {
  const router = useRouter();
  const setUserName = useTodoStore((s) => s.setUserName);
  const [name, setName] = useState("");
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const isValid = name.trim().length >= 2;
  const NAME_LIMIT = 10;

  const handleSave = () => {
    if (!isValid) return;
    setUserName(name);
    router.replace("/"); // go to home
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.emoji}>
          👋
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.titleText}>
          What's your name?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          What should we call you?
        </ThemedText>
        <View style={(styles.nameInputContainer, { width: width * 0.9 })}>
          <Text style={styles.nameInputCounter}>
            {NAME_LIMIT - name.length} characters left
          </Text>

          <TextInput
            style={[styles.input, { width: width * 0.9, height: 60 }]}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            maxLength={NAME_LIMIT}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>

        <View style={{ width: width * 0.9, marginTop: 16 }}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: isValid ? tintColor : "#ccc",
                opacity: pressed || !isValid ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Let's Go →</Text>
          </Pressable>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#f3f2f2ff",
  },
  titleText: {
    fontSize: 20,
    textAlign: "center",
  },
  emoji: {
    fontSize: 30,
  },
  subtitle: {
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    fontSize: 16,
    padding: 15,
  },
  nameInputContainer: { position: "relative" },
  nameInputCounter: {
    position: "absolute",
    right: 8,
    padding: 5,
    top: 0,
    fontSize: 12,
    color: "#b9b7b7ff",
    zIndex: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
