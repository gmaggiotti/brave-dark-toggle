# Dark Mode Toggle Extension

A minimal browser extension for Brave (and other Chromium-based browsers) that toggles dark mode on any website with a single click.

## Features

- 🌙 One-click dark mode toggle
- 💾 Keeps your preferences on each tab
- 🏷️ Badge indicator shows "ON" when active
- ⚡ Fast and lightweight - no popup UI

## Installation

### For Development

1. Open Brave browser
2. Navigate to `brave://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `brave-dark-toggle` folder
6. Pin the extension to your toolbar for easy access

## How to Use

1. **Pin the extension** to your toolbar (right-click extension icon → "Pin")
2. **Click the button** to toggle dark mode on the current website
3. Badge shows **"ON"** in green when dark mode is active
4. The extension automatically remembers your preference for each website

## File Structure

```
brave-dark-toggle/
├── manifest.json       # Extension configuration
├── content.js         # Dark mode CSS injection
├── background.js      # Click handler and state management
└── README.md          # This file
```

## How It Works

1. **Click Handler**: Click the toolbar button to toggle dark mode
2. **Content Script** (`content.js`): Injects CSS to invert colors and apply dark mode
3. **Background Script** (`background.js`): Manages state, badge, and toolbar click events
4. **Storage**: Uses Chrome's local storage to remember preferences per domain
5. **Badge**: Shows "ON" indicator when dark mode is active

## Customization

You can customize the dark mode appearance by editing the CSS in `content.js`. The current implementation uses CSS filters to invert colors while keeping images and videos natural-looking.

## Compatibility

- ✅ Brave Browser
- ✅ Chrome
- ✅ Edge
- ✅ Opera
- ✅ Any Chromium-based browser

## License

MIT License - Feel free to use and modify as needed.

## Author

Gabriel Maggiotti
