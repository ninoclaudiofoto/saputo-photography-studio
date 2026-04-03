# Portfolio Antonino Saputo

Sito web vetrina di Antonino Saputo con homepage (`index.html`) e pagina categorie (`portfolio.html`).

## Modificare i contenuti

- Tutti i testi e i link sono centralizzati in **`data.js`**.
- I campi `featured_photos` e `gallery_photos` puntano a file dentro `assets/img/home/`.
- La chiave `portfolio_categories` viene generata automaticamente dallo script `optimize.js` e non va modificata a mano.

Ricorda di commitare `data.js` dopo ogni modifica o esecuzione dello script di ottimizzazione.

---

## Struttura immagini

- `assets/img/home/`: foto in evidenza + galleria della homepage.
- `assets/img/categories/<nome-categoria>/`: raccolte tematiche mostrate su `portfolio.html` (es: `matrimoni`, `ritratti`, ...). Ogni cartella diventa una sezione autonoma.

---

## Workflow consigliato per nuove foto

1. Copia le nuove foto (JPG/PNG) nella cartella corretta (`home/` oppure `categories/<categoria>/`). Se la cartella non esiste, creala.
2. Esegui `node optimize.js` dalla root del progetto:
   - converte le immagini in WebP sovrascrivendo i file originali;
   - aggiorna automaticamente `data.js` con la struttura delle categorie.
3. Verifica il risultato (preview locale o GitHub Pages), poi effettua commit e push.

> **Nota**: se preferisci caricare solo WebP già ottimizzate, puoi inserirle direttamente nelle cartelle e aggiornare manualmente `featured_photos`/`gallery_photos`. Per le categorie è comunque consigliato eseguire `node optimize.js` così da rigenerare `portfolio_categories`.

---

## Navigazione

- La homepage mette in evidenza i lavori principali e rimanda alla pagina portfolio.
- `portfolio.html` costruisce dinamicamente una sezione per ogni cartella trovata in `assets/img/categories/`.
- Entrambe le pagine condividono lo stesso header/nav e la stessa sezione contatti (aggiornata tramite `data.js`).
