import { Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable,} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import favicon from "../../assets/favicon.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const CheckLogin = async () => {
      try {
        const authtoken = await AsyncStorage.getItem("authtoken");
        if (authtoken) {
          router.replace("(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    CheckLogin();
  }, []);
  const port = process.env.EXPO_PUBLIC_API_URL;
  const login = async () => {
    const user = {
      email: email,
      password: password,
    };
    await axios.post(`${port}/login`, user).then((resp) => {
      console.log(resp);
      const token = resp.data.token;
      AsyncStorage.setItem("authtoken", token);
      router.push("(tabs)/home");
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Image
          styles={{ width: 150, height: 150, resizeMode: "contain" }}
          source={favicon}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignContent: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "black",
            }}
          >
            Login into your account
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
                marginLeft: 10,
              }}
              placeholder="Enter your Email"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
                marginLeft: 10,
              }}
              placeholder="Enter your Password"
            />
          </View>
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged in</Text>

            <Text style={{ color: "#007fff", fontWeight: "500" }}>
              Forget Password
            </Text>
          </View>
          <View style={{ marginTop: 80 }} />
          <Pressable
            onPress={login}
            style={{
              width: 200,
              backgroundColor: "#0072b1",
              borderRadius: 6,
              marginHorizontal: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default login;