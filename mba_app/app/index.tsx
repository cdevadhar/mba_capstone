import { Text, View, ScrollView} from "react-native";
import * as Contacts from 'expo-contacts';
import { useState, useEffect } from "react";

export default function Index() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView>
        {contacts ? contacts.map(contact => {
          return <Text>{contact.firstName+" "+contact.lastName}</Text>
        }): <View></View>}
      </ScrollView>
      
      
    </View>
  );
}
