import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput} from 'react-native';
import { Avatar, Card, Menu } from 'react-native-paper';

const ContactCard = () => {
  const [reminder, setReminder] = useState('Weekly');
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Avatar.Icon size={120} icon="account" style={styles.avatar} />
        <Text style={styles.name}>Val Sandoval</Text>
        
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
                    <Text style={styles.value}>{reminder} ▾</Text>
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
        <TouchableOpacity style={{...styles.infoCard, width: "48%", marginRight: "2%", backgroundColor: '#cfb0f5'}}>
            <View style={styles.wrapperView}>
                <Text style={{...styles.label, fontSize: 16}}>📅 Connection Log</Text>
            </View>
        </TouchableOpacity>
        <Card style={{...styles.infoCard, width: "50%"}}>
            <View style={styles.wrapperView}>
                <Text style={styles.label}>Next:</Text>
                <Text style={styles.value}>February 5th</Text>
            </View>
        </Card>
      </View>
      <View style={{...styles.wrapperView, justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={styles.detailsHeader}>Details</Text>
        <TouchableOpacity style={{marginTop: 5}} onPress={()=>setModalVisible(true)}>
            <Feather name="plus-circle" size={24}></Feather>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Card style={styles.detailCard}>
            <View style={styles.wrapperView}>
                <Text style={styles.label}>🎂 Birthday</Text>
                <Text style={styles.value}>April 19th, 1994</Text>
            </View>
        </Card>
        <Card style={styles.detailCard}>
            <View style={styles.wrapperView}>
                <Text style={styles.label}>👤 Partner’s Name</Text>
                <Text style={styles.value}>Greg</Text>
            </View>
        </Card>
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
            <Text style={styles.title}>Add a detail</Text>

            <Text style={{fontSize: 18}}>Label</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Partner's Name" 
                // onChangeText={setLabel}
            />

            <Text style={{fontSize: 18, marginTop: 10}}>Value</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Greg" 
                // onChangeText={setValue}
            />

            <TouchableOpacity style={{...styles.button, marginTop: 15, backgroundColor: '#f55167'}} onPress={()=>setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.button, marginTop: 5}} onPress={()=>setModalVisible(false)}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
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
    backgroundColor: '#5E4B8B',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ContactCard;
