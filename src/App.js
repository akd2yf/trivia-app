import React, { useState, useEffect } from "react";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export default function App() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setQuestions(res.results);
      });
  }, []);

  class Answer {
    constructor(content, truth) {
      this.content = content;
      this.truth = truth;
      if (truth) {
        this.color = 'green';
      }
      else {
        this.color = 'red';
      }
    }
  }
  class Question {
    constructor(question, answers) {
      this.question = question;
      this.answers = answers;
    }
  }

  const qs = [];

  questions.forEach(createQuestion);

  function createQuestion(question) {
    const answers = [];
    answers.push(new Answer(decode(question.correct_answer),true));
    question.incorrect_answers.forEach((answer) =>
      answers.push(new Answer(answer, false))
    )
    shuffle(answers)
    qs.push(new Question(decode(question.question), answers));
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

    // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
    // Knuth Shuffle, https://github.com/coolaj86/knuth-shuffle
  };

  function decode(str) {
    console.log(str)
    var newStr = '';
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '&') {
        let code = '';
        let decoded = '';
        for (let j = i+1; j < str.length; j++) {
          code += str[j];
          if (str[j+1] === ';') {
            i = j+1;
            break;
          }
        }
        console.log(code)
        switch(code) {
          case 'amp':
            decoded = '&';
            break;
          case '#034':
            decoded = '\"';
            break;
          case 'quot':
            decoded = '\"';
            break;
          case '#039':
            decoded = '\'';
            break;
        }
        console.log(decoded)
        newStr += decoded;
      }
      else newStr += str[i];
    }
    console.log(newStr)

    return newStr;
  }


  const handleClick = (answer, event) => {
    event.target.style.color = answer.color
  }

  return (
    <div>
      <h1>Trivia App 😈</h1>
      {qs.map((q) => (
        <h1>{q.question}
          <div>
            <ButtonGroup>
              {q.answers.map((a) =>
                <Button variant ="contained"
                  onClick={(e) => handleClick(a,e)}
                >
                  {a.content}
                </Button>
              )}
            </ButtonGroup>
          </div>
        </h1>
      ))}
    </div>
  );
}