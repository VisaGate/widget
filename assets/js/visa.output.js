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
/*!***********************************!*\
  !*** ./assets/src/visa.output.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var find_parent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! find-parent */ "./node_modules/find-parent/index.js");
/* harmony import */ var find_parent__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(find_parent__WEBPACK_IMPORTED_MODULE_0__);

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

depend(['m3/core/lysine', 'pipe', 'm3/core/collection'], function (Lysine, pipe, collect) {
  var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
  var language = document.querySelector('meta[name="vg.language"]').content;
  /*
   * The selection cache allows the system to persist the user's selection when
   * the UI is refreshed. Lysine will reset the selection, since the data it receives
   * does not indicate whether the selection was made.
   * 
   * Once the data has been redrawn, we will explicitly set the selection back 
   * in place.
   * 
   * @type Array
   */

  var selectionCache = [];
  return {
    init: function init(parent, api) {
      return new Promise(function (success, failure) {
        fetch(assetsURL + '/templates/' + language + '/visa.output.html').then(function (response) {
          return response.text();
        }).then(function (body) {
          parent.innerHTML = body;
          var view = new Lysine.view('visa-output');
          view.on('input', 'change', function (ev, vi) {
            this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('input[name="selected"]').value = this.dataset.product;
          });
          /*
           * Initialize the autocomplete system.
           */

          var p = pipe(function (input, output) {
            var selected = document.querySelectorAll('input.visa-result-radio:checked');
            selectionCache = [];

            for (var i = 0; i < selected.length; i++) {
              selectionCache.push([find_parent__WEBPACK_IMPORTED_MODULE_0___default().withDataAttribute(selected[i], 'pid').getAttribute('data-pid'), find_parent__WEBPACK_IMPORTED_MODULE_0___default().withDataAttribute(selected[i], 'sid').getAttribute('data-sid'), selected[i].getAttribute('data-product')]);
            }

            var passengers = input[0];

            try {
              /*
               * This extracts the data from the selection cache and
               * matches it against the data returned from the server.
               * 
               * Needs a proper refactoring, I think this was the first
               * time I needed the letter L for an iterator.
               */
              collect(selectionCache).each(function (selection) {
                collect(passengers).each(function (passenger) {
                  if (passenger._pid !== selection[0]) {
                    return;
                  }

                  collect(passenger.stops).each(function (stop) {
                    if (stop._sid !== selection[1]) {
                      return;
                    }

                    collect(stop.candidates).each(function (candidate) {
                      if (!candidate.documents[0].product) {
                        return;
                      }

                      candidate.documents[0].product.selected = candidate.documents[0].product.id === parseInt(selection[2]);
                    });
                  });
                });
              });
              view.setData({
                passengers: passengers
              });
            } catch (e) {
              console.log(e);
            }
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