import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Toast from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTodoStore } from "@/store/store";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const todos = useTodoStore((state) => state.todos);

  const maxDeepTasks = 3;
  const maxEasyTasks = 7;

  const deepTasks = todos.filter((t) => t.category === "deep").length;
  const easyTasks = todos.filter((t) => t.category === "easy").length;

  const canAddMore = deepTasks < maxDeepTasks || easyTasks < maxEasyTasks;
  const [toastVisible, setToastVisible] = useState(false);

  const handlePressAdd = () => {
    if (canAddMore) {
      router.push("/modal?screen=create-to-do");
    } else {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

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

        <Tabs.Screen
          name="dummy"
          options={{
            href: null,
          }}
        />

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
        onPress={handlePressAdd}
        style={[
          styles.fab,
          { backgroundColor: canAddMore ? tintColor : "gray" },
        ]}
      >
        <IconSymbol size={30} name="plus" color="white" />
      </TouchableOpacity>
      <Toast
        visible={toastVisible}
        message="All slots full! Complete some tasks first"
        onDismiss={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 25,
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
