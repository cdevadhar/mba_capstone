import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

const SatisfactionSurvey = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Relationships are tricky!</Text>
        <Text style={styles.subtitle}>We want to help you feel more connected - it's only human!</Text>
      </View>
      <TouchableOpacity style={styles.button}><Text>Beginner: Teach me Everything!</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button}><Text>Intermediate: Room for Improvement for sure.</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button}><Text>Advanced: I'm a communication Ninja.</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    card: { backgroundColor: '#EAE2F8', padding: 20, borderRadius: 10, marginBottom: 20 },
    roundedCard: { backgroundColor: '#EAE2F8', padding: 20, borderRadius: 50, marginBottom: 20 },
    title: { fontSize: 18, fontWeight: 'bold' },
    subtitle: { fontSize: 14 },
    button: { backgroundColor: '#5C4A99', padding: 15, borderRadius: 5, marginTop: 10 },
    nextButton: { backgroundColor: '#5C4A99', padding: 15, borderRadius: 5, marginTop: 20 },
    startButton: { backgroundColor: '#5C4A99', padding: 15, borderRadius: 5, marginTop: 20 },
    image: { width: 100, height: 100, marginBottom: 20 }
});

export default SatisfactionSurvey;