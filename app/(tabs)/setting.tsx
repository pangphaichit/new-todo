import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
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

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const userName = useTodoStore((s) => s.userName);
  const setUserName = useTodoStore((s) => s.setUserName);

  const [name, setName] = useState(userName ?? "");
  const NAME_LIMIT = 10;
  const [saved, setSaved] = useState(false);

  const isValid = name.trim().length >= 2;

  const handleSave = () => {
    if (!isValid) return;
    setUserName(name);
    Keyboard.dismiss();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gearshape"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Settings
        </ThemedText>
      </ThemedView>

      {/* Example collapsible settings section */}
      <Collapsible title="Account">
        <ThemedText style={styles.label}>Display Name</ThemedText>
        <View style={[styles.nameInputContainer, { width: width * 0.8 }]}>
          <Text style={styles.nameInputCounter}>
            {NAME_LIMIT - name.length} characters left
          </Text>

          <TextInput
            style={[styles.input, { width: width * 0.8 }]}
            value={name}
            onChangeText={(v) => {
              setName(v);
              setSaved(false);
            }}
            placeholder="Enter your name"
            maxLength={NAME_LIMIT}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>
        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: saved ? "#1a962fff" : tintColor,
                opacity: pressed || !isValid ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={!isValid}
          >
            <Text style={styles.saveButtonText}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </Collapsible>

      <Collapsible title="Notifications">
        <ThemedText>
          Manage push notifications and email preferences.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Privacy">
        <ThemedText>Adjust privacy settings and permissions.</ThemedText>
      </Collapsible>

      <Collapsible title="About">
        <ThemedText>Version: 1.0.0</ThemedText>
        <ThemedText>Terms of Service and Privacy Policy</ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 6,
  },
  nameInputContainer: { position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    fontSize: 16,
    padding: 15,
  },
  nameInputCounter: {
    position: "absolute",
    right: 8,
    padding: 5,
    top: 0,
    fontSize: 12,
    color: "#b9b7b7ff",
    zIndex: 10,
  },
  row: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
