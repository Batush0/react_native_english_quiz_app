import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import style from "../style";
module.exports = ({ navigation, route }) => {
  const [questions, setQuestions] = useState([]);
  const getQuestions = async () => {
    const response = await fetch(
      `http://10.0.2.2:8080/chapter?id=${route.params.chapter_id}`
    );
    const data = await response.json();
    setQuestions(data);
  };

  const onTouchStart = (questionId) => {
    navigation.navigate("question", {
      ...route.params,
      question_id: questionId,
    });
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const _quesions = questions.length ? (
    questions.map((data) => (
      <TheQuestion {...data} onTouchStart={onTouchStart} />
    ))
  ) : (
    <Text>Yükleniyor ...</Text>
  );

  return <ScrollView style={styles.scroll}>{_quesions}</ScrollView>;
};

const TheQuestion = ({ soru_no, completed, onTouchStart }) => {
  return (
    <View
      style={styles.question}
      onTouchStart={() => {
        onTouchStart(soru_no);
      }}
    >
      <Text style={styles.id}>{soru_no}</Text>
      <Text style={styles.completed}>{completed ? "✔️" : "❌"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    minHeight: "100%",
    backgroundColor: style.primary,
    minWidth: "100%",
  },
  id: {
    fontSize: 30,
    marginLeft: 40,
  },
  completed: {
    fontSize: 35,
    position: "absolute",
    right: 22,
    borderLeftWidth: 1,
    paddingLeft: 30,
  },
  question: {
    width: "80%",
    paddingVertical: 20,
    backgroundColor: style.secondary,
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: "10%",
    alignItems: "center",
    position: "relative",
  },
});
