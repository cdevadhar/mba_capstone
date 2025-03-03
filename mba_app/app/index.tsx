import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from '@/components/bottomNav';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

interface Event {
  text: string;
  date: Date;
  isReminder: boolean;
  memberId: string | null;
  completed: boolean;
}

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Event[]>([]);
  const [gotData, setGotData] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem("onboardingCompleted");
      if (!hasSeenOnboarding) {
        router.replace("/Welcome"); // Redirect to onboarding screen
        return;
      }
      setLoading(false);
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    async function getData() {
        console.log("calling function");
        if (gotData) return;
        const memberIds = (await AsyncStorage.getAllKeys()).filter(key=>key!=='onboardingCompleted' && key!=='events');
        const members = (await AsyncStorage.multiGet(memberIds)).map(pair=>JSON.parse(pair[1] || ''));
        let temp = [...tasks];
        for (const member of members) {
            const reminderDate = new Date(member['next_reminder']);
            const newTask = {"text": "Connection reminder: "+member["name"], date: reminderDate, isReminder: true, memberId: member["id"], completed: false};
            temp.push(newTask);
        }
        const existingEvents = await AsyncStorage.getItem('events');
        let existingArr;
        if (existingEvents==null) existingArr = [];
        else existingArr = JSON.parse(existingEvents);
        for (const event of existingArr) {
          event.date = new Date(event.date);
        }
        for (const event of existingArr) temp.push(event);
        temp = temp.filter(event => new Date().toDateString() === event.date.toDateString());

        setTasks(temp);
        setGotData(true);
    }
    getData();
    
  }, [])

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
            else {
                const existingEvents = await AsyncStorage.getItem('events');
                let existingArr = JSON.parse(existingEvents || '');
                for (let j=0; j<existingArr.length; j++) {
                    if (existingArr[j].text===completed.text) existingArr[j].completed = true;
                }
                await AsyncStorage.setItem('events', JSON.stringify(existingArr));
            }
            break;
        }
    }
    setTasks(temp);
  }

  if (loading) return null; // Prevent rendering until check is done

  return (
    <View style={{flex: 1}}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Card */}
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Avatar.Text size={40} label="HH" />
          <View style={styles.textContainer}>
            <Text style={styles.userName}>Hal Hershfield</Text>
            <Text style={styles.streakText}>3 Week Full Cup Streak</Text>
          </View>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} // Replace with cup icon
            style={styles.cupIcon}
          />
        </View>
      </Card>

      {/* Avatar Section */}
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Replace with cup avatar
        style={styles.avatarImage}
      />

      {/* Today's Tasks Section */}
      {tasks.length > 0 && (
        <View style={{marginBottom: 15, width: "100%"}}>
          <Text style={styles.sectionTitle}>Today's Reminders</Text>
          <FlatList
            scrollEnabled={false}
            data={tasks}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                  <Text>{item.text}</Text>
                  <TouchableOpacity onPress={()=>completeTask(item)}><Feather name={item.completed ? 'check-square' : 'square'} size={18}></Feather></TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      {/* Badges Section */}
      <Text style={styles.sectionTitle}>Your Badges</Text>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>Start a Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>5 Week Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>10 Week Streak</Text>
        </View>
      </View>

      {/* Gift Badges */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>1 Occasion</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>5 Occasions</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://www.nicepng.com/png/detail/621-6216127_simple-crown-clip-art.png" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>10 Occasions</Text>
        </View>
      </View>

    </ScrollView>
    <BottomNav></BottomNav>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  streakText: {
    fontSize: 14,
    color: "gray",
  },
  cupIcon: {
    width: 40,
    height: 40,
  },
  sectionTitle: {
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center'
  },
  avatarImage: {
    width: 120,
    height: 120,
    marginTop: 30,
    backgroundColor: 'green',
    borderRadius: 10
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  badge: {
    alignItems: "center",
  },
  badgeIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 5
  },
  taskItem: {
    padding: 15,
    backgroundColor: "#E6DAF0",
    marginVertical: 5,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: "100%"
  },
});

export default ProfileScreen;
