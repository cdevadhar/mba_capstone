import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isToday, isThisWeek, compareAsc } from "date-fns";
import BottomNav from "@/components/bottomNav";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: "1", text: "Call Mom", date: new Date() },
    { id: "2", text: "Coffee with Dru", date: new Date(new Date().setDate(new Date().getDate() + 2)) },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addEvent = () => {
    if (newEvent.trim() === "") return;
    setTasks([...tasks, { id: Date.now().toString(), text: newEvent, date }].sort((a, b) => compareAsc(a.date, b.date)));
    setNewEvent("");
    setModalVisible(false);
  };

  const todayTasks = tasks.filter((task) => isToday(task.date));
  const weekTasks = tasks.filter((task) => isThisWeek(task.date, { weekStartsOn: 1 }) && !isToday(task.date));
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text>Select Date: {format(date, "PPP")}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <Button title="Add" onPress={addEvent} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
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
});
