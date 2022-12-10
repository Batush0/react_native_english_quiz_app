import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import style from "./style";
// import Menu from "./Menu";
import Chapters from "./Chapters";
import Questions from "./Questions";
const Stack = createNativeStackNavigator();
import Question from "./Questions/Question";

export default function App() {
  return (
    /**
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="chapters" component={Chapters} />
        <Stack.Screen name="questions" component={Questions} />
      </Stack.Navigator>
    </NavigationContainer>
     */
    <Question />
  );
}
