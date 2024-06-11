import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons, AntDesign, Entypo, Feather } from "@expo/vector-icons";

const profile = () => {
  const [userId, setUserId] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [userDescription, setUserDescription] = useState("");
  const [user, setUser] = useState();
  const router = useRouter();
  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authtoken");
      if (token) {
        try {
          const response = await axios.post(`${BaseUrl}/decode-token`, {
            token,
          });

          if (
            response.data &&
            response.data.decoded &&
            response.data.decoded.id
          ) {
            setUserId(response.data.decoded.id);
          } else {
            console.error("Invalid response format", response.data);
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fecthUserProfile();
    }
  }, [userId]);

  const handleSaveDescription = async () => {
    try {
      const response = await axios.put(`${BaseUrl}/profile/${userId}`, {
        userDescription,
      });

      if (response.status === 200) {
        await fecthUserProfile();

        setIsEditing(false);
      }
    } catch (error) {
      console.log("Error saving user description", error);
    }
  };
  const fecthUserProfile = async () => {
    try {
      const resp = await axios.get(`${BaseUrl}/profile/${userId}`);
      const userData = resp.data.user;
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("user is ", user);

  const Logout = async () => {
    try {
      await AsyncStorage.removeItem("authtoken");
      router.replace("(authenticate)/login");
    } catch (err) {
      console.error("Error removing token:", err);
    }
  };

  return (
    <View>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable>
          <Image
            style={{ width: 30, height: 30, borderRadius: 15 }}
            source={{ uri: user?.profileimage }}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 30,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>

        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>

      <Image
        style={{ width: "100%", height: 130 }}
        source={{
          uri: "https://static.vecteezy.com/system/resources/previews/004/493/315/large_2x/white-orange-and-red-gradient-background-free-photo.jpg",
        }}
      />

      <View style={{ position: "absolute", top: 130, left: 10 }}>
        <Image
          style={{ width: 120, height: 120, borderRadius: 60 }}
          source={{ uri: user?.profileimage }}
        />
      </View>

      <View
        style={{
          marginTop: 80,
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems:"center"
        }}
      >
        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>{user?.name}</Text>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text>{user?.userDescription ? "Edit" : "Add Bio"}</Text>
          </Pressable>
        </View>
        <View>
          <Text style={{ marginTop: 12, fontWeight: "500", fontSize: 15 }}>
            Youtube • Linkedin Member
          </Text>
          <Text style={{ fontSize: 15, color: "gray" }}>
            Bengaluru, Karnataka, India
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 12,
              marginHorizontal: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: "#FF5700",
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 25,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Open to
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#FF5700",
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 25,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Add Section
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View>
        {isEditing ? (
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 80,
                marginBottom:40,
              }}
            >
              <TextInput
                placeholder="enter your description"
                value={userDescription}
                onChangeText={(text) => setUserDescription(text)}
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  width: 300,
                  height: 50,
                }}
              />

              <Pressable
                onPress={handleSaveDescription}
                style={{
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#FF5700", // Orange color
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text>{user?.userDescription}</Text>
        )}
      </View>

      <View style={{ marginHorizontal: "auto", marginTop: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Analytics</Text>
        <Text style={{ fontSize: 15, color: "gray", marginTop: 2 }}>
          Private to you
        </Text>

        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Ionicons name="people" size={28} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              350 profile views
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              Discover who's viewed your profile
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Entypo name="bar-graph" size={24} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              1242 post Impressions
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              Checkout who's engaing with your posts
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Feather name="search" size={24} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              45 post appearenced
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              see how often you appear in search results
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={{
          padding: 10,
          backgroundColor: "#FF5700",
          width: 80,
          margin: 20,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={Logout}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default profile;
