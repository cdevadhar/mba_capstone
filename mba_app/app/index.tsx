import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from '@/components/bottomNav';
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Avatar, Card } from "react-native-paper";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
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

      {/* Badges Section */}
      <Text style={styles.sectionTitle}>Today's Reminders</Text>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>Start a Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>5 Week Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>10 Week Streak</Text>
        </View>
      </View>

      {/* Badges Section */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>Start a Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>5 Week Streak</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>10 Week Streak</Text>
        </View>
      </View>

      {/* Gift Badges */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>1 Occasion</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
          <Text style={{"marginTop": 10}}>5 Occasions</Text>
        </View>
        <View style={styles.badge}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.badgeIcon} />
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
});

export default ProfileScreen;
