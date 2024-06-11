  import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    TextInput,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Entypo } from "@expo/vector-icons";
  import { MaterialIcons } from "@expo/vector-icons";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import axios from "axios";
  import * as ImagePicker from "expo-image-picker";
  import * as FileSystem from "expo-file-system";
  import { firebase } from "../../../firebase";
  import { useRouter } from "expo-router";

  const Index = () => {
    const BaseUrl = process.env.EXPO_PUBLIC_API_URL;
    const [description, setDescription] = useState("");
    const [userid, setUserID] = useState("");
    const [image, setImage] = useState("");
    const router = useRouter();
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
              setUserID(response.data.decoded.id);
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

    const createPost = async () => {
      try {
        const uploadUrl = await uploadFile();
        console.log('User ID:', userid);
        console.log('Description:', description);
  
        // Ensure description is a non-empty string
        if (typeof description !== 'string' || description.trim() === '') {
          throw new Error('Description is required and must be a non-empty string.');
        }
  
        const postData = {
          description: description,
          imageUrl: uploadUrl,
          userId: userid,
        };
  
        const response = await axios.post(`${BaseUrl}/createpost`, postData);
        console.log("Post created successfully:", response.data);
        if (response.status === 201) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log("error creating post", error);
      }
    };
    const uploadFile = async () => {
      try {
        console.log("Image URI:", image);

        const { uri } = await FileSystem.getInfoAsync(image);

        if (!uri) {
          throw new Error("Invalid file URI");
        }

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = (e) => {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });

        const filename = image.substring(image.lastIndexOf("/") + 1);

        const ref = firebase.storage().ref().child(filename);
        await ref.put(blob);

        const downloadURL = await ref.getDownloadURL();
        return downloadURL;
      } catch (error) {
        console.log("Error:", error);
      }
    };
    const pickimage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop:30
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Entypo name="circle-with-cross" size={24} color="black" />
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={{
                  uri: "https://res.cloudinary.com/dwoizmsqg/image/upload/v1714125375/samples/upscale-face-1.jpg",
                }}
              />
              <Text style={{ fontWeight: "bold" }}>Anyone</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Entypo name="back-in-time" size={24} color="black" />
            <Pressable
              onPress={createPost}
              style={{
                padding: 10,
                backgroundColor: "#FF5700",
                width: 80,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Post
              </Text>
            </Pressable>
          </View>
        </View>

        <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="What do you want to talk about"
        placeholderTextColor={"black"}
        style={{
          marginHorizontal: 10,
          fontSize: 15,
          fontWeight: "500",
          marginTop: 10,
        }}
        multiline={true}
        numberOfLines={10}
        textAlignVertical={"top"}
      />

        <View>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 240, marginVertical: 20 }}
            />
          )}
        </View>
        <Pressable
          style={{
            flexDirection: "column",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Pressable
            onPress={pickimage}
            style={{
              width: 40,
              height: 40,
              marginTop: 12,
              backgroundColor: "#E0E0E0",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="perm-media" size={24} color="black" />
          </Pressable>
          <Text>Media</Text>
        </Pressable>
      </ScrollView>
    );
  };

  export default Index;
