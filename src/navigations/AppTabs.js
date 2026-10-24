import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SecretHub from '../screens/SecretHub';
import ContactsStack from './ContactsStack';
import { colors } from '../config/theme';
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

      <Tab.Screen
        name="Contacts"
        component={ContactsStack}
        options={({ route }) => ({
          title: 'Contatos',
          // Esconde as abas no formulário, como no protótipo do Figma.
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === 'NewContact'
              ? { display: 'none' }
              : undefined,
        })}
      />

      {/* <Tab.Screen name="Records" component={RecordsStack} options={{ title: 'Registros' }} /> */}
    </Tab.Navigator>
  );
}