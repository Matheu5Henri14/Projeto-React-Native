import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecordsScreen from '../screens/RecordsScreen';
import NewRecordScreen from '../screens/NewRecordScreen';

const Stack = createNativeStackNavigator();

export default function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecordsList" component={RecordsScreen} />
      <Stack.Screen name="NewRecord" component={NewRecordScreen} />
    </Stack.Navigator>
  );
}