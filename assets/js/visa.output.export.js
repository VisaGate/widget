/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/find-parent/index.js":
/*!*******************************************!*\
  !*** ./node_modules/find-parent/index.js ***!
  \*******************************************/
/***/ ((module) => {



var FindParent = {
  byMatcher: function(element, func, opts) {
    if (opts === undefined) {
      opts = {};
    }

    if (opts === null || Array.isArray(opts) || typeof opts !== 'object') {
      throw new Error('Expected opts to be an object.');
    }

    if (!element || element === document) {
      if (opts.throwOnMiss) {
        throw new Error('Expected to find parent node, but none was found.');
      }

      return undefined;
    }

    if (func(element)) {
      return element;
    }

    return this.byMatcher(element.parentNode, func, opts);
  },

  byClassName: function(element, className, opts) {
    return this.byMatcher(element, function(el) {
      return el.classList.contains(className);
    }, opts);
  },

  withDataAttribute: function(element, attName, opts) {
    return this.byMatcher(element, function(el) {
      return el.dataset.hasOwnProperty(attName);
    }, opts);
  }
};

module.exports = FindParent;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./assets/src/visa.output.export.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var find_parent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! find-parent */ "./node_modules/find-parent/index.js");
/* harmony import */ var find_parent__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(find_parent__WEBPACK_IMPORTED_MODULE_0__);

depend(['m3/core/collection', 'pipe', 'm3/core/parent'], function (collect, pipe) {
  var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
  var language = document.querySelector('meta[name="vg.language"]').content;

  var makeSelection = function makeSelection() {
    var selected = document.querySelectorAll('input.visa-result-radio:checked');
    var selection = [];

    for (var i = 0; i < selected.length; i++) {
      selection.push(find_parent__WEBPACK_IMPORTED_MODULE_0___default().withDataAttribute(selected[i], 'pid').getAttribute('data-pid') + '-' + find_parent__WEBPACK_IMPORTED_MODULE_0___default().withDataAttribute(selected[i], 'sid').getAttribute('data-sid') + '-' + selected[i].getAttribute('data-product'));
    }

    return selection;
  };

  return {
    init: function init(parent, api) {
      return new Promise(function (success, failure) {
        fetch(assetsURL + '/templates/' + language + '/visa.output.export.html').then(function (response) {
          return response.text();
        }).then(function (body) {
          parent.innerHTML = body;
          var payload = undefined;
          parent.querySelector("#pdf-export").addEventListener('click', function () {
            console.log('PDF Exporter received CALL');
            var button = this;
            button.classList.add('busy');
            button.classList.remove('idle');
            /*
             * Add the selection to the request.
             */

            payload.selection = makeSelection();
            fetch(api + '/generate/pdf', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(payload)
            }).then(function (response) {
              return response.blob();
            }).then(function (body) {
              try {
                var url = window.URL.createObjectURL(body);
                var a = document.createElement('a');
                a.download = 'erstinformation.pdf';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                  a.parentNode.removeChild(a);
                }, 200);
              } catch (e) {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveOrOpenBlob(body, 'erstinformation.pdf');
                } else {
                  throw e;
                }
              }

              button.classList.add('idle');
              button.classList.remove('busy');
            })["catch"](console.error);
          });
          parent.querySelector("#pdf-email").addEventListener('click', function () {
            console.log('PDF Exporter received CALL');
            payload.email = document.getElementById('email-address').value;
            fetch(api + '/email/send', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(payload)
            }).then(function (response) {
              alert('Email will be delivered in a few minutes');
            })["catch"](console.error);
          });
          var p = pipe(function (input, output) {
            var people = input[0].people;
            var stops = input[0].stops;
            payload = {
              people: collect(people).each(function (e) {
                return {
                  name: e.name,
                  documents: [e.document],
                  _pid: e._pid
                };
              }).raw(),
              stops: collect(stops).each(function (e) {
                return {
                  country: e.ISO,
                  reason: e.reason,
                  _sid: e._sid
                };
              }).raw()
            };
          });
          success(p);
        })["catch"](console.error);
      });
    }
  };
});
})();

/******/ })()
;