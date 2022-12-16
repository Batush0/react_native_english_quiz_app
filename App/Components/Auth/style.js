import { PixelRatio, StyleSheet } from "react-native";
import style from "../../style";

const radius = style.radius;
const gap = style.gap;
module.exports = StyleSheet.create({
  input: {
    backgroundColor: style.secondary,
    paddingHorizontal: gap * 5,
    paddingVertical: gap * 2,
    borderRadius: radius,
    margin: gap * 3,
    width: "60%",
  },
  view: {
    backgroundColor: style.primary,
    padding: 30,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  viewSuccess: {
    backgroundColor: "#DFD3C3",
    padding: 30,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  viewFail: {
    backgroundColor: "#FF8E9E",
    padding: 30,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitContainer: {
    backgroundColor: style.secondary,
    paddingHorizontal: gap * 5,
    paddingVertical: gap * 4,
    borderRadius: radius,
    margin: gap * 10,
    width: "60%",

    alignItems: "center",
  },
  changeView: {
    marginTop: -10,
    paddingLeft: 37,
    fontSize: 10,
    color: style.tertiary,
  },
});
