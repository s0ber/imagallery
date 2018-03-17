const MOBILE_SINGLE_PREVIEW_RATIO = 0.666
const DESKTOP_SINGLE_PREVIEW_RATIO = 1

const MOBILE_TARGET_RATIO = 0.66
const DESKTOP_TARGET_RATIO = 1.5

const MAX_VERTICAL_IMAGE_RATIO = 0.7

const getRatio = (image) => {
  return image.width / image.height
}

const applyScale = (image, scale) => {
  const {width, height} = image
  image.width *= scale
  image.height *= scale
  if (image.images) {
    for (let image of image.images) {
      applyScale(image, scale)
    }
  }
  return image
}

const copyImages = (images) => {
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
const prepareRow = (images) => {
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

const getOptimalVariant = (images, options) => {
  const variants = prepareVariants(images)
  let optimalVariant
  let optimalRatio
  let targetRatio = options.type == 'desktop' ? DESKTOP_TARGET_RATIO : MOBILE_TARGET_RATIO

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
      if (Math.abs(ratio - targetRatio) < Math.abs(optimalRatio - targetRatio)) {
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

const preparePreview = (image, {width, height}) => {
  return {color: image.color, width, height}
}

const singlePreview = (images, options) => {
  const image = images[0]
  const targetRatio = options.type == 'desktop' ? DESKTOP_SINGLE_PREVIEW_RATIO : MOBILE_SINGLE_PREVIEW_RATIO
  const scaleTo = {
    width: 100,
    height: 100 / targetRatio
  }
  const scale = Math.min(scaleTo.width / image.width, scaleTo.height / image.height)
  const preview = applyScale(image, scale)

  return [preview]
}

const twoImgPreviews = (images, options) => {
  const previews = []
  const row = prepareRow(images)

  for (let image of row.images) {
    previews.push(image)
  }

  return previews
}

const manyImgPreviews = (images, options) => {
  const previews = []
  const variant = getOptimalVariant(images, options)

  if (variant.singleRow) {
    const row = prepareRow(variant.singleRow, true)
    for (let image of row.images) {
      previews.push(image)
    }
  } else if (variant.cols) {
    const cols = variant.cols.map((col) => { return prepareCol(col) })
    const row = prepareRow(cols)

    for (let col of row.images) {
      for (let nestedImage of col.images) {
        previews.push(nestedImage)
      }
    }
  } else if (variant.rows) {
    const rows = variant.rows.map((row) => { return prepareRow(row) })
    const col = prepareCol(rows)
    const scale = 100 / col.width

    for (let row of col.images) {
      for (let nestedImage of row.images) {
        previews.push(applyScale(nestedImage, scale))
      }
    }
  }

  return previews
}

const fixVerticalImages = (images) => {
  for (let image of images) {
    if (getRatio(image) >= MAX_VERTICAL_IMAGE_RATIO) continue
    image.height = image.width / MAX_VERTICAL_IMAGE_RATIO
  }
}

module.exports = (images, options = {type: 'desktop'}) => {
  let processorFn
  images = copyImages(images) // don't touch original images

  fixVerticalImages(images)

  if (images.length === 1) {
    processorFn = singlePreview
  } else if (images.length === 2) {
    processorFn = twoImgPreviews
  } else if (images.length > 2) {
    processorFn = manyImgPreviews
  } else {
    processorFn = () => {}
  }

  return processorFn(images, options)
}
