import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { type ScheduledCall } from "~/lib/types/types";

const BACKGROUND_FETCH_TASK = "background-fetch";

// Configure notification handler for background notifications
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
    
    // Get scheduled calls from storage
    const callsJson = await AsyncStorage.getItem("scheduledCalls");
    const calls: ScheduledCall[] = callsJson ? JSON.parse(callsJson) : [];
    
    const now = new Date();
    const dueCalls = calls.filter(call => {
      if (!call.isActive) return false;
      const scheduledTime = new Date(call.scheduledDate);
      // Check if call is due within the last 5 minutes (to catch missed calls)
      return scheduledTime <= now && scheduledTime > new Date(now.getTime() - 5 * 60 * 1000);
    });

    if (dueCalls.length > 0) {
      console.log(`Found ${dueCalls.length} due calls`);
      
      // Schedule immediate notification for the first due call
      const dueCall = dueCalls[0];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Incoming Call: ${dueCall.name}`,
          body: `Call from ${dueCall.number} at ${new Date(dueCall.scheduledDate).toLocaleTimeString()}`,
          data: { 
            type: "scheduled_call",
            callId: dueCall.id,
            callData: JSON.stringify(dueCall)
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          autoDismiss: false,
        },
        trigger: null, // Show immediately
      });

      // Mark this call as processed to avoid duplicate notifications
      const updatedCalls = calls.map(call => 
        call.id === dueCall.id 
          ? { ...call, lastProcessed: now.toISOString() }
          : call
      );
      await AsyncStorage.setItem("scheduledCalls", JSON.stringify(updatedCalls));
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
          minimumInterval: 15 * 60, // 15 minutes minimum (iOS limitation)
          stopOnTerminate: false, // Continue after app is terminated
          startOnBoot: true, // Start on device boot
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