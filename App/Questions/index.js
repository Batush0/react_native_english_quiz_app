import { View, Text, ScrollView } from "react-native";
import Question from "./Question";
import style from "./style";
module.exports = ({ navigator }) => {
  return (
    // <ScrollView style={style.scroll}>
    <Question quesion={"bir berber bir berbere gidince ne demiş ? "} />
    // </ScrollView>
  );
};
