# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` bestanden te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Duplicaten worden geblokkeerd op basis van bestandsinhoud (SHA-256 hash).
- Dashboard met:
  - totaaloverzicht (uptime, downtime, gemiddelde efficiëntie),
  - tabel met efficiëntie per job,
  - dwarsdoorsnede per geselecteerde job met downtime-oorzaken.

## Starten (aanbevolen)

Gebruik een lokale webserver (dit werkt het meest stabiel):

```bash
python3 -m http.server 8000
```

Open daarna:

- `http://localhost:8000`

## Kan ik ook gewoon `index.html` openen?

Ja, soms werkt dat, maar het is **niet altijd betrouwbaar** in alle browsers.
Sommige browser-features werken strenger op `file://` (lokaal bestand), waardoor je vreemde fouten kunt krijgen.
Daarom is testen via `http://localhost:8000` de beste optie.

## Handmatig testen

1. Start de server met `python3 -m http.server 8000`.
2. Open `http://localhost:8000`.
3. Klik op **Kies CSV-bestand(en)** en laad `timeline.csv` in.
4. Controleer:
   - of de samenvatting gevuld wordt,
   - of de tabel “Efficiëntie per job” data toont,
   - of de “Dwarsdoorsnede per job” oorzaken laat zien.
5. Laad daarna hetzelfde bestand nog een keer in.
6. Controleer dat het bestand als duplicaat wordt overgeslagen.
