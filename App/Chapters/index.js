import { View, Text, ScrollView } from "react-native";
import Chapter from "./Chapter";
import style from "./style";

export default ({ navigation }) => {
  return (
    <View style={style.view}>
      <ScrollView
        contentContainerStyle={style.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Chapter
          completed={0.9}
          name={"asaaaaaaaaaaaaaaaad"}
          id={1}
          navigation={navigation}
        />
      </ScrollView>
    </View>
  );
};

const getChapters = () => {};
