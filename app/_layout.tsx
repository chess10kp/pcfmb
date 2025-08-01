import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Tabs, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { View } from "react-native";
import {
  Tabs as TabComponent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { NAV_THEME } from "~/lib/constants";
import { Home } from "~/lib/icons/Home";
import { Plus } from "~/lib/icons/Plus";
import { useColorScheme } from "~/lib/useColorScheme";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

const TABS = [
  { name: "index", title: "Home", icon: Home },
  { name: "add", title: "Add", icon: Plus },
];

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname === "/" ? "index" : "add";

  return (
    <View className="bg-background border-t border-border">
      <TabComponent value={activeTab} onValueChange={(value) => {}}>
        <TabsList className="flex-row">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              onPress={() => {
                router.push(tab.name === "index" ? "/" : `/${tab.name}`);
              }}
              className="flex-1"
            >
              <tab.icon size={16} color="white" className="w-4 h-4" />
              <Text>{tab.title}</Text>
            </TabsTrigger>
          ))}
        </TabsList>
      </TabComponent>
    </View>
  );
};

export default function RootLayout() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  React.useEffect(() => {
    setColorScheme("dark");
  }, []);

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Tabs
        initialRouteName="index"
        tabBar={() => <TabBar />}
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkColorScheme
              ? NAV_THEME.dark.background
              : NAV_THEME.light.background,
          },
          headerTintColor: isDarkColorScheme
            ? NAV_THEME.dark.text
            : NAV_THEME.light.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
          }}
        />
      </Tabs>
      <PortalHost />
    </ThemeProvider>
  );
}

function noop() {}
