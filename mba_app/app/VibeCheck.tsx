// VibeCheckScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const VibeCheckScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerBubble}>
        <Text style={styles.headerText}>VIBE CHECK:</Text>
        <Text style={styles.subHeaderText}>How Full is your cup?</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {[
          "I got this on lock! Just help me remember people's birthdays.",
          "Surprise me - I'm here for the journey!",
          "I feel good but can be better at managing my connections.",
          "I have plenty of room to embrace more connections."
        ].map((item, index) => (
          <Link key={index} href="/Preferences" style={styles.button}>
            <Text style={styles.buttonText}>{item}</Text>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white'},
  headerBubble: { backgroundColor: '#E6DAF2', padding: 20, borderRadius: 20, alignItems: 'center' },
  headerText: { fontWeight: 'bold', fontSize: 18 },
  scrollContainer: {alignItems: 'center'},
  subHeaderText: { fontSize: 16, marginTop: 5 },
  button: { backgroundColor: '#5C4A99', borderRadius: 10, marginTop: 10, width: "90%", padding: 15},
  buttonText: {color: 'white'},
});

export default VibeCheckScreen;