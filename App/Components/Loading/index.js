import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import style from "../../style";

module.exports = () => {
  const [cursor, setCursor] = useState("..");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCursor((prew) => (prew == ".." ? " :" : ".."));
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [cursor]);
  return (
    <View
      style={{
        backgroundColor: style.primary,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Text style={{ color: style.tertiary, fontSize: 30 }}>
        Loading/Yükleniyor{cursor}
      </Text>
    </View>
  );
};
