/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var styles = {
  "Style 1": "style.css",
  "Style 2": "style2.css",
  "Style 3": "style3.css"
};
var currentStyle = "style.css";
function switchStyle(styleName) {
  var styleLink = document.getElementById("current-style");
  if (styleLink) {
    styleLink.href = styles[styleName];
    currentStyle = styles[styleName];
  }
}
function createStyleLinks() {
  var styleLinksContainer = document.getElementById("style-links");
  if (styleLinksContainer) {
    var _loop = function _loop(styleName) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = styleName;
      a.addEventListener("click", function (event) {
        event.preventDefault();
        switchStyle(styleName);
      });
      li.appendChild(a);
      styleLinksContainer.appendChild(li);
    };
    for (var styleName in styles) {
      _loop(styleName);
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  createStyleLinks();
});
/******/ })()
;