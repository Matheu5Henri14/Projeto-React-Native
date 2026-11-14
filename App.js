import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/config/AuthContext';
import { NotesProvider } from './src/config/NotesContext';
import { ContactsProvider } from './src/config/ContactsContext';
import { RecordsProvider } from './src/config/RecordsContext';

import AppNavigator from './src/navigations/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotesProvider>
          <ContactsProvider>
            <RecordsProvider>
              <AppNavigator />
            </RecordsProvider>
          </ContactsProvider>
        </NotesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
