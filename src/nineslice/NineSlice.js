import buildSliceConfig from './buildSliceConfig'

const getSliceLayout = config => ({
    topLeft: { x: config.topLeft.width, y: config.topLeft.height },
    topRight: { x: config.topRight.width, y: config.topRight.height },
    bottomLeft: { x: config.bottomLeft.width, y: config.bottomLeft.height },
    bottomRight: { x: config.bottomRight.width, y: config.bottomRight.height },
})

const BASE = '__BASE'
const MISSING = '__MISSING'

export default class NineSlice extends Phaser.GameObjects.RenderTexture {
    constructor(scene, sliceConfig, positionConfig) {
        const { x, y, width, height } = positionConfig

        super(scene, x, y, width || 32, height || 32)

        this.sliceConfig = buildSliceConfig(sliceConfig)

        const { sourceKey, sourceFrame } = this.sliceConfig

        if (!sourceKey) {
            throw new Error('NineSlice requires a texture key to be specified.')
        }

        this.sourceTexture = scene.sys.textures.get(sourceKey)

        if (!this.sourceTexture || this.sourceTexture.key === MISSING) {
            throw new Error(`Specified texture key '${sourceKey}' not found.`)
        }

        this.frameCache = {}

        const frameName = sourceFrame || BASE

        this.sourceFrame = this.sourceTexture.get(frameName)

        this.initFrames()

        this.initialized = true

        this.resize(width, height)
    }

    get x() {
        return this._x
    }

    set x(x) {
        this._x = x

        if (this._debugGraphic) {
            this._debugGraphic.clear()
            this.updateSafeBounds()
            this.drawFrames()
        }
    }

    get y() {
        return this._y
    }

    set y(y) {
        this._y = y

        if (this._debugGraphic) {
            this._debugGraphic.clear()
            this.updateSafeBounds()
            this.drawFrames()
        }
    }

    drawFrames() {
        if (!this.initialized) {
            return
        }

        if (this._debugGraphic) {
            this._debugGraphic.lineStyle(1, 0xff0000)
        }

        const layout = getSliceLayout(this.sliceConfig.sourceLayout)
        const frame = this.frameCache

        const draw = (currentFrame, x, y, width, height) => {
            if (width > 0 && height > 0) {
                if (this._debugGraphic) {
                    const debugX = this.x + x + (this.parentContainer?.x || 0)
                    const debugY = this.y + y + (this.parentContainer?.y || 0)

                    this._debugGraphic.strokeRect(debugX, debugY, width, height)
                }

                const frameImage = this.scene.make.image({
                    key: this.sourceTexture.key,
                    frame: currentFrame.name,
                    x: 0,
                    y: 0,
                })

                const scaleX = width / currentFrame.width
                const scaleY = height / currentFrame.height

                frameImage.setOrigin(0).setScale(scaleX, scaleY)

                this.draw(frameImage, x, y)

                frameImage.destroy()
            }
        }

        this.clear()

        const minLeftX = Math.min(layout.topLeft.x, layout.bottomLeft.x)
        const minRightX = Math.min(layout.topRight.x, layout.bottomRight.x)

        const minTopY = Math.min(layout.topLeft.y, layout.topRight.y)
        const minBottomY = Math.min(layout.bottomLeft.y, layout.bottomRight.y)

        draw(frame.center, minLeftX, minTopY, this.width - minLeftX - minRightX, this.height - minTopY - minBottomY)
        draw(frame.topMiddle, layout.topLeft.x, 0, this.width - layout.topLeft.x - layout.topRight.x, frame.topMiddle.height)
        draw(frame.bottomMiddle,layout.bottomLeft.x, this.height - frame.bottomMiddle.height, this.width - layout.bottomLeft.x - layout.bottomRight.x, frame.bottomMiddle.height)
        draw(frame.leftMiddle, 0, layout.topLeft.y, frame.leftMiddle.width, this.height - layout.topLeft.y - layout.bottomLeft.y)
        draw(frame.rightMiddle, this.width - layout.topRight.x, layout.topRight.y, frame.rightMiddle.width, this.height - layout.topRight.y - layout.bottomRight.y)

        draw(frame.topLeft, 0, 0, layout.topLeft.x, layout.topLeft.y)
        draw(frame.topRight, this.width - layout.topRight.x, 0, layout.topRight.x, layout.topRight.y)
        draw(frame.bottomLeft, 0, this.height - layout.bottomLeft.y, layout.bottomLeft.x, layout.bottomLeft.y)
        draw(frame.bottomRight, this.width - layout.bottomRight.x, this.height - layout.bottomRight.y, layout.bottomRight.x, layout.bottomRight.y)
    }

    enableDebugDraw(enabled = true) {
        if (this._debugGraphic) {
            this._debugGraphic.clear()
        }

        if (enabled) {
            this._debugGraphic = this.scene.add.graphics(this.x, this.y)
        } else {
            this._debugGraphic.destroy(true)
            this._debugGraphic = null
        }

        this.drawFrames()
        this.updateSafeBounds()
    }

    initFrames() {
        const texture = this.sourceTexture
        const textureWidth = this.sourceFrame.width
        const textureHeight = this.sourceFrame.height
        const textureX = this.sourceFrame.cutX
        const textureY = this.sourceFrame.cutY

        const addFrame = (frame, x, y, width, height) => {
            const name = `${this.sliceConfig.sourceKey}_${this.sliceConfig.sourceFrame}/${frame}`

            if (!texture.has(name)) {
                this.frameCache[frame] = texture.add(name, 0, textureX + x, textureY + y, width, height)
            } else {
                this.frameCache[frame] = texture.frames[name]
            }
        }

        const layout = getSliceLayout(this.sliceConfig.sourceLayout)

        addFrame('topLeft', 0, 0, layout.topLeft.x, layout.topLeft.y)
        addFrame('topRight', textureWidth - layout.topRight.x, 0, layout.topRight.x, layout.topRight.y)
        addFrame('bottomRight', textureWidth - layout.bottomRight.x, textureHeight - layout.bottomRight.y, layout.bottomRight.x, layout.bottomRight.y)
        addFrame('bottomLeft', 0, textureHeight - layout.bottomLeft.y, layout.bottomLeft.x, layout.bottomLeft.y)

        addFrame('topMiddle',
            layout.topLeft.x, 0,
            textureWidth - (layout.topLeft.x + layout.topRight.x), Math.max(layout.topLeft.y, layout.topRight.y)
        )

        addFrame('bottomMiddle',
            layout.bottomLeft.x, textureHeight - Math.max(layout.bottomLeft.y, layout.bottomRight.y),
            textureWidth - (layout.bottomLeft.x + layout.bottomRight.x), Math.max(layout.bottomLeft.y, layout.bottomRight.y)
        )

        addFrame('leftMiddle',
            0, layout.topLeft.y,
            Math.max(layout.topLeft.x, layout.bottomLeft.x), textureHeight - (layout.topLeft.y + layout.bottomLeft.y)
        )

        addFrame('rightMiddle',
            textureWidth - Math.max(layout.topRight.x, layout.bottomRight.x), layout.topRight.y,
            Math.max(layout.topRight.x, layout.bottomRight.x), textureHeight - layout.topRight.y - layout.bottomRight.y
        )

        const centerLeftX = Math.min(layout.topLeft.x, layout.bottomLeft.x)
        const centerTopY = Math.min(layout.topLeft.y, layout.topRight.y)

        addFrame('center',
            centerLeftX, centerTopY,
            textureWidth - centerLeftX - Math.min(layout.topRight.x, layout.bottomRight.x), textureHeight - centerTopY - Math.min(layout.bottomRight.y, layout.bottomLeft.y)
        )
    }

    resize(width, height) {
        if (!this.initialized) {
            return
        }

        const safeOffsets = this.sliceConfig.safeOffsets
        const minWidth = safeOffsets.left + safeOffsets.right
        const minHeight = safeOffsets.top + safeOffsets.bottom

        if (width < minWidth || height < minHeight) {
            console.error(`Attempted to set the NineSlice size below the minimum. (${minWidth}x${minHeight})`)
            return
        }

        super.resize(width, height)

        this.drawFrames()
        this.updateSafeBounds()
    }

    updateSafeBounds() {
        if (!this.initialized || !this._debugGraphic) {
            return
        }

        if (!this._safeBounds) {
            this._safeBounds = new Phaser.Geom.Rectangle()
        }

        const { top, right, bottom, left } = this.sliceConfig.safeOffsets
        const newX = this.x + left
        const newY = this.y + top
        const newWidth = this.width - (left + right)
        const newHeight = this.height - (top + bottom)

        const { x, y, width, height } = this._safeBounds

        if (newX !== x || newY !== y || newWidth !== width || newHeight !== height) {
            const debugX = newX + (this.parentContainer?.x || 0)
            const debugY = newY + (this.parentContainer?.y || 0)

            this._safeBounds.setTo(debugX, debugY, newWidth, newHeight)
        }

        this._debugGraphic.lineStyle(1, 0x00ff00)
        this._debugGraphic.strokeRectShape(this._safeBounds)
    }
}