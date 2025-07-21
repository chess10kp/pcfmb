import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import Slider from "react-native-slide-to-unlock";
import { CircleUserRound } from "~/lib/icons/CircleUserRound";
import { Grip } from "~/lib/icons/Grip";
import { MicOff } from "~/lib/icons/MicOff";
import { Phone } from "~/lib/icons/Phone";
import { Plus } from "~/lib/icons/Plus";
import { Video } from "~/lib/icons/Video";
import { Volume2 } from "~/lib/icons/Volume2";
import { cn } from "~/lib/utils";

export const AppleCallScreen = (props: Props) => {
  const callerInformation = props.formData;

  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const handleCallAccept = () => {
    setIsCallAccepted(true);
  };

  const handleCallReject = () => {
    setIsCallEnded(true);
  };

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

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
        {
          icon: Volume2,
          label: "Speaker",
          enabled: true,
          onPress: () => {},
        },
      ],
      [
        {
          icon: Plus,
          label: "Add Call",
          enabled: true,
          onPress: () => {},
        },
        {
          icon: Video,
          label: "FaceTime",
          enabled: true,
          onPress: () => {},
        },
        {
          icon: CircleUserRound,
          label: "contacts",
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
      colors={["#222224", "#222224"]}
      u
      className={cn("flex-1", props.textColor && `text-${props.textColor}`)}
    >
      {!isCallAccepted && !isCallEnded && (
        <View className="w-full h-full">
          <View className="flex-1 mt-16 justify-start items-center px-6">
            <Text
              className={cn(
                "text-5xl text-foreground mb-4 font-mono",
                props.textColor && `text-${props.textColor}`
              )}
            >
              {callerInformation?.name || callerInformation?.number}
            </Text>
            <Text
              className={cn(
                "text-3xl text-white ",
                props.textColor && `text-${props.textColor}`
              )}
            >
              mobile
            </Text>
          </View>

          {/* Incoming Call Buttons */}
          <View className="mb-20 h-fit mx-12">
            <View className="flex flex-row justify-between w-full">
              <Slider
                onSlideStart={() => {}}
                onSlideEnd={() => {}}
                onEndReached={() => {
                  handleCallAccept();
                }}
                containerStyle={{
                  margin: 8,
                  backgroundColor: "#38383A",
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "95%",
                  borderRadius: 100,
                }}
                sliderElement={
                  <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
                    <Phone size={32} fill={"#8EE082"} strokeWidth={0} />
                  </View>
                }
              ></Slider>
            </View>
          </View>
        </View>
      )}

      {isCallAccepted && (
        <View className="flex-1 m-0 p-0 w-full">
          <View className="flex-1 mt-16 gap-16 justify-start items-center px-6">
            <View className="flex-col items-center justify-center w-full">
              <Text
                className={cn(
                  "text-5xl font-semibold text-foreground mb-2",
                  props.textColor && `text-${props.textColor}`
                )}
              >
                {callerInformation?.name || callerInformation?.number}
              </Text>
              <View className="flex-row items-center gap-2 justify-center w-full">
                <Text className="text-white text-center text-xl">
                  {formatTime(callDuration)}
                </Text>
              </View>
            </View>
          </View>

          {/* Bento with active call actions 9x9 grid */}
          <View className="top-0 self-center bottom-0 absolute ">
            <View className="rounded-xl gap-8 flex h-full justify-center items-center px-4">
              {callActions.map((row, idx) => (
                <View
                  key={idx}
                  className="flex-row justify-around gap-8 gap-y-16"
                >
                  {row.map((action) => (
                    <TouchableOpacity
                      key={action.label}
                      onPress={action.onPress}
                      className="gap-y-4"
                    >
                      <View className="w-20 h-20 bg-[#38383A] rounded-full items-center justify-center">
                        <action.icon
                          size={32}
                          className={`${
                            action.enabled ? "text-white" : "text-white/50"
                          }`}
                        />
                      </View>
                      <Text
                        className={cn(
                          "text-md text-center",
                          action.enabled ? "text-white" : "text-white/50"
                        )}
                      >
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              {/* Row 3 */}
              <View className="flex-row justify-center gap-4">
                <View className="w-20 h-20 rounded-full p-2 items-center justify-center mt-8">
                  <View className="bg-[#FE3628] rounded-full p-4">
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
