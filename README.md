# Invitación XV — GitHub Pages

## Edita principalmente `config.js`
Ahí cambias:
- nombre
- fecha
- textos
- enlaces de Maps
- mesa de regalos
- fotos
- música
- Formspree
- secciones activas/inactivas

## Fotos
Reemplaza los archivos de `assets/fotos/` o usa `.webp` y actualiza las rutas en `config.js`.

## Música
Coloca `assets/audio/musica.mp3` y cambia:
```js
musica: { activa: true, archivo: "./assets/audio/musica.mp3" }
```

## Formspree
Pega el endpoint en:
```js
formspreeEndpoint: "https://formspree.io/f/XXXXXXXX"
```

## Prueba local
```bash
python3 -m http.server 8080
```
Luego abre http://localhost:8080
