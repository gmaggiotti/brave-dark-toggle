/**
 * Brave Dark Mode Toggle Extension
 * @author Gabriel Maggiotti
 */

async function toggleDarkMode(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const styleId = "__brave_dark_mode__";
      const observerId = "__brave_dark_mode_observer__";
      let style = document.getElementById(styleId);

      if (style) {
        style.remove();
        // Remove observer if exists
        if (window[observerId]) {
          window[observerId].disconnect();
          delete window[observerId];
        }
        
        // Clean up any inline filters applied by the observer (especially for Google Sheets)
        document.querySelectorAll('canvas').forEach(canvas => {
          canvas.style.filter = '';
        });
        
        // Clean up any other elements that might have filters
        document.querySelectorAll('.docs-sheet-container, .cell-input, .docs-sheet-cell-text').forEach(el => {
          el.style.filter = '';
        });
        
        return;
      }

      style = document.createElement("style");
      style.id = styleId;
      
      // Check if it's a Google Docs/Sheets page
      const isGoogleDocs = window.location.hostname.includes('docs.google.com');
      
      if (isGoogleDocs) {
        style.innerHTML = `
          /* Direct dark mode for Google Docs/Sheets - no invert */
          body, .docs-material, .kix-appview-editor, 
          .docs-sheet-container, .grid-container,
          [role="grid"], [role="document"] {
            background-color: #1e1e1e !important;
          }
          
          /* Dark cells and content areas */
          .kix-page-compact, .kix-page, 
          div[contenteditable="true"] {
            background-color: #2b2b2b !important;
            color: #e8e8e8 !important;
          }
          
          /* All text elements - force white text */
          span, p, div, .kix-lineview, .kix-lineview-text-block,
          .kix-wordhtmlgenerator-word-node {
            color: #e8e8e8 !important;
          }
          
          /* Override any inline styles on spans in docs */
          .kix-lineview span[style*="color"] {
            color: #e8e8e8 !important;
          }
          
          /* Google Sheets - invert the canvas to make it dark */
          .docs-sheet-container, 
          canvas.docs-sheet-grid-canvas,
          canvas {
            filter: invert(1) hue-rotate(180deg) !important;
          }
          
          /* But keep text readable by inverting it back */
          .cell-input, .docs-sheet-cell-text,
          input, textarea {
            filter: invert(1) hue-rotate(180deg) !important;
            background-color: #2b2b2b !important;
            color: #e8e8e8 !important;
          }
          
          /* Toolbar and UI */
          .docs-material, .docs-titlebar-container,
          .goog-menu, .goog-menuitem {
            background-color: #2b2b2b !important;
            color: #e21717ff !important;
          }
          
          /* Keep images and icons normal */
          img:not(canvas), svg {
            filter: none !important;
          }
        `;
        
        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
          // Force styles on dynamically added canvas elements
          document.querySelectorAll('canvas').forEach(canvas => {
            if (!canvas.style.filter) {
              canvas.style.filter = 'invert(1) hue-rotate(180deg)';
            }
          });
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        window[observerId] = observer;
      } else {
        style.innerHTML = `
          html {
            filter: invert(1) hue-rotate(180deg);
          }
          img, video, picture, canvas, iframe {
            filter: invert(1) hue-rotate(180deg);
          }
        `;
      }
      
      document.head.appendChild(style);
    }
  });
}

// Toolbar click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) toggleDarkMode(tab.id);
});

// Keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-dark-mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) toggleDarkMode(tabs[0].id);
    });
  }
});
