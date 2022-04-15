# NineSlice Plugin for Phaser 3

This plugin adds a new game object to Phaser that allows you to resize your images and sprites without distorting them.

## What is 9-slice scaling?

9-slice scaling is a 2D image resizing technique to proportionally scale an image by splitting it in a grid of nine parts.

The key idea is to prevent image scaling distortion by protecting the pixels defined in 4 parts (corners) of the image and scaling or repeating the pixels in the other 5 parts.

(Source: [Wikipedia](https://en.wikipedia.org/wiki/9-slice_scaling))

## Getting the plugin: Directly including it.

[![](https://data.jsdelivr.com/v1/package/npm/@teampanfu/phaser-nineslice/badge)](https://www.jsdelivr.com/package/npm/@teampanfu/phaser-nineslice)

Paste this into the `<head>` area of your HTML layout:

```html
<script src="//cdn.jsdelivr.net/npm/@teampanfu/phaser-nineslice@latest/dist/nineslice.min.js"></script>
```

Once you have pasted the script, you have access to the global `NineSlice` variable.

This will allow you to include the plugin as follows:

```js
const config = {
    ...
    plugins: {
        global: [
            { key: 'NineSlicePlugin', plugin: NineSlice.Plugin, start: true }
        ]
    }
};

new Phaser.Game(config);
```

## Getting the plugin: `npm` and `yarn`

![npm](https://img.shields.io/npm/dt/@teampanfu/phaser-nineslice?style=flat-square)

The plugin is published on npm under `@teampanfu/phaser-nineslice` and can be installed as follows:

```bash
# npm:
npm install @teampanfu/phaser-nineslice --save

# yarn:
yarn add @teampanfu/phaser-nineslice
```

You can then add it like this:

```js
// Assuming you use ES6 imports...
import { Plugin as NineSlicePlugin } from '@teampanfu/phaser-nineslice'

const config = {
    ...
    plugins: {
        global: [
            { key: 'NineSlicePlugin', plugin: NineSlicePlugin, start: true }
        ]
    }
}

new Phaser.Game(config)
```

## Usage

Once you have added the plugin to your game, you can now use the NineSlice game object in the scene as follows:

```js
class Example extends Phaser.Scene {
    preload() {
        // Preload your image or sprite before using it!
    }

    create() {
        this.add.nineslice(100, 100, 300, 250, 'myTexture', 25);
    }
}
```

## Configuration

### Position

The first two arguments are for the position of the game object.

### Size

The third and fourth argument is for the size of the game object. It doesn't have to be the size of the texture, you can use any size!

However, it must not be smaller than the offsets.

### Spritesheets and Texture Atlases

The fifth argument can be either a string with the key of the texture, or an object with key and frame.

```js
this.add.nineslice(100, 100, 300, 250, { key: 'myTexture', frame: 'test' }, 25);
```

### Corner offsets

The sixth argument is the offset of the corners. It can be either a number, which is then applied to all 4 corners, or an array.

When an array is used, it can consist of 1 to 4 elements and the values are assigned in the same way as when defining border offsets in CSS.

Array Length  | Use  | Explanation  |
------------  | ---- | ------------ |
1 | `[0]` | The first (only) element is used as the value for all corners.
2 | `[0, 10]` | The first element is used for top and bottom, the second is used for left and right.
3 | `[0, 10, 5]` | The first element is used for top, the second for right and left, and the third for bottom.
4 | `[0, 10, 5, 20]` | The first element is used for top, the second for right, the third for bottom and the fourth for left.

## Methods

### Resizing

If you want to change the size of the game object, use the `resize` method on your sliced game object:

```js
const sliced = this.add.nineslice(...);
sliced.resize(width, height);
```



### Enable debug drawing

The NineSlice plugin has a built-in debug mode, so you can quickly find the right offsets for you and check them.

To enable the debug mode, use `enableDebugDraw` on your sliced game object:

```js
const sliced = this.add.nineslice(...);
sliced.enableDebugDraw();

// or disable it:
sliced.enableDebugDraw(false);
```

You will then see the boundaries of the NineSlice game object.

## Credits

* [Azerion's Phaser v2 NineSlice plugin](https://github.com/azerion/phaser-nineslice) for the inspiration.
* [jdotrjs' Phaser v3 NineSlice plugin](https://github.com/jdotrjs/phaser3-nineslice) for the base of this code.

## Contribute

If you find a bug or have a suggestion for a feature, feel free to create a new issue or open a pull request.

We are happy about every contribution!

## License

This package is open-source software licensed under the [MIT License](LICENSE).