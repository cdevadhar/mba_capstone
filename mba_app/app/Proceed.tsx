import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingCompletionScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>You're All Set!</Text>
        <View style={styles.iconContainer}>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={async() => {
        await AsyncStorage.setItem("onboardingCompleted", "true");
        router.dismissAll();
        router.replace("/");
      }}>
        <Text style={styles.buttonText}>Start your Journey</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  card: {
    backgroundColor: "#DCCFFB",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    backgroundColor: "#F5C24E",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#9087E5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingCompletionScreen;