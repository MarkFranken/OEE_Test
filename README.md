# Machine Timeline Dashboard

Kleine webapp om `timeline.csv` én `jobstatistics.csv` te laden en machine-efficiëntie per job te analyseren.

## Features

- Meerdere CSV-bestanden inladen (multi-select).
- Ondersteunt 2 typen bestanden:
  - **Timeline export** (`AssetInt Timeline Export File`)
  - **Job Statistics export** (`AssetInt Job Statistics Export File`)
- Duplicaten worden geblokkeerd op basis van bestandsinhoud.
- Dubbele timeline-events (zelfde job, starttijd, status, reden en duur) worden automatisch weggefilterd zodat ze niet dubbel meetellen.
- Uptime/downtime in de hoofdtabel komt primair uit JobStatistics; Timeline wordt gebruikt als specificatie/fallback.
- In de lijst tonen we ook de snelheid tijdens uptime: `Good Pieces / Uptime` omgerekend naar **good/uur**.
- Timeline-spookregels met datum `1970-01-01 00:00:00` worden automatisch genegeerd.
- Alarmcodes in downtime-redenen (bijv. `RobopackerFault: 159`) worden verrijkt met Nederlandse alarmtekst waar beschikbaar.
- Dashboard met:
  - totaaloverzicht,
  - efficiëntie per job (timeline uptime/downtime),
  - extra job-data (pieces, production rate),
  - dwarsdoorsnede met downtime oorzaken.

- Jobs worden automatisch op datum gesorteerd (nieuwste eerst) en `Base` wordt uitgefilterd.
- Per job zie je nu ook de periode (start/eind datum-tijd).
- De jobs-tabel ondersteunt filteren (jobnaam / downtime reden) en sorteren (datum, jobnaam, efficiëntie, pieces).
- In het overzicht toont "Belangrijkste overige downtime oorzaak" bewust niet `ReadyNoProductFeed`, maar de grootste beïnvloedbare overige downtime-reden.
- Klik op een job-rij in de tabel om rechts een detailpaneel te zien met pie-chart (jobduur: uptime/downtime) en downtime-lijst met duur per reden.
- De efficiëntiebalk in de tabel gebruikt dezelfde kleuren als de pie chart: uptime groen, ReadyNoProductFeed geel, overige downtime rood (van links naar rechts).
- Er is een extra tab **Week timeline** met per week van links naar rechts de gedraaide jobs en de efficiëntie per job.
- In de **Week timeline** zie je boven de balken alle weekdagen met datum, het actieve weeknummer en knoppen om naar een week eerder of later te navigeren.
- In de **Week timeline** staat rechts per job nu ook de tijd-range (van/tot) en de balken kleuren op basis van echte events: uptime groen, ReadyNoProductFeed geel, overige downtime rood; ontbrekende/niet-mapbare stukken worden grijs getoond.
- Klik op een job in de **Week timeline** om een popup te openen met een uitvergrote job-timeline en eventkleuren van links naar rechts; hover op segmenten toont details (tijd, reden, duur).
- Er is een 2e tabblad **Downtime redenen** met alle downtime-redenen onder elkaar en de opgetelde downtime.
- In tab **Downtime redenen** kun je op een reden klikken en rechts per voorval zien in welke job dit gebeurde en hoe lang het duurde.
- In **Dwarsdoorsnede per job** kun je nu op een downtime-oorzaak klikken en rechts per event zien wanneer dit gebeurde en hoe lang het duurde.
- Het rechter detailpaneel blijft sticky zichtbaar tijdens scrollen op grotere schermen.
- Layout gebruikt nu de volledige paginabreedte en schaalt responsief mee op desktop/tablet/mobiel.
- Werkt direct via dubbelklik op `index.html` (zonder bash/server).
- Het importgedeelte staat in een apart tabblad **Importeren**.
- De pagina gebruikt nu een C-TECH-geïnspireerde huisstijl met logo-link linksboven en uniforme knopstijl (kleur/vorm) over de hele app.

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
