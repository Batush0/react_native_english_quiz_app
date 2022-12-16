import { useEffect, useState } from "react";
import { AsyncStorage, ScrollView, View } from "react-native";
import Loading from "../Loading";
import setAccessToken from "../../utils/setAccessToken";

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
        console.log(data);
        setLanguages(data);
      })
      .catch(async (error) => {
        if (response.status == 403) {
          setAccessToken(props.navigation);
        }
      });
  }

  useEffect(() => {
    getLanguages();
  }, []);

  if (!languages) return <Loading />;

  return (
    <View>
      <ScrollView>
        <View
          style={{ width: 200, height: 400, backgroundColor: "black" }}
          onTouchStart={() => {
            getLanguages();
          }}
        ></View>
      </ScrollView>
    </View>
  );
};
