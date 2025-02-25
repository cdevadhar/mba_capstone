import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSegments } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const segments = useSegments();

  return (
    <View style={{
      width: "100%",
      position: "absolute", 
      bottom: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 20,
      backgroundColor: "white",
      borderTopWidth: 1,
      borderColor: "#ccc",
    }}>
      <TouchableOpacity style={{alignItems: "center"}} onPress={() => {
        if (segments.length>0) router.replace("/");
      }}>
        <Feather name="home" size={24} color={segments[0] ? "black" : "purple"} />
        <Text style={{fontWeight: 'bold'}}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems: "center"}} onPress={() => {
        if (!segments || segments[0]!="Tribe") router.replace("/Tribe");
      }}>
        <Feather name="users" size={24} color={segments[0]=="Tribe" ? "purple" : "black"} />
        <Text style={{fontWeight: 'bold'}}>Tribe</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems: "center"}} onPress={() => {
        if (!segments || segments[0]!="Connect") router.replace("/Connect");
      }}>
        <Feather name="message-circle" size={24} color={segments[0]=="Connect" ? "purple" : "black"} />
        <Text style={{fontWeight: 'bold'}}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}