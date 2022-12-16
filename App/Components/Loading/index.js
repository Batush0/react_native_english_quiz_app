import { View, Text } from "react-native";
import style from "../../style";

module.exports = () => {
  return (
    <View
      style={{
        backgroundColor: style.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: style.tertiary, fontSize: 30 }}>
        Loading/Yükleniyor...
      </Text>
    </View>
  );
};
