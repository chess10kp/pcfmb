import * as Notifications from "expo-notifications";
import { type ScheduledCall } from "../types/types";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      throw new Error("Failed to get push notification permissions!");
    }
    
    return finalStatus;
  }

  static async scheduleCallNotification(call: ScheduledCall) {
    try {
      await this.requestPermissions();
      
      // Cancel any existing notification for this call
      await this.cancelCallNotification(call.id);
      
      // Calculate when the notification should trigger
      const now = new Date();
      const scheduledTime = new Date(call.scheduledDate);
      
      // If the scheduled time has already passed, don't schedule
      if (scheduledTime <= now) {
        return null;
      }
      
      const trigger = scheduledTime;
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Incoming Call: ${call.name}`,
          body: `Call from ${call.number} at ${scheduledTime.toLocaleTimeString()}`,
          data: { callId: call.id, callData: call },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });
      
      return notificationId;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  }

  static async cancelCallNotification(callId: string) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notificationToCancel = scheduledNotifications.find(
        notification => notification.content.data?.callId === callId
      );
      
      if (notificationToCancel) {
        await Notifications.cancelScheduledNotificationAsync(notificationToCancel.identifier);
      }
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  }

  static async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }
}