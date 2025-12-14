/*!
* KioskBoard - Virtual Keyboard - ES Module Entry
* Version: 2.3.0
*/

// Import for side effects (UMD module attaches to window)
import './kioskboard.js';

// Re-export from window/globalThis
const KioskBoard = (typeof globalThis !== 'undefined' ? globalThis : window).KioskBoard;

export default KioskBoard;