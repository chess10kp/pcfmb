import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, TextInput, View } from "react-native";
import { Collapsible } from "~/components/animated/collapsible";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Clock } from "~/lib/icons/Clock";
import { Plus } from "~/lib/icons/Plus";
import { ScheduledCall, ScreenComponent } from "~/lib/types/types";
import { formatDate, formatTime } from "~/lib/utils";
import { AppleCallScreen } from "./AppleCallScreen";
import { SamsungCallScreen } from "./SamsungCallScreen";

type Props = {};

export default function PresetLaunch(props: Props) {
  const [formData, setFormData] = useState<ScheduledCall>({
    id: "",
    name: "",
    number: "",
    location: "",
    image: "",
    scheduledDate: new Date(),
    screenType: "samsung",
    repeatDays: [],
    isActive: true,
  });

  const [screenTypes, setScreenTypes] = useState<ScreenComponent[]>([
    {
      id: "samsung",
      name: "samsung",
      component: SamsungCallScreen,
      iconComponent: (color?: string) => (
        <AntDesign name="android" size={16} color={color || "currentColor"} />
      ),
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
      id: "iphone",
      name: "iphone",
      component: AppleCallScreen,
      iconComponent: (color?: string) => (
        <AntDesign name="apple1" size={16} color={color || "currentColor"} />
      ),
      defaultProps: {
        backgroundColors: ["#1a1a2e", "#4a275a", "#20b2aa"] as const,
        textColor: "white",
      },
    },
  ]);

  useEffect(() => {
    AsyncStorage.getItem("scheduledCalls").then((calls) => {
      if (!calls) return;
      const callsParsed = JSON.parse(calls) as ScheduledCall[];
      const dueCalls = callsParsed.filter((call) => {
        const now = new Date();
        const scheduledTime = new Date(call.scheduledDate);
        return (
          scheduledTime <= now &&
          scheduledTime > new Date(now.getTime() - 5 * 60 * 1000)
        );
      });
      if (dueCalls.length > 0) {
        const dueCall = dueCalls[0];
        console.log(dueCall);
      }
    });
  }, []);

  const validateFormData = (formData: ScheduledCall) => {
    if (!formData.name) {
      Alert.alert("Error", "Caller name is required");
      return false;
    }
    if (!formData.number) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!formData.scheduledDate) {
      Alert.alert("Error", "Scheduled date is required");
      return false;
    }
    if (!formData.screenType) {
      Alert.alert("Error", "Screen type is required");
      return false;
    }
    return true;
  };

  const handleSaveCall = () => {
    if (validateFormData(formData)) {
      const newCall: ScheduledCall = {
        ...formData,
      };
      AsyncStorage.setItem("scheduledCalls", JSON.stringify([newCall]));
      Alert.alert("Success", "Call saved successfully");
      setFormData({});
    }
  };

  return (
    <View className="flex-1 w-full">
      <View className="flex-1 w-full black">
        <Collapsible
          title="Add New Preset"
          triggerOpen={Plus}
          triggerClose={Plus}
        >
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
                setFormData((prev: ScheduledCall) => ({ ...prev, name: text }))
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
                  key={type.name}
                  variant={
                    formData.screenType === type.name ? "default" : "outline"
                  }
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      screenType: type.name as any,
                    }))
                  }
                >
                  <View className="flex-row items-center gap-2">
                    <Text>{type.name}</Text>
                    {type.iconComponent(
                      formData.screenType === type.name ? "black" : "white"
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
              <Text>Save Call</Text>
            </Button>
          </View>
        </Collapsible>
      </View>
    </View>
  );
}
