/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hello I'm JokeBot."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var name;
  var answer;
  var question;
  var waitTime

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    userName = input;
    answer = 'Hi ' + userName + ' :-)'; // output response
    waitTime = 5000;
    question = 'Would you like to hear a joke?'; // load next question
  } else if (questionNum == 1) {
    if (input.toLowerCase() === 'yes' || input === 1){
      answer = 'Heh heh, alright you\'re gonna love this.' 
      waitTime = 5000;
      question = 'What has 4 wheels and flies?'; // load next question
    } else if (input.toLowerCase() === 'no' || input === 0){
      answer = 'Aw come on... Its really funny!'
      waitTime = 5000;
      question = 'What has 4 wheels and flies?';}
  } else if (questionNum == 2) {
    socket.emit('changeBG', 'blue');
    answer = 'A garbage truck!!!';
    waitTime = 5000;
    question = 'Wasn\'t that funny ' + userName + ' ?'; // load next question
  } else if (questionNum == 3) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Thanks! I\'ve been working on my jokes.';
      waitTime = 5000;
      question = 'Do you want to hear another?';
    } else if (input.toLowerCase() === 'no' || input === 0) {
      answer = 'I thought it was pretty funny...'
      question = 'Do you want to hear another?';
      waitTime = 5000;
    }
    // load next question
  } else if (questionNum == 4) {
    if (input.toLowerCase() === 'yes' || input === 1){
      answer = 'Alright.' 
      waitTime = 5000;
      question = 'What\'s the difference between a velodrome and a palindrome?'; // load next question
    } else if (input.toLowerCase() === 'no' || input === 0){
      answer = 'You\'re kind of boring aren\'t you?'
      waitTime = 5000;
      question = 'What\'s the difference between a velodrome and a palindrome?';}
  } else if (questionNum == 5) {
    answer = 'For one, you have to use a bicycle. For the other, you can use a racecar!'
    waitTime = 5000;
    question = 'Okay, you have to admit that one was pretty good, wasn\'t it?';
  } else {
    if (input.toLowerCase() === 'yes' || input === 1){
    answer = 'Thanks. Maybe I\'ll become a comic.';
    question = ''; 
    } else if (input.toLowerCase() === 'no' || input === 0){
      answer = '>:('
      question = '';}
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
