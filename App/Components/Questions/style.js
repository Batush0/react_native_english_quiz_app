import style from "../../style";
import { StyleSheet, Dimensions } from "react-native";

module.exports = StyleSheet.create({
  viewPort: {
    backgroundColor: style.secondary,
    minHeight: "100%",
  },
  vpFail: {
    backgroundColor: "#FF8E9E",
  },
  vpSc: {
    backgroundColor: "#DFD3C3",
  },

  question: {
    fontSize: 15,
    color: style.tertiary,
    marginHorizontal: 15,
  },
  questionsContainer: {
    // paddingHorizontal: 20,
    paddingTop: 70,
  },
  questionContainer: {
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    // backgroundColor: style.secondary,
  },
  blankAnswer: {
    fontSize: 20,
    color: style.primary,
  },
  correctAnswer: {
    color: "#2f2",
    fontSize: 20,
  },
  incorrectAnswer: {
    color: "#9b111e",
    fontSize: 20,
  },

  answersContainer: {
    marginTop: 30,
    borderTopColor: "black",
    // borderTopWidth: 1,
    // backgroundColor: style.secondary,
  },

  answerContainer: {
    marginVertical: style.gap * 4,
    paddingVertical: style.gap * 3,
    paddingHorizontal: style.gap * 7,
    alignSelf: "flex-start",
    width: "auto",
    marginLeft: 30,
    borderRadius: style.radius,
    backgroundColor: style.primary,
  },

  answer: {
    fontSize: 20,
    color: "#222",
  },
  controls: {
    position: "absolute",
    right: style.gap * 2,
    // bottom: style.gap * 12,
    bottom: style.gap * 302,
    display: "flex",
    flexDirection: "row",
    padding: style.gap * 3,
    backgroundColor: style.tertiary + "20",
  },
  submit: {
    fontSize: 30,
    paddingHorizontal: style.gap * 2,
  },
  check: {
    paddingHorizontal: "25%",
    marginTop: 70,
    backgroundColor: style.tertiary + "20",
    borderRadius: style.radius,
    padding: style.gap * 3,
  },
  check_t: { fontSize: 40, color: style.tertiary },
});
