import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isToday, isThisWeek, compareAsc } from "date-fns";
import BottomNav from "@/components/bottomNav";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from "@expo/vector-icons";

interface Event {
    text: string;
    date: Date;
    isReminder: boolean;
    memberId: string | null;
    completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Event[]>([
    { text: "Call Mom", date: new Date(), isReminder: false, memberId: null, completed: false},
    { text: "Coffee with Dru", date: new Date(new Date().setDate(new Date().getDate() + 2)), isReminder: false, memberId: null, completed: false},
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [date, setDate] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [gotData, setGotData] = useState<boolean>(false);

  const addEvent = () => {
    if (newEvent.trim() === "") return;
    setTasks([...tasks, {text: newEvent, date, isReminder: false, memberId: null, completed: false}].sort((a, b) => compareAsc(a.date, b.date)));
    setNewEvent("");
    setModalVisible(false);
  };

  const completeTask = async(completed: Event) => {
    let temp = [...tasks];
    for (let i=0; i<temp.length; i++) {
        if (temp[i].text===completed.text) {
            temp[i].completed = true;
            if (temp[i].isReminder) {
                // have to set up the next reminder
                if (temp[i].memberId==null) return;
                const member = JSON.parse((await AsyncStorage.getItem(temp[i].memberId || '') || ''));
                const reminder = member['connection_reminder']
                const nextReminder = new Date(member['next_reminder']);
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
                member['next_reminder'] = nextReminder.getTime();
                await AsyncStorage.setItem(temp[i].memberId || '', JSON.stringify(member));
            }
            break;
        }
    }
    setTasks(temp);
  }
  let todayTasks = tasks.filter((task) => isToday(task.date));
  let weekTasks = tasks.filter((task) => isThisWeek(task.date, { weekStartsOn: 0 }) && !isToday(task.date)).sort((a, b) => a.date.getTime()-b.date.getTime());
  let laterTasks = tasks.filter((task) => !isThisWeek(task.date, {weekStartsOn: 0})).sort((a, b) => a.date.getTime()-b.date.getTime());

  useEffect(() => {
    todayTasks = tasks.filter((task) => isToday(task.date));
    weekTasks = tasks.filter((task) => isThisWeek(task.date, { weekStartsOn: 0 }) && !isToday(task.date)).sort((a, b) => a.date.getTime()-b.date.getTime());
    laterTasks = tasks.filter((task) => !isThisWeek(task.date, {weekStartsOn: 0})).sort((a, b) => a.date.getTime()-b.date.getTime());

  }, [tasks])


  useEffect(() => {
    async function getData() {
        if (gotData) return;
        const memberIds = (await AsyncStorage.getAllKeys()).filter(key=>key!=='onboardingCompleted');
        const members = (await AsyncStorage.multiGet(memberIds)).map(pair=>JSON.parse(pair[1] || ''));
        let temp = [...tasks];
        for (const member of members) {
            const reminderDate = new Date(member['next_reminder']);
            const newTask = {"text": "Connection reminder: "+member["name"], date: reminderDate, isReminder: true, memberId: member["id"], completed: false};
            temp.push(newTask);
        }
        setTasks(temp);
        setGotData(true);
    }
    getData();
    
  }, [])

  return (
    <View style={{flex: 1}}>
    <TouchableOpacity 
        style={{width: "100%", padding: 10, alignItems: 'center', backgroundColor: showCompleted ? '#f55167' : 'gray'}}
        onPress={()=>setShowCompleted(!showCompleted)}
    >
        <Text style={{width: "100%", textAlign: "center", fontSize: 16, color: 'white'}}>{showCompleted ? 'Hide Completed' : 'Show Completed'}</Text>
    </TouchableOpacity>
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      {((todayTasks.length > 0 && showCompleted) || (todayTasks.filter(task=>!task.completed).length>0)) && (
        <View style={{marginBottom: 15}}>
          <Text style={styles.sectionTitle}>Today's Connections</Text>
          <FlatList
            scrollEnabled={false}
            data={todayTasks}
            renderItem={({ item }) => (
                showCompleted || (!item.completed) ? 
                    <View style={styles.taskItem}>
                        <Text>{item.text}</Text>
                        <TouchableOpacity onPress={()=>completeTask(item)}><Feather name={item.completed ? 'check-square' : 'square'} size={18}></Feather></TouchableOpacity>
                    </View> : <></>
            )}
          />
        </View>
      )}

      {((weekTasks.length > 0 && showCompleted) || (weekTasks.filter(task=>!task.completed).length>0)) && (
        <View style={{marginBottom: 15}}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <FlatList
            scrollEnabled={false}
            data={weekTasks}
            renderItem={({ item }) => (
                showCompleted || (!item.completed) ? 
                    <View style={styles.taskItem}>
                        <Text>{item.text} ({format(item.date, "EEEE")})</Text>
                        <TouchableOpacity onPress={()=>completeTask(item)}><Feather name={item.completed ? 'check-square' : 'square'} size={18}></Feather></TouchableOpacity>
                    </View> : <></>
            )}
          />
        </View>
      )}

      {((laterTasks.length > 0 && showCompleted) || (laterTasks.filter(task=>!task.completed).length>0)) && (
        <>
          <Text style={styles.sectionTitle}>Later</Text>
          <FlatList
            scrollEnabled={false}
            data={laterTasks}
            renderItem={({ item }) => (
                showCompleted || (!item.completed) ? 
                    <View style={styles.taskItem}>
                        <Text>{item.text} ({format(item.date, "MMM d")})</Text>
                        <TouchableOpacity onPress={()=>completeTask(item)}><Feather name={item.completed ? 'check-square' : 'square'} size={18}></Feather></TouchableOpacity>
                    </View> : <></>
            )}
          />
        </>
      )}

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
    </ScrollView>
    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ An Event</Text>
    </TouchableOpacity>
    <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    maxHeight: "77%"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    backgroundColor: "#E6DAF0",
    marginVertical: 5,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  addButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
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
