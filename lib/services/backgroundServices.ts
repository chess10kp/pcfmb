import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { type ScheduledCall } from "~/lib/types/types";

const BACKGROUND_FETCH_TASK = "background-fetch";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Background fetch task running...");

    const callsJson = await AsyncStorage.getItem("scheduledCalls");
    const calls: ScheduledCall[] = callsJson ? JSON.parse(callsJson) : [];

    const now = new Date();
    const dueCalls = calls.filter((call) => {
      if (!call.isActive) return false;
      const scheduledTime = new Date(call.scheduledDate);
      return (
        scheduledTime <= now &&
        scheduledTime > new Date(now.getTime() - 5 * 60 * 1000)
      );
    });

    if (dueCalls.length > 0) {
      console.log(`Found ${dueCalls.length} due calls`);

      const dueCall = dueCalls[0];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Incoming Call: ${dueCall.name}`,
          body: `Call from ${dueCall.number} at ${new Date(
            dueCall.scheduledDate
          ).toLocaleTimeString()}`,
          data: {
            type: "scheduled_call",
            callId: dueCall.id,
            callData: JSON.stringify(dueCall),
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          autoDismiss: false,
        },
        trigger: null,
      });

      const updatedCalls = calls.filter((call) => call.id !== dueCall.id);
      await AsyncStorage.setItem(
        "scheduledCalls",
        JSON.stringify(updatedCalls)
      );
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background fetch failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export class BackgroundService {
  static async registerBackgroundFetch() {
    try {
      const status = await BackgroundFetch.getStatusAsync();
      console.log("Background fetch status:", status);

      if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60,
          stopOnTerminate: true,
          startOnBoot: true,
        });
        console.log("Background fetch registered successfully");
      } else {
        console.log("Background fetch not available");
      }
    } catch (error) {
      console.error("Background fetch registration failed:", error);
    }
  }

  static async unregisterBackgroundFetch() {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log("Background fetch unregistered successfully");
    } catch (error) {
      console.error("Background fetch unregistration failed:", error);
    }
  }

  static async getBackgroundFetchStatus() {
    try {
      return await BackgroundFetch.getStatusAsync();
    } catch (error) {
      console.error("Failed to get background fetch status:", error);
      return null;
    }
  }

  static async saveScheduledCalls(calls: ScheduledCall[]) {
    try {
      await AsyncStorage.setItem("scheduledCalls", JSON.stringify(calls));
      console.log("Scheduled calls saved to storage");
    } catch (error) {
      console.error("Failed to save scheduled calls:", error);
    }
  }

  static async getScheduledCalls(): Promise<ScheduledCall[]> {
    try {
      const callsJson = await AsyncStorage.getItem("scheduledCalls");
      return callsJson ? JSON.parse(callsJson) : [];
    } catch (error) {
      console.error("Failed to get scheduled calls:", error);
      return [];
    }
  }
}
