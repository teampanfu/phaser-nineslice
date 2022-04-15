class Example extends Phaser.Scene {
    preload() {
        this.load.image('bluebox', './assets/bluebox.png')
    }

    create() {
        this.add.text(10, 10, 'This is the original image:')
        this.add.image(10, 40, 'bluebox').setOrigin(0)

        this.disableDebugDraw()

        this.add.text(10, 170, 'You can resize it with NineSplice as you like:')

        const startX = 10
        const startY = 200
        const width = 350
        const height = 200
        const texture = 'bluebox'
        const offsets = [35, 15]

        this.slice = this.add.nineslice(startX, startY, width, height, texture, offsets)
    }

    enableDebugDraw() {
        const text = this.add.text(10, this.scale.height - 30, 'Disable debug drawing')
        text.setInteractive({ useHandCursor: true })
        text.on('pointerdown', () => {
            text.destroy()
            this.disableDebugDraw()
            this.slice.enableDebugDraw(false)
        })
    }

    disableDebugDraw() {
        const text = this.add.text(10, this.scale.height - 30, 'Enable debug drawing')
        text.setInteractive({ useHandCursor: true })
        text.on('pointerdown', () => {
            text.destroy()
            this.enableDebugDraw()
            this.slice.enableDebugDraw()
        })
    }
}

const config = {
    width: 800,
    height: 600,
    backgroundColor: '0x9a9a9a',
    scene: [Example],
    plugins: {
        global: [
            { key: 'NineSlicePlugin', plugin: NineSlice.Plugin, start: true }
        ]
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

window.onload = () => {
    new Phaser.Game(config)
}