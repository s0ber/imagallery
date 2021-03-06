(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Imagallery"] = factory();
	else
		root["Imagallery"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var MOBILE_SINGLE_PREVIEW_RATIO = 0.666;
var DESKTOP_SINGLE_PREVIEW_RATIO = 1;

var MOBILE_TARGET_RATIO = 0.66;
var DESKTOP_TARGET_RATIO = 1.5;

var MAX_VERTICAL_IMAGE_RATIO = 0.7;

var getRatio = function getRatio(image) {
  return image.width / image.height;
};

var applyScale = function applyScale(image, scale) {
  var width = image.width,
      height = image.height;

  image.width *= scale;
  image.height *= scale;
  if (image.images) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = image.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _image = _step.value;

        applyScale(_image, scale);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return image;
};

var copyImages = function copyImages(images) {
  var newImages = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var image = _step2.value;

      var newImg = JSON.parse(JSON.stringify(image));
      newImg._width = image.width;
      newImg._height = image.height;
      newImages.push(newImg);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return newImages;
};

// scales images in a list in a way that they are fit into a single row
var prepareRow = function prepareRow(images) {
  var rowHeight = 100 / images.map(function (image) {
    return getRatio(image);
  }).reduce(function (a, b) {
    return a + b;
  }, 0);

  var row = { width: 100, height: rowHeight };

  row.images = images.map(function (image) {
    var ratio = getRatio(image);
    image.width = row.height * ratio;
    image.height = row.height;

    if (image.images) {
      scaleImagesToWidth(image.images, image.width);
    }
    return image;
  });

  row.ratio = getRatio(row);
  return row;
};

var prepareCol = function prepareCol(images) {
  var colWidth = 100 / images.map(function (image) {
    return 1 / getRatio(image);
  }).reduce(function (a, b) {
    return a + b;
  }, 0);

  var col = { width: colWidth, height: 100 };

  col.images = images.map(function (image) {
    var ratio = getRatio(image);
    image.width = col.width;
    image.height = col.width / ratio;

    if (image.images) {
      scaleImagesToHeight(image.images, image.height);
    }
    return image;
  });

  col.ratio = getRatio(col);
  return col;
};

var scaleImagesToWidth = function scaleImagesToWidth(images, width) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = images[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var image = _step3.value;

      var ratio = getRatio(image);
      image.width = width;
      image.height = width / ratio;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

var scaleImagesToHeight = function scaleImagesToHeight(images, height) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = images[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var image = _step4.value;

      var ratio = getRatio(image);
      image.width = height * ratio;
      image.height = height;
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
};

var prepareChunkVariations = function prepareChunkVariations(images, maxChunks) {
  var variants = [];
  if (maxChunks >= 1) variants.push([images]);

  if (maxChunks >= 2) {
    for (var i = 0; i < images.length; i++) {
      if (i === 0) continue;
      variants.push([images.slice(0, i), images.slice(i, images.length)]);
    }
  }

  if (maxChunks === 3) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = variants[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _step5$value = _slicedToArray(_step5.value, 2),
            p1 = _step5$value[0],
            p2 = _step5$value[1];

        if (!p1 || !p2) continue;
        var bigPart = p1.length > 1 ? p1 : p2;

        for (var _i = 0; _i < bigPart.length; _i++) {
          if (_i === 0) continue;
          var v = [bigPart.slice(0, _i), bigPart.slice(_i, bigPart.length)];
          p1.length > 1 ? v.push(p2) : v.unshift(p1);
          variants.push(v);
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  return variants;
};

var prepareVariants = function prepareVariants(images) {
  var variants = [];
  var isSmallGroup = images.length === 3 || images.length === 4;
  var variations = prepareChunkVariations(images, isSmallGroup ? 2 : 3);

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = variations[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var v = _step6.value;

      if (v.length === 1) {
        variants.push({ singleRow: v[0] });
      } else {
        variants.push({ rows: v });
        if (isSmallGroup && v[0].length === 1) {
          variants.push({ cols: v });
        }
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return variants;
};

var getOptimalVariant = function getOptimalVariant(images, options) {
  var variants = prepareVariants(images);
  var optimalVariant = void 0;
  var optimalRatio = void 0;
  var targetRatio = options.type == 'desktop' ? DESKTOP_TARGET_RATIO : MOBILE_TARGET_RATIO;

  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = variants[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var variant = _step7.value;

      var mosaicShape = void 0;

      if (variant.singleRow) {
        mosaicShape = prepareRow(variant.singleRow);
      } else if (variant.rows) {
        var rows = variant.rows.map(function (row) {
          return prepareRow(row);
        });
        mosaicShape = prepareCol(rows);
      } else if (variant.cols) {
        var cols = variant.cols.map(function (col) {
          return prepareCol(col);
        });
        mosaicShape = prepareRow(cols);
      }

      var ratio = getRatio(mosaicShape);
      if (optimalVariant) {
        if (Math.abs(ratio - targetRatio) < Math.abs(optimalRatio - targetRatio)) {
          optimalRatio = ratio;
          optimalVariant = variant;
        }
      } else {
        optimalRatio = ratio;
        optimalVariant = variant;
      }
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  return optimalVariant;
};

var preparePreview = function preparePreview(image, _ref) {
  var width = _ref.width,
      height = _ref.height;

  return { color: image.color, width: width, height: height };
};

var singlePreview = function singlePreview(images, options) {
  var image = images[0];
  var targetRatio = options.type == 'desktop' ? DESKTOP_SINGLE_PREVIEW_RATIO : MOBILE_SINGLE_PREVIEW_RATIO;
  var scaleTo = {
    width: 100,
    height: 100 / targetRatio
  };
  var scale = Math.min(scaleTo.width / image.width, scaleTo.height / image.height);
  var preview = applyScale(image, scale);

  return [preview];
};

var twoImgPreviews = function twoImgPreviews(images, options) {
  var previews = [];
  var row = prepareRow(images);

  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = row.images[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var image = _step8.value;

      previews.push(image);
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return previews;
};

var manyImgPreviews = function manyImgPreviews(images, options) {
  var previews = [];
  var variant = getOptimalVariant(images, options);

  if (variant.singleRow) {
    var row = prepareRow(variant.singleRow, true);
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = row.images[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var image = _step9.value;

        previews.push(image);
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }
  } else if (variant.cols) {
    var cols = variant.cols.map(function (col) {
      return prepareCol(col);
    });
    var _row = prepareRow(cols);

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = _row.images[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var col = _step10.value;
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = col.images[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var nestedImage = _step11.value;

            previews.push(nestedImage);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10.return) {
          _iterator10.return();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }
  } else if (variant.rows) {
    var rows = variant.rows.map(function (row) {
      return prepareRow(row);
    });
    var _col = prepareCol(rows);
    var scale = 100 / _col.width;

    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
      for (var _iterator12 = _col.images[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
        var _row2 = _step12.value;
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = _row2.images[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _nestedImage = _step13.value;

            previews.push(applyScale(_nestedImage, scale));
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
              _iterator13.return();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError12 = true;
      _iteratorError12 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion12 && _iterator12.return) {
          _iterator12.return();
        }
      } finally {
        if (_didIteratorError12) {
          throw _iteratorError12;
        }
      }
    }
  }

  return previews;
};

var fixVerticalImages = function fixVerticalImages(images) {
  var _iteratorNormalCompletion14 = true;
  var _didIteratorError14 = false;
  var _iteratorError14 = undefined;

  try {
    for (var _iterator14 = images[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
      var image = _step14.value;

      if (getRatio(image) >= MAX_VERTICAL_IMAGE_RATIO) continue;
      image.height = image.width / MAX_VERTICAL_IMAGE_RATIO;
    }
  } catch (err) {
    _didIteratorError14 = true;
    _iteratorError14 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion14 && _iterator14.return) {
        _iterator14.return();
      }
    } finally {
      if (_didIteratorError14) {
        throw _iteratorError14;
      }
    }
  }
};

module.exports = function (images) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'desktop' };

  var processorFn = void 0;
  images = copyImages(images); // don't touch original images

  fixVerticalImages(images);

  if (images.length === 1) {
    processorFn = singlePreview;
  } else if (images.length === 2) {
    processorFn = twoImgPreviews;
  } else if (images.length > 2) {
    processorFn = manyImgPreviews;
  } else {
    processorFn = function processorFn() {};
  }

  return processorFn(images, options);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});