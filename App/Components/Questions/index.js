import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, AsyncStorage } from "react-native";
import style from "../../style";
import setAccessToken from "../../utils/setAccessToken";
import Loading from "../Loading";

// -- imports -- //

module.exports = ({ navigation, route }) => {
  const [questions, setQuestions] = useState([]);
  const [reRender, setReRender] = useState(0);
  const [lastRender, setLanstRender] = useState(0);
  const [scrollable, setScrollable] = useState(true);

  if (route.params.related) {
    navigation.navigate("question", { ...route.params });
  }

  const getQuestions = async () => {
    //-- fetch payloads --//

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${await AsyncStorage.getItem("access_token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const on =
      questions.length > 0 ? questions[questions.length - 1].question_id : 0;

    const response = await fetch(
      `http://10.0.2.2:8080/questions?language=${
        route.params.language
      }&chapter=${
        route.params.chapter_id
      }&username=${await AsyncStorage.getItem("username")}&on=${on}`,
      requestOptions
    );
    response
      .json()
      .then((data) => {
        if (!data.bundle) {
          return setScrollable(false);
        }
        setQuestions((prew) => {
          var groups = [];
          var _state = { accuracy: true };
          var state = _state;

          //5li gruplara ayırma
          for (var i = 5; i < data.bundle.length; i++) {
            //tek tek accuracy kontrol etme
            if (i % 5 == 0) {
              /**
              for (var j = 0; j < 5; j++) {
                if (data.bundle[i - j].accuracy !== 1) {
                  state.accuracy = false;
                  break;
                }
              }
 */
              //eklenti zamanı
              groups.push({
                accuracy: state.accuracy,
                question_id: data.bundle[i - 5].id,
              });
              state = _state;
            }
          }

          return [...prew, ...groups];
        });
      })
      .catch((e) => {
        if (response.status == 403) {
          setAccessToken(navigation).then(() => {
            getQuestions();
          });
        }
      });
  };

  function scrollHandler(event) {
    const condition = Date.now() - lastRender < 2000 || !scrollable;
    if (condition) return false;

    const percentOfScrollPosition =
      event.nativeEvent.contentOffset.y /
      (event.nativeEvent.contentSize.height / 100);
    if (percentOfScrollPosition >= 80) {
      setReRender((prew) => prew + 1);
    }
  }

  const onTouchStart = (questionId) => {
    navigation.navigate("question", {
      ...route.params,
      question_id: questionId,
    });
  };

  useEffect(() => {
    getQuestions();
    setLanstRender(Date.now());
  }, [reRender]);

  if (questions.length == 0) return <Loading />;

  //maping questions
  const _quesions = questions.map((data, index) => (
    <TheQuestion {...data} index={index + 1} onTouchStart={onTouchStart} />
  ));

  return (
    <ScrollView onScroll={scrollHandler} style={styles.scroll}>
      <View style={{ paddingBottom: 76 }}>
        {_quesions}

        {!scrollable && <Text style={styles.cs}>Coming Soon ...</Text>}
      </View>
    </ScrollView>
  );
};

/** QUESTION COMPONENT
 *
 *
 *
 *
 *
 */

const TheQuestion = ({ question_id, index, accuracy, onTouchStart }) => {
  return (
    <View
      style={styles.question}
      onTouchStart={() => {
        onTouchStart(question_id);
      }}
    >
      <Text style={styles.id}>{index}</Text>

      <Text style={styles.completed}>
        {/* 
        impoertant!
        API'deki chapter özel accuracy hesaplama sorunu çözüldükten sonra açılacak

        {accuracy !== null ? (accuracy == 1 ? "✔️" : "❌") : "□"}
      */}
      </Text>
    </View>
  );
};

/** STYLES
 *
 *
 *
 *
 *
 */

const styles = StyleSheet.create({
  cs: {
    paddingTop: 25,
    color: style.tertiary,
    fontWeight: "500",
    paddingLeft: "40%",
  },
  scroll: {
    minHeight: "100%",
    backgroundColor: style.primary,
    width: "100%",
    paddingTop: 50,
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
