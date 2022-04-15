declare module 'phaser-nineslice' {
    export interface NineSliceConfig {
        sourceKey: string,
        sourceFrame?: string | number,
        sourceLayout: LayoutConfig | CornerConfig,
    }

    export interface PositionConfig {
        x?: number,
        y?: number,
        width?: number,
        height?: number,
    }

    export interface LayoutConfig {
        topLeft: CornerConfig,
        topRight?: CornerConfig,
        bottomLeft?: CornerConfig,
        bottomRight?: CornerConfig,
    }

    export interface CornerConfig {
        width: number,
        height?: number,
    }

    export class NineSlice extends Phaser.GameObjects.RenderTexture {
        constructor(scene: Phaser.Scene, config: NineSliceConfig, position: PositionConfig);
    }
}

declare namespace Phaser.GameObjects {
    interface NineSlice extends Phaser.GameObjects.RenderTexture {
        /**
         * Enable or disable debug drawing for this game object. If enabled, the bounds of the sliced game object are displayed.
         * @param enabled Whether debug drawing should be enabled. Default is true.
         */
        enableDebugDraw(enabled?: boolean): void;
    }

    interface GameObjectFactory {
        /**
         * Creates a new NineSlice game object and returns it.
         * @param x The horizontal position of this game object.
         * @param y The vertical position of this game object in the world.
         * @param width The width of the game object.
         * @param height The height of the game object.
         * @param texture The key of the preloaded texture or an object with key and frame.
         * @param offset The width and height to be offset for a corner slice.
         * @param safeArea Pixels to be accounted for in the calculation of the safe area.
         */
        nineslice(x: number, y: number, width: number, height: number, texture: string | { key: string, frame: string | number }, offset: number | number[]): Phaser.GameObjects.NineSlice;
    }

    interface GameObjectCreator {
        /**
         * The configuration objects this game object will use to create itself.
         *
         * Creates a new NineSlice game object and returns it.
         * @param sliceConfig The texture configuration specifies which texture is used and how the slice should be laid out based on it.
         * @param positionConfig The position configuration specifies the position and size of the game object. If not specified, x and y position are 0 and the size is calculated from the texture.
         */
        nineslice(sliceConfig: SliceConfig, positionConfig: PositionConfig): Phaser.GameObjects.NineSlice;
    }
}