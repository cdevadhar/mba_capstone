import BottomNav from "@/components/bottomNav";
import { Modal, View, Text, Button, StyleSheet, ScrollView, TextInput, Touchable, TouchableOpacity} from 'react-native';
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as Contacts  from 'expo-contacts';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
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
const TribeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contacts.Contact[]>([]);
  const router = useRouter();
  
  const createMember = (contact: Contacts.Contact) => {
    const member: Member = {
        id: contact.id || '', 
        name: contact.name, 
        phones: contact.phoneNumbers, 
        emails: contact.emails, 
        connection_reminder: 'Weekly', 
        next_reminder: Date.now()+604800000, 
        connection_log: [], 
        details:[]
    };
    return member;
  }
  const memberExists = (id: string | undefined) => {
    if (!id) return false;
    return members.some(member => member.id==id);
  }
  const renderMember = (item : Member) => (
    <TouchableOpacity onPress={()=>router.push(`/ContactCard?contactId=${item.id}`)} key={item.id} style={styles.member}>
      <Feather name="user" size={30} color="black" style={styles.icon} />
      <Text style={styles.memberName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderContact = (item : Contacts.Contact) => (
    <TouchableOpacity 
        disabled={memberExists(item.id)} 
        key={item.id} 
        style={memberExists(item.id) ? styles.alreadyMemberContact : (selectedContacts.includes(item) ? styles.selectedContact: styles.member)} 
        onPress={()=>setSelected(item)}
    >
      <Feather name="user" size={30} color="black" style={styles.icon} />
      <Text style={styles.memberName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const setSelected = (contact: Contacts.Contact) => {
    let temp = [...selectedContacts];
    let index = temp.indexOf(contact)
    if (index>=0) {
        temp.splice(index, 1);
        setSelectedContacts(temp);
    }
    else {
        temp.push(contact);
        setSelectedContacts(temp);
    }
  }

  const getContacts = async() => {
      if (contacts.length>0) return;
      const { status } = await Contacts.requestPermissionsAsync();
      console.log(status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
        setFilteredContacts(data);
      }
  }

  useEffect(() => {
    let filtered = contacts.filter(contact => contact.name && contact.name.toLowerCase().includes(searchString.toLowerCase()));
    setFilteredContacts(filtered);
  }, [searchString])

  useEffect(() => {
    const getData = async() => {
        const memberIds = (await AsyncStorage.getAllKeys()).filter(key=>key!=='onboardingCompleted' && key!=='events');
        const members = (await AsyncStorage.multiGet(memberIds)).map(pair=>JSON.parse(pair[1] || ''));
        setMembers(members);
    }
    getData();
  }, [])

  return (
    <View style={{flex: 1}}>
        <Button title="Add Tribe Member" onPress={async() => {
            await getContacts();
            setModalVisible(true);
        }} />
        {members.map(member => renderMember(member))}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                <TouchableOpacity style={{position: "absolute", top: 15, right: 15}} onPress={()=>{
                    setSelectedContacts([]);
                    setModalVisible(false);
                }}>
                    <Feather name="x" size={30} color="red"></Feather>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {
                        let temp = members;
                        const newMembers = selectedContacts.map(contact=>createMember(contact));
                        temp = temp.concat(newMembers)
                        setSelectedContacts([]);
                        setModalVisible(false);
                        for (const newMember of newMembers) {
                            AsyncStorage.setItem(newMember.id || '', JSON.stringify(newMember));
                        }
                        setMembers(temp);
                    }} 
                    style={{width: "100%", alignItems: 'center', marginTop: 30, backgroundColor: selectedContacts.length==0 ? 'gray' : 'green', padding: 15, borderRadius: 15}} 
                    disabled={selectedContacts.length==0}
                >
                    <Text style={{alignContent: 'center', fontSize: 18, color: 'white'}}>Add Selected Contacts</Text>
                </TouchableOpacity>
                <TextInput 
                    value={searchString} 
                    onChangeText={(query) => setSearchString(query)} 
                    placeholder="Search Contacts" 
                    style={{marginTop: 5, height: 40, padding: 10, fontSize: 18, backgroundColor: '#eee', borderRadius: 15}}
                >
                </TextInput>
                <ScrollView style={{maxHeight: "65%", marginTop: 10}}>
                    {filteredContacts.map(contact =>
                        contact.name ? renderContact(contact): <View></View>
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
    selectedContact: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#cfb0f5',
        borderRadius: 5,
        borderBottomWidth: 0.5
    },
    alreadyMemberContact: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#cbcacc',
        borderRadius: 5,
        borderBottomWidth: 0.5
    },
    icon: {
        marginRight: 10,
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default TribeScreen;