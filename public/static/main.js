/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/index.js":
/*!****************************!*\
  !*** ./public/js/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/script */ \"./public/js/script.js\");\n/* harmony import */ var _js_script__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_script__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_bootstrap_scss_bootstrap_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/bootstrap/scss/bootstrap.scss */ \"./node_modules/bootstrap/scss/bootstrap.scss\");\n/* harmony import */ var _css_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/style.scss */ \"./public/css/style.scss\");\n//import * as $ from 'jquery';\n\n\n\n\n//# sourceURL=webpack://noa_app/./public/js/index.js?");

/***/ }),

/***/ "./public/js/script.js":
/*!*****************************!*\
  !*** ./public/js/script.js ***!
  \*****************************/
/***/ (() => {

eval("var popup = document.querySelector(\".login-wraper\");\nvar btn_noa_cancel = document.querySelector(\".login-wraper button.noa_app\");\nvar inputs = document.querySelectorAll(\".block-pass input\");\nvar arr_pos = [];\nvar prov = null;\n\ndocument.onkeydown = function (evt) {\n  if (!evt) evt = event;\n\n  if (evt.shiftKey && evt.keyCode === 78) {\n    on_open_windows();\n  }\n\n  if (evt.keyCode === 27) {\n    on_close_windows();\n  }\n\n  if (evt.keyCode === 8) {\n    // delete\n    pos = get_cursor_pos() - 1;\n\n    if (pos >= 0) {\n      inputs[pos].focus();\n    }\n  }\n};\n\ninputs.forEach(function (elem, index) {\n  elem.onkeyup = function () {\n    if (elem.value.length > 0) {\n      if (inputs[index + 1] !== undefined) {\n        inputs[index + 1].focus();\n      }\n\n      if (inputs.length - 1 == index) {\n        var validated = true;\n        inputs.forEach(function (e, i) {\n          if (e.value.length < 1) {\n            validated = false;\n            inputs[i].focus();\n          }\n        });\n\n        if (validated) {\n          on_close_windows();\n          var arr = [];\n          inputs.forEach(function (e) {\n            if (e.value.length > 0) {\n              arr.push(e.value);\n            }\n          });\n          send_password(arr);\n        } else {\n          console.log(\"Not verified!\");\n        }\n      }\n    }\n  };\n});\n\nbtn_noa_cancel.onclick = function () {\n  on_close_windows();\n};\n\nvar get_cursor_pos = function get_cursor_pos() {\n  var pos = -1;\n  inputs.forEach(function (elem, index) {\n    if (elem === document.activeElement) {\n      pos = index;\n    }\n  });\n  return pos;\n};\n\nvar on_open_windows = function on_open_windows() {\n  $.ajax({\n    \"url\": \"\".concat(Noa.hostname, \"request_auth\"),\n    \"method\": \"GET\",\n    \"headers\": {\n      \"Content-Type\": \"application/json\"\n    },\n    \"timeout\": 0,\n    complete: function complete(xhr, textStatus) {\n      if (xhr.status == 500) {}\n    }\n  }).done(function (response) {\n    if (response['auth']['status'] == 'OK') {\n      setTimeout(function () {\n        on_open_windows();\n      }, 1000);\n      return;\n    }\n\n    if (response['auth']['status'] == 'NOK') {\n      on_close_windows(); //return;\n    }\n\n    arr_pos = response['pos'];\n    prov = response['prov'];\n    var desc = document.querySelectorAll(\"div.desc span[char]\");\n    var texts = document.querySelectorAll(\".block-text input\");\n    texts.forEach(function (text, index) {\n      text.value = arr_pos[index];\n    });\n    desc.forEach(function (text, index) {\n      text.innerText = arr_pos[index];\n    });\n    popup.classList.add(\"show\");\n    inputs[0].focus();\n    setTimeout(function () {\n      inputs.forEach(function (e) {\n        e.value = '';\n      });\n    }, 20);\n  });\n};\n\nvar on_close_windows = function on_close_windows() {\n  popup.classList.remove(\"show\");\n  setTimeout(function () {\n    inputs.forEach(function (e) {\n      e.value = '';\n    });\n  }, 20);\n};\n\nvar send_password = function send_password(arr) {\n  console.log(arr);\n  $.ajax({\n    \"url\": \"\".concat(Noa.hostname, \"auth\"),\n    \"method\": \"POST\",\n    \"timeout\": 0,\n    \"headers\": {\n      \"Content-Type\": \"application/json\"\n    },\n    \"data\": JSON.stringify({\n      pos: arr_pos,\n      key: arr,\n      prov: prov\n    }),\n    complete: function complete(xhr, textStatus) {}\n  }).done(function (response) {\n    if (response['auth']['status'] == 'OK') {\n      location.reload();\n    }\n  });\n};\n\nvar Noa = {\n  hostname: '/api/v1/noa/',\n  $input: document.querySelector(\".wrapper input\"),\n  $textarea: document.querySelector(\".wrapper textarea\"),\n  $datalist: document.querySelector(\".main datalist#list\"),\n  time_out: 0,\n  update_time: 500,\n  time_obj_title: null,\n  time_obj_desc: null,\n  init: function init() {\n    input = Noa.$input;\n    textarea = Noa.$textarea;\n    value = input.value;\n    textarea.disabled = true;\n\n    if (value.length > 0) {\n      $.ajax({\n        \"url\": \"\".concat(Noa.hostname, \"read/\").concat(value),\n        \"method\": \"GET\",\n        \"headers\": {\n          \"Content-Type\": \"application/json\"\n        },\n        \"timeout\": Noa.time_out,\n        complete: function complete(xhr, textStatus) {\n          if (xhr.status == 500) {\n            on_open_windows();\n            return;\n          }\n        }\n      }).done(function (response) {\n        input.value = response['data']['title'];\n        textarea.value = response['data']['desc'];\n        textarea.disabled = false; // Display all title\n\n        Noa.$datalist.innerHTML = '';\n        response['titles'].forEach(function (element) {\n          var tag = document.createElement(\"option\");\n          tag.value = element;\n          Noa.$datalist.appendChild(tag);\n          console.log(tag);\n        });\n      });\n    }\n\n    input.onkeyup = function (evt) {\n      Noa.onsave_title();\n    };\n\n    textarea.onkeyup = function (evt) {\n      Noa.onsave_desc();\n    };\n  },\n  onsave_title: function onsave_title() {\n    input = Noa.$input;\n    textarea = Noa.$textarea;\n    textarea.disabled = true;\n    clearTimeout(Noa.time_obj_title);\n    Noa.time_obj_title = setTimeout(function () {\n      var value = document.querySelector(\".wrapper input\").value;\n\n      if (value.length > 0) {\n        $.ajax({\n          \"url\": \"\".concat(Noa.hostname, \"write\"),\n          \"method\": \"POST\",\n          \"timeout\": Noa.time_out,\n          \"headers\": {\n            \"Content-Type\": \"application/json\"\n          },\n          \"data\": JSON.stringify({\n            mode: 'title',\n            data: {\n              \"title\": value,\n              \"desc\": textarea.value\n            }\n          }),\n          complete: function complete(xhr, textStatus) {\n            if (xhr.status == 500) {//location.href='/';\n            }\n          }\n        }).done(function (response) {\n          input.value = response['data']['title'];\n          textarea.value = response['data']['desc'];\n          textarea.disabled = false;\n        });\n      }\n    }, Noa.update_time);\n  },\n  onsave_desc: function onsave_desc() {\n    input = Noa.$input;\n    textarea = Noa.$textarea;\n    input.disabled = true;\n    clearTimeout(Noa.time_obj_desc);\n    Noa.time_obj_desc = callback = setTimeout(function () {\n      var value = input.value;\n\n      if (value.length > 0) {\n        if (textarea.value == '') {\n          textarea.value = null;\n        }\n\n        $.ajax({\n          \"url\": \"\".concat(Noa.hostname, \"write\"),\n          \"method\": \"POST\",\n          \"timeout\": Noa.time_out,\n          \"headers\": {\n            \"Content-Type\": \"application/json\"\n          },\n          \"data\": JSON.stringify({\n            mode: 'desc',\n            data: {\n              \"title\": value,\n              \"desc\": textarea.value\n            }\n          }),\n          complete: function complete(xhr, textStatus) {\n            if (xhr.status == 500) {//location.href='/';\n            }\n          }\n        }).done(function (response) {\n          textarea.value = response['data']['desc'];\n          input.disabled = false;\n          console.log(response['titles']); // Display all title\n\n          Noa.$datalist.innerHTML = '';\n          response['titles'].forEach(function (element) {\n            var tag = document.createElement(\"option\");\n            tag.value = element;\n            Noa.$datalist.appendChild(tag);\n          });\n        });\n      }\n    }, Noa.update_time);\n  }\n};\nNoa.init();\n\n//# sourceURL=webpack://noa_app/./public/js/script.js?");

/***/ }),

/***/ "./node_modules/bootstrap/scss/bootstrap.scss":
/*!****************************************************!*\
  !*** ./node_modules/bootstrap/scss/bootstrap.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://noa_app/./node_modules/bootstrap/scss/bootstrap.scss?");

/***/ }),

/***/ "./public/css/style.scss":
/*!*******************************!*\
  !*** ./public/css/style.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://noa_app/./public/css/style.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/js/index.js");
/******/ 	
/******/ })()
;