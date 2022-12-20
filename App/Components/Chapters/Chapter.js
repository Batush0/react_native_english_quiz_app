import {
  View,
  Image,
  Text,
  ProgressBarAndroid,
  Button,
  AsyncStorage,
} from "react-native";
import style from "./style";
import color from "../../style";

export default ({ completed, name, id, navigation, route_params }) => {
  const onTouchStart = () => {
    // AsyncStorage.setItem("chapter", name);
    navigation.navigate("questions", { ...route_params, chapter_id: id });
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

      {/* 
      impoertant!
      API'deki chapter özel accuracy hesaplama sorunu çözüldükten sonra açılacak
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={completed}
        style={style.progress}
        color={color.secondary}
      /> */}
    </View>
  );
};
