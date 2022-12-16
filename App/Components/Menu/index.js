import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Text,
  View,
} from "react-native";
import style from "../../style";
export default () => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={{
          borderRadius:
            Math.round(
              Dimensions.get("window").width + Dimensions.get("window").height
            ) / 2,
          width: Dimensions.get("window").width * 0.5,
          height: Dimensions.get("window").width * 0.5,
          backgroundColor: "#f00",
          justifyContent: "center",
          alignItems: "center",
        }}
        underlayColor="#ccc"
        onPress={() => alert("Yaay!")}
      >
        <Text> Mom, look, I am a circle! </Text>
      </TouchableHighlight>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
