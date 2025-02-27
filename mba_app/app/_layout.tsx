import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
            name="index"
            options={{
              animation: 'none'
            }}
          />
          <Stack.Screen
            name="Tribe"
            options={{
              animation: 'none'
            }}
          />
          <Stack.Screen
            name="Connect"
            options={{
              animation: 'none'
            }}
          />
      </Stack>
    </PaperProvider>
  );
}