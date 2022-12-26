import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Image,
} from "react-native";
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
      `http://10.0.2.2:8080/questions?language=${await AsyncStorage.getItem(
        "language"
      )}&chapter=${
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

          var accuracyCount = 0;

          for (var i = 0; i < data.bundle.length; i++) {
            if (data.bundle[i].accuracy) ++accuracyCount;
            if (i % 5 == 4) {
              groups.push({
                solved: accuracyCount,
                question_id: data.bundle[i - 4].id,
              });
              accuracyCount = 0;
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
    console.log(
      event.nativeEvent.contentOffset.y /
        (event.nativeEvent.contentSize.height / 100)
    );
    if (percentOfScrollPosition >= 70) {
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
  let qst = [];
  const _quesions = questions.map((data, index) => {
    qst.push({ ...data, index: index + 1 });
    if (qst.length == 2) {
      const qst2 = qst;
      qst = [];
      return <CoupleQuestion data={qst2} onTouchStart={onTouchStart} />;
    }
  });

  return (
    <View style={styles.viewPort}>
      <View
        style={styles.goBackChaptersV}
        onTouchEnd={() => {
          navigation.navigate("chapters");
        }}
      >
        <Text style={styles.goBackChaptersT}>← Chapters</Text>
      </View>
      <Image style={styles.logo} source={require("../../Assets/vulang.png")} />
      <View style={styles.questionContainer}>
        <ScrollView onScroll={scrollHandler} style={styles.scrollView}>
          {_quesions}

          {!scrollable && (
            <Text style={styles.comingSoon}>Coming Soon ...</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

/** QUESTION COMPONENT
 *
 *
 *
 *
 *
 */
const CoupleQuestion = ({ data, onTouchStart }) => {
  return (
    <View style={styles.coupleQuestionWrapper}>
      <TheQuestion {...data[0]} onTouchStart={onTouchStart} />
      <TheQuestion {...data[1]} onTouchStart={onTouchStart} />
    </View>
  );
};

const TheQuestion = ({ question_id, index, solved, onTouchStart }) => {
  if (!index) return <View />;
  return (
    <View
      style={styles.questionWrapper}
      onTouchStart={() => {
        onTouchStart(question_id);
      }}
    >
      <Text style={styles.id}>{index}</Text>
      <View style={styles.completionWrapper}>
        <Text style={styles.accurT}>{`${solved} / 5`}</Text>
        <View style={styles.chapterBar}>
          <View
            style={{
              backgroundColor: "#D9D9D9",
              height: "100%",
              width: `${solved / (5 / 100)}%`,
            }}
          />
        </View>
      </View>
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
  viewPort: {
    paddingTop: 30,
    width: "100%",
    height: "100%",
    paddingHorizontal: 30,
  },
  goBackChaptersV: {
    backgroundColor: "white",
    width: "40%",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
  },
  goBackChaptersT: {
    fontSize: 16,
  },
  logo: {
    transform: [{ scale: 0.2 }],
    position: "absolute",
    right: -100,
    top: -40,
  },
  questionContainer: {
    backgroundColor: "white",
    marginTop: "5%",
    height: "90%",
    borderRadius: 10,
  },
  scrollView: {
    width: "100%",
    height: "100%",
    paddingHorizontal: "5%",
    marginTop: 30,
  },
  coupleQuestionWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  questionWrapper: {
    width: "40%",
    height: 60,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  id: {
    fontSize: 30,
    padding: 10,
  },
  completionWrapper: {
    marginLeft: 5,
    width: 35,
    alignItems: "center",
  },
  accurT: {},
  chapterBar: {
    width: "90%",
    height: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 3,
  },
});
