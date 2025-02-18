import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { Card} from 'react-native-paper';
import { styles } from './Welcome';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import * as Calendar from 'expo-calendar';
import * as Contacts  from 'expo-contacts';


const PermissionsScreen = () => {
  const [contacts, setContacts] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<boolean>(false);

  const getContacts = async() => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      setContacts(true);
    }
  }
  const getCalendar = async() => {
    console.log("called");
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      setCalendar(true);
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Let’s Get Started</Text>
        <Text style={styles.subtitle}>
          We’ll need a few permissions to help you stay connected:
        </Text>
        <TouchableOpacity style={contacts ? styles.nextButton: styles.permissionButton} onPress={() => getContacts()}>
          <Text style={styles.buttonText}>Contacts</Text>
          <Text style={styles.permissionText}>To help you find and reach your loved ones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={calendar ? styles.nextButton: styles.permissionButton} onPress={() => getCalendar()}>
          <Text style={styles.buttonText}>Calendar</Text>
          <Text style={styles.permissionText}>To remind you of key dates like birthdays and anniversaries</Text>
        </TouchableOpacity>
      </Card>
      <Link href="/Satisfaction" style={contacts && calendar ? styles.nextButton: styles.disabledButton}>
        <TouchableOpacity disabled={!contacts || !calendar}>
          <Text style={styles.buttonText}>Next Steps</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};


export default PermissionsScreen;