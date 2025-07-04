import { LinearGradient } from "expo-linear-gradient";
import {
  Bluetooth,
  Grip,
  MicOff,
  Phone,
  PhoneOff,
  Plus,
  Video,
  Volume2,
} from "lucide-react-native";
import { useContext, useRef, useState } from "react";
import { Animated, ColorValue, Pressable, Text, View } from "react-native";
import { InfoContext } from "~/app/index";
import { cn } from "~/lib/utils";

type Props = {
  backgroundColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  textColor?: string;
  rejectFillColor?: string;
  rejectStrokeColor?: string;
  acceptFillColor?: string;
  acceptStrokeColor?: string;
};

export const SamsungCallScreen = (props: Props) => {
  const callerInformation = useContext(InfoContext);

  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const handleCallAccept = () => {
    setIsCallAccepted(true);
  };

  const handleCallReject = () => {
    setIsCallEnded(true);
  };

  const acceptScale = useRef(new Animated.Value(1)).current;
  const rejectScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, toValue: number) => {
    scale.stopAnimation();

    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <LinearGradient
      colors={
        props.backgroundColors || (["#1a1a2e", "#4a275a", "#20b2aa"] as const)
      }
      className={cn("flex-1", props.textColor && `text-${props.textColor}`)}
    >
      {!isCallAccepted && !isCallEnded && (
        <View className="w-full h-full">
          <View className="flex-1 mt-16 justify-start items-center px-6">
            <Text
              className={cn(
                "text-5xl font-semibold text-foreground mb-2",
                props.textColor && `text-${props.textColor}`
              )}
            >
              {callerInformation.callerName || callerInformation.callerNumber}
            </Text>
            <Text
              className={cn(
                "text-xl text-muted-foreground",
                props.textColor && `text-${props.textColor}`
              )}
            >
              {callerInformation.callerLocation}
            </Text>
          </View>

          {/* Incoming Call Buttons */}
          <View className="mb-20 h-fit mx-12">
            <View className="flex flex-row justify-between w-full">
              <Pressable
                onPress={handleCallAccept}
                onPressIn={() => animateButton(acceptScale, 1.1)}
                onPressOut={() => animateButton(acceptScale, 1)}
                onHoverIn={() => animateButton(acceptScale, 1.2)}
                onHoverOut={() => animateButton(acceptScale, 1)}
              >
                <Animated.View
                  style={{ transform: [{ scale: acceptScale }] }}
                  className="items-center"
                >
                  <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
                    <Phone
                      size={32}
                      color={props.acceptStrokeColor || "green"}
                      fill={props.acceptFillColor || "green"}
                      strokeWidth={2}
                    />
                  </View>
                </Animated.View>
              </Pressable>
              <Pressable
                onPress={handleCallReject}
                onPressIn={() => animateButton(rejectScale, 1.1)}
                onPressOut={() => animateButton(rejectScale, 1)}
                onHoverIn={() => animateButton(rejectScale, 1.2)}
                onHoverOut={() => animateButton(rejectScale, 1)}
              >
                <Animated.View
                  style={{ transform: [{ scale: rejectScale }] }}
                  className="items-center"
                >
                  <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
                    <PhoneOff
                      size={32}
                      color={props.rejectStrokeColor || "red"}
                      fill={props.rejectFillColor || "red"}
                      strokeWidth={2}
                    />
                  </View>
                </Animated.View>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      {isCallAccepted && (
        <View className="flex-1 w-full">
          <View className="flex-1 mt-16 justify-start items-center px-6">
            <Text
              className={cn(
                "text-5xl font-semibold text-foreground mb-2",
                props.textColor && `text-${props.textColor}`
              )}
            >
              {callerInformation.callerName || callerInformation.callerNumber}
            </Text>
          </View>

          {/* Bento with active call actions 9x9 grid */}
          <View className="mb-20 px-12 ">
            <View className="rounded-lg bg-black/30 p-4">
              {/* Row 1 */}
              <View className="flex-row justify-center gap-4 mb-4">
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <Plus size={24} color="white" />
                  <Text className="text-white text-sm">Add Call</Text>
                </View>
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <Video size={24} color="white" />
                  <Text className="text-white text-sm">Video</Text>
                </View>
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <Bluetooth size={24} color="white" />
                  <Text className="text-white text-sm">Bluetooth</Text>
                </View>
              </View>
              {/* Row 2 */}
              <View className="flex-row justify-center gap-4 mb-4">
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <Volume2 size={24} color="white" />
                  <Text className="text-white text-sm">Speaker</Text>
                </View>
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <MicOff size={24} color="white" />
                  <Text className="text-white text-sm">Mute</Text>
                </View>
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <Grip size={24} color="white" />
                  <Text className="text-white text-sm">Keypad</Text>
                </View>
              </View>
              {/* Row 3 */}
              <View className="flex-row justify-center gap-4">
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                  <View className="bg-red-500 rounded-full p-4">
                    <Phone
                      size={32}
                      color={"white"}
                      strokeWidth={0}
                      fill={"white"}
                      style={{ transform: [{ rotate: "135deg" }] }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};
