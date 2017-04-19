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

const MARGIN = 2.5

const VARIANTS = [imageV, imageH, imageS]
const SQUARE = {width: 100, height: 66.66}
const MIN_POST_RATIO = SQUARE.width / SQUARE.height
const MAX_POST_RATIO = 3.5

const getRatio = (image) => {
  return image.width / image.height
}

const fitIntoSquare = (image) => {
  const scale = Math.min(SQUARE.width / image.width, SQUARE.height / image.height)
  return applyScale(image, scale)
}

const applyScale = (image, scale) => {
  const {width, height} = image
  image.width = image.width * scale
  image.height = image.height * scale
  if (image.images) {
    for (let image of image.images) {
      applyScale(image, scale)
    }
  }
  return image
}

const setOriginalSizes = (images) => {
  images.forEach((image) => {
    image._width = image.width
    image._height = image.height
  })
}

// scales images in a list in a way that they are fit into a single row
const prepareRow = (images, fixImbalanced = false) => {
  const rowHeight = 100 / images.map((image) => {
    return getRatio(image)
  }).reduce((a, b) => { return a + b }, 0)

  let row = {width: 100, height: rowHeight}

  row.images = images.map((image) => {
    const ratio = getRatio(image)
    image.width = row.height * ratio
    image.height = row.height

    if (image.images) {
      scaleImagesToWidth(image.images, image.width)
    }
    return image
  })

  row.ratio = getRatio(row)
  if (fixImbalanced) { row = fixImbalancedImages(row) }
  return row
}

const prepareCol = (images) => {
  const colWidth = 100 / images.map((image) => {
    return 1 / getRatio(image)
  }).reduce((a, b) => { return a + b }, 0)

  const col = {width: colWidth, height: 100}

  col.images = images.map((image) => {
    const ratio = getRatio(image)
    image.width = col.width
    image.height = col.width / ratio

    if (image.images) {
      scaleImagesToHeight(image.images, image.height)
    }
    return image
  })

  col.ratio = getRatio(col)
  return col
}

const fixImbalancedImages = (row) => {
  const RECOMMENDED_WIDTH = 1 / (row.images.length + 1)

  if (row.ratio < MIN_POST_RATIO) {
    let imbalancedNum = 0
    let balancedNum = 0
    let balancedWidth = 0

    row.images.forEach((image) => {
      if (getRatio(image) < RECOMMENDED_WIDTH) {
        image._imbalanced = true
        imbalancedNum++
      } else {
        balancedWidth += image.width
        balancedNum++
      }
    })

    row.images.forEach((image) => {
      if (image._imbalanced) {
        image.width = balancedWidth * RECOMMENDED_WIDTH / (1 - RECOMMENDED_WIDTH * imbalancedNum)
        image.height = row.height
        delete image._imbalanced
        adjustRowColImages(image)
      }
    })
    return prepareRow(row.images)
  } else {
    return row
  }
}

const adjustRowColImages = (col) => {
  if (col.images) {
    scaleImagesToWidth(col.images, col.width)
  }
}

const scaleImagesToWidth = (images, width) => {
  for (let image of images) {
    let ratio = getRatio(image)
    image.width = width
    image.height = width / ratio
  }
}

const scaleImagesToHeight = (images, height) => {
  for (let image of images) {
    let ratio = getRatio(image)
    image.width = height * ratio
    image.height = height
  }
}

const fitImageToRow = (image, row) => {
  if (row.ratio < MIN_POST_RATIO) {
    return {width: row.height * getRatio(image), height: 100 / MIN_POST_RATIO}
  } else if (row.ratio > MAX_POST_RATIO) {
    const scale = MAX_POST_RATIO / row.ratio
    return {width: row.height * getRatio(image), height: 100 / MAX_POST_RATIO}
  } else {
    return image
  }
}

const prepareChunkVariations = (images, maxChunks) => {
  const variants = []
  if (maxChunks >= 1) variants.push([images])

  if (maxChunks >= 2) {
    for (let i = 0; i < images.length; i++) {
      if (i === 0) continue
      variants.push([images.slice(0, i), images.slice(i, images.length)])
    }
  }

  if (maxChunks === 3) {
    for (let [p1, p2] of variants) {
      if (!p1 || !p2) continue
      const bigPart = p1.length > 1 ? p1 : p2

      for (let i = 0; i < p1.length; i++) {
        if (i === 0) continue
        let v = [bigPart.slice(0, i), bigPart.slice(i, p1.length)]
        p1.length > 1 ? v.push(p2) : v.unshift(p1)
        variants.push(v)
      }
    }
  }

  return variants
}

const prepareVariants = (images) => {
  const variants = []
  const isSmallGroup = images.length === 3 || images.length === 4
  const variations = prepareChunkVariations(images, isSmallGroup ? 2 : 3)

  for (let v of variations) {
    if (v.length === 1) {
      variants.push({singleRow: v[0]})
    } else {
      variants.push({rows: v})
      if (isSmallGroup && v[0].length === 1) {
        variants.push({cols: v})
      }
    }
  }

  return variants
}

const getOptimalVariant = (images) => {
  const variants = prepareVariants(images)
  let optimalVariant
  let optimalRatio

  for (let variant of variants) {
    let mosaicShape

    if (variant.singleRow) {
      mosaicShape = prepareRow(variant.singleRow)
    } else if (variant.rows) {
      const rows = variant.rows.map((row) => { return prepareRow(row) })
      mosaicShape = prepareCol(rows)
    } else if (variant.cols) {
      const cols = variant.cols.map((col) => { return prepareCol(col) })
      mosaicShape = prepareRow(cols)
    }

    const ratio = getRatio(mosaicShape)
    if (optimalVariant) {
      if (Math.abs(ratio - 1.5) < Math.abs(optimalRatio - 1.5)) {
        optimalRatio = ratio
        optimalVariant = variant
      }
    } else {
      optimalRatio = ratio
      optimalVariant = variant
    }
  }

  return optimalVariant
}

const renderPreviews = ($col, images) => {
  const $wrapper = $('<div class="wrapper" />')
  const $wrapperInner = $('<div class="wrapper-inner" />')
  $wrapper.append($wrapperInner)

  setOriginalSizes(images)

  const previews = []

  if (images.length === 1) {
    const image = images[0]
    const p = preparePreview(image, fitIntoSquare(image))
    previews.push(p)
  } else if (images.length === 2) {
    let row = prepareRow(images, true)

    for (let image of row.images) {
      const previewImg = fitImageToRow(image, row)
      const p = preparePreview(image, previewImg)
      previews.push(p)
    }
  } else if (images.length > 2) {
    const variant = getOptimalVariant(images)

    if (variant.singleRow) {
      const row = prepareRow(variant.singleRow, true)
      for (let image of row.images) {
        const previewImg = fitImageToRow(image, row)
        const p = preparePreview(image, previewImg)
        previews.push(p)
      }
    } else if (variant.cols) {
      const cols = variant.cols.map((col) => { return prepareCol(col) })
      const row = prepareRow(cols)

      for (let col of row.images) {
        for (let nestedImage of col.images) {
          // const previewImg = fitImageToRow(nestedImage, row)
          const p = preparePreview(nestedImage, nestedImage)
          previews.push(p)
        }
      }
    } else if (variant.rows) {
      const rows = variant.rows.map((row) => { return prepareRow(row) })
      const col = prepareCol(rows)
      const scale = 100 / col.width

      for (let row of col.images) {
        for (let nestedImage of row.images) {
          // const previewImg = fitImageToRow(nestedImage, row)
          const p = preparePreview(nestedImage, applyScale(nestedImage, scale))
          previews.push(p)
        }
      }
    }
  }

  for (let preview of previews) {
    let $preview = $('<div class="preview" />').css({width: `${preview.width}%`, paddingBottom: `${preview.height}%`})
    let $previewInner = $('<div class="preview-inner" />')
    let $previewImg = $('<div class="preview-img" />').css({'background-color': preview.color})
    $previewInner.append($previewImg)
    $preview.append($previewInner)
    $wrapperInner.append($preview)
  }

  $col.append($wrapper)
}

const preparePreview = (image, {width, height}) => {
  return {color: image.color, width, height}
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
