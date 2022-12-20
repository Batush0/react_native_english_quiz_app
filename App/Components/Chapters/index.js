import { useEffect, useState } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import setAccessToken from "../../utils/setAccessToken";
import Chapter from "./Chapter";
import style from "./style";
import Loading from "../Loading";

export default ({ navigation, route }) => {
  const [chapters, setChapters] = useState();

  const getChapters = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${await AsyncStorage.getItem("access_token")}`
    );
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `http://10.0.2.2:8080/chapters?language=${
        route.params.language
      }&username=${await AsyncStorage.getItem("username")}`,
      requestOptions
    );

    response
      .json()
      .then((chapters) => {
        setChapters(chapters);
      })
      .catch((e) => {
        if (response.status == 403) {
          setAccessToken(props.navigation).then(() => {
            getChapters();
          });
        }
      });
  };

  useEffect(() => {
    getChapters();
  }, []);

  if (!chapters) return <Loading />;

  const _chapters = chapters.map((chapter) => (
    <Chapter
      completed={chapter.completed}
      name={chapter.chapter_ad}
      id={chapter.chapter_id}
      navigation={navigation}
      route_params={route.params}
    />
  ));

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
