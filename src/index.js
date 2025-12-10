/*!
* KioskBoard - Virtual Keyboard - ES Module Entry
* Version: 2.3.0
*/

// Le script UMD définit KioskBoard sur le contexte global
import './kioskboard.js';

// Récupérer KioskBoard depuis le contexte approprié
const KioskBoard = (typeof window !== 'undefined' && window.KioskBoard) ||
                   (typeof global !== 'undefined' && global.KioskBoard) ||
                   (typeof globalThis !== 'undefined' && globalThis.KioskBoard);

export default KioskBoard;