import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ColorValue,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bluetooth } from "~/lib/icons/Bluetooth";
import { EllipsisVertical } from "~/lib/icons/EllipsisVertical";
import { Grip } from "~/lib/icons/Grip";
import { MicOff } from "~/lib/icons/MicOff";
import { Phone } from "~/lib/icons/Phone";
import { PhoneOff } from "~/lib/icons/PhoneOff";
import { Plus } from "~/lib/icons/Plus";
import { Video } from "~/lib/icons/Video";
import { Volume2 } from "~/lib/icons/Volume2";
import { type ScheduledCall } from "~/lib/types/types";
import { cn } from "~/lib/utils";

type Props = {
  backgroundColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  textColor?: string;
  rejectFillColor?: string;
  rejectStrokeColor?: string;
  acceptFillColor?: string;
  acceptStrokeColor?: string;
  formData: ScheduledCall | null;
  onClose: () => void;
};

export const SamsungCallScreen = (props: Props) => {
  const callerInformation = props.formData;

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
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const endCall = () => {
    router.back();
  };

  const animateButton = (scale: Animated.Value, toValue: number) => {
    scale.stopAnimation();

    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const callActions = useMemo(
    () => [
      [
        {
          icon: Plus,
          label: "Add Call",
          enabled: false,
          onPress: () => {},
        },
        {
          icon: Video,
          label: "Video",
          enabled: false,
          onPress: () => {},
        },
        {
          icon: Bluetooth,
          label: "Bluetooth",
          enabled: true,
          onPress: () => {},
        },
      ],
      [
        {
          icon: Volume2,
          label: "Speaker",
          enabled: true,
          onPress: () => {},
        },
        {
          icon: MicOff,
          label: "Mute",
          enabled: isMuted,
          onPress: () => toggleMute(),
        },
        {
          icon: Grip,
          label: "Keypad",
          enabled: true,
          onPress: () => {},
        },
      ],
    ],
    [isMuted]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
              {callerInformation?.name || callerInformation?.number}
            </Text>
            <Text
              className={cn(
                "text-xl text-muted-foreground",
                props.textColor && `text-${props.textColor}`
              )}
            >
              {callerInformation?.location}
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
          <View className="flex-1 mt-8 gap-16 justify-start items-center px-6">
            <View className="flex-row items-center mx-8 justify-between w-full">
              <View className="flex-1"></View>
              <View className="flex-row items-center gap-2 justify-center w-full">
                <Phone size={16} color="white" fill="white" />
                <Text className="text-white text-center text-xl">
                  {formatTime(callDuration)}
                </Text>
              </View>
              <View>
                <EllipsisVertical size={16} color="white" fill="white" />
              </View>
            </View>
            <View className="flex-col items-center justify-center w-full">
              <Text
                className={cn(
                  "text-5xl font-semibold text-foreground mb-2",
                  props.textColor && `text-${props.textColor}`
                )}
              >
                {callerInformation?.name || callerInformation?.number}
              </Text>
              <Text
                className={cn(
                  "text-xl text-muted-foreground",
                  props.textColor && `text-${props.textColor}`
                )}
              >
                Mobile +{callerInformation?.number}
              </Text>
            </View>
          </View>

          {/* Bento with active call actions 9x9 grid */}
          <View className="mb-20 px-12 rounded-xl">
            <View className="rounded-xl gap-4 bg-black/70 p-4">
              {callActions.map((row, idx) => (
                <View key={idx} className="flex-row justify-center gap-8 mb-4">
                  {row.map((action) => (
                    <TouchableOpacity
                      key={action.label}
                      onPress={action.onPress}
                    >
                      <View className="w-20 h-20 rounded-full p-2 gap-2 items-center justify-center">
                        <action.icon
                          size={32}
                          className={`${
                            action.enabled ? "text-white" : "text-white/50"
                          }`}
                        />
                        <Text
                          className={cn(
                            "text-sm",
                            action.enabled ? "text-white" : "text-white/50"
                          )}
                        >
                          {action.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
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
