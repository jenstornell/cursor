# Markia

## Options

You need to create `options.php` and place it in the root.

```php
return [
  'autosave' => true,
  'autosave.interval' => 15,
  'bar.bottom' => true,
  'bar.top' => true,
  'editor.width' => 900,
  'project.css' => null,
  'project.path' => null,
  'preview.width' => 900,
  'revisions.folder' => 'revisions',
  'revisions.hide' => true,
  'revisions.max' => 2,
  'root.path' => null,
  'root.url' => null,
  'sidebar.width' => 300,
  'spellcheck' => false,
];
```

| Name              | Type     | Default     | Description |
| ----------------- | -------- | ----------- | ----------- |
| autosave          | bool     | true        | Save the file automatically after a numer of seconds |
| autosave.interval | int      | 15          | If autosave is true, you can use this option to set number of seconds |
| bar.bottom        | bool     | true        | Enable or disable the bottom bar |
| bar.top           | bool     | true        | Enable or disable the top bar |
| editor.width      | int      | 900         | Set the editor textarea width |
| project.css       | string   | null        | Set a custom css for the preview to match your project |
| project.path      | string   | null        | You need to set the path to your project folder where your markdown files are stored |
| preview.width     | int      | 900         | Set the preview width to match your project |
| revisions.folder  | string   | 'revisions' | If `revisions.max` is set, you can specify a name for the revisions folder |
| revisions.hide    | bool     | true        | If you don't want to show the revisions folder in the filetree, you can hide it |
| revisions.max     | bool/int | 2           | To use revisions, set the number of revisions you want to keep. To disable it, set it to `false` |
| root.path         | string   | null        | The root path is the path where Markia is stored |
| root.url          | string   | null        | The root url from where to acess Markia |
| sidebar.width     | int      | 300         | Set the sidebar width in case your file structure gets too wide |
| spellcheck        | bool     | false       | Spellchecker is `false` by default but you can enable it if needed |

https://remixicon.com/