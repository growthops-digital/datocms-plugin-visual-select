# Visual Select — a DatoCMS Plugin

Elegantly visualize a group of options in the DatoCMS Editor using colors, images, and more.

![](https://user-images.githubusercontent.com/56568247/155078720-2736183f-424f-4fa2-a049-c8050566e335.jpg)

---

## Configuration

This plugin is designed to be used on a per-field basis. To get started, add a single-string text field to any model or block, and under the presentation tab change the field editor from "Text input" to "Visual Select".

![](https://user-images.githubusercontent.com/56568247/155075251-dca1b09a-afa3-4293-ba49-aadc41702206.png)

### JSON Data Structure

Each field requires a JSON configuration object. This object has 2 key fields — the first is `extends` and the second is `options`.

To understand the behaviour of `extends`, see the [Global Presets](#global-presets) section below.

`options` represents each visual option displayed to the editor, as well the underlying value returned by the API. There are 4 required fields on each option:

| Key       | Value    | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `name`    | `string` | The label displayed in the editor                |
| `type`    | `string` | The visualization type, see table below          |
| `display` | `string` | The visualization display value, see table below |
| `value`   | `string` | The value returned by the API                    |

#### Visualization displays

| Type    | Display | Example                           |
| ------- | ------- | --------------------------------- |
| `color` | `hex`   | `#bada55`                         |
| `image` | `url`   | `https://example.com/my-icon.svg` |

### Visualization

There is also a third optional field you can add called `presentation`

`presentation` Is an object representing how the options should be displayed. It has 3 optional fields:

| Key       | Value     | Description                                                                  |
| --------- | --------- | ---------------------------------------------------------------------------- |
| `type`    | `string`  | The presentation type, can be either `grid` or `carousel`                    |
| `columns` | `integer` | The number of columns, used only if the type `grid` was selected             |
| `width`   | `string`  | The width of each option item, used only if the type `carousel` was selected |

### Example configuration

```json
{
	"options": [
		{
			"name": "Green",
			"type": "color",
			"display": "#bada55",
			"value": "text-brand-green"
		},
		{
			"name": "Yellow",
			"type": "color",
			"display": "#fcba03",
			"value": "text-brand-yellow"
		}
	],
	"presentation": {
		"type": "carousel",
		"width": "300px"
	}
}
```

## Global Presets

You'll often have a collection of options that you want to make available across multiple different models or blocks. Instead of repeating the same configuration object on each field, you can make use of the global presets functionality.

To supply a global presets object, navigate to the **Visual Select** plugin settings under **_Settings > Plugins > Visual Select_**.

![](https://user-images.githubusercontent.com/56568247/155076764-d671a857-eab4-4d9b-a0f7-818e17e1f96f.jpg)

### JSON Data Structure

The JSON configuration for global presets is a simple dictionary object, where each entry is an array of options following the same structure as those used on individual fields.

To make use of a global preset, first define the dictionary object in the plugin settings:

```json
{
	"brandColors": [
		{
			"name": "Green",
			"type": "color",
			"display": "#bada55",
			"value": "text-brand-green"
		},
		{
			"name": "Yellow",
			"type": "color",
			"display": "#fcba03",
			"value": "text-brand-yellow"
		}
	]
}
```

and then in an individual field's configuration object, use the `extends` key:

```json
{
	"extends": ["brandColors"]
}
```

You can extend multiple presets if required, and you can also supply additional options:

```json
{
	"extends": ["brandColors"],
	"options": [
		{
			"name": "Blue",
			"type": "color",
			"display": "#00d0ff",
			"value": "text-specials-blue"
		},
		{
			"name": "Purple",
			"type": "color",
			"display": "#8b05eb",
			"value": "text-specials-purple"
		}
	]
}
```

The example above would produce the following editor visualization (where `Green` and `Yellow` are coming from the `brandColors` preset, and `Blue` and `Purple` are from the additional options supplied):

![](https://user-images.githubusercontent.com/56568247/155077897-e11efc86-31bc-47a4-8233-3a60b1d74a3e.jpg)
