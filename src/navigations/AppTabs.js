import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SecretHub from '../screens/SecretHub';
import { colors } from '../config/theme';
// import ContactsStack from './ContactsStack';
// import RecordsStack from './RecordsStack';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8E8A96',
      }}
    >
      <Tab.Screen name="Home" component={SecretHub} options={{ title: 'Início' }} />
    {/*<Tab.Screen name="Contacts" component={ContactsStack} options={{ title: 'Contatos' }} />*/}
    {/*<Tab.Screen name="Records" component={RecordsStack} options={{ title: 'Registros' }} />*/} 
    </Tab.Navigator>
  );
}