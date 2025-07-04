import { createContext, useActionState, useState } from "react";
import { View } from "react-native";

import { SamsungCallScreen } from "~/components/SamsungCallScreen";
import SettingsScreen from "~/components/Settings";

export const InfoContext = createContext({
  callerName: "",
  callerLocation: "",
  callerNumber: "",
  callerImage: "",
  callerStatus: "",
  callerTime: "",
  callerDate: "",
  callerDuration: "",
});

export default function Screen() {
  const [callerName, setCallerName] = useState<string>("John Doe");
  const [callerNumber, setCallerNumber] = useState<string>("+1234567890");
  const [callerLocation, setCallerLocation] = useState<string>("Texas");
  const [callerImage, setCallerImage] = useState<string>(
    "https://via.placeholder.com/150",
  );
  const [callerStatus, setCallerStatus] = useState("Incoming");
  const [callerTime, setCallerTime] = useState("12:00");
  const [callerDate, setCallerDate] = useState("2021-01-01");
  const [callerDuration, setCallerDuration] = useState("1:00");

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <InfoContext.Provider
      value={{
        callerName,
        callerNumber,
        callerImage,
        callerLocation,
        callerStatus,
        callerTime,
        callerDate,
        callerDuration,
      }}
    >
      <View className="flex-1">
        {isPreviewMode ? (
          <SamsungCallScreen
            backgroundColors={["#1a1a2e", "#4a275a", "#20b2aa"]}
            textColor="white"
            acceptFillColor="green"
            acceptStrokeColor="green"
            rejectFillColor="red"
            rejectStrokeColor="red"
          />
        ) : (
          <SettingsScreen />
        )}
      </View>
    </InfoContext.Provider>
  );
}
