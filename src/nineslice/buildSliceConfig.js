export default function buildSliceConfig(config) {
    if (typeof config.sourceLayout.width === 'number') {
        const { width, height } = config.sourceLayout
        config.sourceLayout = { topLeft: { width, height } }
    }

    const layout = config.sourceLayout

    layout.topRight = layout.topRight || layout.topLeft
    layout.bottomLeft = layout.bottomLeft || layout.topLeft
    layout.bottomRight = layout.bottomRight || layout.topLeft

    const maxTopHeight = Math.max(layout.topLeft.height, layout.topRight.height)
    const maxRightWidth = Math.max(layout.topRight.width, layout.bottomRight.width)
    const maxBottomHeight = Math.max(layout.bottomLeft.height, layout.bottomRight.height)
    const maxLeftWidth = Math.max(layout.topLeft.width, layout.bottomLeft.width)

    if (!config.safeOffsets) {
        config.safeOffsets = {
            top: maxTopHeight,
            right: maxRightWidth,
            bottom: maxBottomHeight,
            left: maxLeftWidth,
        }
    }

    return config
}