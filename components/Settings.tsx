import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Switch, TextInput, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Collapsible } from "~/components/animated/collapsible";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Calendar } from "~/lib/icons/Calendar";
import { Clock } from "~/lib/icons/Clock";
import { Pencil } from "~/lib/icons/Pencil";
import { Phone } from "~/lib/icons/Phone";
import { Plus } from "~/lib/icons/Plus";
import { Trash } from "~/lib/icons/Trash";
import { User } from "~/lib/icons/User";
import { View as ViewIcon } from "~/lib/icons/View";
import { type ScheduledCall } from "~/lib/types/types";

type Props = {
  previewHandler: (call: ScheduledCall) => void;
  closeHandler: () => void;
};

export default function SettingsScreen({
  previewHandler,
  closeHandler,
}: Props) {
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingCall, setEditingCall] = useState<ScheduledCall | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    name: "Boss",
    number: "1234567890",
    location: "Dearborn, MI",
    image: "https://via.placeholder.com/150",
    scheduledDate: new Date(),
    screenType: "samsung" as const,
    repeatDays: [] as string[],
  });

  const screenTypes = [
    {
      id: "samsung",
      name: "Samsung",
      iconComponent: (color?: string) => (
        <AntDesign name="android" size={16} color={color || "currentColor"} />
      ),
    },
    {
      id: "iphone",
      name: "iPhone",
      iconComponent: (color?: string) => (
        <AntDesign name="apple1" size={16} color={color || "currentColor"} />
      ),
    },
    {
      id: "pixel",
      name: "Pixel",
      iconComponent: (color?: string) => (
        <AntDesign name="google" size={16} color={color || "currentColor"} />
      ),
    },
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
    setShowDatePicker(false);
    setShowTimePicker(false);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollView className="flex-1 bg-background text-foreground p-4">
      <View>
        <Text className="text-3xl font-bold text-foreground ">Settings</Text>
      </View>

      {/* Add/Edit Call Form */}
      <Collapsible title="Add New Call" triggerOpen={Plus} triggerClose={Plus}>
        {/* Caller Information */}
        <View className="gap-4 pb-4">
          <View className="flex-row items-center gap-2">
            <User color="white" size={16} />
            <Text className="text-sm font-medium">Caller Information</Text>
          </View>

          <TextInput
            placeholder="Caller Name"
            placeholderClassName="text-foreground"
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
        </View>

        {/* Screen Type Selection */}
        <View className="gap-4 py-4">
          <View className="flex-row items-center gap-2">
            <User className="text-foreground" size={16} />
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
              >
                <View className="flex-row items-center gap-2">
                  <Text>{type.name}</Text>
                  {type.iconComponent(
                    formData.screenType === type.id ? "black" : "white"
                  )}
                </View>
              </Button>
            ))}
          </View>
        </View>

        {/* Schedule Settings */}
        <View className="gap-4 py-4">
          <View className="flex-row items-center gap-2">
            <User className="text-foreground" size={16} />
            <Text className="text-sm font-medium"> Schedule</Text>
          </View>

          <View className="flex-row gap-2">
            <Button onPress={() => setShowDatePicker(true)} variant="outline">
              <Calendar size={16} className="mr-2 text-foreground" />
              <Text>{formatDate(formData.scheduledDate)}</Text>
            </Button>

            <Button
              variant="outline"
              onPress={() => setShowTimePicker(true)}
              className="flex-1"
            >
              <Clock size={16} className="mr-2 text-foreground" />
              <Text>{formatTime(formData.scheduledDate)}</Text>
            </Button>
          </View>
        </View>

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

        {/* Action Buttons */}
        <View className="flex-row gap-2 pt-4">
          <Button
            onPress={handleSaveCall}
            variant="default"
            size="lg"
            className="flex-1 bg-foreground text-background"
            disabled={
              !formData.name || !formData.number || !formData.scheduledDate
            }
          >
            <Text>{editingCall ? "Update Call" : "Add Call"}</Text>
          </Button>

          {editingCall && (
            <Button
              variant="default"
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
              Cancel
            </Button>
          )}
        </View>
      </Collapsible>

      {/* Scheduled Calls List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Calls ({scheduledCalls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledCalls.length === 0 ? (
            <View className="py-8 items-center">
              <Phone size={48} className="text-muted-foreground mb-2" />
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
                          {call.location}
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
                        {formatDate(call.scheduledDate)}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {formatTime(call.scheduledDate)}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {screenTypes
                          .find((t) => t.id === call.screenType)
                          ?.iconComponent(undefined)}
                      </Text>
                    </View>

                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleEditCall(call)}
                      >
                        <Pencil className="text-primary" size={16} />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => {
                          previewHandler({
                            id: call.id,
                            name: call.name,
                            number: call.number,
                            location: call.location,
                            image: call.image,
                            scheduledDate: call.scheduledDate,
                            screenType: call.screenType as
                              | "samsung"
                              | "iphone"
                              | "pixel",
                            isActive: call.isActive,
                            repeatDays: call.repeatDays,
                          });
                        }}
                      >
                        <ViewIcon className="text-foreground" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleDeleteCall(call.id)}
                      >
                        <Trash className="text-destructive" size={16} />
                      </Button>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
