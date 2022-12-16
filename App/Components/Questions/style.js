import style from "../../style";
import { StyleSheet, Dimensions } from "react-native";

module.exports = StyleSheet.create({
  viewPort: {
    backgroundColor: style.secondary,
    minHeight: "100%",
  },

  question: {
    fontSize: 20,
    color: style.tertiary,
    marginHorizontal: 15,
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingTop: 80,
    display: "flex",
    flexDirection: "row",
    backgroundColor: style.secondary,
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
    marginTop: 90,
    borderTopColor: "black",
    // borderTopWidth: 1,
    backgroundColor: style.secondary,
  },

  answerContainer: {
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    width: "auto",
    marginLeft: 30,
    borderRadius: 15,
    backgroundColor: style.primary,
  },

  answer: {
    fontSize: 20,
    color: "#222",
  },
});
