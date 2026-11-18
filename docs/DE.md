# shae-javascript-browser-drawing (Deutsch)

Eine browserbasierte Zeichenanwendung mit HTML5 Canvas, Vanilla-JavaScript
und CSS. Unterstützt Maus- und Touch-Zeichnung, einen Farbwähler,
verstellbare Pinselgröße, Leinwand leeren und Speichern als PNG. Gestaltet
nach dem SHAE Field Manual: warmer Papier-Hintergrund, Tintenstriche,
oxidfarbene Akzente, 0px Radius, 1px Rahmen, 44px Touch-Targets. Teil der
SHAE Tier 3 Serie.

## Funktionen

- HTML5-Canvas-Zeichnung mit Maus und Touch
- Farbwähler (oxidfarbener Akzent)
- Verstellbare Pinselgröße
- Leinwand leeren
- Zeichnung als PNG speichern
- Keine Abhängigkeiten (reines HTML/CSS/JS)

## Voraussetzungen

- Ein moderner Browser. Kein Build-Schritt oder Server erforderlich.
- Python 3 für die lokale Entwicklung (`make dev`).

## Installation

```bash
./scripts/install.sh
```

Öffnet `src/index.html` im Standardbrowser.

## Verwendung

Direkt (ohne Server):

```
src/index.html im Browser öffnen
```

Lokaler Entwicklungsserver:

```bash
make dev
# dann http://localhost:8080/src/index.html aufrufen
```

Auf die Leinwand ziehen, um mit Maus oder Finger zu zeichnen. Die
Symbolleiste dient zur Farbwahl, Pinselgröße, Löschen und Speichern als
PNG.

## Lizenz

MIT. Siehe `LICENSE`.
