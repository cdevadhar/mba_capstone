
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useState } from 'react';
import { Link } from 'expo-router';

const CommunicationPreferenceScreen = () => {
  const [checked, setChecked] = useState([false, false, false]);
  const setCheck = (index: number) => {
    let temp = [...checked];
    temp[index] = !temp[index];
    setChecked(temp);
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerBubble}>
        <Text style={styles.headerText}>I feel most connected with others while...</Text>
      </View>
      <View style={styles.optionsContainer}>
        {["Texting", "Talking over the phone", "Hanging out in person"].map((item, index) => (
          <TouchableOpacity key={index} style={styles.optionRow} onPress={()=> setCheck(index)}>
            <View style={{ borderWidth: 1, borderColor: 'black'}}>
                <Checkbox status={checked[index] ? 'checked' : 'unchecked'} uncheckedColor='black' color='purple'/>
            </View>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Link href="/Proceed" style={styles.nextButton}>
        <Text style={styles.nextText}>Next</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  headerBubble: { backgroundColor: '#E6DAF2', padding: 20, borderRadius: 20, alignItems: 'center' },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  optionsContainer: { marginTop: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  optionText: { fontSize: 16, marginLeft: 10 },
  nextButton: { backgroundColor: '#5B4B8A', padding: 15, borderRadius: 10, alignSelf: 'center', marginTop: 20 },
  nextText: { color: 'white', fontWeight: 'bold' }
});

export default CommunicationPreferenceScreen;