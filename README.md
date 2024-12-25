# VSCode Trailing Whitespace Trimmer

A formatter extension for Visual Studio Code that does nothing but trim trailing whitespace as in a lot of projects additional formatting rules are not necessary or desired.

- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=bitpatty.trailing-whitespace-trimmer)

## Setup

Install the extension and and add the following configuration to your VSCode's `settings.json` to apply it by default:

```jsonc
// Alternatively you can configure this via the UI:
// `Settings` -> `Editor: Default Formatter`
{
  "editor.defaultFormatter": "bitpatty.trailing-whitespace-trimmer"
}
```

Or to add it to specific file formats:

```json
{
  "[plaintext]": {
    "editor.defaultFormatter": "bitpatty.trailing-whitespace-trimmer"
  }
}
```

## License

Published under the MIT license, see `LICENSE` for details.
