# Virtual Mouse Firefox Extension

A Firefox extension that implements virtual mouse functionality through a content script.

## Structure

- `manifest.json` - Extension configuration file
- `content/virtMouse.js` - Content script implementing virtual mouse functionality
- `icons/` - Directory containing extension icons

## Installation

1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this extension

## Development

The extension uses Manifest V3 and includes a content script that runs on all URLs. The virtual mouse functionality is implemented in the `virtMouse.js` content script.

## Features

- Virtual mouse movement tracking
- Click event handling
- Basic mouse interaction logging

## License

MIT License "# chr_ext_1" 
