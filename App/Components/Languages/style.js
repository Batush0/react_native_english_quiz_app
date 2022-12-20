import { StyleSheet } from "react-native";
import style from "../../style";
module.exports = StyleSheet.create({
  scrollView: {
    backgroundColor: style.primary,
    width: "100%",
    minHeight: "100%",
    paddingTop: 50,
  },
  languageContainer: {
    backgroundColor: style.secondary,
    maxWidth: "90%",
    paddingHorizontal: style.gap * 13,
    paddingVertical: style.gap * 10,
    borderRadius: style.radius,
    marginLeft: "5%",
  },
  languageText: {
    fontSize: 20,
  },
});
