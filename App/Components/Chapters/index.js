import { useEffect, useState } from "react";
import { View, Text, ScrollView, AsyncStorage, Image } from "react-native";
import setAccessToken from "../../utils/setAccessToken";
import Chapter from "./Chapter";
import { SelectList } from "react-native-dropdown-select-list";
import style from "./style";
import Loading from "../Loading";

export default ({ navigation, route }) => {
  const [chapters, setChapters] = useState();
  const [languages, setLanguages] = useState();
  const [selectedLang, setSelectedLang] = useState();

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
        (await AsyncStorage.getItem("language")) || "english"
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

  async function getLanguages() {
    let storedLang = await AsyncStorage.getItem("language");
    if (storedLang) setSelectedLang(storedLang);
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${await AsyncStorage.getItem("access_token")}`
    );
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(
      `http://10.0.2.2:8080/languages?username=${await AsyncStorage.getItem(
        "username"
      )}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    );
    response
      .json()
      .then((data) => {
        setLanguages(
          data.map((_data) => {
            return { value: data };
          })
        );
      })
      .catch(async (error) => {
        if (response.status == 403) {
          setAccessToken(props.navigation).then(() => {
            getLanguages();
          });
        }
      });
  }

  useEffect(() => {
    getLanguages();
    getChapters();
  }, []);

  if (!chapters || !languages) return <Loading />;

  const _chapters = chapters.map((chapter) => (
    <Chapter
      name={chapter.chapter_ad}
      id={chapter.chapter_id}
      navigation={navigation}
      route_params={route.params}
      accurQuestionCount={chapter.accuracy}
      totalQuestionCount={chapter.questionCount}
    />
  ));
  return (
    <View style={style.viewPort}>
      <SelectList
        setSelected={(val) => {
          setSelectedLang(val[0]);
          AsyncStorage.setItem("language", val[0]);
        }}
        data={languages}
        save="value"
        boxStyles={style.boxStyles}
        search={false}
        dropdownTextStyles={style.dropdownTextStyles}
        dropdownItemStyles={style.dropdownItemStyles}
        dropdownStyles={style.dropdownStyles}
        placeholder={selectedLang ? selectedLang : "Bir dil seç"}
      />
      <Image style={style.logo} source={require("../../Assets/vulang.png")} />
      <View style={style.chapterContainer}>
        <ScrollView style={style.scrollView}>{_chapters}</ScrollView>
      </View>
    </View>
  );
};

/**
  <View style={style.view}>
    <ScrollView
      contentContainerStyle={style.scroll}
      showsVerticalScrollIndicator={false}
    >
      {_chapters}
    </ScrollView>
  </View>
   */
