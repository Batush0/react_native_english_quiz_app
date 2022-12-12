import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Chapter from "./Chapter";
import style from "./style";

export default ({ navigation }) => {
  const [chapters, setChapters] = useState([]);

  const getChapters = async () => {
    const response = await fetch("http://10.0.2.2:8080/chapters");
    const data = await response.json();
    setChapters(data);
  };

  useEffect(() => {
    getChapters();
  }, []);
  const _chapters = chapters.length ? (
    chapters.map((chapter) => (
      <Chapter
        completed={chapter.completed}
        name={chapter.chapter_ad}
        id={chapter.chapter_id}
        navigation={navigation}
      />
    ))
  ) : (
    <Text>Yükleniyor ...</Text>
  );
  return (
    <View style={style.view}>
      <ScrollView
        contentContainerStyle={style.scroll}
        showsVerticalScrollIndicator={false}
      >
        {_chapters}
      </ScrollView>
    </View>
  );
};
