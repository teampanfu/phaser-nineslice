import NineSliceCreator from './NineSliceCreator'

export default class NineSlicePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager)

        pluginManager.registerGameObject('nineslice', this.addNineSlice, this.makeNineSlice)
    }

    addNineSlice(...args) {
        const slice = new NineSliceCreator(this.scene, args)
        this.displayList.add(slice)
        return slice
    }

    makeNineSlice(...args) {
        return new NineSliceCreator(this.scene, args)
    }
}