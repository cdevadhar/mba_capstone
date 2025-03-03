import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView} from "react-native";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';

interface Connection {
    interaction: string;
    notes: string;
    date: string;
}
interface Detail {
    label: string;
    value: string;
}
interface Member {
    id: string;
    name: string;
    phones?: Contacts.PhoneNumber[]
    emails?: Contacts.Email[]
    connection_reminder: 'Daily' | 'Weekly' | 'Monthly';
    next_reminder: number;
    connection_log: Connection[];
    details: Detail[];
}

const ConnectionLogScreen = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [interaction, setInteraction] = useState<Connection>({interaction: '', notes: '', date: ''});
  const [member, setMember] = useState<Member>();
  let { contactId} = useLocalSearchParams();

  useEffect(() => {
    const getData = async() => {
        if (!contactId) return;
        if (Array.isArray(contactId)) contactId = contactId[0];
        const member = JSON.parse((await AsyncStorage.getItem(contactId)) || '');
        setMember(member);
    }
    getData();
  }, [])

  useEffect(() => {
    const setData = async() => {
        if (!contactId) return;
        if (Array.isArray(contactId)) contactId = contactId[0];
        await AsyncStorage.setItem(contactId, JSON.stringify(member));
    }
    setData();
  }, [member])

  const addInteraction = (interaction: Connection) => {
    if (!member) return;
    let temp = {...member};
    temp.connection_log.push(interaction);
    setMember(temp);
  }
  const setInteractionData = (label: 'interaction' | 'notes' | 'date', value: string) => {
    let temp = {...interaction};
    temp[label] = value;
    setInteraction(temp);
  }

  return (
    <View style={styles.container}>
      {/* Add Interaction Button */}
      <TouchableOpacity style={styles.addButton} onPress={()=>setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Interaction</Text>
      </TouchableOpacity>
      <View>
        <Text style={{marginTop: 15, fontSize: 20, fontWeight: "bold"}}>Past Interactions</Text>
      </View>
      <ScrollView style={{width: '100%', marginLeft: 40, marginBottom: 50}}>
        {member?.connection_log.map((connection, index) => {
            return (
                <View key={index} style={styles.logCard}>
                    <Text style={styles.label}>Date</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputText}>{connection.date}</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 10 }]}>Interaction</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputText}>{connection.interaction}</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 10 }]}>Notes:</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputText}>
                            {connection.notes}
                        </Text>
                    </View>
                </View>
            )
        })}
      </ScrollView>
      

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add an interaction</Text>

            <Text style={styles.label}>When?</Text>
            <TextInput style={styles.input} placeholder="Date" value={interaction.date} onChangeText={(text) => setInteractionData('date', text)}/>

            <Text style={styles.label}>Communication Method</Text>
            <TextInput style={styles.input} placeholder="Text" value={interaction.interaction} onChangeText={(text) => setInteractionData('interaction', text)}/>

            <Text style={styles.label}>Notes</Text>
            <TextInput style={styles.input} placeholder="Important information" value={interaction.notes} onChangeText={(text) => setInteractionData('notes', text)}/>

            <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity
                    style={{...styles.saveButton, backgroundColor: '#f55167'}}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        addInteraction(interaction);
                        setInteraction({interaction: '', notes: '', date: ''});
                        setModalVisible(false);
                    }}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 10,
  },
  logCard: {
    backgroundColor: "#E6E1F9",
    borderRadius: 15,
    padding: 16,
    width: "90%",
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    marginLeft: 5,
    marginTop: 10
  },
  inputBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  inputText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#5C4387",
    padding: 14,
    borderRadius: 15,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#E6E1F9",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    marginTop: '50%'
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 10,
    marginLeft: 5
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#5C4387",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 15,
    width: '47%',
    marginRight: '6%',
    alignItems: 'center'
  },
  saveButtonText: {
    color: "white",
  },
});

export default ConnectionLogScreen;
