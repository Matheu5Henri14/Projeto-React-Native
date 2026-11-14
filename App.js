import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/config/AuthContext';
import { ContactsProvider } from './src/config/ContactsContext';
import { RecordsProvider } from './src/config/RecordsContext';

import AppNavigator from './src/navigations/AppNavigator';

import AppTabs from './src/navigations/AppTabs';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ContactsProvider>
          <RecordsProvider>
            <NavigationContainer>
              <AppTabs />
            </NavigationContainer>
          </RecordsProvider>
        </ContactsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}