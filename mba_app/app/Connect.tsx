import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "@/components/bottomNav";

const ConnectScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F2FD", paddingBottom: 20 }}>
      <ScrollView>
        <Section title="Today's connections" icon="calendar">
          <ConnectionItem name="Call Mom" />
        </Section>

        <Section title="This week" icon="emoticon-outline">
          <ConnectionItem name="Coffee with Dru (Tuesday)" />
        </Section>

        <TouchableOpacity style={styles.eventButton}>
          <Text style={styles.eventText}>+ An Event</Text>
        </TouchableOpacity>

        <Section title="Special Occasions" icon="cake-variant">
          <SpecialItem text="Order Dru a Birthday gift (1 week away!)" />
          <SpecialItem text="Congratulations Val for Graduating !" />
        </Section>
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const Section: React.FC<{ title: string, icon: keyof typeof MaterialCommunityIcons.glyphMap, children: React.ReactNode}> = ({ title, icon, children}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={20} color="#4C2A85" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const ConnectionItem: React.FC<{ name: string }> = ({ name }) => (
  <View style={styles.item}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>A</Text>
    </View>
    <Text style={styles.itemText}>{name}</Text>
    <MaterialCommunityIcons name="checkbox-marked-outline" size={20} color="#4C2A85" />
  </View>
);

const SpecialItem: React.FC<{ text: string }> = ({ text }) => (
  <TouchableOpacity style={styles.specialItem}>
    <Text style={styles.specialText}>{text}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  section: { margin: 16, backgroundColor: "#E5DDFB", borderRadius: 12, padding: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 10, color: "#4C2A85" },
  item: { flexDirection: "row", alignItems: "center", padding: 10 },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#DCC8FC", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#4C2A85", fontWeight: "bold" },
  itemText: { flex: 1, fontSize: 16, marginLeft: 10 },
  eventButton: { backgroundColor: "#2E2E2E", margin: 16, padding: 12, borderRadius: 8, alignItems: "center" },
  eventText: { color: "#FFF", fontSize: 16 },
  specialItem: { backgroundColor: "#2E2E2E", padding: 12, marginHorizontal: 16, marginBottom: 10, borderRadius: 8 },
  specialText: { color: "#FFF", fontSize: 16 },
});

export default ConnectScreen;
