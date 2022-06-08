import NineSlice from '../nineslice/NineSlice'

const processOffsetArray = (array) => {
    switch (array.length) {
        case 1: // topRightBottomLeft
            return [array[0], array[0], array[0], array[0]]
        case 2: // topBottom rightLeft
            return [array[0], array[1], array[0], array[1]]
        case 3: // top rightLeft bottom
            return [array[0], array[1], array[2], array[1]]
        case 4: // top right bottom left
            return array
    }

    throw new Error(`Received ${arr.length} offset values, expected 1 to 4.`)
}

export default function NineSliceCreator(scene, args) {
    if (args.length === 2) {
        return new NineSlice(this.scene, args)
    }

    if (args.length < 6) {
        throw new Error(`Expected at least 6 arguments to NineSlice creator, received ${args.length}.`)
    }

    if (args.length > 7) {
        console.warn(`Expected less than 7 arguments to NineSlice creator, received ${args.length}.`)
    }

    const [x, y, width, height, textureConfig, offsetConfig] = args

    const sliceConfig = {}
    const positionConfig = { x, y, width, height }

    // Extract the key and optionally the frame from the texture source
    if (typeof textureConfig === 'string') {
        sliceConfig.sourceKey = textureConfig
    } else {
        const { key, frame } = textureConfig

        sliceConfig.sourceKey = key

        if (typeof frame === 'string') {
            sliceConfig.sourceFrame = frame
        }
    }

    // Extract the layout config
    if (typeof offsetConfig === 'number') {
        // If only a number is provided, we use it for all corners
        sliceConfig.sourceLayout = { width: offsetConfig, height: offsetConfig }
    } else if (Array.isArray(offsetConfig)) {
        const [top, right, bottom, left] = processOffsetArray(offsetConfig)

        sliceConfig.sourceLayout = {
            topLeft: { width: left, height: top },
            topRight: { width: right, height: top },
            bottomLeft: { width: left, height: bottom },
            bottomRight: { width: right, height: bottom }
        }
    } else {
        sliceConfig.sourceLayout = offsetConfig
    }

    if (args.length > 6) {
        const offsets = args[6]

        if (typeof offsets === 'number') {
            sliceConfig.safeOffsets = { top: offsets, right: offsets, bottom: offsets, left: offsets }
        } else if (Array.isArray(offsets)) {
            const [top, right, bottom, left] = processOffsetArray(offsets)

            sliceConfig.safeOffsets = { top, right, bottom, left }
        } else {
            throw new Error(`Expected type number or array for argument 7, got ${typeof offsets}`)
        }
    }

    return new NineSlice(scene, sliceConfig, positionConfig)
}