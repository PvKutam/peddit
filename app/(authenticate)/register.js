import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import favicon from "../../assets/favicon.png";
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const port = process.env.EXPO_PUBLIC_API_URL;

  const handleRegister = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
      profileimage: image,
    };
    await axios
      .post(`${port}/register`, user)
      .then((resp) => {
        console.log(resp);
        Alert.alert(
          "Registration Successfull",
          "You have been registered successfully"
        );
        setName("");
        setEmail("");
        setImage("");
        setPassword("");
      })
      .catch((err) => {
        Alert.alert("Registration Failed", "Something went wrong");
        console.log("Registration Failed", err);
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
            Register into your account
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
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
                marginLeft: 10,
              }}
              placeholder="Enter your Name"
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
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
                marginLeft: 10,
              }}
              placeholder="Enter your email"
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
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
                marginLeft: 10,
              }}
              placeholder="Enter your Image Url"
            />
          </View>
          <View style={{ marginTop: 80 }} />
          <Pressable
            onPress={handleRegister}
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
              Register
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account?
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
