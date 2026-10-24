import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SecretHub from '../screens/SecretHub';
import ContactsStack from './ContactsStack';
import RecordsStack from './RecordsStack';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

// Esconde a barra de abas nas telas de formulário, como no protótipo do Figma.
const hideTabsOn = (formRouteName) => ({ route }) => ({
  tabBarStyle:
    getFocusedRouteNameFromRoute(route) === formRouteName ? { display: 'none' } : undefined,
});

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
        options={(props) => ({ title: 'Contatos', ...hideTabsOn('NewContact')(props) })}
      />

      <Tab.Screen
        name="Records"
        component={RecordsStack}
        options={(props) => ({ title: 'Registros', ...hideTabsOn('NewRecord')(props) })}
      />
    </Tab.Navigator>
  );
}