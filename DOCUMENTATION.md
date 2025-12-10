# KioskBoard Fork - Documentation

Ce fork de KioskBoard ajoute des fonctionnalités personnalisées pour une meilleure intégration dans les applications kiosk.

## Nouvelles fonctionnalités

1. **Numpad personnalisable** - Support de caractères personnalisés (ex: `+`, `-`, `.`)
2. **Preview Field** - Champ d'affichage intégré au clavier
3. **Événements personnalisés** - Émission d'événements lors de la frappe

---

## Installation

```bash
npm install
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`.

---

## Configuration de base

```javascript
KioskBoard.run('.js-kioskboard-input', {
  keysJsonUrl: '/path/to/kioskboard-keys-french.json',
  theme: 'dark',
  language: 'fr',
});
```

---

## 1. Numpad personnalisable

### Configuration standard (10 touches)

```javascript
KioskBoard.run('.input', {
  keysNumpadArrayOfNumbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0],
});
```

### Configuration avec caractères spéciaux

```javascript
KioskBoard.run('.input', {
  keysNumpadArrayOfNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, '+', 0, '-'],
});
```

### Inclure backspace et/ou enter dans la grille

```javascript
// Grille 4x3 avec backspace intégré
KioskBoard.run('.input', {
  keysNumpadArrayOfNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '.'],
});

// Utiliser 'backspace' ou '⌫' pour le backspace
// Utiliser 'enter' ou '↵' pour la touche entrée
```

### Valeurs spéciales reconnues

| Valeur | Description |
|--------|-------------|
| `'⌫'` ou `'backspace'` | Touche retour arrière |
| `'↵'` ou `'enter'` | Touche entrée |
| Tout autre caractère | Ajouté comme touche normale |

---

## 2. Preview Field

Le preview field affiche en temps réel ce qui est tapé, avec un curseur clignotant indiquant la position actuelle. Utile quand l'input réel est caché par le clavier.

### Activation

```javascript
KioskBoard.run('.input', {
  showPreviewField: true,
  previewFieldLabel: 'Code PIN',  // Label affiché au-dessus (défaut: "Aperçu")
});
```

### Options

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `showPreviewField` | `boolean` | `false` | Active le champ de prévisualisation |
| `previewFieldLabel` | `string` | `'Aperçu'` | Label affiché au-dessus du champ |

### Caractéristiques

- **Label personnalisable** au-dessus du champ
- **Curseur clignotant** à la position exacte du caret
- **Support de tous les thèmes** (light, dark, flat, material, oldschool)

### Styles CSS personnalisés

```css
/* Personnaliser le conteneur */
#KioskBoard-VirtualKeyboard .kioskboard-preview {
  padding: 16px;
  background: rgba(0, 0, 0, 0.1);
}

/* Personnaliser le label */
#KioskBoard-VirtualKeyboard .kioskboard-preview-label {
  font-size: 14px;
  color: #333;
}

/* Personnaliser le champ */
#KioskBoard-VirtualKeyboard .kioskboard-preview-field {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 8px;
}

/* Personnaliser le curseur */
#KioskBoard-VirtualKeyboard .kioskboard-preview-cursor {
  background-color: #007bff;
  width: 3px;
}
```

---

## 3. Événements personnalisés

### Activation

```javascript
KioskBoard.run('.input', {
  emitCustomEvents: true, // Activé par défaut
});
```

### Liste des événements

| Événement | Déclencheur | Données (`event.detail`) |
|-----------|-------------|--------------------------|
| `kioskboard:keypress` | Touche pressée | `{ key, value, cursorPosition }` |
| `kioskboard:backspace` | Backspace pressé | `{ deletedChar, value, cursorPosition }` |
| `kioskboard:enter` | Enter pressé | `{ value }` |
| `kioskboard:open` | Clavier ouvert | `{ input }` |
| `kioskboard:close` | Clavier fermé | `{ input, value }` |

### Exemples d'écoute

#### JavaScript vanilla

```javascript
document.querySelector('.my-input').addEventListener('kioskboard:keypress', (e) => {
  console.log('Touche pressée:', e.detail.key);
  console.log('Valeur actuelle:', e.detail.value);
  console.log('Position curseur:', e.detail.cursorPosition);
});

document.querySelector('.my-input').addEventListener('kioskboard:close', (e) => {
  console.log('Valeur finale:', e.detail.value);
  // Envoyer au serveur, etc.
});
```

#### Alpine.js

```html
<input
  class="js-kioskboard"
  data-kioskboard-type="numpad"
  @kioskboard:keypress="console.log($event.detail)"
  @kioskboard:close="submitValue($event.detail.value)"
>
```

#### Livewire + Alpine

```html
<input
  class="js-kioskboard"
  wire:model.defer="code"
  @kioskboard:close="$wire.set('code', $event.detail.value)"
>
```

---

## Exemple complet - Application Kiosk

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/kioskboard.min.css">
</head>
<body>

<input
  type="text"
  class="js-kioskboard-input"
  data-kioskboard-type="numpad"
  placeholder="Entrez votre code"
>

<script src="dist/kioskboard.min.js"></script>
<script>
  KioskBoard.run('.js-kioskboard-input', {
    // Numpad personnalisé avec +
    keysNumpadArrayOfNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, '+', 0, '⌫'],

    // Preview field
    showPreviewField: true,
    previewFieldLabel: 'Code',

    // Événements
    emitCustomEvents: true,

    // Options standard
    theme: 'dark',
    cssAnimations: true,
    cssAnimationsStyle: 'slide',
    keysEnterText: 'Valider',
    keysEnterCanClose: true,
  });

  // Écouter la fermeture
  document.querySelector('.js-kioskboard-input').addEventListener('kioskboard:close', (e) => {
    if (e.detail.value) {
      console.log('Code saisi:', e.detail.value);
      // Traitement...
    }
  });
</script>

</body>
</html>
```

---

## Types TypeScript

Le fichier `index.d.ts` inclut les types pour les nouvelles options et événements :

```typescript
import KioskBoard from 'kioskboard';

// Options
const options: KioskBoard.IKioskBoardOptions = {
  showPreviewField: true,
  previewFieldLabel: 'Code PIN',
  emitCustomEvents: true,
  keysNumpadArrayOfNumbers: [1, 2, 3, '+', 0, '⌫'],
};

// Types d'événements
interface KeypressDetail extends KioskBoard.IKioskBoardKeypressEventDetail {}
interface BackspaceDetail extends KioskBoard.IKioskBoardBackspaceEventDetail {}
interface EnterDetail extends KioskBoard.IKioskBoardEnterEventDetail {}
interface OpenDetail extends KioskBoard.IKioskBoardOpenEventDetail {}
interface CloseDetail extends KioskBoard.IKioskBoardCloseEventDetail {}
```

---

## Changelog

### Fork v1.0.0 (basé sur KioskBoard v2.3.0)

- Ajout de `showPreviewField` et `previewFieldLabel`
- Preview field avec label et curseur clignotant
- Ajout de `emitCustomEvents` et 5 nouveaux événements
- Support des caractères spéciaux dans `keysNumpadArrayOfNumbers`
- Support de layouts numpad flexibles (plus de 10 touches)
- CSS pour le preview field avec support des thèmes