const QUESTIONS = [
  "!0",
  "(a => !a)(false)",
  "+true === NaN",
  "+true === 1",
  "(new Date()).getTime() === +new Date()",
  "010 === 10",
  "0x10 > 010",
  '"1" + 1 + 1 === "111"',
  '1 + 1 + "1" === "111"',
  '!!~~"0.5"',
  "~1 === -1",
  "Infinity/Infinity === 1",
  "var a = 1; a++ + ++a === 2",
  "null == undefined",
  "NaN === NaN",
  "[0][0] === 0",
  '({a: true})["a"]',
  "1|2 === 1||2",
  "1<<1<<1 === 2",
  "2>>>1 === 1",
  "({...{a:true} , ...{a:false}}).a"
];

const colors = {
  green: "#91c579",
  red: "#e36664"
};

const TOTALTIME = 10000;
const AWARD = 5000;

let state;
let points;
let questions;
let questionIndex = 0;
let endTime;
let startTime;
const elements = {};
let interval;

function init($el) {
  //test all questions
  QUESTIONS.map(q => eval(q));

  //randomize the questions, but always start with the first easy one.
  questions = [
    QUESTIONS[0],
    ...QUESTIONS.slice(1)
      .map(q => ({ q, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(i => i.q)
  ];

  var textStyle = {
    position: "absolute",
    fontFamily: "monospace",
    zIndex: 2,
    color: "black"
  };

  applyStyle($el, {
    backgroundColor: colors.green,
    position: "relative",
    width: "100%",
    height: "100%",
    fontSize: "2em"
  });

  elements.$text = document.createElement("div");
  elements.$text.innerText =
    "Click on the screen to start. \nPress on the right side for true, and left side for false.";
  applyStyle(elements.$text, {
    ...textStyle,
    padding: "20px",
    transform: "translateY(-50%)",
    top: "50%",
    width: "calc(100% - 40px)",
    textAlign: "center"
  });

  elements.$time = document.createElement("div");
  applyStyle(elements.$time, {
    backgroundColor: colors.red,
    padding: 0,
    position: "relative",
    width: "100%",
    top: "0px"
  });

  elements.$points = document.createElement("div");
  elements.$points.innerText = "0 points";
  applyStyle(elements.$points, { ...textStyle, top: "10px", right: "10px" });

  const $github = document.createElement("a");
  $github.setAttribute("href", "https://github.com/peterlindkvist/truefalse");
  $github.innerText = "Fork me!";
  applyStyle($github, { ...textStyle, top: "10px", left: "10px" });

  const $left = document.createElement("div");
  $left.innerText = "false";
  applyStyle($left, { ...textStyle, bottom: "10px", left: "10px" });

  const $right = document.createElement("div");
  $right.innerText = "true";
  applyStyle($right, { ...textStyle, bottom: "10px", right: "10px" });

  $el.appendChild(elements.$text);
  $el.appendChild(elements.$time);
  $el.appendChild(elements.$points);
  $el.appendChild($github);
  $el.appendChild($left);
  $el.appendChild($right);

  $el.addEventListener("click", e => {
    if (state !== "run") {
      start();
    } else {
      calculate(e.x > $el.offsetWidth / 2);
    }
  });
  window.addEventListener("keydown", e => {
    if (state !== "run") {
      start();
    } else if (e.key === "ArrowLeft" || e.key === "a") {
      calculate(false);
    } else if (e.key === "ArrowRight" || e.key === "d") {
      calculate(true);
    }
  });

  state = "init";
}

function calculate(val) {
  const result = eval(questions[questionIndex]);
  const correct = result === val;
  const currentTime = Date.now();
  if (correct) {
    points++;
    elements.$points.innerText = points + " points";
  } else {
    end(false);
  }

  questionIndex++;
  if (questionIndex > questions.length - 1) {
    end(true);
  }

  endTime = currentTime + TOTALTIME;
}

function start() {
  state = "run";
  elements.$points.innerText = "0 points";
  startTime = Date.now();
  endTime = startTime + TOTALTIME;
  questionIndex = 0;
  points = 0;
  interval = setInterval(tick, 10);
}

function end(win) {
  state = "end";
  if (win) {
    elements.$text.innerText = "No more questions, open a pull request!";
    elements.$time.style.height = "0%";
  } else {
    elements.$text.innerText = "Game Over";
    elements.$time.style.height = "100%";
  }

  clearInterval(interval);
}

function tick() {
  const currentTime = +new Date();
  const percent = (endTime - currentTime) / TOTALTIME;

  if (percent < 0) {
    end(false);
  } else {
    elements.$text.innerText = questions[questionIndex];
    elements.$time.style.height = `${100 - 100 * percent}%`;
  }
}

function applyStyle($el, styles) {
  for (let s in styles) {
    $el.style[s] = styles[s];
  }
}

init(document.querySelector(".game"));
