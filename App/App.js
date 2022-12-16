import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import style from "./style";
// import Menu from "./Menu";
import Chapters from "./Components/Chapters";
import Questions from "./Components/Questions";
const Stack = createNativeStackNavigator();
// import Question from "./Questions/Question";
import Auth from "./Components/Auth";
import Languages from "./Components/Languages";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth" component={Auth} />
        <Stack.Screen name="chapters" component={Chapters} />
        <Stack.Screen name="questions" component={Questions} />
        <Stack.Screen name="languages" component={Languages} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
