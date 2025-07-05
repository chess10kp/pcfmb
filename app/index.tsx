import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { SamsungCallScreen } from "~/components/SamsungCallScreen";
import SettingsScreen from "~/components/Settings";
import { ScreenComponent, type ScheduledCall } from "~/lib/types/types";

import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export default function Screen() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPreviewedCall, setCurrentPreviewedCall] =
    useState<ScheduledCall | null>(null);

  const previewScheduledCall = (caller: ScheduledCall) => {
    setIsPreviewMode(true);
    setCurrentPreviewedCall(caller);
    router.push({
      pathname: "/preview",
      params: {
        formData: JSON.stringify(caller),
        currentPreviewedCall: JSON.stringify(caller),
      },
    });
  };

  const screens: ScreenComponent[] = useMemo(
    () => [
      {
        name: "samsung",
        component: SamsungCallScreen,
        defaultProps: {
          backgroundColors: ["#1a1a2e", "#4a275a", "#20b2aa"] as const,
          textColor: "white",
          acceptFillColor: "green",
          acceptStrokeColor: "green",
          rejectFillColor: "red",
          rejectStrokeColor: "red",
        },
      },
    ],
    []
  );

  const currentScreen = useMemo(() => {
    if (!currentPreviewedCall?.screenType) return null;
    return screens.find(
      (screen) => screen.name === currentPreviewedCall?.screenType
    );
  }, [currentPreviewedCall?.screenType, screens]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push notification permissions!");
        return;
      }
      requestPermissions();
    };

    return () => {};
  }, []);

  return (
    <View className="flex-1 bg-background text-foreground">
      <SettingsScreen
        previewHandler={previewScheduledCall}
        closeHandler={() => setIsPreviewMode(false)}
      />
    </View>
  );
}
