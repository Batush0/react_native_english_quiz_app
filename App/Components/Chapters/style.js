import style from "../../style";
import { StyleSheet, Dimensions } from "react-native";
export default StyleSheet.create({
  /**
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
   */
  viewPort: {
    paddingTop: 30,
    backgroundColor: "cc2",
    width: "100%",
    height: "100%",
    paddingHorizontal: 30,
  },
  boxStyles: {
    width: "60%",
  },
  dropdownTextStyles: {
    fontSize: 16,
  },
  dropdownItemStyles: {
    // width: 60,
    marginHorizontal: -1,
    marginVertical: -7,
  },
  dropdownStyles: {
    width: "60%",
  },
  logo: {
    transform: [{ scale: 0.2 }],
    position: "absolute",
    right: -100,
    top: -40,
  },
  chapterContainer: {
    backgroundColor: "white",
    marginTop: "5%",
    height: "90%",
    borderRadius: 10,
  },
  scrollView: {
    width: "100%",
    height: "100%",
    paddingHorizontal: "5%",
    // paddingVertical: "7%",
    marginTop: 20,
  },
  chapterWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    height: 140,
    marginBottom: 20,
    overflow: "scroll",
    paddingLeft: 20,
  },
  chapterTitle: {
    fontSize: 20,
    marginTop: 15,
  },
  chapterBottomThing: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  chapterCompletionWrapper: {
    width: "70%",
    marginRight: 20,
  },
  chapterAccurT: {},
  chapterBar: {
    height: 15,
    borderWidth: 1,
    marginTop: 5,
  },
  travelArrow: {
    borderRadius: 15,
    borderWidth: 1,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  travelArrowT: {
    fontSize: 25,
  },
});
