# Portfolio Antonino Saputo

Sito web vetrina di Antonino Saputo con homepage (`index.html`) e pagina categorie (`my-works.html`).

## Modificare i contenuti

- **`config/site-content.js`**: file manuale. Qui puoi aggiornare nome, titoli SEO, contatti, link social e il blocco `portfolio_intro` (tagline e descrizione della hero di `my-works.html`). Non viene toccato dallo script.
- **`config/site-data.js`**: file generato automaticamente da `optimize.js` (non modificarlo a mano). Contiene soltanto i dati dinamici letti dalle cartelle immagini:
  - `bio_photo` -> prima foto trovata in `assets/img/home/bio/` (mostrata nella hero).
  - `home_recent_works` -> immagini in `assets/img/home/recent-works/`.
  - `portfolio_categories` -> cartelle trovate in `assets/img/my-works/<nome>/`.

Ricorda di commitare `config/site-data.js` dopo ogni modifica o esecuzione dello script di ottimizzazione.

---

## Struttura immagini

- `assets/img/home/bio/`: inserisci qui uno o piu' ritratti. Verra' mostrata automaticamente la prima foto (in ordine alfabetico) come immagine della hero.
- `assets/img/home/recent-works/`: tutte le foto mostrate nella sezione "Recent Works".
- `assets/img/my-works/<nome-categoria>/`: raccolte tematiche mostrate su `my-works.html` (es: `matrimoni`, `ritratti`, ...). Ogni cartella diventa una sezione autonoma.

---

## Workflow consigliato per nuove foto

1. Copia le nuove foto (JPG/PNG) nella cartella corretta (`home/bio`, `home/recent-works` o `my-works/<categoria>/`). Se la cartella non esiste, creala.
2. Esegui `node optimize.js` dalla root del progetto:
   - converte le immagini in WebP sovrascrivendole direttamente nella stessa cartella;
   - aggiorna automaticamente `config/site-data.js` con `bio_photo`, `home_recent_works` e `portfolio_categories`.
3. Verifica il risultato (preview locale o GitHub Pages), poi effettua commit e push.

> **Nota**: se preferisci caricare solo WebP gia' ottimizzate, puoi inserirle direttamente nelle cartelle. Mantieni pero' la convenzione di rilanciare `node optimize.js` cosi' da ricostruire i dati (il file `config/site-data.js` verra' aggiornato con i nuovi percorsi).

Le modifiche puramente testuali (nome, contatti, hero del portfolio) si applicano semplicemente salvando `config/site-content.js`: non serve rilanciare lo script.

---

## Script rapido

- **Windows**: esegui `run-optimize.bat`. Lo script controlla che `node` sia disponibile, lancia `node optimize.js` e, se va a buon fine, esegue automaticamente `git add -A`, `git commit` (messaggio fisso `chore: update media`) e `git push` senza chiedere conferme.
- **macOS / Linux**: apri il terminale nella root del progetto ed esegui manualmente `node optimize.js` (serve avere Node.js installato).

Installa sempre una versione LTS di Node.js da [nodejs.org](https://nodejs.org/) o tramite il package manager della tua distribuzione prima di lanciare questi comandi.

---

## Navigazione

- La homepage ora apre con un ritratto + bio estesa seguiti dalla sezione "Recent Works" e rimanda, dal menu, alla pagina "I miei lavori".
- `my-works.html` costruisce dinamicamente una sezione per ogni cartella trovata in `assets/img/my-works/`.
- Entrambe le pagine condividono lo stesso header/nav e la stessa sezione contatti (aggiornata tramite `data.js`).
