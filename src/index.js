const SINGLE_PREVIEW_RATIO = 1

const MAX_IMAGES = 25

const sum = arr => arr.reduce((a, b) => a + b, 0)
const clamp = (num, min, max) => (Math.min(max, Math.max(min, num)))
const lerp = (a, b, alpha) => a + alpha * ( b - a )
const aspectRatio = image => image.width / image.height
const getAverageRatio = images => images.map(aspectRatio).reduce((result, ratio) => ratio + result, 1) / images.length

// inspired by https://github.com/Ajaxy/telegram-tt/blob/master/src/components/middle/message/helpers/calculateAlbumLayout.ts
const cropImages = (images, averageRatio) => {
  for (let image of images) {
    const ratio = aspectRatio(image)
    const clampedRatio = averageRatio > 1.1 ? clamp(ratio, 1, 2.75) : clamp(ratio, 0.6667, 1)

    image.height = image.width / clampedRatio
  }
}

const applyScale = (image, scale) => {
  image.width *= scale
  image.height *= scale
  return image
}

const copyImages = images => {
  const newImages = []
  for (let image of images) {
    let newImg = JSON.parse(JSON.stringify(image))
    newImg._width = image.width
    newImg._height = image.height
    newImages.push(newImg)
  }
  return newImages
}


// scales images in a list in a way that they are fit into a single row
const prepareRow = images => {
  const rowHeight = 100 / sum(images.map(aspectRatio))
  let row = { width: 100, height: rowHeight }

  row.images = images.map(image => scaleImageToHeight(image, row.height))
  row.ratio = aspectRatio(row)

  return row
}

const prepareCol = images => {
  const colWidth = 100 / sum(images.map(image => 1 / aspectRatio(image)))
  const col = { width: colWidth, height: 100 }

  col.images = images.map(image => scaleImageToWidth(image, col.width))
  col.ratio = aspectRatio(col)

  return col
}

const scaleImageToWidth = (image, width) => {
  let ratio = aspectRatio(image)
  image.width = width
  image.height = width / ratio

  if (image.images) {
    for (let nestedImage of image.images) {
      scaleImageToHeight(nestedImage, image.height)
    }
  }

  return image
}

const scaleImageToHeight = (image, height) => {
  let ratio = aspectRatio(image)
  image.width = height * ratio
  image.height = height

  if (image.images) {
    for (let nestedImage of image.images) {
      scaleImageToWidth(nestedImage, image.width)
    }
  }

  return image
}

const prepareRowsVariations = (images, maxRows, { averageRatio }) => {
  const variants = []
  if (maxRows >= 1) variants.push([images])

  if (maxRows >= 2) {
    const MAX_ITEMS_IN_ROW_1 = 3

    for (let i = 1; i < MAX_ITEMS_IN_ROW_1 + 1; i++) {
      variants.push([images.slice(0, i), images.slice(i, images.length)])
    }
  }

  if (maxRows >= 3) {
    for (let [p1, p2] of [...variants]) {
      if (!p1 || !p2) continue

      const MAX_ITEMS_IN_ROW_2 = averageRatio < 0.85 ? 4 : 3

      for (let i = 1; i < MAX_ITEMS_IN_ROW_2 + 1; i++) {
        variants.push([p1, p2.slice(0, i), p2.slice(i, p2.length)])
      }
    }
  }

  if (maxRows >= 4) {
    for (let [p1, p2, p3] of [...variants]) {
      if (!p1 || !p2 || !p3) continue

      const MAX_ITEMS_IN_ROW_3 = 3

      for (let i = 1; i < MAX_ITEMS_IN_ROW_3 + 1; i++) {
        variants.push([p1, p2, p3.slice(0, i), p3.slice(i, p3.length)])
      }
    }
  }

  if (maxRows >= 5) {
    for (let [p1, p2, p3, p4] of [...variants]) {
      if (!p1 || !p2 || !p3 || !p4) continue

      const MAX_ITEMS_IN_ROW_4 = 4

      for (let i = 1; i < MAX_ITEMS_IN_ROW_4 + 1; i++) {
        variants.push([p1, p2, p3, p4.slice(0, i), p4.slice(i, p4.length)])
      }
    }
  }

  if (maxRows >= 6) {
    for (let [p1, p2, p3, p4, p5] of [...variants]) {
      if (!p1 || !p2 || !p3 || !p4 || !p5) continue

      const MAX_ITEMS_IN_ROW_5 = 4

      for (let i = 1; i < MAX_ITEMS_IN_ROW_5 + 1; i++) {
        variants.push([p1, p2, p3, p4, p5.slice(0, i), p5.slice(i, p5.length)])
      }
    }
  }

  if (maxRows >= 7) {
    for (let [p1, p2, p3, p4, p5, p6] of [...variants]) {
      if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) continue

      const MAX_ITEMS_IN_ROW_6 = 3

      for (let i = 1; i < MAX_ITEMS_IN_ROW_6; i++) {
        variants.push([p1, p2, p3, p4, p5, p6.slice(0, i), p6.slice(i, p6.length)])
      }
    }
  }

  return variants
}

const prepareVariants = (images, options) => {
  const variants = []
  const isSmallGroup = images.length <= 4

  const maxRows = (() => {
    if (isSmallGroup) return 2
    if (images.length <= 8) return 3
    if (images.length <= 12) return 4
    if (images.length <= 16) return 5
    if (images.length <= 18) return 6

    return 7
  })()

  const variations = prepareRowsVariations(images, maxRows, options)

  for (let v of variations) {
    if (v.length === 1) {
      variants.push({rows: v})
    } else {
      variants.push({rows: v})
      if (isSmallGroup && v[0].length === 1) {
        variants.push({cols: v})
      }
    }
  }

  return variants
}

// this function will scale all nested images according to calculated aspect ratios
const getPreviews = (variant, mosaicShape) => {
  const previews = []
  if (variant.cols) {
    for (let col of mosaicShape.images) {
      for (let nestedImage of col.images) {
        previews.push({ ...nestedImage })
      }
    }
  } else if (variant.rows) {
    // we need to wrap in additional row for auto-scaling to work properly
    scaleImageToWidth({ ...mosaicShape, images: [mosaicShape] }, 100)
    for (let row of mosaicShape.images) {
      for (let nestedImage of row.images) {
        previews.push({ ...nestedImage })
      }
    }
  }
  return previews
}

const getOptimalVariant = (images, options) => {
  const variants = prepareVariants(images, options)
  let optimalVariant
  let optimalRatio
  let optimalPreviews

  // all values here are hand-adjusted to get the minimum amount of produced small images
  let targetRatio = lerp(1.35, .47, images.length / MAX_IMAGES)

  for (let variant of variants) {
    const mosaicShape = variant.cols
      ? prepareRow(variant.cols.map(prepareCol))
      : prepareCol(variant.rows.map(prepareRow))

    let ratio = aspectRatio(mosaicShape)
    const previews = getPreviews(variant, mosaicShape)

    // penalize current variant for every small image
    for (let _badPreview of previews.filter(p => p.width <= 20 || p.height <= 20)) {
      ratio > targetRatio ? (ratio *= 1.3) : (ratio /= 1.3)
    }

    // encourage cols layout
    if (variant.cols) {
      ratio > targetRatio ? (ratio /= 1.15) : (ratio *= 1.15)
    }

    if (optimalVariant) {
      if (Math.abs(ratio - targetRatio) < Math.abs(optimalRatio - targetRatio)) {
        optimalRatio = ratio
        optimalVariant = variant
        optimalPreviews = previews
      }
    } else {
      optimalRatio = ratio
      optimalVariant = variant
      optimalPreviews = previews
    }
  }

  return { variant: optimalVariant, previews: optimalPreviews, aspectRatio: optimalRatio, diff: Math.abs(optimalRatio - targetRatio) }
}

const singlePreview = images => {
  const image = images[0]
  const targetRatio = SINGLE_PREVIEW_RATIO
  const scaleTo = {
    width: 100,
    height: 100 / targetRatio
  }
  const scale = Math.min(scaleTo.width / image.width, scaleTo.height / image.height)
  const preview = applyScale(image, scale)

  return { previews: [preview], aspectRatio: image.width / image.height, direction: 'row' }
}

const twoImgPreviews = images => {
  const previews = []
  const row = prepareRow(images)

  for (let image of row.images) {
    previews.push(image)
  }

  return { previews, aspectRatio: row.ratio, direction: 'row' }
}

const manyImgPreviews = (images, options) => {
  let direction
  const { variant, previews, diff, aspectRatio } = getOptimalVariant(images, options)

  if (variant.cols) {
    direction = 'column'
  } else if (variant.rows) {
    direction = 'row'
  }

  return {
    aspectRatio,
    previews: previews,
    direction,
    diff
  }
}

const MAX_VERTICAL_IMAGE_RATIO = 0.56
const fixVerticalImages = (images) => {
  for (let image of images) {
    if (aspectRatio(image) >= MAX_VERTICAL_IMAGE_RATIO) continue
    image.height = image.width / MAX_VERTICAL_IMAGE_RATIO
  }
}

const MIN_HORIZONTAL_IMAGE_RATIO = 1.77
const fixHorizontalImages = (images) => {
  for (let image of images) {
    if (aspectRatio(image) <= MIN_HORIZONTAL_IMAGE_RATIO) continue
    image.width = image.height * MIN_HORIZONTAL_IMAGE_RATIO
  }
}

module.exports = (images, options = {type: 'desktop'}) => {
  let processorFn = (images, _options) => images
  images = copyImages(images) // don't touch original images

  if (images.length === 1) {
    fixVerticalImages(images)
    fixHorizontalImages(images)
    processorFn = singlePreview
  } else if (images.length === 2) {
    fixVerticalImages(images)
    fixHorizontalImages(images)
    processorFn = twoImgPreviews
  } else if (images.length > 2 && images.length <= 4) {
    fixVerticalImages(images)
    fixHorizontalImages(images)
    processorFn = manyImgPreviews
  } else if (images.length > 4) {
    const averageRatio = getAverageRatio(images)
    options = { ...options, averageRatio }

    cropImages(images, averageRatio)
    processorFn = manyImgPreviews
  }

  return processorFn(images, options)
}
