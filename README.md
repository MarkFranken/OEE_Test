# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` bestanden te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Duplicaten worden geblokkeerd op basis van bestandsinhoud (SHA-256 hash).
- Dashboard met:
  - totaaloverzicht (uptime, downtime, gemiddelde efficiëntie),
  - tabel met efficiëntie per job,
  - dwarsdoorsnede per geselecteerde job met downtime-oorzaken.
- Werkt direct via dubbelklik op `index.html` (zonder bash/server).

## Starten (zonder bash)

1. Open de map.
2. Dubbelklik op `index.html`.
3. Klik op **Kies CSV-bestand(en)** en laad je `timeline.csv`.

## Optioneel: starten met lokale server

Als je liever via een localhost URL werkt:

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.
