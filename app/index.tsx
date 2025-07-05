import { useMemo, useState } from "react";
import { View } from "react-native";

import { SamsungCallScreen } from "~/components/SamsungCallScreen";
import SettingsScreen from "~/components/Settings";
import { type ScheduledCall } from "~/lib/types/types";

export default function Screen() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPreviewedCall, setCurrentPreviewedCall] =
    useState<ScheduledCall | null>(null);

  const previewScheduledCall = (caller: ScheduledCall) => {
    setIsPreviewMode(true);
    setCurrentPreviewedCall(caller);
    console.log(caller);
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

  return (
    <View className="flex-1 bg-background text-foreground">
      {isPreviewMode ? (
        <currentScreen.component
          {...currentScreen.defaultProps}
          formData={currentPreviewedCall}
          onClose={() => setIsPreviewMode(false)}
        />
      ) : (
        <SettingsScreen
          previewHandler={previewScheduledCall}
          closeHandler={() => setIsPreviewMode(false)}
        />
      )}
    </View>
  );
}
