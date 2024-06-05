import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const home = () => {
  const router = useRouter();
const Logout =async()=>{
  try {
    await AsyncStorage.removeItem('authtoken');
    router.replace("(authenticate)/login");
  } catch (err) {
    console.error('Error removing token:', err);
  }
}
  return (
    <View>
      <Text>home</Text>
      <Pressable style={{padding:10,backgroundColor:'orange',width:80,margin:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}
      onPress={Logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}
export default home
