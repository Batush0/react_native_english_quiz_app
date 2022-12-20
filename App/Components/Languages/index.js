import { useEffect, useState } from "react";
import { AsyncStorage, ScrollView, View, Text } from "react-native";
import Loading from "../Loading";
import setAccessToken from "../../utils/setAccessToken";
import style from "./style";

module.exports = (props) => {
  const [languages, setLanguages] = useState();

  async function getLanguages() {
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
        setLanguages(data);
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
  }, []);

  if (!languages) return <Loading />;

  function handleSubmit(language) {
    props.navigation.navigate("chapters", { language: language });
    // AsyncStorage.setItem("language", language);
  }

  const langs = languages.map((_lang) => (
    <Language lang={_lang} handleSubmit={handleSubmit} />
  ));

  return (
    <View>
      <ScrollView style={style.scrollView}>{langs}</ScrollView>
    </View>
  );
};

const Language = ({ lang, handleSubmit }) => {
  const language = lang.charAt(0).toUpperCase() + lang.slice(1);
  return (
    <View
      onTouchStart={() => {
        handleSubmit(lang);
      }}
      style={style.languageContainer}
    >
      <Text style={style.languageText}>{language}</Text>
    </View>
  );
};
