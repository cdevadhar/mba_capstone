import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isToday, isThisWeek, compareAsc } from "date-fns";
import BottomNav from "@/components/bottomNav";

interface Event {
    id: string;
    text: string;
    date: Date;
    isReminder: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Event[]>([
    { id: "1", text: "Call Mom", date: new Date(), isReminder: false},
    { id: "2", text: "Coffee with Dru", date: new Date(new Date().setDate(new Date().getDate() + 2)), isReminder: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [date, setDate] = useState(new Date());

  const addEvent = () => {
    if (newEvent.trim() === "") return;
    setTasks([...tasks, { id: Date.now().toString(), text: newEvent, date, isReminder: false}].sort((a, b) => compareAsc(a.date, b.date)));
    setNewEvent("");
    setModalVisible(false);
  };

  const todayTasks = tasks.filter((task) => isToday(task.date));
  const weekTasks = tasks.filter((task) => isThisWeek(task.date, { weekStartsOn: 0 }) && !isToday(task.date));

  return (
    <View style={{flex: 1}}>
    <View style={styles.container}>
      {todayTasks.length > 0 && (
        <View style={{marginBottom: 15}}>
          <Text style={styles.sectionTitle}>Today's Connections</Text>
          <FlatList
            data={todayTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text>{item.text}</Text>
              </View>
            )}
          />
        </View>
      )}

      {weekTasks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>This Week</Text>
          <FlatList
            data={weekTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text>{item.text} ({format(item.date, "EEEE")})</Text>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ An Event</Text>
      </TouchableOpacity>

      {/* Modal for Adding Events */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>
            <TextInput
              placeholder="Event description"
              value={newEvent}
              onChangeText={setNewEvent}
              style={styles.input}
            />
            <Text>Select Date:</Text>
            <DateTimePicker
                style={{marginLeft: -10, marginTop: 5}}
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                }}
            />
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity onPress={addEvent} style={styles.confirmButton}>
                    <Text style={{color: 'white'}}>Add Event</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{...styles.confirmButton, backgroundColor: '#f55167'}}>
                    <Text style={{color: 'white'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
           
          </View>
        </View>
      </Modal>
    </View>
    <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    backgroundColor: "#E6DAF0",
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#E6DAF0",
    borderRadius: 5,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#5C4387",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 15,
    width: '47%',
    marginRight: '6%',
    alignItems: 'center'
  },
});
