import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ContactsProvider } from './src/config/ContactsContext';
import { RecordsProvider } from './src/config/RecordsContext';
// import RootNavigator from './src/navigations/RootNavigator'; // seu Stack externo (Notes -> AppTabs)
import AppTabs from './src/navigations/AppTabs';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContactsProvider>
        <RecordsProvider>
          <NavigationContainer>
            {/* <RootNavigator /> */}
            <AppTabs/>
          </NavigationContainer>
        </RecordsProvider>
      </ContactsProvider>
    </SafeAreaProvider>
  );
}