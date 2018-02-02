webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = addStylesClient;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__listToStyles__ = __webpack_require__(3);
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeComponent;
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  scriptExports = scriptExports || {}

  // ES6 modules interop
  var type = typeof scriptExports.default
  if (type === 'object' || type === 'function') {
    scriptExports = scriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = listToStyles;
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__step_1_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__step_2_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__step_3_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__step_4_vue__ = __webpack_require__(40);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      step: 1
    }
  },

  computed: {
    guests: {
      get() {
        return this.$store.state.reservation.guests
      },

      set(value) {
        this.$store.commit('reservation/guests', value)
      }
    }
  },

  methods: {
    setStep(step) {
      if(step > this.step) return
      this.step = step
    },

    next() {
      this.step++
    }
  },

  components: {
    step1: __WEBPACK_IMPORTED_MODULE_0__step_1_vue__["a" /* default */],
    step2: __WEBPACK_IMPORTED_MODULE_1__step_2_vue__["a" /* default */],
    step3: __WEBPACK_IMPORTED_MODULE_2__step_3_vue__["a" /* default */],
    step4: __WEBPACK_IMPORTED_MODULE_3__step_4_vue__["a" /* default */]
  }
});


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  model: {
    prop: 'guests',
    event: 'update'
  },
  props: {
    guests: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      current_guests: this.guests,
      showMore: false
    }
  },
  mounted() {
    this.showMore = this.current_guests > 8
  },
  methods: {
    setGuests(guests) {
      this.current_guests = guests
      this.$emit('update', guests)
    },
    toggleShowMore() {
      this.showMore = !this.showMore
    }
  }
});


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__calendar_vue__ = __webpack_require__(31);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      year: null,
      month: null,
      seats: [],
      timetable: [11, 12, 13, 14, 15, 16]
    }
  },

  computed: {
    reservation() {
      return this.$store.state.reservation
    }
  },

  mounted() {
    this.year = this.reservation.date.year
    this.month = this.reservation.date.month
    this.updateSeats(this.year, this.month)
  },

  methods: {
    setDate(day, month, year) {
      this.$store.commit('reservation/date', {
        year: year,
        month: month,
        day: day,
        hour: 0
      })
    },

    setHour(hour) {
      this.$store.commit('reservation/date', {
        year: this.reservation.date.year,
        month: this.reservation.date.month,
        day: this.reservation.date.day,
        hour: hour
      })
    },

    getStatus(day) {
      if(this.seats[day] >= this.reservation.guests) {
        return '<i class="fa fa-circle-o"></i>'
      } else if(this.seats[day] > 0) {
        return '<i class="fa fa-sort-asc"></i>'
      } else {
        return '--'
      }
    },

    updateSeats(year, month, resetHour = false) {
      this.year = year
      this.month = month
      if(resetHour) {
        this.setHour(null)
      }
      this.$http.get('/api/v1/schedule/' + year + '/' + month).then(response => {
        this.seats = {}
        response.body.forEach(day => {
          this.seats[day.day] = day.free_seats
        })
      })
    },

    book(hour) {
      this.$store.commit('reservation/seats', Math.min(this.reservation.guests, this.seats[this.reservation.date.day] || 0))
      if(this.reservation.seats <= 0) return
      this.setHour(hour)
    }
  },

  components: {
    calendar: __WEBPACK_IMPORTED_MODULE_0__calendar_vue__["a" /* default */]
  }
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const MATRIX_MAX = 7 * 6,
      WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let bMonthRe = /^1?$|3|5|7|8|10|12/;

/* harmony default export */ __webpack_exports__["a"] = ({
  props: {
    getData: {
      type: Function,
      required: true
    },
    selected: {
      type: Date
    }
  },

  data() {
    return {
      time: this.selected || new Date(),
      weeks: WEEKS
    }
  },

  computed: {
    isRunYear() {
      return ((this.year % 4 === 0) && (this.year % 100 !== 0));
    },

    firstDayWeek() {
      return new Date(
        this.year
        , this.month - 1
        , 1
      )
      .getDay();
    },

    year() {
      return this.time.getFullYear()
    },

    month() {
      return this.time.getMonth() + 1
    },

    days() {
      return this.getDaysList();
    },

    currentDay() {
      return this.time.getDate();
    },

    currentMonth() {
      return (new Date()).getMonth() + 1;
    }
  },

  methods: {
    pad(num, size) {
      var s = num + "";
      while(s.length < size) {
        s = "0" + s;
      }
      return s;
    },

    adjustMonth(count) {
      var time = new Date(this.time);
      time.setMonth(time.getMonth() + count);
      this.time = time;
      this.$emit('change:month', { year: time.getFullYear(), month: time.getMonth() + 1 });
    },

    select(day) {
      this.$emit('select', day, this.month, this.year);
    },

    isSelected(day) {
      return this.selected.getFullYear() == day.year && this.selected.getMonth() + 1 == day.month && this.selected.getDate() == day.day;
    },

    _getPreMonthDays(month, offset) {
      if(offset === 0) {
        return [];
      } else if(month === 1) {
        return this.getDays(12).slice(-offset);
      } else {
        return this.getDays(month - 1).slice(-offset);
      }
    },

    _getNextMonthDays(month, offset) {
      if(month === 12) {
        return this.getDays(1).slice(0, offset);
      } else {
        return this.getDays(month + 1).slice(0, offset);
      }
    },

    _getRangeList(range, start) {
      var i = start || 1, _list = [];
      for(;i <= range;i ++) {
        _list.push(i);
      }
      return _list;
    },

    getDays(month) {
      if(bMonthRe.test(month)) {
        return this._getRangeList(31);
      } else if(month === 2) {
        if(this.isRunYear) {
          return this._getRangeList(29);
        } else {
          return this._getRangeList(28);
        }
      } else {
        return this._getRangeList(30);
      }
    },

    getDaysList() {
      let _needConcatLength = this.getDays(this.month).length + this.firstDayWeek;
      // debugger;
      let _initList = this._getPreMonthDays(this.month, this.firstDayWeek)
          .map((preMonthday) => {
            return {
              'year': this.month === 1 ? this.year - 1 : this.year,
              'month': this.month === 1 ? 12 : this.month - 1,
              'day': preMonthday,
              'isPreMonth': true
            };
          });

      if(MATRIX_MAX <= _needConcatLength) {
        let _thisMonthDaysList = this.getDays(this.month).slice(
          0
          , this.getDays(this.month).length - (_needConcatLength - MATRIX_MAX)
        )
        return _initList
          .concat(_thisMonthDaysList.map((day) => {
            let _dateObj = {
              'year': this.year,
              'month': this.month,
              'isThisMonthDay': true,
              'day': day
            };
            if(day === this.currentDay && this.month === this.currentMonth) {
                _dateObj.isToday = true;
            }
            return _dateObj;
          }));
      } else {
        return _initList
        .concat(this.getDays(this.month).map((day) => {
          let _dateObj = {
            'year': this.year,
            'month': this.month,
            'isThisMonthDay': true,
            'day': day
          };
          if(day === this.currentDay && this.month === this.currentMonth) {
              _dateObj.isToday = true;
          }
          return _dateObj;
        }))
        .concat(
          this._getNextMonthDays(
            this.month
            , MATRIX_MAX - _needConcatLength
          ).map((nextMonthDay) => {
            return {
              'year': this.month === 12 ? this.year + 1 : this.year,
              'month': this.month === 12 ? 1 : this.month + 1,
              'day': nextMonthDay,
              'isNextMonth': true
            };
          })
        )
      }

      }
  }
});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      errors: {
        name: false,
        phone: false,
        email: false,
        password: false
      }
    }
  },

  computed: {
    name: {
      get() { return this.$store.state.identification.name },
      set(value) { this.$store.commit('identification/name', value) }
    },

    phone: {
      get() { return this.$store.state.identification.phone },
      set(value) { this.$store.commit('identification/phone', value) }
    },

    email: {
      get() { return this.$store.state.identification.email },
      set(value) { this.$store.commit('identification/email', value) }
    },

    password: {
      get() { return this.$store.state.identification.password },
      set(value) { this.$store.commit('identification/password', value) }
    }
  },

  methods: {
    checkForm() {
      let hasError = false

      this.errors.name = this.name.length < 1
      hasError = hasError || this.errors.name

      this.errors.phone = this.phone.length < 1
      hasError = hasError || this.errors.phone

      this.errors.email = this.email.length < 1
      hasError = hasError || this.errors.email

      this.errors.password = this.password.length < 1
      hasError = hasError || this.errors.password

      if(hasError) return

      this.$emit('next')
    }
  },
});


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_stripe_checkout__ = __webpack_require__(43);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



Vue.use(__WEBPACK_IMPORTED_MODULE_0_vue_stripe_checkout__["a" /* default */], {
  key: 'pk_test_EAj5BTkLoiJS3DWC3O6M4q78',
  locale: 'auto'
})

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
    }
  },

  computed: {
    reservation() {
      return this.$store.state.reservation
    },

    identification() {
      return this.$store.state.identification
    }
  },

  methods: {
    reservationDate() {
      return (new Date(this.reservation.date.year, this.reservation.date.month-1, this.reservation.date.day)).toLocaleString("en-us", { year: "numeric", month: "long", day: "2-digit" })
    },

    reserve() {
      let data = {
        reservation: {
          guests: this.reservation.seats,
          date: {
            year: this.reservation.date.year,
            month: this.reservation.date.month,
            day: this.reservation.date.day,
            hour: this.reservation.date.hour
          }
        },
        identification: {
          name: this.identification.name,
          phone: this.identification.phone,
          email: this.identification.email,
          password: this.identification.password
        }
      }
      this.$http.post('/api/v1/reservations', data).then(response => {
        this.checkout(response.data)
      }, error => {
        alert(error.body.errors)
      })
    },

    checkout(reservation) {
      let self = this
      this.$checkout.open({
        name: `A table for ${this.reservation.seats} person on ${this.reservationDate()}`,
        currency: 'USD',
        amount: 100,
        panelLabel: 'Pay {{amount}}',
        token(token) {
          self.$http.post(`/api/v1/reservations/${reservation.id}/pay`, { token: token.id }).then(response => {
            alert('Reserved')
          }, error => {
            alert(error.body.errors)
          })
        }
      })
    }
  }
});


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_index_vue__ = __webpack_require__(19);


document.addEventListener('DOMContentLoaded', () => {
  const store = new Vuex.Store({
    modules: {
      reservation: {
        namespaced: true,

        state: {
          guests: 2,
          seats: 0,
          date: {
            year: (new Date).getFullYear(),
            month: (new Date).getMonth() + 1,
            day: (new Date).getDate(),
            hour: null //12
          }
        },

        mutations: {
          guests(state, count) {
            state.guests = count
          },

          seats(state, count) {
            state.seats = count
          },

          date(state, date) {
            state.date = date
          }
        }
      },

      identification: {
        namespaced: true,

        state: {
          name: '', //'John Smith',
          phone: '', //'+1234567890',
          email: '', //'test@gmail.com',
          password: ''//'qweQWE123'
        },

        mutations: {
          name(state, value) {
            state.name = value
          },

          phone(state, value) {
            state.phone = value
          },

          email(state, value) {
            state.email = value
          },

          password(state, value) {
            state.password = value
          }
        }
      }
    }
  })

  const app = new Vue({
    el: 'app',
    template: '<wizard />',

    components: {
      wizard: __WEBPACK_IMPORTED_MODULE_0__wizard_index_vue__["a" /* default */]
    },

    store
  })
})


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(5);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1bad45ea_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(20)
  __webpack_require__(22)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1bad45ea"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1bad45ea_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1bad45ea_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/wizard/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1bad45ea", Component.options)
  } else {
    hotAPI.reload("data-v-1bad45ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("20c18af0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1bad45ea\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1bad45ea\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.wizard[data-v-1bad45ea] {\n  width: 100%;\n  height: 100%;\n}\n.wizard .steps[data-v-1bad45ea] {\n    background-color: #f4a57c;\n    float: left;\n}\n.wizard .steps .step[data-v-1bad45ea] {\n      float: left;\n      padding: 0.9rem;\n}\n.wizard .steps .step .element[data-v-1bad45ea] {\n        float: left;\n        margin: 1rem;\n        background-color: #d9d6d6;\n        border: 4px solid #d9d6d6;\n        color: #f4a57c;\n        width: 1.7em;\n        height: 1.7em;\n        border-radius: 1.7em;\n        text-align: center;\n        font-size: 26px;\n}\n.wizard .steps .step .element.active[data-v-1bad45ea] {\n          cursor: pointer;\n          background-color: white;\n          border: 4px solid white;\n}\n.wizard .steps .step .caption[data-v-1bad45ea] {\n        color: white;\n        float: left;\n        margin-top: 2rem;\n        font-weight: bold;\n        display: none;\n}\n.wizard .content[data-v-1bad45ea] {\n    width: auto;\n    height: 100%;\n    padding-top: 1rem;\n}\n@media (max-width: 767px) {\n.wizard .steps[data-v-1bad45ea], .wizard .content[data-v-1bad45ea] {\n    clear: both;\n    width: 100%;\n}\n.wizard .steps .step[data-v-1bad45ea] {\n    width: 25%;\n}\n.wizard .steps .step .element[data-v-1bad45ea] {\n      float: none;\n      margin: auto auto;\n}\n}\n@media (min-width: 768px) {\n.wizard .steps[data-v-1bad45ea] {\n    width: 10rem;\n    height: 100vh;\n}\n.wizard .steps .step[data-v-1bad45ea] {\n      clear: both;\n}\n.wizard .content[data-v-1bad45ea] {\n    margin-left: 10rem;\n}\n}\n@media (min-width: 992px) {\n.wizard .steps[data-v-1bad45ea] {\n    width: 30rem;\n}\n.wizard .steps .step .caption[data-v-1bad45ea] {\n      display: initial;\n}\n.wizard .content[data-v-1bad45ea] {\n    margin-left: 30rem;\n}\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("3170b3ea", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1bad45ea\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./index.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1bad45ea\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.wizard .content h4 {\n  text-transform: uppercase;\n  text-align: center;\n  color: #f4a57c;\n  font-weight: bold;\n}\n.btn-next {\n  margin-top: 2rem;\n  width: 100%;\n}\n.btn-next button {\n    border-radius: 1rem;\n    padding: 1rem 0;\n    border: 2px #9a9a9a solid;\n    color: white;\n    font-weight: bold;\n    background-color: #a9a9a9;\n    width: 22rem;\n}\n.btn-next button:hover {\n      margin-top: initial !important;\n      border-bottom-width: 2px !important;\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_1_vue__ = __webpack_require__(6);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ccac0d4_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_1_vue__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(25)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3ccac0d4"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_1_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ccac0d4_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_1_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ccac0d4_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_1_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/wizard/step_1.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ccac0d4", Component.options)
  } else {
    hotAPI.reload("data-v-3ccac0d4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("50cd00fc", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3ccac0d4\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_1.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3ccac0d4\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_1.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.grid-container[data-v-3ccac0d4] {\n  text-align: center;\n  padding: 1.5rem;\n  width: 24rem;\n  height: 13rem;\n  margin: auto;\n}\n.grid-container .grid-cell[data-v-3ccac0d4] {\n    cursor: pointer;\n    width: 4rem;\n    height: 4rem;\n    padding: 0.2rem;\n    font-weight: bold;\n    margin-bottom: 1rem;\n    margin-right: 1rem;\n    float: left;\n    border: 4px solid #f9f6f2;\n    border-radius: 3px;\n    background: #f9f6f2;\n    color: #a9a9a9;\n    font-size: xx-large;\n}\n.grid-container .grid-cell.active[data-v-3ccac0d4] {\n      border: 4px solid #f4a57c;\n}\n.show-more[data-v-3ccac0d4] {\n  font-size: x-large;\n  cursor: pointer;\n  color: #a9a9a9;\n}\nselect.guests-count[data-v-3ccac0d4] {\n  margin-top: 2rem;\n  margin-left: auto;\n  margin-right: auto;\n  width: 22rem;\n}\n@media (min-width: 768px) {\n.grid-container[data-v-3ccac0d4] {\n    padding: 2rem;\n    height: 17rem;\n    width: 33rem;\n}\n.grid-container .grid-cell[data-v-3ccac0d4] {\n    width: 6rem;\n    height: 6rem;\n    padding: 1rem;\n}\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("h4", [_vm._v("How many person?")]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "grid-container" },
      _vm._l(8, function(index) {
        return _c(
          "div",
          {
            staticClass: "grid-cell",
            class: { active: _vm.current_guests == index },
            on: {
              click: function($event) {
                _vm.setGuests(index)
              }
            }
          },
          [_vm._v("\n      " + _vm._s(index) + "\n    ")]
        )
      })
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "show-more",
        on: {
          click: function($event) {
            _vm.toggleShowMore()
          }
        }
      },
      [_vm._v("\n    more\n  ")]
    ),
    _vm._v(" "),
    _vm.showMore
      ? _c("div", [
          _c("div", { staticClass: "form-group" }, [
            _c(
              "select",
              {
                staticClass: "form-control guests-count",
                domProps: { value: _vm.current_guests },
                on: {
                  change: function($event) {
                    _vm.setGuests($event.target.value)
                  }
                }
              },
              _vm._l(20, function(index) {
                return _c("option", { domProps: { value: index } }, [
                  _vm._v("\n          " + _vm._s(index) + "\n        ")
                ])
              })
            )
          ])
        ])
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "btn-next" }, [
      _c(
        "button",
        {
          staticClass: "btn text-uppercase",
          on: {
            click: function($event) {
              _vm.$emit("next")
            }
          }
        },
        [_vm._v("\n      Next\n    ")]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3ccac0d4", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_2_vue__ = __webpack_require__(7);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3cae91d2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_2_vue__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(29)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3cae91d2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_2_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3cae91d2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_2_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3cae91d2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_2_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/wizard/step_2.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3cae91d2", Component.options)
  } else {
    hotAPI.reload("data-v-3cae91d2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("567f4835", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3cae91d2\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_2.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3cae91d2\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_2.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.vcom-calendar[data-v-3cae91d2] {\n  margin: auto;\n}\n.timetable[data-v-3cae91d2] {\n  margin: 2rem auto;\n}\n.timetable-item[data-v-3cae91d2] {\n  cursor: pointer;\n  background-color: #f9f9f9;\n  margin-top: 0.5rem;\n  padding: 1rem;\n}\n.timetable-item[data-v-3cae91d2]:hover, .timetable-item.active[data-v-3cae91d2] {\n    background-color: #e6e6e6;\n}\n.timetable-item-hour[data-v-3cae91d2] {\n  margin-top: 1rem;\n  font-weight: bold;\n  width: 25%;\n  float: left;\n}\n.timetable-item-status[data-v-3cae91d2] {\n  font-size: xx-large;\n  width: 50%;\n  float: left;\n}\n.timetable-item-seats[data-v-3cae91d2] {\n  margin-top: 1rem;\n  font-weight: bold;\n  width: 25%;\n  float: left;\n}\n@media (min-width: 1200px) {\n.box[data-v-3cae91d2] {\n    width: 50%;\n    float: left;\n    padding: 0 1rem;\n}\n}\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_calendar_vue__ = __webpack_require__(8);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_86a0980c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_calendar_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(32)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-86a0980c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_calendar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_86a0980c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_calendar_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_86a0980c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_calendar_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/calendar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-86a0980c", Component.options)
  } else {
    hotAPI.reload("data-v-86a0980c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("7668ed56", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-86a0980c\",\"scoped\":true,\"sourceMap\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./calendar.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-86a0980c\",\"scoped\":true,\"sourceMap\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./calendar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.vcom-calendar[data-v-86a0980c] {\n  width: 350px;\n  height: auto;\n  overflow: hidden;\n  -webkit-border-radius: 10px;\n  border-radius: 10px;\n  -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);\n  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);\n}\n.vcom-calendar .header[data-v-86a0980c] {\n    width: 100%;\n    padding: 10px 0;\n    background-color: #2ecc71;\n}\n.vcom-calendar .head[data-v-86a0980c] {\n    text-align: center;\n    font-size: 24px;\n    padding: 10px 0;\n    color: #ffffff;\n    letter-spacing: 1px;\n    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);\n}\n.vcom-calendar .weeks[data-v-86a0980c] {\n    display: block;\n    width: 100%;\n    overflow: auto;\n    padding: 10px 0;\n    text-align: center;\n}\n.vcom-calendar .weeks .week[data-v-86a0980c] {\n      width: 14.28571%;\n      display: block;\n      color: #ffffff;\n      float: left;\n      font-size: 16px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box;\n}\n.vcom-calendar .days[data-v-86a0980c] {\n    width: 100%;\n    height: auto;\n    overflow: auto;\n    background-color: #ffffff;\n    position: relative;\n}\n.vcom-calendar .days .day > span[data-v-86a0980c] {\n      width: 50px;\n      display: block;\n      float: left;\n      height: 50px;\n      font-size: 12px;\n      text-align: center;\n      line-height: 25px;\n      color: #333333;\n      background-color: #fefefe;\n      font-weight: bold;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box;\n      border-right: 1px solid #f0f0f0;\n      border-bottom: 1px solid #f0f0f0;\n}\n.vcom-calendar .days .day .this-month-day[data-v-86a0980c]:hover {\n      background-color: #e1e1e1;\n      cursor: pointer;\n      color: #ffffff;\n}\n.vcom-calendar .days .day .active[data-v-86a0980c] {\n      background-color: #e6e6e6;\n}\n.vcom-calendar .days .day .today[data-v-86a0980c] {\n      border-bottom: 3px solid #2ecc71;\n      color: #2ecc71;\n}\n.vcom-calendar .days .day .not-this-month[data-v-86a0980c] {\n      background-color: #f9f9f9;\n      color: #999999;\n}\n.vcom-calendar .month-select[data-v-86a0980c] {\n    cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "vcom-calendar", attrs: { id: "vcom-calendar" } },
    [
      _c("div", { staticClass: "header" }, [
        _c("div", { staticClass: "head" }, [
          _c(
            "span",
            {
              staticClass: "month-select",
              on: {
                click: function($event) {
                  _vm.adjustMonth(-1)
                }
              }
            },
            [_vm._v("<")]
          ),
          _vm._v(
            "\n      " +
              _vm._s(_vm.year) +
              " - " +
              _vm._s(_vm.pad(_vm.month, 2)) +
              "\n      "
          ),
          _c(
            "span",
            {
              staticClass: "month-select",
              on: {
                click: function($event) {
                  _vm.adjustMonth(1)
                }
              }
            },
            [_vm._v(">")]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "weeks" },
          _vm._l(_vm.weeks, function(week) {
            return _c("span", { staticClass: "week" }, [
              _vm._v("\n        " + _vm._s(week) + "\n      ")
            ])
          })
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "days" },
        _vm._l(_vm.days, function(day) {
          return _c(
            "span",
            {
              staticClass: "day",
              attrs: { "track-by": "$index" },
              on: {
                click: function($event) {
                  _vm.select(day)
                }
              }
            },
            [
              day.isToday
                ? _c(
                    "span",
                    {
                      staticClass: "today this-month-day",
                      class: { active: _vm.isSelected(day) },
                      attrs: {
                        "data-month": day.year + "-" + day.month + "-" + day.day
                      }
                    },
                    [
                      _vm._v("\n          " + _vm._s(day.day) + "\n          "),
                      _c("br"),
                      _vm._v(" "),
                      _c("span", {
                        domProps: { innerHTML: _vm._s(_vm.getData(day.day)) }
                      })
                    ]
                  )
                : _vm._e(),
              _vm._v(" "),
              day.isPreMonth || day.isNextMonth
                ? _c(
                    "span",
                    {
                      staticClass: "not-this-month",
                      attrs: {
                        "data-month": day.year + "-" + day.month + "-" + day.day
                      }
                    },
                    [_vm._v("\n          " + _vm._s(day.day) + "\n        ")]
                  )
                : _vm._e(),
              _vm._v(" "),
              day.isThisMonthDay && !day.isToday
                ? _c(
                    "span",
                    {
                      staticClass: "this-month-day",
                      class: { active: _vm.isSelected(day) },
                      attrs: {
                        "data-month": day.year + "-" + day.month + "-" + day.day
                      }
                    },
                    [
                      _vm._v("\n          " + _vm._s(day.day) + "\n          "),
                      _c("br"),
                      _vm._v(" "),
                      _c("span", {
                        domProps: { innerHTML: _vm._s(_vm.getData(day.day)) }
                      })
                    ]
                  )
                : _vm._e()
            ]
          )
        })
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-86a0980c", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("h4", [_vm._v("Select day")]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "box" },
      [
        _c("calendar", {
          attrs: {
            selected: new Date(
              _vm.reservation.date.year,
              _vm.reservation.date.month - 1,
              _vm.reservation.date.day
            ),
            "get-data": _vm.getStatus
          },
          on: {
            select: function($event) {
              _vm.setDate($event.day, $event.month, $event.year)
            },
            "change:month": function($event) {
              _vm.updateSeats($event.year, $event.month, true)
            }
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "box" }, [
      _vm.reservation.date.hour != null
        ? _c(
            "div",
            { staticClass: "timetable" },
            _vm._l(_vm.timetable, function(hour) {
              return _c(
                "div",
                {
                  staticClass: "timetable-item",
                  class: { active: hour == _vm.reservation.date.hour },
                  on: {
                    click: function($event) {
                      _vm.book(hour)
                    }
                  }
                },
                [
                  _c("div", { staticClass: "timetable-item-hour" }, [
                    _vm._v("\n          " + _vm._s(hour) + ":00\n        ")
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "timetable-item-status" }, [
                    _c("span", {
                      domProps: {
                        innerHTML: _vm._s(
                          _vm.getStatus(_vm.reservation.date.day)
                        )
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "timetable-item-seats" }, [
                    _vm._v(
                      "\n          " +
                        _vm._s(
                          Math.min(
                            _vm.reservation.guests,
                            _vm.seats[_vm.reservation.date.day] || 0
                          )
                        ) +
                        " seats\n        "
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "clearfix" })
                ]
              )
            })
          )
        : _vm._e()
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "btn-next" }, [
      _vm.reservation.date && _vm.reservation.date.hour
        ? _c(
            "button",
            {
              staticClass: "btn text-uppercase",
              on: {
                click: function($event) {
                  _vm.$emit("next")
                }
              }
            },
            [_vm._v("\n      Next\n    ")]
          )
        : _vm._e()
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3cae91d2", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_3_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c9262d0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_3_vue__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(37)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3c9262d0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_3_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c9262d0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_3_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c9262d0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_3_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/wizard/step_3.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c9262d0", Component.options)
  } else {
    hotAPI.reload("data-v-3c9262d0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("6d06464f", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c9262d0\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_3.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c9262d0\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_3.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.group[data-v-3c9262d0] {\n  width: 100%;\n  margin-top: 1rem;\n}\n.text-label[data-v-3c9262d0] {\n  text-transform: uppercase;\n}\n@media (max-width: 767px) {\n.text-label[data-v-3c9262d0] {\n    text-align: left;\n}\n}\n@media (min-width: 768px) {\n.text-label[data-v-3c9262d0] {\n    text-align: left;\n}\n}\n@media (min-width: 992px) {\n.text-label[data-v-3c9262d0] {\n    text-align: right;\n}\n}\n@media (min-width: 1200px) {\n}\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-inline" }, [
    _c("h4", [_vm._v("Your info")]),
    _vm._v(" "),
    _c("div", { staticClass: "group form-group" }, [
      _c("div", { staticClass: "col-lg-6 col-md-12" }, [
        _c("div", { staticClass: "group form-group" }, [
          _vm._m(0),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-6 col-xs-12" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.name,
                  expression: "name"
                }
              ],
              staticClass: "form-control",
              class: { "is-invalid": _vm.errors.name },
              attrs: { id: "name" },
              domProps: { value: _vm.name },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.name = $event.target.value
                }
              }
            })
          ])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-6 col-md-12" }, [
        _c("div", { staticClass: "group form-group" }, [
          _vm._m(1),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-6 col-xs-12" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.phone,
                  expression: "phone"
                }
              ],
              staticClass: "form-control",
              class: { "is-invalid": _vm.errors.phone },
              attrs: { id: "phone" },
              domProps: { value: _vm.phone },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.phone = $event.target.value
                }
              }
            })
          ])
        ])
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "group form-group" }, [
      _c("div", { staticClass: "col-lg-6 col-md-12" }, [
        _c("div", { staticClass: "group form-group" }, [
          _vm._m(2),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-6 col-xs-12" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.email,
                  expression: "email"
                }
              ],
              staticClass: "form-control",
              class: { "is-invalid": _vm.errors.email },
              attrs: { id: "email" },
              domProps: { value: _vm.email },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.email = $event.target.value
                }
              }
            })
          ])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-6 col-md-12" }, [
        _c("div", { staticClass: "group form-group" }, [
          _vm._m(3),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-6 col-xs-12" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.password,
                  expression: "password"
                }
              ],
              staticClass: "form-control",
              class: { "is-invalid": _vm.errors.password },
              attrs: { type: "password", id: "password" },
              domProps: { value: _vm.password },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.password = $event.target.value
                }
              }
            })
          ])
        ])
      ])
    ]),
    _vm._v(" "),
    _vm._m(4),
    _vm._v(" "),
    _c("div", { staticClass: "btn-next" }, [
      _c(
        "button",
        {
          staticClass: "btn text-uppercase",
          on: {
            click: function($event) {
              _vm.checkForm()
            }
          }
        },
        [_vm._v("\n      Next\n    ")]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-md-6 col-xs-12 text-label" }, [
      _c(
        "label",
        { staticClass: "form-control-label", attrs: { for: "name" } },
        [_vm._v("Name:")]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-md-6 col-xs-12 text-label" }, [
      _c(
        "label",
        { staticClass: "form-control-label", attrs: { for: "phone" } },
        [_vm._v("Phone number:")]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-md-6 col-xs-12 text-label" }, [
      _c(
        "label",
        { staticClass: "form-control-label", attrs: { for: "email" } },
        [_vm._v("Email:")]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-md-6 col-xs-12 text-label" }, [
      _c(
        "label",
        { staticClass: "form-control-label", attrs: { for: "password" } },
        [_vm._v("Password:")]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass: "group",
        staticStyle: { display: "inline-block", "margin-top": "2rem" }
      },
      [_c("a", [_vm._v("already has account?")])]
    )
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3c9262d0", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_4_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c7633ce_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_4_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(2);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(41)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3c7633ce"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_step_4_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c7633ce_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_4_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c7633ce_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_step_4_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "app/wizard/step_4.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c7633ce", Component.options)
  } else {
    hotAPI.reload("data-v-3c7633ce", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(1).default
var update = add("12b8e55e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c7633ce\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_4.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c7633ce\",\"scoped\":true,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step_4.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.form-inline .warning[data-v-3c7633ce] {\n  color: red;\n}\n.group[data-v-3c7633ce] {\n  width: 100%;\n  margin-top: 1rem;\n  display: inline-block;\n}\n.text-label[data-v-3c7633ce] {\n  text-transform: uppercase;\n  text-align: left;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__dist__);


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__dist___default.a);

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _src = __webpack_require__(1);

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _src2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var script = document.createElement('script');
script.src = 'https://checkout.stripe.com/checkout.js';
document.getElementsByTagName('head')[0].appendChild(script);

var VueStripeCheckout = {
  install: function install(Vue, options) {
    if (!options) {
      console.warn('Shut up and provide the options! (config options is required in Vue.use(VueStripeCheckout, options))');
      return;
    }
    window.addEventListener('load', function () {
      Vue.prototype.$checkout = StripeCheckout.configure(options);
    });
  }
};

exports.default = VueStripeCheckout;

/***/ })
/******/ ]);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-inline" }, [
    _c("h4", [_vm._v("Your info")]),
    _vm._v(" "),
    _c("div", { staticClass: "group" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "pull-left col-sm-6 col-xs-12 text-uppercase",
          class: { warning: _vm.reservation.seats < _vm.reservation.guests }
        },
        [_vm._v("\n      " + _vm._s(_vm.reservation.seats) + " person\n    ")]
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "group" }, [
      _vm._m(1),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "pull-left col-sm-6 col-xs-12 text-uppercase" },
        [_vm._v("\n      " + _vm._s(_vm.reservationDate()) + "\n    ")]
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "group" }, [
      _vm._m(2),
      _vm._v(" "),
      _c("div", { staticClass: "pull-left col-sm-6 col-xs-12" }, [
        _vm._v("\n      " + _vm._s(_vm.identification.name) + "\n    ")
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "group" }, [
      _vm._m(3),
      _vm._v(" "),
      _c("div", { staticClass: "pull-left col-sm-6 col-xs-12" }, [
        _vm._v("\n      " + _vm._s(_vm.identification.phone) + "\n    ")
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "group" }, [
      _vm._m(4),
      _vm._v(" "),
      _c("div", { staticClass: "pull-left col-sm-6 col-xs-12" }, [
        _vm._v("\n      " + _vm._s(_vm.identification.email) + "\n    ")
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "btn-next" }, [
      _c(
        "button",
        {
          staticClass: "btn text-uppercase",
          on: {
            click: function($event) {
              _vm.reserve()
            }
          }
        },
        [_vm._v("\n      Next\n    ")]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "pull-left col-sm-6 col-xs-12 text-label" },
      [_c("label", { staticClass: "control-label" }, [_vm._v("Guests:")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "pull-left col-sm-6 col-xs-12 text-label" },
      [_c("label", { staticClass: "control-label" }, [_vm._v("Date:")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "pull-left col-sm-6 col-xs-12 text-label" },
      [_c("label", { staticClass: "control-label" }, [_vm._v("Name:")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "pull-left col-sm-6 col-xs-12 text-label" },
      [_c("label", { staticClass: "control-label" }, [_vm._v("Phone number:")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "pull-left col-sm-6 col-xs-12 text-label" },
      [_c("label", { staticClass: "control-label" }, [_vm._v("Email:")])]
    )
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3c7633ce", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wizard" }, [
    _c("div", { staticClass: "steps" }, [
      _c("div", { staticClass: "step" }, [
        _c(
          "div",
          {
            staticClass: "element",
            class: { active: _vm.step >= 1 },
            on: {
              click: function($event) {
                _vm.setStep(1)
              }
            }
          },
          [_vm._v("\n        1\n      ")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "caption" }, [
          _vm._v("\n        select a count of guest\n      ")
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "step" }, [
        _c(
          "div",
          {
            staticClass: "element",
            class: { active: _vm.step >= 2 },
            on: {
              click: function($event) {
                _vm.setStep(2)
              }
            }
          },
          [_vm._v("\n        2\n      ")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "caption" }, [
          _vm._v("\n        select date and time\n      ")
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "step" }, [
        _c(
          "div",
          {
            staticClass: "element",
            class: { active: _vm.step >= 3 },
            on: {
              click: function($event) {
                _vm.setStep(3)
              }
            }
          },
          [_vm._v("\n        3\n      ")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "caption" }, [
          _vm._v("\n        fill name and phone number and email\n      ")
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "step" }, [
        _c(
          "div",
          {
            staticClass: "element",
            class: { active: _vm.step >= 4 },
            on: {
              click: function($event) {
                _vm.setStep(4)
              }
            }
          },
          [_vm._v("\n        4\n      ")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "caption" }, [
          _vm._v("\n        confirm\n      ")
        ])
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "content text-center" }, [
      _vm.step == 1
        ? _c(
            "div",
            [
              _c("step1", {
                on: {
                  next: function($event) {
                    _vm.next()
                  }
                },
                model: {
                  value: _vm.guests,
                  callback: function($$v) {
                    _vm.guests = $$v
                  },
                  expression: "guests"
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.step == 2
        ? _c(
            "div",
            [
              _c("step2", {
                on: {
                  next: function($event) {
                    _vm.next()
                  }
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.step == 3
        ? _c(
            "div",
            [
              _c("step3", {
                on: {
                  next: function($event) {
                    _vm.next()
                  }
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.step == 4
        ? _c(
            "div",
            [
              _c("step4", {
                on: {
                  next: function($event) {
                    _vm.next()
                  }
                }
              })
            ],
            1
          )
        : _vm._e()
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1bad45ea", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ })
],[18]);