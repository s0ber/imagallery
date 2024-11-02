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


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var SINGLE_PREVIEW_RATIO = 1;

var MAX_IMAGES = 25;

var sum = function sum(arr) {
  return arr.reduce(function (a, b) {
    return a + b;
  }, 0);
};
var clamp = function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
};
var lerp = function lerp(a, b, alpha) {
  return a + alpha * (b - a);
};
var aspectRatio = function aspectRatio(image) {
  return image.width / image.height;
};
var getAverageRatio = function getAverageRatio(images) {
  return images.map(aspectRatio).reduce(function (result, ratio) {
    return ratio + result;
  }, 1) / images.length;
};

// inspired by https://github.com/Ajaxy/telegram-tt/blob/master/src/components/middle/message/helpers/calculateAlbumLayout.ts
var cropImages = function cropImages(images, averageRatio) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var image = _step.value;

      var ratio = aspectRatio(image);
      var clampedRatio = averageRatio > 1.1 ? clamp(ratio, 1, 2.75) : clamp(ratio, 0.6667, 1);

      image.height = image.width / clampedRatio;
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
};

var applyScale = function applyScale(image, scale) {
  image.width *= scale;
  image.height *= scale;
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
  var rowHeight = 100 / sum(images.map(aspectRatio));
  var row = { width: 100, height: rowHeight };

  row.images = images.map(function (image) {
    return scaleImageToHeight(image, row.height);
  });
  row.ratio = aspectRatio(row);

  return row;
};

var prepareCol = function prepareCol(images) {
  var colWidth = 100 / sum(images.map(function (image) {
    return 1 / aspectRatio(image);
  }));
  var col = { width: colWidth, height: 100 };

  col.images = images.map(function (image) {
    return scaleImageToWidth(image, col.width);
  });
  col.ratio = aspectRatio(col);

  return col;
};

var scaleImageToWidth = function scaleImageToWidth(image, width) {
  var ratio = aspectRatio(image);
  image.width = width;
  image.height = width / ratio;

  if (image.images) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = image.images[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var nestedImage = _step3.value;

        scaleImageToHeight(nestedImage, image.height);
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
  }

  return image;
};

var scaleImageToHeight = function scaleImageToHeight(image, height) {
  var ratio = aspectRatio(image);
  image.width = height * ratio;
  image.height = height;

  if (image.images) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = image.images[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var nestedImage = _step4.value;

        scaleImageToWidth(nestedImage, image.width);
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
  }

  return image;
};

var prepareRowsVariations = function prepareRowsVariations(images, maxRows, _ref) {
  var averageRatio = _ref.averageRatio;

  var variants = [];
  if (maxRows >= 1) variants.push([images]);

  if (maxRows >= 2) {
    var MIN_ITEMS_IN_ROW_1 = 1;
    var MAX_ITEMS_IN_ROW_1 = 3;

    for (var i = MIN_ITEMS_IN_ROW_1; i <= MAX_ITEMS_IN_ROW_1; i++) {
      variants.push([images.slice(0, i), images.slice(i, images.length)]);
    }
  }

  if (maxRows >= 3) {
    var _arr = [].concat(variants);

    for (var _i = 0; _i < _arr.length; _i++) {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
          p1 = _arr$_i[0],
          p2 = _arr$_i[1];

      if (!p1 || !p2) continue;

      var MIN_ITEMS_IN_ROW_2 = 3;
      var MAX_ITEMS_IN_ROW_2 = averageRatio < 0.85 ? 4 : 3;

      for (var _i2 = MIN_ITEMS_IN_ROW_2; _i2 <= MAX_ITEMS_IN_ROW_2; _i2++) {
        variants.push([p1, p2.slice(0, _i2), p2.slice(_i2, p2.length)]);
      }
    }
  }

  if (maxRows >= 4) {
    var _arr2 = [].concat(variants);

    for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
      var _arr2$_i = _slicedToArray(_arr2[_i3], 3),
          p1 = _arr2$_i[0],
          p2 = _arr2$_i[1],
          p3 = _arr2$_i[2];

      if (!p1 || !p2 || !p3) continue;

      var MIN_ITEMS_IN_ROW_3 = 2;
      var MAX_ITEMS_IN_ROW_3 = 3;

      for (var _i4 = MIN_ITEMS_IN_ROW_3; _i4 <= MAX_ITEMS_IN_ROW_3; _i4++) {
        variants.push([p1, p2, p3.slice(0, _i4), p3.slice(_i4, p3.length)]);
      }
    }
  }

  if (maxRows >= 5) {
    var _arr3 = [].concat(variants);

    for (var _i5 = 0; _i5 < _arr3.length; _i5++) {
      var _arr3$_i = _slicedToArray(_arr3[_i5], 4),
          p1 = _arr3$_i[0],
          p2 = _arr3$_i[1],
          p3 = _arr3$_i[2],
          p4 = _arr3$_i[3];

      if (!p1 || !p2 || !p3 || !p4) continue;

      var MIN_ITEMS_IN_ROW_4 = 3;
      var MAX_ITEMS_IN_ROW_4 = 4;

      for (var _i6 = MIN_ITEMS_IN_ROW_4; _i6 <= MAX_ITEMS_IN_ROW_4; _i6++) {
        variants.push([p1, p2, p3, p4.slice(0, _i6), p4.slice(_i6, p4.length)]);
      }
    }
  }

  if (maxRows >= 6) {
    var _arr4 = [].concat(variants);

    for (var _i7 = 0; _i7 < _arr4.length; _i7++) {
      var _arr4$_i = _slicedToArray(_arr4[_i7], 5),
          p1 = _arr4$_i[0],
          p2 = _arr4$_i[1],
          p3 = _arr4$_i[2],
          p4 = _arr4$_i[3],
          p5 = _arr4$_i[4];

      if (!p1 || !p2 || !p3 || !p4 || !p5) continue;

      var MIN_ITEMS_IN_ROW_5 = 2;
      var MAX_ITEMS_IN_ROW_5 = 4;

      for (var _i8 = MIN_ITEMS_IN_ROW_5; _i8 <= MAX_ITEMS_IN_ROW_5; _i8++) {
        variants.push([p1, p2, p3, p4, p5.slice(0, _i8), p5.slice(_i8, p5.length)]);
      }
    }
  }

  if (maxRows >= 7) {
    var _arr5 = [].concat(variants);

    for (var _i9 = 0; _i9 < _arr5.length; _i9++) {
      var _arr5$_i = _slicedToArray(_arr5[_i9], 6),
          p1 = _arr5$_i[0],
          p2 = _arr5$_i[1],
          p3 = _arr5$_i[2],
          p4 = _arr5$_i[3],
          p5 = _arr5$_i[4],
          p6 = _arr5$_i[5];

      if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) continue;

      var MIN_ITEMS_IN_ROW_6 = 3;
      var MAX_ITEMS_IN_ROW_6 = 3;

      for (var _i10 = MIN_ITEMS_IN_ROW_6; _i10 <= MAX_ITEMS_IN_ROW_6; _i10++) {
        variants.push([p1, p2, p3, p4, p5, p6.slice(0, _i10), p6.slice(_i10, p6.length)]);
      }
    }
  }

  return variants;
};

var prepareVariants = function prepareVariants(images, options) {
  var variants = [];
  var isSmallGroup = images.length <= 4;

  var maxRows = function () {
    if (isSmallGroup) return 2;
    if (images.length <= 8) return 3;
    if (images.length <= 12) return 4;
    if (images.length <= 18) return 6;

    return 7;
  }();

  var variations = prepareRowsVariations(images, maxRows, options);

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = variations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var v = _step5.value;

      if (v.length === 1) {
        variants.push({ rows: v });
      } else {
        variants.push({ rows: v });
        if (isSmallGroup && v[0].length === 1) {
          variants.push({ cols: v });
        }
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

  return variants;
};

// this function will scale all nested images according to calculated aspect ratios
var getPreviews = function getPreviews(variant, mosaicShape) {
  var previews = [];
  if (variant.cols) {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = mosaicShape.images[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var col = _step6.value;
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = col.images[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var nestedImage = _step7.value;

            previews.push(_extends({}, nestedImage));
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
  } else if (variant.rows) {
    // we need to wrap in additional row for auto-scaling to work properly
    scaleImageToWidth(_extends({}, mosaicShape, { images: [mosaicShape] }), 100);
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = mosaicShape.images[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var row = _step8.value;
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = row.images[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _nestedImage = _step9.value;

            previews.push(_extends({}, _nestedImage));
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
  }
  return previews;
};

var getOptimalVariant = function getOptimalVariant(images, options) {
  var variants = prepareVariants(images, options);
  var optimalVariant = void 0;
  var optimalRatio = void 0;
  var optimalOriginalRatio = void 0;
  var optimalPreviews = void 0;

  // all values here are hand-adjusted to get the minimum amount of produced small images
  var targetRatio = lerp(1.25, .47, images.length / MAX_IMAGES);

  console.log('Target ratio', targetRatio);

  var _iteratorNormalCompletion10 = true;
  var _didIteratorError10 = false;
  var _iteratorError10 = undefined;

  try {
    for (var _iterator10 = variants[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
      var variant = _step10.value;

      var mosaicShape = variant.cols ? prepareRow(variant.cols.map(prepareCol)) : prepareCol(variant.rows.map(prepareRow));

      var ratio = aspectRatio(mosaicShape);
      var originalRatio = ratio;
      var previews = getPreviews(variant, mosaicShape);

      // penalize current variant for every small image
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = previews.filter(function (p) {
          return p.width <= 20 || p.height <= 20;
        })[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var _badPreview = _step11.value;

          ratio > targetRatio ? ratio *= 1.2 : ratio /= 1.2;
        }

        // encourage cols layout
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

      if (variant.cols) {
        ratio > targetRatio ? ratio /= 1.15 : ratio *= 1.15;
      }

      if (optimalVariant) {
        if (Math.abs(ratio - targetRatio) < Math.abs(optimalRatio - targetRatio)) {
          optimalRatio = ratio;
          optimalOriginalRatio = originalRatio;
          optimalVariant = variant;
          optimalPreviews = previews;
        }
      } else {
        optimalRatio = ratio;
        optimalOriginalRatio = originalRatio;
        optimalVariant = variant;
        optimalPreviews = previews;
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

  return { variant: optimalVariant, previews: optimalPreviews, aspectRatio: optimalOriginalRatio, diff: Math.abs(optimalOriginalRatio - targetRatio) };
};

var singlePreview = function singlePreview(images) {
  var image = images[0];
  var targetRatio = SINGLE_PREVIEW_RATIO;
  var scaleTo = {
    width: 100,
    height: 100 / targetRatio
  };
  var scale = Math.min(scaleTo.width / image.width, scaleTo.height / image.height);
  var preview = applyScale(image, scale);

  return { previews: [preview], aspectRatio: image.width / image.height, direction: 'row' };
};

var twoImgPreviews = function twoImgPreviews(images) {
  var previews = [];
  var row = prepareRow(images);

  var _iteratorNormalCompletion12 = true;
  var _didIteratorError12 = false;
  var _iteratorError12 = undefined;

  try {
    for (var _iterator12 = row.images[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
      var image = _step12.value;

      previews.push(image);
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

  return { previews: previews, aspectRatio: row.ratio, direction: 'row' };
};

var manyImgPreviews = function manyImgPreviews(images, options) {
  var direction = void 0;

  var _getOptimalVariant = getOptimalVariant(images, options),
      variant = _getOptimalVariant.variant,
      previews = _getOptimalVariant.previews,
      diff = _getOptimalVariant.diff,
      aspectRatio = _getOptimalVariant.aspectRatio;

  if (variant.cols) {
    direction = 'column';
  } else if (variant.rows) {
    direction = 'row';
  }

  return {
    aspectRatio: aspectRatio,
    previews: previews,
    direction: direction,
    diff: diff
  };
};

var MAX_VERTICAL_IMAGE_RATIO = 0.56;
var fixVerticalImages = function fixVerticalImages(images) {
  var _iteratorNormalCompletion13 = true;
  var _didIteratorError13 = false;
  var _iteratorError13 = undefined;

  try {
    for (var _iterator13 = images[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
      var image = _step13.value;

      if (aspectRatio(image) >= MAX_VERTICAL_IMAGE_RATIO) continue;
      image.height = image.width / MAX_VERTICAL_IMAGE_RATIO;
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
};

var MIN_HORIZONTAL_IMAGE_RATIO = 1.77;
var fixHorizontalImages = function fixHorizontalImages(images) {
  var _iteratorNormalCompletion14 = true;
  var _didIteratorError14 = false;
  var _iteratorError14 = undefined;

  try {
    for (var _iterator14 = images[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
      var image = _step14.value;

      if (aspectRatio(image) <= MIN_HORIZONTAL_IMAGE_RATIO) continue;
      image.width = image.height * MIN_HORIZONTAL_IMAGE_RATIO;
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

  var processorFn = function processorFn(images, _options) {
    return {
      previews: images,
      aspectRatio: 1,
      direction: 'row'
    };
  };

  images = copyImages(images); // don't touch original images

  if (images.length === 1) {
    fixVerticalImages(images);
    fixHorizontalImages(images);
    processorFn = singlePreview;
  } else if (images.length === 2) {
    fixVerticalImages(images);
    fixHorizontalImages(images);
    processorFn = twoImgPreviews;
  } else if (images.length > 2 && images.length <= 4) {
    fixVerticalImages(images);
    fixHorizontalImages(images);
    processorFn = manyImgPreviews;
  } else if (images.length > 4) {
    var averageRatio = getAverageRatio(images);
    options = _extends({}, options, { averageRatio: averageRatio });

    cropImages(images, averageRatio);
    processorFn = manyImgPreviews;
  }

  var result = processorFn(images, options);

  return result;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});