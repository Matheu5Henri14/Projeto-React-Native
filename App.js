import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./src/navigations/AppTabs";

export default function App() {
  return (
    <NavigationContainer>
      <AppTabs/>
    </NavigationContainer>
  );
}