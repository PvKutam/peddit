import { Tabs } from "expo-router";
const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          tabBarLabel: "network",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarLabel: "post",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default _layout;


