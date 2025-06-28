import { LinearGradient } from "expo-linear-gradient";
import { Phone, PhoneOff, User } from "lucide-react-native";
import { useContext } from "react";
import { Text, View } from "react-native";
import { InfoContext } from "~/app/index";

type Props = {
  backgroundCSS: string;
};

export const SamsungCallScreen = (props: Props) => {
  const callerInformation = useContext(InfoContext);
  return (
    <LinearGradient
      colors={["#1a1a2e", "#4a275a", "#20b2aa"]}
      className="flex-1"
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 rounded-full bg-secondary/20 justify-center items-center mb-6">
          <User size={48} className="text-foreground" />
        </View>
        <Text className="text-2xl font-semibold text-foreground mb-2">
          {callerInformation.callerName}
        </Text>
        <Text className="text-lg text-muted-foreground">
          {callerInformation.callerNumber}
        </Text>
      </View>

      <View className="mb-20 h-fit mx-12">
        <View className="flex flex-row justify-between w-full">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
              <Phone size={32} className="text-white" />
            </View>
          </View>
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-red-500 justify-center items-center mb-2">
              <PhoneOff size={32} className="text-white" />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
