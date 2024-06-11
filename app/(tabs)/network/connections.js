import {  Image, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import { Entypo } from '@expo/vector-icons';

const connections = () => {
  const BaseUrl = process.env.EXPO_PUBLIC_API_URL;

  const [connections,setConnections] = useState([])

  const [userid,setUserid]= useState("")

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
    if(userid){
      fetchConnections();
    }
   
  },[userid])
  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/connectionList/${userid}`);
      // console.log(response.data.Connection);
      setConnections(response.data.Connection);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userid);
  console.log(connections);
  return (
    <View style={{flex:1,bacgroundColor:"white"}}>
      <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between",marginHorizontal:12,marginTop:20}}>
      <Text style={{fontWeight:"500"}}>Connections</Text>
      <View style={{flexDirection:"row",alignItems:"center",gap:10}}>
      <Feather name="search" size={24} color="black" />
      <Ionicons name="reorder-three-outline" size={24} color="black" />
      </View> 
      </View>
      <View style={{height:2,borderColor:"#E0E0E0",borderWidth:2,marginTop:12}} />
      <View style={{marginHorizontal:10, marginTop:10}}>
        {connections.map((item,index) => (
            <View  key= {index} style={{flexDirection:"row",alignItems:"center",gap:10,marginVertical:10}}>
              <Image source={{uri:item?.profileimage}} style={{width:50,height:50,borderRadius:25}} />
              <View style={{flexDirection:"column",gap:2,flex:1}}>
                <Text style={{fontSize:15,fontWeight:"500"}}>{item?.name}</Text>
                <Text style={{color:"gray"}}>Btech | Information Technology</Text>
                <Text style={{color:"gray"}}> Connected on {moment(item?.createdAt).format("MMMM Do YYYY")}</Text>
                {/* <Text>Test</Text> */}
                </View>

                <View style={{flexDirection:"row", alignItems:"center",gap:8}}>
                <Entypo name="dots-three-vertical" size={20} color="black" />
                   </View>
              </View>        
       ))}

      </View>
    </View>
  )
} 
export default connections  