# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` én `jobstatistics.csv` te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Ondersteunt 2 typen bestanden:
  - **Timeline export** (`AssetInt Timeline Export File`)
  - **Job Statistics export** (`AssetInt Job Statistics Export File`)
- Duplicaten worden geblokkeerd op basis van bestandsinhoud.
- Dashboard met:
  - totaaloverzicht,
  - efficiëntie per job (timeline uptime/downtime),
  - extra job-data (pieces, production rate),
  - dwarsdoorsnede met downtime oorzaken.
- Werkt direct via dubbelklik op `index.html` (zonder bash/server).

## Starten (zonder bash)

1. Open de map.
2. Dubbelklik op `index.html`.
3. Klik op **Kies CSV-bestand(en)**.
4. Selecteer één of meerdere bestanden, bijvoorbeeld:
   - `timeline.csv`
   - `jobstatistics.csv`

## Voorbeeldbestanden

- `timeline.csv`
- `jobstatistics.csv`

## Optioneel: starten met lokale server

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.
