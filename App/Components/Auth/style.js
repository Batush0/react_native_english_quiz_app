import { PixelRatio, StyleSheet } from "react-native";
import style from "../../style";

const radius = style.radius;
const gap = style.gap;
module.exports = StyleSheet.create({
  /**
  logo: {
    height: 60,
    width: 120,
    marginBottom: 60,
  },
  halfOfInputs: {
    width: "80%",
    backgroundColor: style.tertiary,
    borderRadius: style.radius * 2,
    paddingVertical: "10%",
    alignItems: "center",
  },
  halfOfSubmits: {
    marginTop: "6%",
    width: "80%",
    backgroundColor: style.tertiary,
    borderRadius: style.radius * 2,
  },
  input: {
    borderColor: style.secondary,
    borderWidth: 1,
    paddingHorizontal: gap * 5,
    paddingVertical: gap * 2,
    borderRadius: radius,
    margin: gap * 4,
    width: "80%",
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
    width: "70%",
    marginLeft: "15%",
    alignItems: "center",
  },
  changeView: {
    marginBottom: 15,
    marginTop: -10,
    paddingLeft: 42,
    fontSize: 10,
  },
  process: {
    fontFamily: "sans-serif",
    fontSize: 25,
    marginBottom: 30,
  },
   */
  viewPort: {
    width: "100%",
    height: "100%",
    backgroundColor: "gray",
    alignItems: "center",
    position: "relative",
  },
  logoV: {},
  logoI: {
    transform: [{ scale: 0.35 }],
  },
  authContainer: {
    position: "absolute",
    left: 0,
    top: 170,
  },
  upperSections: {
    display: "flex",
    flexDirection: "row",
  },
  upperV: {
    padding: 10,
    backgroundColor: "white",
    borderColor: "gray",
    alignItems: "center",
    width: 120,
  },

  upperT: {
    fontFamily: "sans-serif",
    fontSize: 23,
  },
  authInner: {
    //borderTopColor: "gray",
    //borderTopWidth: 1,
    padding: 20,
    backgroundColor: "white",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 100,
  },
  inputsV: {
    margin: 25,
    marginTop: 40,
    // alignItems: "center",
  },
  inputsT: {},
  inputsI: {
    width: 250,
    marginTop: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  submitV: {
    right: 40,
    bottom: 20,
    position: "absolute",
    borderWidth: 1,
    borderColor: "gray",
    padding: 13,
    paddingVertical: 10,
    borderRadius: 25,
  },
  submitT: {
    fontSize: 20,
  },
});
