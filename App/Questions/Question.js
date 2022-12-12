import React from "react";
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

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
    this.state = { suspendedAnswer: null, questionZoneValues: null };
    this.script = "Bir yıl 365 gündür"; //TODO: sentence uzayınca düzen bozuluyor
    this.answer = "365";
    this.question = this.script.split(` ${this.answer} `); //api'dan gelecek
    this.answers = [400, 252, 309, 365]; //api'da üretilip dağıtılacak
  }

  setAnswer(answer) {
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
          answer={this.answer}
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
                ? this.props.suspendedAnswer == this.props.answer
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

module.exports = ViewPort;
