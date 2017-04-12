const Board = require('./board');
const Tile = require('./tile');
const DataTransfer = require('./data-transfer');
const blockCoordinates = require('./blockCoordinates');

var $ = require('jquery');
var currentBoard;
var emptyNodes = [];
var newTileData = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

function Game(canvas, context){
  this.canvas = canvas;
  this.context = context;
  startNewGame(canvas, context);
}

Game.prototype.keyFunctions = function (keyCode) {
  if(keyCode === 38) {
    transferData(currentBoard.upLists);
  }
  if (keyCode === 40) {
    transferData(currentBoard.downLists);
  }
  if (keyCode === 37) {
    transferData(currentBoard.leftLists);
  }
  if (keyCode === 39) {
    transferData(currentBoard.rightLists);
  }
  generateNewTile(this.context);
  checkForEndGame();
  drawTiles(this.context);
};

function transferData(lists) {
  lists.forEach(function(list){
    new DataTransfer(list);
  });
}

function generateNewTile(context) {
  checkForOpenTiles();
  var theChosenOne = shuffle(emptyNodes)[0];
  if (emptyNodes.length > 0) {
    theChosenOne.data = shuffle(newTileData)[0];
    var tile = new Tile({currentNode: theChosenOne, context: context});
    tile.drawTile();
  }
}

function startNewGame(canvas, context) {
  context.clearRect(0,0, canvas.width, canvas.height);
  currentBoard = new Board(context);
  placeStartingTiles(context);
  $("canvas").show();
  $("#game-over").hide();
}

function checkForEndGame() {
  var playableNodes = [];
  currentBoard.nodes.forEach(function(node){
    if (node.data === null || validNeighbors(node)) {
      playableNodes.push(node);
    }
  });
  if (playableNodes.length === 0 || winTheGame()) {
    $("canvas").hide();
    $("#game-over").fadeIn(500);
  }
}

function winTheGame(){
  var winningTiles = [];
  currentBoard.nodes.forEach(function (node) {
    if (node.data === 2048) {
      $("#game-over").find("h1").text("You won!");
      winningTiles.push(node);
    }
  });
  if (winningTiles.length > 0) {
    return true;
  }
}

function validNeighbors(node) {
  if (node.data === node.leftNode.data ||
      node.data === node.rightNode.data ||
      node.data === node.upNode.data ||
      node.data === node.downNode.data) {
    return true;
  }
}

function drawTiles(context) {
  currentBoard.nodes.forEach(function(node) {
    var tile = new Tile({currentNode: node, context: context});
    tile.drawTile();
  });
}

function checkForOpenTiles() {
  emptyNodes = [];
  currentBoard.nodes.forEach(function (node) {
    if(node.data === null) {
       emptyNodes.push(node);
    }
  });
}

function shuffle(array) {
  var j, x, i;
  for (i = array.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = array[i - 1];
    array[i - 1] = array[j];
    array[j] = x;
   }
   return array;
}

function placeStartingTiles(context) {
  var randomNodes = shuffle(currentBoard.nodes);
  placeTile(context, randomNodes[0]);
  placeTile(context, randomNodes[1]);
}

function placeTile(context, node){
  var randomCoord = blockCoordinates[node.id];
  randomCoord.context = context;
  node.data = shuffle(newTileData)[0];
  var randomTile = new Tile(randomCoord);
  randomTile.currentNode = node;
  randomTile.drawTile();
}

module.exports = Game;
