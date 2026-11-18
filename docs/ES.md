# shae-javascript-browser-drawing (Español)

Una aplicación de dibujo en el navegador con HTML5 Canvas, JavaScript
vanilla y CSS. Admite dibujo con ratón y táctil, selector de color, tamaño
de pincel ajustable, limpiar el lienzo y guardar como PNG. Diseñada según
el manual de campo SHAE: fondo de papel cálido, trazos de tinta, acento
óxido, radio 0px, bordes de 1px, objetivos táctiles de 44px. Parte de la
serie SHAE Tier 3.

## Características

- Dibujo en canvas HTML5 con ratón y táctil
- Selector de color (acento óxido)
- Tamaño de pincel ajustable
- Limpiar el lienzo
- Guardar dibujo como PNG
- Sin dependencias (HTML/CSS/JS vanilla)

## Requisitos

- Un navegador moderno. Sin paso de compilación ni servidor necesario.
- Python 3 para desarrollo local (`make dev`).

## Instalación

```bash
./scripts/install.sh
```

Abre `src/index.html` en el navegador predeterminado.

## Uso

Directo (sin servidor):

```
Abrir src/index.html en el navegador
```

Servidor de desarrollo local:

```bash
make dev
# visitar http://localhost:8080/src/index.html
```

Arrastra sobre el lienzo para dibujar con el ratón o el dedo. Usa la barra
de herramientas para elegir el color, cambiar el tamaño del pincel, limpiar
el lienzo o guardar el dibujo como PNG.

## Licencia

MIT. Véase `LICENSE`.
