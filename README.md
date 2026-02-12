# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` én `jobstatistics.csv` te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Ondersteunt 2 typen bestanden:
  - **Timeline export** (`AssetInt Timeline Export File`)
  - **Job Statistics export** (`AssetInt Job Statistics Export File`)
- Duplicaten worden geblokkeerd op basis van bestandsinhoud.
- Uptime/downtime in de hoofdtabel komt primair uit JobStatistics; Timeline wordt gebruikt als specificatie/fallback.
- Timeline-spookregels met datum `1970-01-01 00:00:00` worden automatisch genegeerd.
- Dashboard met:
  - totaaloverzicht,
  - efficiëntie per job (timeline uptime/downtime),
  - extra job-data (pieces, production rate),
  - dwarsdoorsnede met downtime oorzaken.

- Jobs worden automatisch op datum gesorteerd (nieuwste eerst) en `Base` wordt uitgefilterd.
- Per job zie je nu ook de periode (start/eind datum-tijd).
- De jobs-tabel ondersteunt filteren (jobnaam / downtime reden) en sorteren (datum, jobnaam, efficiëntie, pieces).
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
