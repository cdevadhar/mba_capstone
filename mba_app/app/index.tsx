import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, Text} from 'react-native';
import BottomNav from '@/components/bottomNav';
import { StyleSheet } from "react-native";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem("onboardingCompleted");
      if (!hasSeenOnboarding) {
        router.replace("/Welcome"); // Redirect to onboarding screen
        return;
      }
      setLoading(false);
    };

    checkOnboarding();
  }, []);

  if (loading) return null; // Prevent rendering until check is done

  return (
    <View style={{flex: 1}}>
      <Text>Home Screen</Text>
      <BottomNav />
    </View>
  );
}