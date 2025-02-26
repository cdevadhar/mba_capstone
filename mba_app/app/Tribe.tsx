import BottomNav from "@/components/bottomNav";
import { Modal, View, Text, Button, StyleSheet, ScrollView, TextInput, Touchable, TouchableOpacity} from 'react-native';
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as Contacts  from 'expo-contacts';

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
  const [searchString, setSearchString] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);

  const renderItem = (item : Member) => (
    <View key={item.id} style={styles.member}>
      <Feather name="user" size={30} color="black" style={styles.icon} />
      <Text style={styles.memberName}>{item.name}</Text>
    </View>
  );

  const getContacts = async() => {
      if (contacts.length>0) return;
      console.log("called function");
      const { status } = await Contacts.requestPermissionsAsync();
      console.log("returned");
      console.log(status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        console.log(data);
        setContacts(data);
        setFilteredContacts(data);
      }
  }

  useEffect(() => {
    let filtered = contacts.filter(contact => contact.name && contact.name.toLowerCase().includes(searchString.toLowerCase()));
    setFilteredContacts(filtered);
  }, [searchString])
  return (
    <View style={{flex: 1}}>
        <Button title="Add Tribe Member" onPress={async() => {
            await getContacts();
            setModalVisible(true);
        }} />
        {members.map(member => renderItem(member))}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                <TouchableOpacity style={{position: "absolute", top: 15, right: 15}} onPress={()=>setModalVisible(false)}>
                    <Feather name="x" size={30} color="red"></Feather>
                </TouchableOpacity>
                <TextInput value={searchString} onChangeText={(query) => setSearchString(query)} placeholder="Search Contacts" style={{marginTop: 30, height: 40, marginLeft: 5, padding: 10, fontSize: 18, backgroundColor: '#eee', borderRadius: 15}}></TextInput>
                <ScrollView style={{maxHeight: "65%"}}>
                    {filteredContacts.map(contact =>
                        contact.name ? renderItem({'id': contact.id || '', 'name': contact.name}): <View></View>
                    )}
                </ScrollView>
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