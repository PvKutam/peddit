import { Text, View, Image, Dimensions, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = ({ item, userid }) => {
  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;
  const [connectionSent, setConnectionSent] = useState(false);
  const [connectionRequest, setConnectionRequest] = useState([]);

  const sendConnectionRequest = async (userid, friendid) => {
    try {
      if (!userid || !friendid) {
        throw new Error("Invalid user or friend id");
      }
      const resp = await fetch(`${BaseUrl}/connection-req`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          currentUserID: userid,
          selectedUserID: friendid,
        }),
      });
      if (resp.ok) {
        setConnectionSent(true);
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };
 

  return (
    <View
      style={{
        borderRadius: 9,
        marginHorizontal: 16,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        marginVertical: 10,
        justifyContent: "center",
        height: Dimensions.get("window").height / 4,
        width: (Dimensions.get("window").width - 80) / 2,
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 45,
            resizeMode: "cover",
          }}
          source={{ uri: item.profileimage }}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          {item?.name}
        </Text>
        <Text style={{ textAlign: "center", marginLeft: 1, marginTop: 2 }}>
          Product Designer
        </Text>
        <Pressable
          onPress={() => sendConnectionRequest(userid, item._id)}
          style={{
            margin: "auto",
            borderColor:
              connectionSent || item?.connectionsrequests?.includes(userid)
                ? "gray"
                : "#0072b1",
            borderWidth: 1,
            borderRadius: 25,
            marginTop: 7,
            paddingHorizontal: 15,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              color:
                connectionSent || item?.connectionsrequests?.includes(userid)
                  ? "gray"
                  : "#0072b1",
            }}
          >
            {connectionSent || item?.connectionsrequests?.includes(userid)
              ? "Pending"
              : "Connect"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserProfile;
