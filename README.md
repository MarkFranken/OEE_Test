# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` bestanden te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Duplicaten worden geblokkeerd op basis van bestandsinhoud (SHA-256 hash).
- Dashboard met:
  - totaaloverzicht (uptime, downtime, gemiddelde efficiëntie),
  - tabel met efficiëntie per job,
  - dwarsdoorsnede per geselecteerde job met downtime-oorzaken.

## Starten

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000` in je browser en laad één of meerdere `timeline.csv` bestanden in.
