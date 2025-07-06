import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Phone } from "~/lib/icons/Phone";
import { PhoneOff } from "~/lib/icons/PhoneOff";
import { type ScheduledCall } from "~/lib/types/types";
import { cn } from "~/lib/utils";

type Props = {
  call: ScheduledCall | null;
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
};

export const NotificationPopup = ({
  call,
  visible,
  onAccept,
  onReject,
  onClose,
}: Props) => {
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const acceptScale = useRef(new Animated.Value(1)).current;
  const rejectScale = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  const handleCallAccept = () => {
    setIsCallAccepted(true);
    onAccept();
  };

  const handleCallReject = () => {
    onReject();
    onClose();
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (visible) {
      // Animate modal in
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Animate modal out
      Animated.spring(modalScale, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (isCallAccepted) {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCallAccepted]);

  if (!call) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale: modalScale }],
        }}
      >
        <LinearGradient
          colors={["#1a1a2e", "#4a275a", "#20b2aa"]}
          className="flex-1"
        >
          {!isCallAccepted && (
            <View className="w-full h-full">
              <View className="flex-1 mt-16 justify-start items-center px-6">
                <Text className="text-5xl font-semibold text-white mb-2">
                  {call.name || call.number}
                </Text>
                <Text className="text-xl text-white/70">{call.location}</Text>
                <Text className="text-lg text-white/60 mt-4">
                  Scheduled Call
                </Text>
              </View>

              {/* Incoming Call Buttons */}
              <View className="mb-20 h-fit mx-12">
                <View className="flex flex-row justify-between w-full">
                  <Pressable
                    onPress={handleCallAccept}
                    onPressIn={() => animateButton(acceptScale, 1.1)}
                    onPressOut={() => animateButton(acceptScale, 1)}
                  >
                    <Animated.View
                      style={{ transform: [{ scale: acceptScale }] }}
                      className="items-center"
                    >
                      <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
                        <Phone
                          size={32}
                          color="green"
                          fill="green"
                          strokeWidth={2}
                        />
                      </View>
                      <Text className="text-white text-sm">Accept</Text>
                    </Animated.View>
                  </Pressable>

                  <Pressable
                    onPress={handleCallReject}
                    onPressIn={() => animateButton(rejectScale, 1.1)}
                    onPressOut={() => animateButton(rejectScale, 1)}
                  >
                    <Animated.View
                      style={{ transform: [{ scale: rejectScale }] }}
                      className="items-center"
                    >
                      <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-2">
                        <PhoneOff
                          size={32}
                          color="red"
                          fill="red"
                          strokeWidth={2}
                        />
                      </View>
                      <Text className="text-white text-sm">Reject</Text>
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
                  <View className="flex-1"></View>
                </View>

                <View className="flex-col items-center justify-center w-full">
                  <Text className="text-5xl font-semibold text-white mb-2">
                    {call.name || call.number}
                  </Text>
                  <Text className="text-xl text-white/70">
                    Mobile +{call.number}
                  </Text>
                </View>
              </View>

              {/* Call Actions */}
              <View className="mb-20 px-12">
                <View className="rounded-xl gap-4 bg-black/70 p-4">
                  <View className="flex-row justify-center gap-8 mb-4">
                    <TouchableOpacity onPress={toggleMute}>
                      <View className="w-20 h-20 rounded-full p-2 gap-2 items-center justify-center">
                        <Phone
                          size={32}
                          className={isMuted ? "text-white/50" : "text-white"}
                        />
                        <Text
                          className={cn(
                            "text-sm",
                            isMuted ? "text-white/50" : "text-white"
                          )}
                        >
                          {isMuted ? "Unmute" : "Mute"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* End Call Button */}
                  <View className="flex-row justify-center gap-4">
                    <TouchableOpacity onPress={handleCallReject}>
                      <View className="w-20 h-20 rounded-full p-2 items-center justify-center">
                        <View className="bg-red-500 rounded-full p-4">
                          <Phone
                            size={32}
                            color="white"
                            strokeWidth={0}
                            fill="white"
                            style={{ transform: [{ rotate: "135deg" }] }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};
