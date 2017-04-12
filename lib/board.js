const StaticNode = require('./static-node');
const List = require('./node-list');
const blockCoordinates = require('./blockCoordinates');
var $ = require('jquery');

function Board(context){
  this.nodes = [];
  setupNodeGrid(this.nodes);
  this.upLists = createLists("up", this.nodes);
  this.downLists = createLists("down", this.nodes);
  this.leftLists = createLists("left", this.nodes);
  this.rightLists = createLists("right", this.nodes);
  setupBoard(context);
}

function setupBoard(context) {
  context.fillStyle="#FFB266";
  drawGrid(context);
  var initialHighScore = localStorage.getItem("high-score");
  $('#high-score').html(initialHighScore);
}

function drawGrid(context) {
  Object.keys(blockCoordinates).forEach(function(key) {
    context.strokeRect(blockCoordinates[key].x, blockCoordinates[key].y, 100, 100);
  });
}

function setupNodeGrid(nodes){
  Object.keys(blockCoordinates).forEach(function(key) {
    var newNode = new StaticNode({id: key});
    nodes.push(newNode);
  });
  setNodeRelationships(nodes);
  return nodes;
}

function setNodeRelationships(nodes) {
  nodes.forEach(function(node) {
    assignNeighbors(node, nodes);
  });
}

var edgeIds = {"up": ["1", "2", "3", "4"],
               "down": ["13", "14", "15", "16"],
               "left": ["1", "5", "9", "13"],
               "right": ["4", "8", "12", "16"]};

function assignNeighbors(node, nodes) {
  ["up", "down", "left", "right"].forEach(function(direction) {
    if (edgeIds[direction].indexOf(node.id) > -1) {
      setEdge(node, direction);
    } else {
      var currentNodeIndex = nodes.indexOf(node);
      if (direction === "up") {
        node.upNode = nodes[currentNodeIndex - 4];
      }
      if (direction === "down") {
        node.downNode = nodes[currentNodeIndex + 4];
      }
      if (direction === "left") {
        node.leftNode = nodes[currentNodeIndex - 1];
      }
      if (direction === "right") {
        node.rightNode = nodes[currentNodeIndex + 1];
      }
    }
  });
}

function setEdge(node, direction) {
  if (direction === "up") {
    node.upNode = "edge";
  }
  if (direction === "down") {
    node.downNode = "edge";
  }
  if (direction === "left") {
    node.leftNode = "edge";
  }
  if (direction === "right") {
    node.rightNode = "edge";
  }
}

function createLists(direction, nodes) {
  var directionalIds = edgeIds[direction];
  var lists = [];
  nodes.forEach(function(node) {
    if (directionalIds.indexOf(node.id) > -1) {
      var newList = new List({head: node, direction: direction});
      lists.push(newList);
    }
  });
  return lists;
}

module.exports = Board;
