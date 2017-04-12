var $ = require('jquery');
var score = 0;
var highScore = 0 || JSON.parse(localStorage.getItem("high-score"));


function transferData(list) {
  compact(list.head, list.direction);
  updateData(list.head, list.direction);
  compact(list.head, list.direction);
}

function updateData(activeNode, direction) {
  var nextNode = nextNodeLookup(activeNode, direction);
  if (nextNode === "edge") {
    console.log("done updating");
  }
  else if(activeNode.data === nextNode.data) {
    nextNode.data = null;
    if (activeNode.data === null) {
      updateData(nextNode, direction);
    } else {
      activeNode.data = activeNode.data * 2;
      addToScore(activeNode.data);
      updateData(nextNode, direction);
    }
  } else {
    updateData(nextNode, direction);
  }
}

function compact(activeNode, direction) {
  var nextNode = nextNodeLookup(activeNode, direction);
  var previousNode = previousNodeLookup(activeNode, direction);
  if (activeNode === "edge") {
    console.log("done shifting");
  } else if (activeNode.data === null) {
    compact(nextNode, direction);
  } else if (previousNode.data === null && previousNode !== "edge") {
    slideOne(activeNode, direction);
    compact(previousNode, direction);
  } else if (previousNode.data !== null || previousNode === "edge") {
    compact(nextNode, direction);
  } else {
    compact(nextNode, direction);
  }
}

function slideOne(activeNode, direction) {
  var previousNode = previousNodeLookup(activeNode, direction);
  previousNode.data = activeNode.data;
  activeNode.data = null;
}

function nextNodeLookup(node, direction) {
  if (direction === "right") {
    return node.leftNode;
  }
  if (direction === "left") {
    return node.rightNode;
  }
  if (direction === "up") {
    return node.downNode;
  }
  if (direction === "down") {
    return node.upNode;
  }
}

function previousNodeLookup(node, direction) {
  if (direction === "right") {
    return node.rightNode;
  }
  if (direction === "left") {
    return node.leftNode;
  }
  if (direction === "up") {
    return node.upNode;
  }
  if (direction === "down") {
    return node.downNode;
  }
}

function addToScore(updatedData) {
  score += updatedData;
  $("#zero-score").hide();
  $("#score").html(score);
    if (score > highScore) {
      localStorage.setItem("high-score", JSON.stringify(score));
      var newHighScore = localStorage.getItem("high-score");
      $("#high-score").html(newHighScore);
    }
  }

module.exports = transferData;
