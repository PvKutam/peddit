import { Text, View,ScrollView, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import UserProfile from "../../../Components/UserProfile";
import ConnectionRequest from "../../../Components/ConnectionRequest";
import { useRouter } from "expo-router";
const Index = () => {
  const [userid, setUserid] = useState("");
  const [user, setUser] = useState();
  const router= useRouter()

  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);

  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authtoken");
      // console.log(token);

      if (token) {
        try {
          const response = await axios.post(`${BaseUrl}/decode-token`, {
            token,
          });
          // console.log("resp is",response.data);

          if (
            response.data &&
            response.data.decoded &&
            response.data.decoded.id
          ) {
            setUserid(response.data.decoded.id);
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
    if (userid) {
      fecthUserProfile();
    }
  }, [userid]);
  const fecthUserProfile = async () => {
    try {
      const resp = await axios.get(`${BaseUrl}/profile/${userid}`);
      const userData = resp.data.user;
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [userid]);
  const fetchUser = async () => {
      await axios
        .get(`${BaseUrl}/users/${userid}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    if (userid) {
      fetchFriendReq();
    }
  }, [userid]);
  const fetchFriendReq = async () => {
    try {
      const Resp = await axios.get(`${BaseUrl}/connection-req/${userid}`);
      
      if (Resp.status === 200) {
        const connectionRequestData = Resp.data.map((req) => ({
          _id: req._id,
          name: req.name,
          email: req.email,
          profileimage: req.profileimage,
        }));
        setConnectionRequests(connectionRequestData);
      }
    } catch (error) {
      console.log("Error is", error);
    }
  };
  
  // console.log(users);
  return (
    <ScrollView style={{flex:1,backgroundColor:'white'}}>
        <Pressable onPress={()=>{
          router.push("/network/connections")
        }} style={{marginTop:10,marginHorizontal:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
            <Text style={{fontSize:18,fontWeight:"600"}}>Manage My Network</Text>
            <AntDesign name="arrowright" size={22} color="black" />
        </Pressable>
      <View
        style={{borderColor:"#E0E0E0",borderWidth:2,marginVertical:10}}/>
        <View style={{marginTop:10,marginHorizontal:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
          <Text style={{fontSize:18,fontWeight:"600"}}>Invetations (0)</Text>
          <AntDesign name="arrowright" size={22} color="black" />
        </View>
        <View
        style={{borderColor:"#E0E0E0",borderWidth:2,marginVertical:10}}/>
        <View>
          {connectionRequests?.map((item,index)=>{
            return <ConnectionRequest item={item} key={index} connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests} userid={userid}/>
          })}
        </View>
        <View style={{marginHorizontal:15}}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}><Text>Grow Your Network faster</Text>
          <Entypo name="cross" size={24} color="black" />
          </View>
        <Text>Find and contact the right people</Text>
        <View style={{backgroundColor:"#FF5700",width:140,paddingHorizontal:10, paddingVertical:5,borderRadius:25,marginTop:8}}>
          <Text style={{textAlign:"center",color:'white',fontWeight:"600"}}>Try premium</Text> 
        </View>
        </View>
       <FlatList data={users} 
       columnWrapperStyle={{justifyContent:'space-between'}}
       numColumns={2}
       keyExtractor={item => item._id}
       renderItem={({ item }) => <UserProfile item={item} userid={userid} />} />
    </ScrollView>
  );
};


export default Index;
