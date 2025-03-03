import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput} from 'react-native';
import { Avatar, Card, Menu } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';

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


const ContactCard = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [member, setMember] = useState<Member>();
  const [detailLabel, setDetailLabel] = useState<string>('');
  const [detailValue, setDetailValue] = useState<string>('');
  const router = useRouter();
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

  const setReminder = (reminder: "Daily" | "Monthly" | "Weekly") => {
    if (!member) return;
    let temp = {...member};
    temp.connection_reminder = reminder;
    const nextReminder = new Date();
    if (reminder=="Daily") {
        // first reminder is tomorrow
        nextReminder.setDate(nextReminder.getDate() + 1);
    }
    else if (reminder=="Weekly") {
        // first reminder is in a week
        nextReminder.setDate(nextReminder.getDate() + 7);
    }
    else if (reminder=="Monthly") {
        nextReminder.setMonth(nextReminder.getMonth() + 1);
    }
    temp.next_reminder = nextReminder.getTime();
    setMember(temp);
  }

  const addDetail = (detail: Detail) => {
    if (!member) return;
    let temp = {...member};
    temp.details.push(detail);
    setMember(temp);
  }

  const markComplete = () => {
    if (!member) return;
    let temp = {...member};
    if (temp.connection_reminder=='Daily') {
        temp.next_reminder+=86400000;
    }
    else if (temp.connection_reminder=='Weekly') {
        temp.next_reminder+=86400000*7;
    }
    else {
        const now = new Date(temp.next_reminder);
        now.setMonth(now.getMonth()+1);
        temp.next_reminder=(now.getTime());
    }
    setMember(temp);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Avatar.Icon size={120} icon="account" style={styles.avatar} />
        <Text style={styles.name}>{member?.name}</Text>
        
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}><Text style={styles.icon}>📞</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Text style={styles.icon}>💬</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Text style={styles.icon}>✉️</Text></TouchableOpacity>
        </View>
      </View>
      
      <Card style={styles.infoCard}>
        <View style={styles.wrapperView}>
            <Text style={styles.label}>Connection reminder:</Text>
            <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
                <TouchableOpacity onPress={() => {
                    setMenuVisible(false); // Reset state
                    setTimeout(() => setMenuVisible(true), 10); // Open after short delay
                  }}>
                    <Text style={styles.value}>{member?.connection_reminder} ▾</Text>
                </TouchableOpacity>
            }
            >
                <Menu.Item onPress={() => {setReminder('Daily'); setMenuVisible(false);}} title="Daily" />
                <Menu.Item onPress={() => {setReminder('Weekly'); setMenuVisible(false);}} title="Weekly" />
                <Menu.Item onPress={() => {setReminder('Monthly'); setMenuVisible(false);}} title="Monthly" />
            </Menu>
        </View>
        
      </Card>
      <View style={styles.wrapperView}>
        <TouchableOpacity style={{...styles.infoCard, width: "48%", marginRight: "2%", backgroundColor: '#cfb0f5'}} onPress={()=>router.push(`/ConnectionLog?contactId=${contactId}`)}>
            <View style={styles.wrapperView}>
                <Text style={{...styles.label, fontSize: 16}}>📅 Connection Log</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.infoCard, width: "50%"}} onPress={()=>markComplete()}>
            <View style={{...styles.wrapperView, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.label}>Next:</Text>
                    <Text style={styles.value}>{new Date(member?.next_reminder || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric' })}</Text> 
                </View>
                <Text style={{...styles.value, marginBottom: 5}}>🎯</Text>
            </View>
        </TouchableOpacity>
      </View>
      <View style={{...styles.wrapperView, justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={styles.detailsHeader}>Details</Text>
        <TouchableOpacity style={{marginTop: 5}} onPress={()=>setModalVisible(true)}>
            <Feather name="plus-circle" size={24}></Feather>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {member?.details.map((detail, index) =>
            <Card key={index} style={styles.detailCard}>
                <View style={styles.wrapperView}>
                    <Text style={styles.label}>{detail.label}</Text>
                    <Text style={styles.value}>{detail.value}</Text>
                </View>
            </Card>
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
            <Text style={styles.title}>Add a detail</Text>

            <Text style={{fontSize: 18}}>Label</Text>
            <TextInput 
                value={detailLabel}
                style={styles.input} 
                placeholder="Partner's Name" 
                onChangeText={(text)=>setDetailLabel(text)}
            />

            <Text style={{fontSize: 18, marginTop: 10}}>Value</Text>
            <TextInput 
                value={detailValue}
                style={styles.input} 
                placeholder="Greg" 
                onChangeText={(text)=>setDetailValue(text)}
            />

            <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity
                    style={{...styles.button, backgroundColor: '#f55167'}}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                        addDetail({'label': detailLabel, 'value': detailValue}); 
                        setDetailLabel('');
                        setDetailValue('');
                        setModalVisible(false);
                    }}
                >
                    <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    backgroundColor: '#D9C4F1',
  },
  name: {
    fontSize: 26,
    fontWeight: 'normal',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  iconButton: {
    backgroundColor: '#EDE7F6',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,
  },
  icon: {
    fontSize: 22,
  },
  infoCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 1,
  },
  wrapperView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsHeader: {
    fontSize: 22,
    fontWeight: 'normal',
    marginTop: 20,
    marginBottom: 10,
  },
  detailCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    marginLeft: 5,
    fontSize: 18,
    color: '#444',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
    marginTop: '50%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#5C4387",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 15,
    width: '47%',
    marginRight: '6%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
  },
});

export default ContactCard;
