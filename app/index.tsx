import { Redirect } from "expo-router";
import { View, Text } from "react-native";
export default function Page() {
  return <Redirect href="/(authenticate)/login" />;
}
