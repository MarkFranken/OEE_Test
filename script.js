const fileInput = document.getElementById('fileInput');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const loadedFilesEl = document.getElementById('loadedFiles');
const summaryCardsEl = document.getElementById('summaryCards');
const jobTableBodyEl = document.getElementById('jobTableBody');
const jobSelectEl = document.getElementById('jobSelect');
const selectedJobStatsEl = document.getElementById('selectedJobStats');
const reasonBreakdownEl = document.getElementById('reasonBreakdown');

const appState = {
  signatures: new Set(),
  loadedFiles: [],
  events: []
};

fileInput.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) {
    return;
  }

  let added = 0;
  let duplicates = 0;

  for (const file of files) {
    const signature = await getFileSignature(file);
    if (appState.signatures.has(signature)) {
      duplicates += 1;
      continue;
    }

    const text = await file.text();
    const parsedEvents = parseTimelineCsv(text);
    if (parsedEvents.length === 0) {
      continue;
    }

    appState.signatures.add(signature);
    appState.loadedFiles.push(file.name);
    appState.events.push(...parsedEvents);
    added += 1;
  }

  event.target.value = '';
  render(added, duplicates);
});

clearBtn.addEventListener('click', () => {
  appState.signatures.clear();
  appState.loadedFiles.length = 0;
  appState.events.length = 0;
  render();
});

jobSelectEl.addEventListener('change', () => {
  renderCrossSection(jobSelectEl.value);
});

async function getFileSignature(file) {
  const text = await file.text();
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback hash if subtle crypto isn't available
  let hash = 0;
  for (const byte of data) {
    hash = (hash * 31 + byte) >>> 0;
  }
  return String(hash);
}

function parseTimelineCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith('start time,shift id,production state,reason,duration,job name')
  );

  if (headerIndex === -1) {
    return [];
  }

  return lines.slice(headerIndex + 1).map((line) => {
    const [startTime, shiftId, productionState, reason, duration, jobName] = line.split(',');
    return {
      startTime,
      shiftId,
      productionState,
      reason: reason || 'Onbekend',
      durationSeconds: durationToSeconds(duration),
      jobName
    };
  });
}

function durationToSeconds(duration) {
  const parts = (duration || '').split(':').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return 0;
  }
  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

function aggregateByJob() {
  const byJob = new Map();

  for (const event of appState.events) {
    if (!event.jobName) {
      continue;
    }

    if (!byJob.has(event.jobName)) {
      byJob.set(event.jobName, {
        jobName: event.jobName,
        uptimeSeconds: 0,
        downtimeSeconds: 0,
        reasons: new Map()
      });
    }

    const job = byJob.get(event.jobName);
    const isUptime = event.productionState?.toLowerCase() === 'uptime';

    if (isUptime) {
      job.uptimeSeconds += event.durationSeconds;
    } else {
      job.downtimeSeconds += event.durationSeconds;
      const current = job.reasons.get(event.reason) || 0;
      job.reasons.set(event.reason, current + event.durationSeconds);
    }
  }

  return [...byJob.values()].sort((a, b) => a.jobName.localeCompare(b.jobName));
}

function render(added = 0, duplicates = 0) {
  const jobs = aggregateByJob();

  loadedFilesEl.innerHTML = appState.loadedFiles
    .map((name) => `<li>${name}</li>`)
    .join('');

  if (appState.loadedFiles.length === 0) {
    statusEl.textContent = 'Nog geen bestanden geladen.';
  } else {
    statusEl.textContent = `${added} bestand(en) toegevoegd, ${duplicates} dubbel(e) bestand(en) overgeslagen.`;
  }

  renderSummary(jobs);
  renderJobTable(jobs);
  renderJobSelector(jobs);

  const selected = jobSelectEl.value || jobs[0]?.jobName;
  renderCrossSection(selected);
}

function renderSummary(jobs) {
  const totalUptime = jobs.reduce((sum, job) => sum + job.uptimeSeconds, 0);
  const totalDowntime = jobs.reduce((sum, job) => sum + job.downtimeSeconds, 0);
  const total = totalUptime + totalDowntime;
  const efficiency = total === 0 ? 0 : (totalUptime / total) * 100;

  const cards = [
    { label: 'Ingeladen bestanden', value: appState.loadedFiles.length },
    { label: 'Jobs', value: jobs.length },
    { label: 'Totale uptime', value: formatDuration(totalUptime) },
    { label: 'Totale downtime', value: formatDuration(totalDowntime) },
    { label: 'Gemiddelde efficiëntie', value: `${efficiency.toFixed(2)}%` }
  ];

  summaryCardsEl.innerHTML = cards
    .map((card) => `<article class="card"><span>${card.label}</span><strong>${card.value}</strong></article>`)
    .join('');
}

function renderJobTable(jobs) {
  if (jobs.length === 0) {
    jobTableBodyEl.innerHTML = '<tr><td colspan="5" class="muted">Nog geen data.</td></tr>';
    return;
  }

  jobTableBodyEl.innerHTML = jobs
    .map((job) => {
      const total = job.uptimeSeconds + job.downtimeSeconds;
      const efficiency = total === 0 ? 0 : (job.uptimeSeconds / total) * 100;
      const topReason = [...job.reasons.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'Geen';

      return `<tr>
        <td>${job.jobName}</td>
        <td>${formatDuration(job.uptimeSeconds)}</td>
        <td>${formatDuration(job.downtimeSeconds)}</td>
        <td>
          ${efficiency.toFixed(2)}%
          <div class="progress" aria-hidden="true"><span style="width:${efficiency.toFixed(2)}%"></span></div>
        </td>
        <td>${topReason}</td>
      </tr>`;
    })
    .join('');
}

function renderJobSelector(jobs) {
  if (jobs.length === 0) {
    jobSelectEl.innerHTML = '';
    return;
  }

  const current = jobSelectEl.value;
  jobSelectEl.innerHTML = jobs
    .map((job) => `<option value="${job.jobName}">${job.jobName}</option>`)
    .join('');

  if (jobs.some((job) => job.jobName === current)) {
    jobSelectEl.value = current;
  }
}

function renderCrossSection(jobName) {
  const jobs = aggregateByJob();
  const selectedJob = jobs.find((job) => job.jobName === jobName);

  if (!selectedJob) {
    selectedJobStatsEl.innerHTML = '<p class="muted">Geen job geselecteerd.</p>';
    reasonBreakdownEl.innerHTML = '';
    return;
  }

  const total = selectedJob.uptimeSeconds + selectedJob.downtimeSeconds;
  const efficiency = total === 0 ? 0 : (selectedJob.uptimeSeconds / total) * 100;

  selectedJobStatsEl.innerHTML = `
    <p><strong>${selectedJob.jobName}</strong></p>
    <p>Uptime: ${formatDuration(selectedJob.uptimeSeconds)} · Downtime: ${formatDuration(
      selectedJob.downtimeSeconds
    )} · Efficiëntie: ${efficiency.toFixed(2)}%</p>
  `;

  const reasons = [...selectedJob.reasons.entries()].sort((a, b) => b[1] - a[1]);
  if (reasons.length === 0) {
    reasonBreakdownEl.innerHTML = '<p class="muted">Geen downtime oorzaken voor deze job.</p>';
    return;
  }

  reasonBreakdownEl.innerHTML = reasons
    .map(([reason, seconds]) => {
      const percentage = selectedJob.downtimeSeconds === 0 ? 0 : (seconds / selectedJob.downtimeSeconds) * 100;
      return `<div class="reason-row">
          <div>
            <div class="reason-label">${reason} (${formatDuration(seconds)})</div>
            <div class="progress"><span style="width:${percentage.toFixed(2)}%"></span></div>
          </div>
          <strong>${percentage.toFixed(1)}%</strong>
      </div>`;
    })
    .join('');
}

render();
