import {
  View,
  Image,
  Text,
  ProgressBarAndroid,
  Button,
  AsyncStorage,
} from "react-native";
import style from "./style";

export default ({
  accurQuestionCount,
  totalQuestionCount,
  name,
  id,
  navigation,
  route_params,
}) => {
  const onTouchStart = () => {
    navigation.navigate("questions", { ...route_params, chapter_id: id });
  };
  return (
    <View
      style={style.chapterWrapper}
      onTouchStart={() => {
        onTouchStart();
      }}
    >
      <Text style={style.chapterTitle}>{name}</Text>
      <View style={style.chapterBottomThing}>
        <View style={style.chapterCompletionWrapper}>
          <Text
            style={style.chapterAccurT}
          >{`${accurQuestionCount} / ${totalQuestionCount}`}</Text>
          <View style={style.chapterBar}>
            <View
              style={{
                backgroundColor: "#D9D9D9",
                height: "100%",
                width: `${accurQuestionCount / (totalQuestionCount / 100)}%`,
              }}
            ></View>
          </View>
        </View>
        <View style={style.travelArrow}>
          <Text style={style.travelArrowT}>➜</Text>
        </View>
      </View>
    </View>
  );
};
/* 
      impoertant!
      API'deki chapter özel accuracy hesaplama sorunu çözüldükten sonra açılacak
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={completed}
        style={style.progress}
        color={color.secondary}
      /> */
