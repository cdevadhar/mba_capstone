import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Link } from 'expo-router';

const SatisfactionSurvey = () => {
  const options = [ 
    "I got this on lock! Just help me remember people's birthdays.",
    "Surprise me - I'm here for the journey!",
    "I feel good but can be better at managing my connections.",
    "I have plenty of room to embrace more connections."
  ]
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Relationships are tricky!</Text>
        <Text style={styles.subtitle}>We want to help you feel more connected - it's only human!</Text>
      </View>
      {
        options.map((option, index) => {
            return (
                <Link key={index} href="/Preferences" style={styles.button}>
                    <Text style={styles.buttonText}>{option}</Text>
                </Link>
            )
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
    card: { backgroundColor: '#EAE2F8', padding: 20, borderRadius: 10, marginTop: 20 },
    roundedCard: { backgroundColor: '#EAE2F8', padding: 20, borderRadius: 50, marginBottom: 20 },
    title: { fontSize: 18, fontWeight: 'bold' },
    subtitle: { fontSize: 14 },
    button: { backgroundColor: '#5C4A99', borderRadius: 5, marginTop: 10, width: "90%", padding: 15},
    buttonText: {color: 'white'},
    nextButton: { backgroundColor: '#5C4A99', padding: 15, borderRadius: 5, marginTop: 20 },
    startButton: { backgroundColor: '#5C4A99', padding: 15, borderRadius: 5, marginTop: 20 },
    image: { width: 100, height: 100, marginBottom: 20 }
});

export default SatisfactionSurvey;