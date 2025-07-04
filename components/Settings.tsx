import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Clock, Phone, Settings, User } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Switch, Text, TextInput, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

interface ScheduledCall {
  id: string;
  name: string;
  number: string;
  location: string;
  image: string;
  scheduledDate: Date;
  screenType: "samsung" | "iphone" | "pixel";
  isActive: boolean;
  repeatDays: string[];
}

export default function SettingsScreen() {
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingCall, setEditingCall] = useState<ScheduledCall | null>(null);

  // Form state for new/edit call
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    location: "",
    image: "",
    scheduledDate: new Date(),
    screenType: "samsung" as const,
    repeatDays: [] as string[],
  });

  const screenTypes = [
    { id: "samsung", name: "Samsung", icon: "📱" },
    { id: "iphone", name: "iPhone", icon: "🍎" },
    { id: "pixel", name: "Pixel", icon: "📱" },
  ];

  const daysOfWeek = [
    { id: "monday", name: "Mon" },
    { id: "tuesday", name: "Tue" },
    { id: "wednesday", name: "Wed" },
    { id: "thursday", name: "Thu" },
    { id: "friday", name: "Fri" },
    { id: "saturday", name: "Sat" },
    { id: "sunday", name: "Sun" },
  ];

  const handleSaveCall = () => {
    if (editingCall) {
      setScheduledCalls((prev) =>
        prev.map((call) =>
          call.id === editingCall.id
            ? { ...formData, id: call.id, isActive: call.isActive }
            : call
        )
      );
    } else {
      const newCall: ScheduledCall = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      };
      setScheduledCalls((prev) => [...prev, newCall]);
    }

    // Reset form
    setFormData({
      name: "",
      number: "",
      location: "",
      image: "",
      scheduledDate: new Date(),
      screenType: "samsung",
      repeatDays: [],
    });
    setEditingCall(null);
  };

  const handleEditCall = (call: ScheduledCall) => {
    setEditingCall(call);
    setFormData({
      name: call.name,
      number: call.number,
      location: call.location,
      image: call.image,
      scheduledDate: call.scheduledDate,
      screenType: call.screenType,
      repeatDays: call.repeatDays,
    });
  };

  const handleDeleteCall = (id: string) => {
    setScheduledCalls((prev) => prev.filter((call) => call.id !== id));
  };

  const toggleCallActive = (id: string) => {
    setScheduledCalls((prev) =>
      prev.map((call) =>
        call.id === id ? { ...call, isActive: !call.isActive } : call
      )
    );
  };

  const toggleRepeatDay = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      repeatDays: prev.repeatDays.includes(dayId)
        ? prev.repeatDays.filter((d) => d !== dayId)
        : [...prev.repeatDays, dayId],
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-foreground mb-2">
          Settings
        </Text>
        <Text className="text-muted-foreground">
          Configure your scheduled phone calls
        </Text>
      </View>

      {/* Add/Edit Call Form */}
      <Collapsible>
        <CollapsibleTrigger className="flex flex-row items-center gap-2">
          <View className="flex flex-row items-center gap-2">
            <Phone size={20} className="text-muted-foreground" />
            <Text className="text-muted-foreground">
              {editingCall ? "Edit Call" : "Add New Call"}
            </Text>
          </View>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Caller Information */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-2">
              <User size={16} />
              <Text className="text-sm font-medium">Caller Information</Text>
            </View>

            <TextInput
              placeholder="Caller Name"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              className="border border-border rounded-lg p-3 bg-card text-foreground"
            />

            <TextInput
              placeholder="Phone Number"
              value={formData.number}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, number: text }))
              }
              className="border border-border rounded-lg p-3 bg-card text-foreground"
              keyboardType="phone-pad"
            />

            <TextInput
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              className="border border-border rounded-lg p-3 bg-card text-foreground"
            />

            <TextInput
              placeholder="Image URL (optional)"
              value={formData.image}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, image: text }))
              }
              className="border border-border rounded-lg p-3 bg-card text-foreground"
            />
          </View>

          {/* Screen Type Selection */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-2">
              <Settings size={16} />
              <Text className="text-sm font-medium">Screen Type</Text>
            </View>

            <View className="flex-row gap-2">
              {screenTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    formData.screenType === type.id ? "default" : "outline"
                  }
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      screenType: type.id as any,
                    }))
                  }
                  className="flex-1"
                >
                  <Text className="text-lg mr-1">{type.icon}</Text>
                  <Text>{type.name}</Text>
                </Button>
              ))}
            </View>
          </View>

          {/* Schedule Settings */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} />
              <Text className="text-sm font-medium">Schedule</Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                variant="outline"
                onPress={() => setShowDatePicker(true)}
                className="flex-1"
              >
                <Calendar size={16} className="mr-2" />
                <Text>{formatDate(formData.scheduledDate)}</Text>
              </Button>

              <Button
                variant="outline"
                onPress={() => setShowTimePicker(true)}
                className="flex-1"
              >
                <Clock size={16} className="mr-2" />
                <Text>{formatTime(formData.scheduledDate)}</Text>
              </Button>
            </View>

            {/* Repeat Days */}
            <View className="space-y-2">
              <Text className="text-sm font-medium">Repeat on:</Text>
              <View className="flex-row flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.id}
                    variant={
                      formData.repeatDays.includes(day.id)
                        ? "default"
                        : "outline"
                    }
                    onPress={() => toggleRepeatDay(day.id)}
                    className="px-3 py-1"
                  >
                    <Text className="text-xs">{day.name}</Text>
                  </Button>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 pt-4">
            <Button
              onPress={handleSaveCall}
              className="flex-1"
              disabled={!formData.name || !formData.number}
            >
              <Text>{editingCall ? "Update Call" : "Add Call"}</Text>
            </Button>

            {editingCall && (
              <Button
                variant="outline"
                onPress={() => {
                  setEditingCall(null);
                  setFormData({
                    name: "",
                    number: "",
                    location: "",
                    image: "",
                    scheduledDate: new Date(),
                    screenType: "samsung",
                    repeatDays: [],
                  });
                }}
              >
                <Text>Cancel</Text>
              </Button>
            )}
          </View>
        </CollapsibleContent>
      </Collapsible>
      <Card className="mb-6">
        <CardContent className="space-y-4"></CardContent>
      </Card>

      {/* Scheduled Calls List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Calls ({scheduledCalls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledCalls.length === 0 ? (
            <View className="py-8 items-center">
              <Phone size={48} className="text-muted-foreground mb-2" />
              <Text className="text-muted-foreground text-center">
                No scheduled calls yet.{"\n"}Add your first call above.
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {scheduledCalls.map((call) => (
                <View
                  key={call.id}
                  className="border border-border rounded-lg p-4 bg-card"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">
                        {call.name}
                      </Text>
                      <Text className="text-muted-foreground">
                        {call.number}
                      </Text>
                      {call.location && (
                        <Text className="text-muted-foreground text-sm">
                          📍 {call.location}
                        </Text>
                      )}
                    </View>

                    <Switch
                      value={call.isActive}
                      onValueChange={() => toggleCallActive(call.id)}
                    />
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-4">
                      <Text className="text-sm text-muted-foreground">
                        📅 {formatDate(call.scheduledDate)}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        🕐 {formatTime(call.scheduledDate)}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {
                          screenTypes.find((t) => t.id === call.screenType)
                            ?.icon
                        }{" "}
                        {call.screenType}
                      </Text>
                    </View>

                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleEditCall(call)}
                      >
                        <Text className="text-xs">Edit</Text>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleDeleteCall(call.id)}
                      >
                        <Text className="text-xs text-destructive">Delete</Text>
                      </Button>
                    </View>
                  </View>

                  {call.repeatDays.length > 0 && (
                    <View className="mt-2">
                      <Text className="text-xs text-muted-foreground">
                        🔄 Repeats:{" "}
                        {call.repeatDays
                          .map(
                            (day) => daysOfWeek.find((d) => d.id === day)?.name
                          )
                          .join(", ")}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.scheduledDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setFormData((prev) => ({ ...prev, scheduledDate: date }));
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.scheduledDate}
          mode="time"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              setFormData((prev) => ({ ...prev, scheduledDate: date }));
            }
          }}
        />
      )}
    </ScrollView>
  );
}
