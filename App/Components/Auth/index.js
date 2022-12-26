import { useEffect, useState } from "react";
import { Text, TextInput, View, AsyncStorage, Image } from "react-native";
import style from "./style";
// import Logo from "../../Assets/vulang.png";

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
      if (success == 1) props.navigation.navigate("chapters");
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  useEffect(() => {
    loginAttempt().then(() => {
      props.navigation.navigate("chapters");
    });
  }, []);

  return (
    <View style={style.viewPort}>
      <View style={style.logoV}>
        <Image
          style={style.logoI}
          source={require("../../Assets/vulang.png")}
        />
      </View>

      <View style={style.authContainer}>
        <View style={style.upperSections}>
          <View
            onTouchEnd={() => setProcess("login")}
            style={{
              ...style.upperV,
              borderBottomWidth: process == "login" ? 0 : 1,
            }}
          >
            <Text style={style.upperT}>Giriş Yap</Text>
          </View>
          <View
            onTouchEnd={() => setProcess("register")}
            style={{
              ...style.upperV,
              borderTopRightRadius: 10,
              borderLeftWidth: 1,
              borderBottomWidth: process == "login" ? 1 : 0,
            }}
          >
            <Text style={style.upperT}>Kayıt Ol</Text>
          </View>
        </View>
        <View style={style.authInner}>
          <View style={style.inputsV}>
            <Text style={style.inputsT}>Kullanıcı Adı</Text>
            <TextInput
              style={style.inputsI}
              placeholder="ör. Mustafa"
              onChangeText={(text) =>
                setValues((prew) => {
                  return { ...prew, username: text };
                })
              }
            />
          </View>
          <View style={style.inputsV}>
            <Text tyle={style.inputsT}>Parola</Text>
            <TextInput
              style={style.inputsI}
              placeholder="ör. m1_A*k93F.q"
              onChangeText={(text) =>
                setValues((prew) => {
                  return { ...prew, password: text };
                })
              }
            />
          </View>
          <View
            style={{
              ...style.submitV,
              backgroundColor:
                success !== null ? (success ? "#1afe17" : "#fe12a4") : "white",
            }}
            onTouchEnd={handleSubmit}
          >
            <Text style={style.submitT}>{"➜"}</Text>
          </View>
        </View>
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

/** 
  <View style={viewStyle}>
    {/* <Image source={Logo} style={style.logo} /> }
    <View style={style.halfOfInputs}>
      <Text style={style.process}>
        {process == "login" ? "Giriş yap" : "Hesap Oluştur"}
      </Text>
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
    </View>
    <View style={style.halfOfSubmits}>
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
  </View>
*/
