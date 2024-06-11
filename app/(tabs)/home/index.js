import {
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import moment from "moment";

const home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [posts, setPost] = useState([]);
  const[isLiked,setIsLiked]= useState(false)
  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);
  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;


  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `${BaseUrl}/like/${postId}/${userId}`
      );
      console.log(response.data);
      if (response.status === 200) {
        const updatedPost = response.data.post;
        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("Error liking/unliking the post", error);
    }
  };

  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };

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
  const fecthUserProfile = async () => {
    try {
      const resp = await axios.get(`${BaseUrl}/profile/${userId}`);
      const userData = resp.data.user;
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchallpost = async () => {
      try {
        const resp = await axios.get(`${BaseUrl}/all`);
        setPost(resp.data);
       
      } catch (error) {
        console.log("Error fetching all posts:", error);
      }
    };
    fetchallpost();
  }, []);
  
  // console.log(user);
  const Logout = async () => {
    try {
      await AsyncStorage.removeItem("authtoken");
      router.replace("(authenticate)/login");
    } catch (err) {
      console.error("Error removing token:", err);
    }
  };
  return (
    <ScrollView>
      <View
        style={{
          padding: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable onPress={()=>{router.push("/home/profile")}}>
          <Image
            style={{ width: 40, height: 40, borderRadius: 15 }}
            source={{ uri: user?.profileimage }}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 5,
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

      <View>
        {posts.map((post, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
              key={index}
            >
              <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={{ uri: post?.user?.profileimage }}
              />

              <View>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  {post?.user?.name}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    width: 230,
                    color: "gray",
                    fontSize: 15,
                    fontWeight: "400",
                  }}
                >
                  Engineer Graduate | Front-end Dev
                </Text>
                <Text style={{ color: "gray" }}>
                  {moment(post.createdAt).format("MMMM Do YYYY")}
                </Text>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />

                <Feather name="x" size={20} color="black" />
              </View>
            </View>
            <View
              style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}
            >
              <Text
                style={{ fontSize: 15 }}
                numberOfLines={showfullText ? undefined : MAX_LINES}
              >
                {post?.description}
              </Text>
              {!showfullText && (
                <Pressable onPress={toggleShowFullText}>
                  <Text>See more</Text>
                </Pressable>
              )}
            </View>

            <Image
              style={{ width: "100%", height: 240 }}
              source={{ uri: post?.imageurl }}
            />


            {post?.likes?.length > 0 && (
             
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                <Text style={{ color: "gray" }}>{post?.likes?.length}</Text>
              </View>
            )}

            <View
              style={{
                height: 2,
                borderColor: "#E0E0E0",
                borderWidth: 2,
                marginHorizontal: 15,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <Pressable onPress={() => handleLikePost(post?._id)}>
                <AntDesign
                  style={{ textAlign: "center" }}
                  name="like2"
                  size={24}
                  color={ "gray"}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "gray",
                    marginTop: 2,
                  }}
                >
                  Like
                </Text>
              </Pressable>
              <Pressable>
                <FontAwesome
                  name="comment-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Comment
                </Text>
              </Pressable>
              <Pressable>
                <Feather
                  name="repeat"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  repost
                </Text>
              </Pressable>
              <Pressable>
                <Feather name="send" size={20} color="gray" />
                <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* <Text>home</Text>
      <Pressable style={{padding:10,backgroundColor:'orange',width:80,margin:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}
      onPress={Logout}>
        <Text>Logout</Text>
      </Pressable> */}
    </ScrollView>
  );
};
export default home;
