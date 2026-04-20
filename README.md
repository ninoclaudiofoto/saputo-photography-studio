# Lavori di Antonino Saputo

Sito web vetrina per la fotografia di Antonino Saputo. Il progetto si compone di una homepage (`index.html`) e tre gallerie specifiche tematiche:
- `love-stories.html` (Storie d'amore)
- `authentic-portraits.html` (Ritratti autentici)
- `projects.html` (Progetti)

## Modificare i contenuti testuali

- **`config/site-content.js`**: File manuale. Modifica qui contatti (telefono, mail, whatsapp), SEO e link social (es. Instagram).
- **`config/site-data.js`**: **NON modificarlo a mano**. È il file autogenerato dallo script di ottimizzazione che mappa tutte le foti presenti nel sito.

---

## Architettura e Immagini

Ogni sezione del sito carica dinamicamente le foto scansionando delle specifiche cartelle.

- `assets/img/home/bio/`: La tua foto ritratto usata nella Homepage. Il sistema sceglierà la prima in ordine alfabetico.
- `assets/img/home/recent-works/`: Tutte le tue foto "Recent Works" per la Homepage.
- `assets/img/love-stories/`: Raggruppate in sottocartelle (es. "Marco e Giada", "Anna e Luigi") per la sezione Storie d'Amore.
- `assets/img/authentic-portraits/`: Raggruppate in sottocartelle per la sezione Ritratti.
- `assets/img/projects/`: Raggruppate in sottocartelle per la sezione Progetti.

---

## Workflow consigliato per nuove foto

1. **Aggiungi le foto:** Copia le tue nuove foto (in formato JPG/PNG) nelle rispettive cartelle. (Crea la cartella principale o la sotto-galleria se non esiste).
2. **Ottimizzazione WebP:**
    - Doppio click su `run-optimize.bat` se ti trovi su Windows.
    - Se invece usi terminali classici, lancia semplicemente `node optimize.js`.
3. Lo script in automatico scansionerà le directory, ridimensionerà e convertirà le foto in `WebP` andando ad eliminare le copie originali troppo pesanti, e infine salverà su `config/site-data.js` la mappa aggiornata del sito.

---

## Script Rapidi (Windows)

- **`run-optimize.bat`**: Avvia l'ottimizzazione automatica delle immagini e rigenera i dati del sito. Se l'operazione va a buon fine, ti scriverà i file `WebP` pronti. Successivamente alla generazione, il prompt ti domanderà se desideri effettuare e lanciare automaticamente la commit per mandare subito il sito online!
- **`run-pull.bat`**: Avvia lo scaricamento (`git pull`) delle ultime modifiche (incluse queste istruzioni e gli aggiornamenti del codice sorgente dal server).

*In entrambi i casi accertati di avere [Node.js](https://nodejs.org/it) sempre installato e funzionante.*
