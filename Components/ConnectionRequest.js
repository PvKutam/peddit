import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";

import { Feather } from "@expo/vector-icons";

const ConnectionRequest = ({
  item,
  connectionRequests,
  setConnectionRequests,
  userid,
}) => {
  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;
  const acceptConnection = async (requestid) => {
    console.log( "request sender id is",requestid,);
    console.log( "request reciver id is loggedin user",userid,);
    try {
      const response = await fetch(`${BaseUrl}/connection/accept`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          senderid: requestid,   
          receiverid: userid,  
        }),
      });
      if (response.ok) {
        setConnectionRequests(
          connectionRequests.filter((req) => req._id !== requestid)
        );
      }
    } catch (error) {
      console.log("Error connection request", error);
    }
  };
  return (
    <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item.profileimage }}
        />
        <Text style={{ width: 200 }}>{item.name} is Inviting to connect</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="x" size={24} color="black" />
          </View>
          <Pressable
            onPress={() => acceptConnection(item._id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="check" size={24} color="#0072b1" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

