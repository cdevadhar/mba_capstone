import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Welcome to Fill Your Cup!</Text>
        <Text style={styles.subtitle}>
          We’re thrilled you want to embark on this journey with us! We believe
          authentic communication can bring more joy and satisfaction into your life.
        </Text>
      </Card>
      <Link href="/Permissions" style={styles.button}>
        <Button mode="contained">
            Get started
        </Button>
      </Link>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  card: {
    padding: 20,
    backgroundColor: '#E6D9FF',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6A5298',
    borderRadius: 5
  },
  permissionButton: {
    backgroundColor: '#D8C4FF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: '#3bbf5c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9fa19f',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  }
});

export { WelcomeScreen, styles};
