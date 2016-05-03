var Game = function(){};

Game.questions = [
  '!0',
  '+true === NaN',
  '+true === 1',
  '(new Date()).getTime() === +new Date()',
  '010 === 10',
  '0x10 > 010',
  '"1" + 1 + 1 === "111"',
  '1 + 1 + "1" === "111"',
  '!!~~"0.5"',
  "~1 === -1",
  "Infinity/Infinity === 1",
  'var a = 1; a++ + ++a === 2',
  'null == undefined',
  'NaN === NaN',
  '[0][0] === 0',
  '({a: true})["a"]',
  '1|2 === 1||2',
  '1<<1<<1 === 2',
  '2>>>1 === 1',
  'Object.assign({a:true}, {a:false}, {a:false})["a"]'
];

Game.colors = {
  green: '#91c579',
  red: '#e36664'
};

Game.TOTALTIME = 10000;
Game.AWARD = 5000;

Game.prototype.init = function($el){
  this.$el = $el;

  //randomize the questions, but always start with the first easy one.
  var easy = Game.questions.shift();
  Game.questions.sort(function(){return Math.random() < .5 ? -1 : 1});
  Game.questions.unshift(easy);

  var textStyle = {
    position : 'absolute',
    fontFamily : 'monospace',
    zIndex : 2,
    color: 'black'
  };

  Game.applyStyle(this.$el, {
    backgroundColor : Game.colors.green,
    position : 'relative',
    width : '100%',
    height : '100%',
    fontSize : '2em'
  });

  this.$text = document.createElement('div');
  this.$text.innerText = "Click on the screen to start. \nPress on the right side for true, and left side for false.";
  Game.applyStyle(this.$text, Object.assign({}, textStyle, {
    padding : '20px',
    transform : 'translateY(-50%)',
    top : '50%',
    width : 'calc(100% - 40px)',
    textAlign : 'center'
  }));

  this.$time = document.createElement('div');
  Game.applyStyle(this.$time, {
    backgroundColor : Game.colors.red,
    padding : 0,
    position : 'relative',
    width : '100%',
    top : '0px'
  });

  this.$points = document.createElement('div');
  this.$points.innerText = '0 points';
  Game.applyStyle(this.$points, Object.assign({}, textStyle, {
    top : '10px',
    right : '10px'
  }));

  this.$github = document.createElement('a');
  this.$github.setAttribute('href','https://github.com/peterlindkvist/truefalse');
  this.$github.innerText = 'Fork me!';
  Game.applyStyle(this.$github, Object.assign({}, textStyle, {
    top : '10px',
    left : '10px'
  }));

  this.$left = document.createElement('div');
  this.$left.innerText = 'false';
  Game.applyStyle(this.$left, Object.assign({}, textStyle, {
    bottom : '10px',
    left : '10px'
  }));

  this.$right = document.createElement('div');
  this.$right.innerText = 'true';
  Game.applyStyle(this.$right, Object.assign({}, textStyle, {
    bottom : '10px',
    right : '10px'
  }));

  this.$el.appendChild(this.$text);
  this.$el.appendChild(this.$time);
  this.$el.appendChild(this.$points);
  this.$el.appendChild(this.$github);
  this.$el.appendChild(this.$left);
  this.$el.appendChild(this.$right);

  this.$el.addEventListener('click', this.clickHandler.bind(this));

  this.state = 'init';
};

Game.prototype.clickHandler = function(e){
  if(this.state !== 'run'){
    this.start();
  } else {
    this.calculate(e.x > this.$el.offsetWidth / 2);
  }
};

Game.prototype.calculate = function(val){
  var result = eval(Game.questions[this.pos]);
  var correct = result === val;
  var currentTime = +new Date();
  if(correct){
    this.points ++;
    this.$points.innerText = this.points + ' points'
  }

  this.pos ++;
  if(this.pos > Game.questions.length - 1){
    this.end(true);
  }

  this.endTime += correct ? Game.AWARD : -Game.AWARD;

  if(this.endTime - Game.TOTALTIME > currentTime){
    this.endTime = currentTime + Game.TOTALTIME;
  }
};

Game.prototype.start = function(){
  this.state = 'run';
  this.$points.innerText = '0 points';
  this.startTime = + new Date();
  this.endTime = this.startTime + Game.TOTALTIME;
  this.pos = 0;
  this.points = 0;
  this.interval = setInterval(this.tick.bind(this), 10);
};


Game.prototype.end = function(win){
  this.state = 'end';
  if(win){
    this.$text.innerText = 'No more questions, open a pull request!';
    this.$time.style.height = '0%';
  } else {
    this.$text.innerText = 'Game Over';
    this.$time.style.height = '100%';
  }

  clearInterval(this.interval);
};

Game.prototype.tick = function(){
  var currentTime = + new Date();
  var percent = (this.endTime - currentTime) / Game.TOTALTIME;

  if(percent < 0){
    this.end(false);
  } else {
    this.$text.innerText = Game.questions[this.pos];
    this.$time.style.height = 100 - 100 * percent + '%';
  }
};

Game.applyStyle = function($el, styles){
  for(var s in styles){
    $el.style[s] = styles[s];
  }
};

var g = new Game();
g.init(document.querySelector('.game'));