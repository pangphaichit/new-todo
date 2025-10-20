import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
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
        <ThemedText>
          Change your account settings, password, and profile info.
        </ThemedText>
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
});
