import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tintColor,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            height: 60,
            paddingBottom: 5,
          },
          tabBarButton: HapticTab,
        }}
      >
        {/* 🏠 Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="house.fill"
                color={color}
                style={{ marginTop: 15 }}
              />
            ),
          }}
        />

        <Tabs.Screen name="dummy" />

        {/* ⚙️ Settings Tab */}
        <Tabs.Screen
          name="setting"
          options={{
            title: "Setting",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="gearshape"
                color={color}
                style={{ marginTop: 15 }}
              />
            ),
          }}
        />
      </Tabs>

      {/* ➕ Center Floating Button */}
      <TouchableOpacity
        onPress={() => router.push("/modal?screen=create-to-do")}
        style={[styles.fab, { backgroundColor: tintColor }]}
      >
        <IconSymbol size={30} name="plus" color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
