# Portfolio Antonino Saputo

Sito web vetrina di Antonino Saputo.

## Modificare i contenuti

Tutti i testi e i link alle foto del sito sono centralizzati nel file **`data.js`**. 
Per aggiornare il sito è sufficiente modificare questo file direttamente da GitHub.

1. Apri **`data.js`** su GitHub.
2. Modifica i campi necessari (le informazioni di contatto sono autoesplicative).
3. Le foto sono divise in due sezioni:
    - `"featured_photos"`: Le foto grandi mostrate nella sezione in evidenza iniziale.
    - `"gallery_photos"`: Tutte le restanti foto caricate nella galleria a griglia.
4. Salva (Commit) il file. Le modifiche saranno online pochi secondi dopo.

---

## Gestione ed Aggiunta Nuove Foto

Per garantire il caricamento fluido della galleria, è opportuno che le foto vengano alleggerite prima di essere pubblicate (peso consigliato < 500KB o dimensione max ~1920px). Ci sono due opzioni per farlo:

### Opzione 1: Caricamento Autonomo da GitHub
Se preferisci gestire le foto dal browser:
1. Esporta le foto già compresse ad es. da Lightroom con qualità standard ed esportazione Web, oppure comprimile online tramite siti gratuiti come [Squoosh](https://squoosh.app/) o [TinyPNG](https://tinypng.com/).
2. Entra in `assets/img/optimized/` e carica qui i file.
3. Aggiungi il nuovo percorso (es: `"assets/img/optimized/nuovafoto.jpg"`) all'interno di `data.js`.

### Opzione 2: Uso dello Script Locale (Per sviluppatori/webmaster)
Se gestisci i file in locale tramite il tool Node.js preconfigurato:
1. Inserisci le foto originali pesanti nella cartella `assets/img/original/`.
2. Apri il terminale alla root del progetto e lancia lo script `node optimize.js`.
3. Lo script convertirà tutto in formato WebP, piazzandolo in `assets/img/optimized/`.
4. Aggiorna `data.js` per puntare ai file generati e fai il push su git.