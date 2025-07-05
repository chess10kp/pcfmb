import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define the props for the Collapsible component
type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  initialCollapsed?: boolean;
  duration?: number; // Animation duration in ms
};

/**
 * A custom Collapsible component for React Native with Animated.
 * It animates the height of its content when expanding/collapsing.
 *
 * @param {CollapsibleProps} props - The props for the component.
 * @param {string} props.title - The title displayed in the header.
 * @param {React.ReactNode} props.children - The content to be collapsed/expanded.
 * @param {boolean} [props.initialCollapsed=true] - Whether the component should be collapsed initially.
 * @param {number} [props.duration=300] - The duration of the animation in milliseconds.
 */
export const Collapsible = ({
  title,
  children,
  initialCollapsed = true,
  duration = 300,
}: CollapsibleProps) => {
  // State to manage the collapsed/expanded status
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  // Animated.Value for controlling the height animation
  const animationHeight = useRef(
    new Animated.Value(initialCollapsed ? 0 : -1)
  ).current; // -1 indicates 'auto' or full height
  // State to store the measured content height
  const [contentHeight, setContentHeight] = useState(0);

  // Effect to run the animation whenever the 'collapsed' state changes
  useEffect(() => {
    if (contentHeight === 0) {
      // If contentHeight is not yet measured, don't animate.
      // This can happen on initial render if initialCollapsed is false.
      if (!collapsed && animationHeight._value === -1) {
        // If not collapsed and height is -1 (meaning it should be auto/full),
        // we wait for onLayout to set contentHeight.
        return;
      }
    }

    // Determine the target height for the animation
    const toValue = collapsed ? 0 : contentHeight;

    // Start the animation
    Animated.timing(animationHeight, {
      toValue,
      duration,
      easing: Easing.linear, // Smooth easing function
      useNativeDriver: false, // Height animation typically requires useNativeDriver: false
    }).start();
  }, [collapsed, contentHeight, duration]);

  // Function to measure the content's natural height
  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
      // If initially expanded, set animation height to content height immediately
      if (!initialCollapsed && animationHeight._value === -1) {
        animationHeight.setValue(height);
      }
    }
  };

  // Function to toggle the collapsed state
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Determine the icon to display based on the collapsed state
  const Icon = collapsed ? ChevronDown : ChevronUp;

  return (
    <View className="w-full my-2 rounded-lg overflow-hidden shadow-md">
      {/* Collapsible Header */}
      <TouchableOpacity
        onPress={toggleCollapsed}
        activeOpacity={0.7}
        className="flex-row justify-between items-center p-4  rounded-t-lg"
      >
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Icon size={24} color="white" />
      </TouchableOpacity>

      {/* Collapsible Content */}
      {/*
        The Animated.View applies the animated height.
        The inner View with onLayout measures the actual content height.
        We only render content if not fully collapsed or if contentHeight is not yet measured,
        to ensure onLayout fires.
      */}
      <Animated.View
        style={{
          height: animationHeight,
          // If contentHeight is 0 and not collapsed (meaning it's waiting for measurement),
          // or if it's already expanded, set overflow to visible to allow content to show.
          // Otherwise, hide overflow when collapsed.
          overflow:
            collapsed && animationHeight._value === 0 ? "hidden" : "visible",
        }}
        className=""
      >
        <View
          onLayout={onContentLayout}
          // Position absolute to prevent content from affecting layout when height is 0
          // but still allow measurement. Only apply if collapsed to prevent layout issues.
          style={
            collapsed && contentHeight === 0
              ? { position: "absolute", opacity: 0 }
              : {}
          }
          className="p-4"
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
