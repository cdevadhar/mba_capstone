import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
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
  </Stack>;
}