import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Animated, PanResponder } from "react-native";

const styles = require("./style");

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
        if (this.isDropZone(gesture)) {
          this.props.viewPort.setAnswer(this.props.children);
          speed = 200;
        }
        Animated.spring(this.state.pan, {
          speed: speed,
          toValue: { x: 0, y: 0 },
        }).start();
      },
    });
  }

  isDropZone(gesture) {
    var dz = this.props.questionZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  render() {
    const responder =
      this.props.viewPort.state.suspendedAnswer === null
        ? this.panResponder.panHandlers
        : {};
    return (
      <View>
        <Animated.View
          {...responder}
          style={[this.state.pan.getLayout(), styles.answerContainer]}
        >
          <Text style={[styles.answer]}>{`${choiceChars[this.props.index]})   ${
            this.props.children
          }`}</Text>
        </Animated.View>
      </View>
    );
  }
}

const choiceChars = ["A", "B", "C", "D", "E", "F", "G", "H"];

module.exports = function LoadData(props) {
  const [_data, _setData] = useState({});

  const getData = async () => {
    const response = await fetch(
      `http://10.0.2.2:8080/question?chapter_id=${props.route.params.chapter_id}&question_id=${props.route.params.question_id}`
    );
    const data = await response.json();
    _setData({ ...data });
  };

  useEffect(() => {
    getData();
  }, []);

  if (!_data.question)
    return (
      <View>
        <Text>Yükleniyor ...</Text>
      </View>
    );
  var passable = { ..._data };
  passable["route"] = props.route.params;
  return <ViewPort {...passable} />;
};

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
    this.state = { suspendedAnswer: null, questionZoneValues: null }; //TODO: suspended api'dan gelecek
    this.question = props.question;
    this.answers = props.choices;
    this.isCorrect;
  }

  async setAnswer(answer) {
    //checking answer's accuracy
    await fetch(
      `http://10.0.2.2:8080/checkAnswer?chapter_id=${this.props.route.chapter_id}&question_id=${this.props.route.question_id}&choice=${answer}`,
      { method: "PATCH" }
    )
      .then((response) => response.json())
      .then(({ state }) => {
        this.isCorrect = state;
      });
    this.setState({ suspendedAnswer: answer });
    this.setAnswers();
  }

  setAnswers() {
    this._answers = this.answers.map((data, index) => (
      <Answer
        questionZoneValues={this.state.questionZoneValues}
        viewPort={this}
        draggable={this.state.suspendedAnswer === null ? true : false}
        index={index}
      >
        {data}
      </Answer>
    ));
  }

  setQuestionZoneValues(event) {
    this.setState({
      questionZoneValues: event.nativeEvent.layout,
    });
  }
  render() {
    this.setAnswers();
    return (
      <View style={styles.viewPort}>
        <Question
          onLayout={this.setQuestionZoneValues.bind(this)}
          question={this.question}
          suspendedAnswer={this.state.suspendedAnswer}
          isCorrect={this.isCorrect}
        />
        <View style={styles.answersContainer}>{this._answers}</View>
      </View>
    );
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.questionContainer} onLayout={this.props.onLayout}>
        <Text style={styles.question}>{this.props.question[0]}</Text>
        <View style={styles.answer}>
          <Text
            style={[
              this.props.suspendedAnswer != null
                ? this.props.isCorrect == true
                  ? styles.correctAnswer
                  : styles.incorrectAnswer
                : styles.blankAnswer,
            ]}
          >
            {this.props.suspendedAnswer !== null
              ? this.props.suspendedAnswer
              : "......."}
          </Text>
        </View>
        <Text style={styles.question}>{this.props.question[1]}</Text>
      </View>
    );
  }
}
