import { useEffect, useMemo, useState } from "react";

import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { View } from "react-native";
import { AppleCallScreen } from "~/components/AppleCallScreen";
import { SamsungCallScreen } from "~/components/SamsungCallScreen";
import SettingsScreen from "~/components/Settings";
import { NotificationService } from "~/lib/services/notificationService";
import { type ScheduledCall, type ScreenComponent } from "~/lib/types/types";

export default function Screen() {
  const [currentPreviewedCall, setCurrentPreviewedCall] =
    useState<ScheduledCall | null>(null);

  const [notificationCall, setNotificationCall] =
    useState<ScheduledCall | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);

  const previewScheduledCall = (caller: ScheduledCall) => {
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
      {
        name: "apple",
        component: AppleCallScreen,
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

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const callData = response.notification.request.content.data
          ?.callData as ScheduledCall;
        if (callData) {
          setNotificationCall(callData);
          setShowNotification(true);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const callData = notification.request.content.data
          ?.callData as ScheduledCall;
        if (callData) {
          setNotificationCall(callData);
          setShowNotification(true);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const checkDueCalls = () => {
      const now = new Date();
      const dueCalls = scheduledCalls.filter((call) => {
        if (!call.isActive) return false;
        const scheduledTime = new Date(call.scheduledDate);
        return (
          scheduledTime <= now &&
          scheduledTime > new Date(now.getTime() - 60000)
        );
      });

      if (dueCalls.length > 0) {
        const firstDueCall = dueCalls[0];
        setNotificationCall(firstDueCall);
        setShowNotification(true);
      }
    };

    checkDueCalls();

    const interval = setInterval(checkDueCalls, 30000);

    return () => clearInterval(interval);
  }, [scheduledCalls]);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await NotificationService.requestPermissions();
      } catch (error) {
        console.error("Failed to get notification permissions:", error);
      }
    };

    requestPermissions();
  }, []);

  const handleNotificationAccept = () => {
    console.log("Call accepted:", notificationCall);
  };

  const handleNotificationReject = () => {
    console.log("Call rejected:", notificationCall);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setNotificationCall(null);
  };

  return (
    <View className="flex-1 bg-background text-foreground">
      <SettingsScreen
        previewHandler={previewScheduledCall}
        closeHandler={() => {}}
        scheduledCalls={scheduledCalls}
        setScheduledCalls={setScheduledCalls}
      />
    </View>
  );
}
