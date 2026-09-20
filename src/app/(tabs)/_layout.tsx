import { Tabs } from "expo-router";
import { FloatingTabBar } from "../../components/ui/FloatingTabBar";
import { House, Receipt, Users } from "../../components/ui/icons";

export default function TabsLayout() {
  return (
    // `tabBar` swaps the default bar for ours
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          tabBarIcon: ({ color }) => <Receipt size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
