const { AsyncStorage } = require("react-native");

module.exports = (navigation) => {
  return new Promise(async (resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      refresh_token: await AsyncStorage.getItem("refresh_token"),
    });

    const response = await fetch("http://10.0.2.2:8081/token", {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    });
    response
      .json()
      .then((result) => {
        AsyncStorage.setItem("access_token", result.access_token);
        resolve();
      })
      .catch(() => {
        navigation.navigate("auth");
      });
  });
};
