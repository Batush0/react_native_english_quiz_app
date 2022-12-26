import style from "../../style";
import { StyleSheet, Dimensions } from "react-native";

module.exports = StyleSheet.create({
  /**
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
   */
  viewPort: {
    marginTop: 30,
    width: "100%",
    height: "100%",
    paddingHorizontal: 30,
  },
  goBackQuestions: {
    alignItems: "center",
    paddingVertical: 10,
    width: "40%",
    // backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    position: "absolute",
    bottom: 50,
    left: 20,
  },
  goBackQuestionsT: {
    fontSize: 16,
  },
  inner: {
    width: "100%",
    backgroundColor: "white",
    height: "100%",
    borderRadius: 10,
    padding: 20,
    paddingTop: 5,
  },
  logo: {
    transform: [{ scale: 0.2 }],
    position: "absolute",
    right: -100,
    bottom: -20,
  },
  questionsContainer: {},
  answersContainer: {
    marginTop: 70,
    marginLeft: 20,
  },
  _question: {
    display: "flex",
    alignItems: "flex-start",
  },

  questionWrapper: {
    borderBottomWidth: 1,
    padding: 10,
    marginTop: 10,
    borderColor: "gray",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  id: {
    fontSize: 20,
  },
  question: {
    marginLeft: 15,
    alignSelf: "flex-start",
  },
  _qZone: {
    alignItems: "center",
    backgroundColor: "gray",
  },
  question_answer: {
    backgroundColor: "gray",
    alignItems: "flex-start",
  },
  answer: {
    fontSize: 20,
  },
  answerWrapper: {
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  _answerWrapper: {
    alignItems: "flex-start",
  },
  check: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    marginTop: "20%",
  },
  check_t: {
    fontSize: 20,
  },
});
