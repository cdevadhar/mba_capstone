import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ title: "Fill Your Cup" }}>
        <Stack.Screen
            name="index"
            options={{
              animation: 'none',
              title: 'Home'
            }}
          />
          <Stack.Screen
            name="Tribe"
            options={{
              animation: 'none',
              title: 'Tribe'
            }}
          />
          <Stack.Screen
            name="Connect"
            options={{
              animation: 'none',
              title: 'Connect'
            }}
          />
          <Stack.Screen
            name="ContactCard"
            options={{
              title: 'Contact Card'
            }}
          />
          <Stack.Screen
            name="ConnectionLog"
            options={{
              title: 'Connection Log'
            }}
          />
      </Stack>
    </PaperProvider>
  );
}