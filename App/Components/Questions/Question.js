import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  PanResponder,
  AsyncStorage,
  Vibration,
  Image,
} from "react-native";
import Loading from "../Loading";
import setAccessToken from "../../utils/setAccessToken";

const styles = require("./style");

/**
 *
 *
 * ANSWER COMPONENT
 *
 *
 */

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),

      onPanResponderRelease: (e, gesture) => {
        var speed = 1;
        //drop zone ise indexini alma
        const dpIndex = this.isDropZone(gesture);
        if (dpIndex !== undefined) {
          this.props.viewPort.setAnswer(
            this.props.children,
            dpIndex,
            this.props.index
          );
          speed = 200;
        }
        Animated.spring(this.state.pan, {
          speed: speed,
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });
  }

  isDropZone(gesture) {
    let pl = undefined;
    for (var i = 0; i < this.props.questionZoneValues.length; i++) {
      const dz = this.props.questionZoneValues[i];
      if (gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height) {
        pl = i;
        break;
      }
    }
    return pl;
  }

  render() {
    const seenable =
      !this.props.viewPort.state.suspendedAnswers[this.props.index];

    return (
      <View style={styles._answerWrapper}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            this.state.pan.getLayout(),
            seenable ? styles.answerWrapper : {},
          ]}
        >
          {seenable && (
            <Text style={[styles.answer]}>{this.props.children}</Text>
          )}
        </Animated.View>
      </View>
    );
  }
}

/**
 *
 *
 * GETING NECESSARY THINGS
 *
 *
 */

module.exports = function LoadData(props) {
  console.log(props.route.params.question_id);
  const [_data, _setData] = useState();

  const getData = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${await AsyncStorage.getItem("access_token")}`
    );
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `http://10.0.2.2:8080/quiz?language=${await AsyncStorage.getItem(
        "language"
      )}&chapter=${props.route.params.chapter_id}&on=${
        props.route.params.question_id
      }&username=${await AsyncStorage.getItem("username")}${
        props.route.params.related ? "&related=true" : ""
      }`,
      requestOptions
    );

    response
      .json()
      .then((payload) => {
        if (payload.cause == 204)
          return props.navigation.navigate("chapters", {
            language: props.route.params.language,
          });
        if (!payload.cause) _setData(payload);
        console.log(props.route.params.question_id, payload.on);
        props.route.params.question_id = payload.on;
      })
      .catch((e) => {
        if (response.status == 403) {
          setAccessToken(props.navigation).then(() => {
            getData();
          });
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  if (!_data) return <Loading />;

  var passable = _data;
  passable["route"] = { ...props.route.params }; //, related: undefined };
  passable["navigation"] = props.navigation;
  return <ViewPort {...passable} />;
};

/**
 *
 *
 * THE VİEW_PORT
 *
 *
 */

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suspendedQuestions: [null, null, null, null, null],
      suspendedAnswers: [false, false, false, false, false],
      questionZoneValues: [null, null, null, null, null],
      success: null,
    }; //TODO: suspended api'dan gelecek
    this.qzvProcessIndex = 0;
    this.questions = props.questions;
    this.answers = props.answers;
    // this.isCorrect = [];
  }

  async setAnswer(answer, index_q, index_a) {
    const { suspendedQuestions, suspendedAnswers } = this.state;
    //eğer değer tanımlıysa
    if (suspendedQuestions[index_q]) {
      suspendedAnswers[
        this.answers.indexOf(suspendedQuestions[index_q])
      ] = false;
    }
    suspendedQuestions[index_q] = answer;
    suspendedAnswers[index_a] = true;
    this.setState({
      suspendedQuestions: suspendedQuestions,
      suspendedAnswers: suspendedAnswers,
    });
    this.setAnswers();
  }

  handleSuccess() {
    const accuracy = this.state.success;
    this.vpStyle = styles.viewPort;
    /**accuracy !== null
        ? accuracy
          ? styles.vpSc
          : styles.vpFail
        : styles.viewPort;
        */
    if (accuracy == null) return "";

    if (accuracy)
      return setTimeout(() => {
        this.props.navigation.navigate("questions", {
          ...this.props.route,
          question_id: this.props.to,
          related: true,
        });
      }, 1500);
    setTimeout(() => {
      this.setState({ success: null, onSuccessTimeout: false });
    }, 1500);
    if (!this.state.onSuccessTimeout) {
      this.setState({
        suspendedQuestions: [null, null, null, null, null],
        suspendedAnswers: [false, false, false, false, false],
        onSuccessTimeout: true,
      });
    }
  }

  setAnswers() {
    this._answers = this.answers.map((data, index) => (
      <Answer
        questionZoneValues={this.state.questionZoneValues}
        viewPort={this}
        draggable={this.state.suspendedQuestions[index] === null}
        index={index}
      >
        {data}
      </Answer>
    ));
  }

  setQuestions() {
    this._questions = this.questions.map((question, index) => (
      <Question
        question={question}
        suspendedAnswer={this.state.suspendedQuestions[index]}
        onLayout={this.setQuestionZoneValues.bind(this)}
        dropAnswer={this.dropAnswer.bind(this)}
        index={index}
        soru_no={this.props.question_numbers[index]}
      />
    ));
  }

  dropAnswer(index, answer) {
    const { suspendedQuestions, suspendedAnswers } = this.state;
    suspendedQuestions[index] = null;
    suspendedAnswers[this.answers.indexOf(answer)] = false;
    this.setState({
      suspendedQuestions: suspendedQuestions,
      suspendedAnswers: suspendedAnswers,
    });
  }

  handleHome() {
    this.props.navigation.navigate("questions", {
      ...this.props.route,
    });
  }

  async submitButtons(process) {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${await AsyncStorage.getItem("access_token")}`
    );
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
      body: undefined,
    };
    var _process;
    switch (process) {
      case "forward":
      case "backward":
        _process = "bAf";
        break;
      default:
        requestOptions.body = JSON.stringify({
          answers: this.state.suspendedQuestions,
        });
        requestOptions.method = "POST";
        _process = "check";
        break;
    }
    const response = await fetch(
      `http://10.0.2.2:8080/${_process}?language=${await AsyncStorage.getItem(
        "language"
      )}&on=${
        this.props.route.question_id
      }&username=${await AsyncStorage.getItem("username")}${
        this.props.route.related ? "&related=true" : ""
      }`,
      requestOptions
    );

    response
      .json()
      .then((data) => {
        switch (process) {
          case "check":
            this.setState({
              success: data.accuracy,
            });
            break;
        }
      })
      .catch((e) => {
        if (response.status === 403) {
          setAccessToken(this.props.navigation).then(() => {
            this.submitButtons(process);
          });
        }
      });
  }

  setQuestionZoneValues(event) {
    var qzv = this.state.questionZoneValues;
    qzv[this.qzvProcessIndex] = event.nativeEvent.layout;
    this.setState({
      questionZoneValues: qzv,
    });
    this.qzvProcessIndex += 1;
  }
  //TODO : cevap değiştirebilme
  render() {
    this.handleSuccess();
    this.setAnswers();
    this.setQuestions();
    return (
      // <View style={styles.viewPort}>
      <View>
        <View style={styles.inner}>
          <View style={styles.questionsContainer}>{this._questions}</View>
          <View style={styles.answersContainer}>{this._answers}</View>
          {this.state.suspendedAnswers.indexOf(false) == -1 && (
            <View
              style={styles.check}
              onTouchEnd={() => {
                this.submitButtons("check");
              }}
            >
              <Text style={styles.check_t}>Kontrol Et</Text>
            </View>
          )}
          <View
            style={styles.goBackQuestions}
            onTouchEnd={() => {
              this.props.navigation.navigate("questions", {
                chapter_id: this.props.route.chapter_id,
              });
            }}
          >
            <Text styles={styles.goBackQuestionsT}>← Questions</Text>
          </View>
          <Image
            style={styles.logo}
            source={require("../../Assets/vulang.png")}
          />
        </View>
      </View>
    );
  }
}
/**
<View style={styles.controls}>
          <View
            onTouchEnd={() => {
              this.handleHome();
            }}
          >
            <Text style={styles.submit}>🏠</Text>
          </View>
        </View>

        {this.state.suspendedAnswers.indexOf(false) == -1 && (
          <View
            style={styles.check}
            onTouchEnd={() => {
              this.submitButtons("check");
            }}
          >
            <Text style={styles.check_t}>Kontrol Et</Text>
          </View>
        )}
 */
/**
 *
 *
 * QUESTION COMPONENT
 *
 *
 */

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastTouch: 0 };
  }

  dropAnswer() {
    if (
      this.props.suspendedAnswer === null ||
      Date.now() - this.state.lastTouch < 300
    )
      return false;
    // Vibration.vibrate();
    this.props.dropAnswer(this.props.index, this.props.suspendedAnswer);
  }

  render() {
    return (
      <View
        onTouchEnd={() => this.dropAnswer()}
        onTouchStart={() => this.setState({ lastTouch: Date.now() })}
        style={styles.questionWrapper}
        onLayout={this.props.onLayout}
      >
        <Text style={styles.id}>{this.props.soru_no}</Text>
        <Text style={styles.question}>{`${
          this.props.question[0] ? this.props.question[0] : ""
        }  |${
          this.props.suspendedAnswer === null
            ? "........"
            : this.props.suspendedAnswer
        }| ${this.props.question[1] ? this.props.question[1] : ""}`}</Text>
      </View>
    );
  }
}
/**
 <View style={styles._question}>
          <View style={styles._qZone}>
            <Text style={styles.question}>{`${
              this.props.question[0] ? this.props.question[0] : ""
            }`}</Text>
          </View>
          <View style={styles._qZone}>
            <Text>
              {this.props.suspendedAnswer ? this.props.suspendedAnswer : ""}
            </Text>
          </View>
          <View style={styles._qZone}>
            <Text style={styles.question}>{`${
              this.props.question[1] ? this.props.question[1] : ""
            }`}</Text>
          </View>
        </View>
 */
