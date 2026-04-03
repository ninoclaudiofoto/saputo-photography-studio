# Portfolio Antonino Saputo

Sito web vetrina di Antonino Saputo con homepage (`index.html`) e pagina categorie (`portfolio.html`).

## Modificare i contenuti

- Tutti i testi e i link sono centralizzati in **`data.js`**.
- `home_highlights` contiene le foto utilizzate nella hero e viene aggiornato automaticamente a partire da `assets/img/home/highlights/`.
- `home_recent_works` rappresenta la galleria principale della homepage ed è generato da `assets/img/home/recent-works/`.
- `portfolio_categories` viene popolato dallo script `optimize.js` scansionando `assets/img/categories/<nome>`.

Ricorda di commitare `data.js` dopo ogni modifica o esecuzione dello script di ottimizzazione.

---

## Struttura immagini

- `assets/img/home/highlights/`: fino a tre scatti (ordinati alfabeticamente) mostrati nella hero Highlights.
- `assets/img/home/recent-works/`: tutte le foto mostrate nella sezione “Recent Works”.
- `assets/img/categories/<nome-categoria>/`: raccolte tematiche mostrate su `portfolio.html` (es: `matrimoni`, `ritratti`, ...). Ogni cartella diventa una sezione autonoma.

---

## Workflow consigliato per nuove foto

1. Copia le nuove foto (JPG/PNG) nella cartella corretta (`home/highlights`, `home/recent-works` o `categories/<categoria>/`). Se la cartella non esiste, creala.
2. Esegui `node optimize.js` dalla root del progetto:
   - converte le immagini in WebP sovrascrivendo i file originali;
   - aggiorna automaticamente `data.js` con `home_highlights`, `home_recent_works` e `portfolio_categories`.
3. Verifica il risultato (preview locale o GitHub Pages), poi effettua commit e push.

> **Nota**: se preferisci caricare solo WebP già ottimizzate, puoi inserirle direttamente nelle cartelle. Mantieni però la convenzione di rilanciare `node optimize.js` così da ricostruire i dati (o aggiorna manualmente `home_highlights` se vuoi forzare un ordine specifico).

---

## Navigazione

- La homepage ora mostra “Highlights” + “Recent Works” e rimanda, dal menu, alla pagina portfolio dedicata.
- `portfolio.html` costruisce dinamicamente una sezione per ogni cartella trovata in `assets/img/categories/`.
- Entrambe le pagine condividono lo stesso header/nav e la stessa sezione contatti (aggiornata tramite `data.js`).
