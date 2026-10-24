import { SafeAreaProvider } from 'react-native-safe-area-context';

// import { AuthProvider } from './src/config/AuthContext';
import { ContactsProvider } from './src/config/ContactsContext';
import { RecordsProvider } from './src/config/RecordsContext';
import AppNavigator from './src/navigations/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContactsProvider>
        <RecordsProvider>
          <AppNavigator />
        </RecordsProvider>
      </ContactsProvider>
    </SafeAreaProvider>
  );
}