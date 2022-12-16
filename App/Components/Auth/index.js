import { useEffect, useState } from "react";
import { Text, TextInput, View, AsyncStorage } from "react-native";
import style from "./style";

module.exports = function (props) {
  const [values, setValues] = useState({ username: null, password: null });
  const [process, setProcess] = useState("login");
  const [success, setSuccess] = useState(null);
  const [viewStyle, setViewStyle] = useState(style.view);

  const handleSubmit = async () => {
    const response = await fetch(
      `http://10.0.2.2:8081/${process}?username=${values.username}&password=${values.password}`,
      { method: process == "login" ? "PATCH" : "PUT" }
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.access_token) {
          AsyncStorage.setItem("username", values.username);
          AsyncStorage.setItem("access_token", data.access_token);
          AsyncStorage.setItem("refresh_token", data.refresh_token);
          setSuccess(true);
        }
      })
      .catch(() => {
        setSuccess(false);
      });
  };

  useEffect(() => {
    //success gelince (true veya false ise) view's style ayarlanacak bitince success null olacak
    if (success !== null)
      setViewStyle(
        success == 1 && success !== null ? style.viewSuccess : style.viewFail
      );
    const timeout = setTimeout(() => {
      setSuccess(null);
      setViewStyle(style.view);
      if (success == 1) props.navigation.navigate("languages");
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  useEffect(() => {
    loginAttempt().then(() => {
      props.navigation.navigate("languages");
    });
  }, []);

  return (
    <View style={viewStyle}>
      <TextInput
        style={style.input}
        placeholder={"Kullanıcı Adı"}
        value={values.username}
        onChangeText={(text) =>
          setValues((prew) => {
            return { ...prew, username: text };
          })
        }
      />
      <TextInput
        style={style.input}
        placeholder={"Parola"}
        value={values.password}
        onChangeText={(text) =>
          setValues((prew) => {
            return { ...prew, password: text };
          })
        }
      />
      <View style={style.submitContainer} onTouchStart={handleSubmit}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>
          {process == "login" ? "Giriş Yap" : "Kayıt Ol"}
        </Text>
      </View>
      <View
        onTouchStart={() => {
          setProcess((prew) => (prew == "login" ? "register" : "login"));
        }}
      >
        <Text style={style.changeView}>
          {process == "login"
            ? "Bir hesabın yok mu ? Hesap Oluştur"
            : "Zaten bir hesabın mı var ? Giriş yap"}
        </Text>
      </View>
    </View>
  );
};

function loginAttempt() {
  return new Promise(async (resolve, reject) => {
    const refresh_token = await AsyncStorage.getItem("refresh_token");

    if (refresh_token == null) return reject();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch("http://10.0.2.2:8081/token", {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({
        refresh_token: refresh_token,
      }),
      redirect: "follow",
    });
    response
      .json()
      .then((result) => {
        AsyncStorage.setItem("access_token", result.access_token);
        return resolve();
      })
      .catch((e) => {
        reject();
      });
  });
}
