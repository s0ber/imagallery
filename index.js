const imageH = () => {
  return {width: 1200, height: 900, color: '#FF4081'} // dark green, 4:3, vertical
}
const imageV = () => {
  return {width: 900, height: 1200, color: '#56B8AE'} // light-green, 3:4, horizontal
}
const imageVV = () => {
  return {width: 1600, height: 900, color: '#30716A'} // pink, 16:9, horizontal
}
const imageS = () => {
  return {width: 800, height: 800, color: '#F2F2F2'} // grey, square
}
const imageHH = () => {
  return {width: 900, height: 1600, color: '#d388b9'} // magenta, 9:16, vertical
}

let SMALL_IMAGES_COUNT = 0
let VERY_SMALL_IMAGES_COUNT = 0
let ALL_IMAGES_COUNT = 0
let OPTIMAL_DIFF_SUM = 0
let OPTIMAL_NUMS = 0

const renderPreviews = ($container, images) => {
  const $wrapper = $('<div class="wrapper" />')
  const $wrapperInner = $('<div class="wrapper-inner" />')
  $wrapper.append($wrapperInner)

  const { previews, aspectRatio, direction, diff } = Imagallery(images)

  // console.log(aspectRatio)
  // console.log(direction)

  if (diff) {
    OPTIMAL_NUMS++
    OPTIMAL_DIFF_SUM += diff
  }

  ALL_IMAGES_COUNT += previews.length
  SMALL_IMAGES_COUNT += previews.filter(p => p.width < 20).length
  VERY_SMALL_IMAGES_COUNT += previews.filter(p => p.width < 15).length

  for (let preview of previews) {
    let $preview = $('<div class="preview" />').css({width: `${preview.width}%`, paddingBottom: `${preview.height}%`})
    let $previewInner = $('<div class="preview-inner" />')
    let $previewImg = $('<div class="preview-img" />').css({'background-color': preview.color || '#ccc'})
    $previewInner.append($previewImg)
    $preview.append($previewInner)
    $wrapperInner.append($preview)
  }

  $container.append($wrapper)
}

const renderInCol = (fn) => {
  const $col = $('<div class="col" />')
  $('body').append($col)
  fn($col)
}

console.time('previewing')

const items = [imageV, imageH, imageS, imageVV, imageH, imageHH]

renderInCol(($col) => {
  for (let item of items) {
    renderPreviews($col, [item()])
  }
})

renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      renderPreviews($col, [item(), secondItem()])
    }
  }
})

renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      for (let thirdItem of items) {
        renderPreviews($col, [item(), secondItem(), thirdItem()])
      }
    }
  }
})

renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      for (let thirdItem of items) {
        for (let fItem of items) {
          renderPreviews($col, [item(), secondItem(), thirdItem(), fItem()])
        }
      }
    }
  }
})

renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      for (let thirdItem of items) {
        for (let fItem of items) {
          renderPreviews($col, [secondItem(), item(), secondItem(), thirdItem(), fItem()])
        }
      }
    }
  }
})

renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      for (let thirdItem of items) {
        for (let fItem of items) {
          renderPreviews($col, [item(), thirdItem(), secondItem(), item(), fItem(), secondItem(), secondItem(), thirdItem(), thirdItem(), item()])
        }
      }
    }
  }
})
renderInCol(($col) => {
  for (let item of items) {
    for (let secondItem of items) {
      for (let thirdItem of items) {
        for (let fItem of items) {
          renderPreviews($col, [item(), thirdItem(), secondItem(), item(), fItem(), secondItem(), secondItem(), thirdItem(), item(), item(), thirdItem(), secondItem(), item(), fItem(), secondItem(), secondItem(), thirdItem(), item(), fItem(), secondItem()])
        }
      }
    }
  }
})
console.timeEnd('previewing')

console.log('all images', ALL_IMAGES_COUNT)
console.log('images with width < 20%', SMALL_IMAGES_COUNT)
console.log('images with width < 15%', VERY_SMALL_IMAGES_COUNT)
console.log('averageDiff', OPTIMAL_DIFF_SUM / OPTIMAL_NUMS)
