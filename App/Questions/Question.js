import React from "react";
import { StyleSheet, View, Text, Animated, PanResponder } from "react-native";

const styles = StyleSheet.create({
  question: {
    fontSize: 20,
    color: "white",
  },
  questionContainer: {
    backgroundColor: "#2c3e50",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  answersContainer: {
    backgroundColor: "#bf30fa",
    marginTop: 50,
  },
  answersHeader: {
    fontSize: 15,
    color: "#f0b0cc",
  },
  answerContainer: {
    marginVertical: 30,
    borderColor: "#ff00ff",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f0",
  },
  answer: {
    fontSize: 20,
    color: "#fff",
  },
  selectedAnswer: {
    borderColor: "#555",
  },
  correctAnswer: {
    color: "#2f2",
    fontSize: 20,
  },
  incorrectAnswer: {
    color: "#f22",
    fontSize: 20,
  },
});

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
        //  cevabı yerine yerleştir
        if (this.isDropZone(gesture)) {
          //   this.props.setAnswer
          console.log(this.props.children);
        } else {
          Animated.spring(this.state.pan, {
            speed: 1,
            toValue: { x: 0, y: 0 },
          }).start();
        }
      },
    });
  }

  isDropZone(gesture) {
    var dz = this.props.questionZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  render() {
    return (
      <View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout(), styles.answerContainer]}
        >
          <Text style={[styles.answer]}>{this.props.children}</Text>
        </Animated.View>
      </View>
    );
  }
}

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
    this.state = { suspendedAnswer: null, questionZoneValues: null };
    this.script = "Bir yıl 365 gündür";
    this.answer = "365";
    this.question = this.script.split(` ${this.answer} `); //api'dan gelecek
    this.answers = [400, 252, 309, 365]; //api'da üretilip dağıtılacak
  }

  setAnswer(answer) {
    this.setState({ suspendedAnswer: answer });
  }

  setQuestionZoneValues(event) {
    this.setState({
      questionZoneValues: event.nativeEvent.layout,
    });
  }
  render() {
    const answers = this.answers.map((data) => (
      <Answer
        questionZoneValues={this.state.questionZoneValues}
        setAnswer={this.setAnswer}
      >
        {data}
      </Answer>
    ));
    return (
      <View>
        <Question
          onLayout={this.setQuestionZoneValues.bind(this)}
          question={this.question}
          suspendedAnswer={this.state.suspendedAnswer}
          answer={this.answer}
        />
        <View style={styles.answersContainer}>
          <Text style={styles.answersHeader}>Answers</Text>
          {answers}
        </View>
      </View>
    );
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //TODO: questionContainer flex olacak
    return (
      <View style={styles.questionContainer} onLayout={this.props.onLayout}>
        <Text style={styles.question}>{this.props.question[0]}</Text>
        <View style={styles.answer}>
          <Text
            style={[
              this.props.suspendedAnswer != null
                ? this.props.suspendedAnswer === this.props.answer
                  ? styles.correctAnswer
                  : styles.incorrectAnswer
                : styles.answer,
            ]}
          >
            {this.props.suspendedAnswer
              ? this.props.suspendedAnswer
              : "._._._."}
          </Text>
        </View>
        <Text style={styles.question}>{this.props.question[1]}</Text>
      </View>
    );
  }
}

//TODO: question filed'a answer sürüklendiğinde answer yerine dönecek ve style değiştirecek

module.exports = ViewPort;
