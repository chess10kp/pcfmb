import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";
import { SamsungCallScreen } from "~/components/SamsungCallScreen";
import { ScheduledCall, ScreenComponent } from "~/lib/types/types";

export default function ScreenPreview() {
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

  let { formData, currentPreviewedCall } = useLocalSearchParams<{
    formData: string;
    currentPreviewedCall: string;
  }>();

  const formDataParsed = JSON.parse(formData as string) as ScheduledCall;
  const currentPreviewedCallParsed = JSON.parse(
    currentPreviewedCall as string
  ) as ScheduledCall;

  const currentScreen = useMemo(() => {
    if (!currentPreviewedCallParsed?.screenType) return null;
    return screens.find(
      (screen) => screen.name === currentPreviewedCallParsed?.screenType
    );
  }, [currentPreviewedCallParsed?.screenType, screens]);

  return (
    <View className="flex-1 bg-background text-foreground">
      {currentScreen && (
        <currentScreen.component
          {...currentScreen.defaultProps}
          formData={formDataParsed}
          onClose={() => router.back()}
        />
      )}
    </View>
  );
}
