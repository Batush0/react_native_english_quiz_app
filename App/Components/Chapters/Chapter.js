import { View, Image, Text, ProgressBarAndroid, Button } from "react-native";
import style from "./style";
import color from "../../style";

export default ({ completed, name, id, navigation }) => {
  const onTouchStart = () => {
    navigation.navigate("questions", { chapter_id: id });
  };

  return (
    <View
      style={style.chapter}
      onTouchStart={() => {
        onTouchStart();
      }}
    >
      <Image
        source={require("../../Media/empty_image.jpg")}
        style={style.image}
      ></Image>
      <Text style={style.text}>{name}</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={completed}
        style={style.progress}
        color={color.secondary}
      />
    </View>
  );
};
