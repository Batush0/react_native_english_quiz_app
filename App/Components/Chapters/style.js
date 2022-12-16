import style from "../../style";
import { StyleSheet, Dimensions } from "react-native";
export default StyleSheet.create({
  view: {
    backgroundColor: style.primary,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    borderColor: "#000",
    borderWidth: 2,
    padding: 50,
  },
  chapter: {
    width: 110,
    height: 120,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginTop: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 2,
  },
  text: {
    left: 10,
    fontSize: 12,
    position: "absolute",
    bottom: 25,
    maxWidth: "85%",
  },
  progress: {
    width: "90%",
    marginTop: 5,
    height: 5,
  },
  scroll: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
