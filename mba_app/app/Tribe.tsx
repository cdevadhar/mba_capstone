import BottomNav from "@/components/bottomNav";
import { Modal, View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Contacts, { getContactByIdAsync } from "expo-contacts";

interface Member {
    id: string;
    name: string;
}
  
const TribeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alex Johnson' },
  ]);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const renderItem = ({ item }: { item: Member }) => (
    <View style={styles.member}>
      <Feather name="user" size={30} color="black" style={styles.icon} />  {/* Use Feather icon */}
      <Text style={styles.memberName}>{item.name}</Text>
    </View>
  );

  const getContacts = async() => {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log(status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        console.log(data);
        setContacts(data);
      }
  }
  return (
    <View style={{flex: 1}}>
        <Button title="Add Tribe Member" onPress={() => {
            setModalVisible(true);
            getContacts();
        }} />
        <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                <Button title="Close" onPress={() => setModalVisible(false)} />
                <Text style={styles.modalText}>This is a modal!</Text>
                
                </View>
            
            </View>
        </Modal>
        <BottomNav />
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',  // Start at the top of the screen
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent dark overlay
    },
    modalView: {
      width: '100%',  // Full width
      height: '100%',  // 90% of the screen height
      backgroundColor: 'white',
      marginTop: 200,  // Reserve space at the top
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 20,
    },
    modalText: {
      fontSize: 20,
      marginBottom: 20,
    },
    member: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderBottomWidth: 0.5
    },
    icon: {
        marginRight: 10,
    },
        memberName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TribeScreen;