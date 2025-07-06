import AsyncStorage from "@react-native-async-storage/async-storage";
import { type ScheduledCall } from "~/lib/types/types";

export class StorageService {
  static readonly SCHEDULED_CALLS_KEY = "scheduledCalls";
  static readonly NOTIFICATION_SETTINGS_KEY = "notificationSettings";

  static async saveScheduledCalls(calls: ScheduledCall[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SCHEDULED_CALLS_KEY, JSON.stringify(calls));
    } catch (error) {
      console.error("Failed to save scheduled calls:", error);
      throw error;
    }
  }

  static async getScheduledCalls(): Promise<ScheduledCall[]> {
    try {
      const callsJson = await AsyncStorage.getItem(this.SCHEDULED_CALLS_KEY);
      return callsJson ? JSON.parse(callsJson) : [];
    } catch (error) {
      console.error("Failed to get scheduled calls:", error);
      return [];
    }
  }

  static async addScheduledCall(call: ScheduledCall): Promise<void> {
    try {
      const calls = await this.getScheduledCalls();
      calls.push(call);
      await this.saveScheduledCalls(calls);
    } catch (error) {
      console.error("Failed to add scheduled call:", error);
      throw error;
    }
  }

  static async updateScheduledCall(updatedCall: ScheduledCall): Promise<void> {
    try {
      const calls = await this.getScheduledCalls();
      const index = calls.findIndex(call => call.id === updatedCall.id);
      if (index !== -1) {
        calls[index] = updatedCall;
        await this.saveScheduledCalls(calls);
      }
    } catch (error) {
      console.error("Failed to update scheduled call:", error);
      throw error;
    }
  }

  static async deleteScheduledCall(callId: string): Promise<void> {
    try {
      const calls = await this.getScheduledCalls();
      const filteredCalls = calls.filter(call => call.id !== callId);
      await this.saveScheduledCalls(filteredCalls);
    } catch (error) {
      console.error("Failed to delete scheduled call:", error);
      throw error;
    }
  }

  static async clearAllScheduledCalls(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SCHEDULED_CALLS_KEY);
    } catch (error) {
      console.error("Failed to clear scheduled calls:", error);
      throw error;
    }
  }
}