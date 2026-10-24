import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactsScreen from '../screens/ContactsScreen';
import NewContactScreen from '../screens/NewContactScreen';

const Stack = createNativeStackNavigator();

export default function ContactsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContactsList" component={ContactsScreen} />
      <Stack.Screen name="NewContact" component={NewContactScreen} />
    </Stack.Navigator>
  );
}