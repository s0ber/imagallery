const imageH = () => {
  return {width: 1200, height: 800, color: '#FF4081'}
}
const imageV = () => {
  return {width: 800, height: 1200, color: '#56B8AE'}
}
const imageVV = () => {
  return {width: 1600, height: 900, color: '#30716A'}
}
const imageS = () => {
  return {width: 800, height: 800, color: '#F2F2F2'}
}

const renderPreviews = ($container, images) => {
  const $wrapper = $('<div class="wrapper" />')
  const $wrapperInner = $('<div class="wrapper-inner" />')
  $wrapper.append($wrapperInner)

  const previews = Imagallery(images)

  for (let preview of previews) {
    let $preview = $('<div class="preview" />').css({width: `${preview.width}%`, paddingBottom: `${preview.height}%`})
    let $previewInner = $('<div class="preview-inner" />')
    let $previewImg = $('<div class="preview-img" />').css({'background-color': preview.color})
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

const items = [imageV, imageH, imageS, imageVV, imageH]

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
          renderPreviews($col, [item(), thirdItem(), secondItem(), item(), fItem(), secondItem(), secondItem(), thirdItem(), item()])
        }
      }
    }
  }
})
