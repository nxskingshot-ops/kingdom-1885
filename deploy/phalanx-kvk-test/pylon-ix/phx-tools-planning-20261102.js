import {describeTransferPlan, readTransferPlan, transferPlanKey, transferPlanUpdated} from './phx-transfer-event-plan-20261108.js';

const tools = document.querySelector('.tools-body');
const scenario = document.getElementById('phxPowerScenario');

if (tools && scenario) {
 const panel = document.createElement('section');
 panel.className = 'panel phx-planning-context';
 panel.id = 'phxEventPlan';
 panel.innerHTML = `
  <style id="phx-tools-mobile-layout">
   .phx-planning-context,.phx-planning-context .panel-body,.phx-planning-context .form-grid,.phx-planning-context label{min-width:0;max-width:100%;box-sizing:border-box}
   .phx-planning-context .form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
   .phx-planning-context .form-grid>label{display:block;overflow-wrap:anywhere}
   .phx-planning-context .form-grid input:not([type=checkbox]){display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;margin-top:6px}
   .phx-planning-context label:has(#phxEventCapVerified){display:flex;align-items:flex-start;gap:10px;line-height:1.4}
   .phx-planning-context #phxEventCapVerified{flex:none;margin:4px 0 0}
   .phx-planning-context #phxSaveEvent{max-width:100%;white-space:normal;overflow-wrap:anywhere}
   @media(max-width:760px){.phx-planning-context .form-grid{grid-template-columns:minmax(0,1fr)!important}.phx-planning-context .panel-body{padding:12px}.phx-planning-context .form-grid>label{width:100%}}
  </style>
  <div class="panel-head"><h2>Transfer-Einstellungen</h2><small>Manuelle Planung auf diesem Gerät</small></div>
  <div class="panel-body">
   <form id="phxEventPlanForm">
    <div class="form-grid">
     <label>Max. Transfer-Power (M)<input id="phxEventCap" type="number" min="0.000001" step="any" inputmode="decimal" placeholder="z. B. 175,5"></label>
     <label>Transfergruppe<input id="phxEventGroup" type="number" min="1" step="1" inputmode="numeric" placeholder="z. B. 7"></label>
     <label>Gruppe · erstes Kingdom<input id="phxGroupMin" type="number" min="1" step="1" inputmode="numeric"></label>
     <label>Gruppe · letztes Kingdom<input id="phxGroupMax" type="number" min="1" step="1" inputmode="numeric"></label>
     <label>Zielkönigreich<input id="phxTargetKingdom" type="number" min="1" step="1" inputmode="numeric" value="1885"></label>
     <label>Transferfenster · Beginn<input id="phxEventStart" type="date"></label>
     <label>Transferfenster · Ende<input id="phxEventEnd" type="date"></label>
     <label>Quelle / Beleg<input id="phxEventCapSource" type="text" maxlength="500" placeholder="Event-Regel / Screenshot-Nachweis"></label>
     <label>Belegdatum<input id="phxEventCapVerifiedAt" type="date"></label>
     <label><input type="checkbox" id="phxEventCapVerified"> Quelle für das Power-Limit dokumentiert</label>
    </div>
    <p id="phxGroupRange" class="smallprint" role="status"></p>
    <p id="phxEventStatus" class="smallprint" role="status">Manuelle Werte dienen der Planung.</p>
    <button type="submit" id="phxSaveEvent">Planung auf diesem Gerät speichern</button>
   </form>
  </div>`;
 tools.prepend(panel);
 scenario.removeAttribute('style');

 const field = id => document.getElementById(id);
 const ids = ['phxEventCap', 'phxEventGroup', 'phxGroupMin', 'phxGroupMax', 'phxTargetKingdom',
  'phxEventStart', 'phxEventEnd', 'phxEventCapSource', 'phxEventCapVerifiedAt'];
 const summary = field('phxEventPlanSummary');
 const status = field('phxEventStatus');
 const documented = field('phxEventCapVerified');
 const rangeStatus = field('phxGroupRange');
 const saved = readTransferPlan();
 for (const id of ids) {
  if (typeof saved?.[id] === 'string') field(id).value = saved[id];
 }
 documented.checked = saved?.phxEventCapVerified === true;

 const showSavedPlan = plan => {
  summary.textContent = describeTransferPlan(plan) || 'Transfergruppe und Power-Limit eingeben';
 };
 const showRange = () => {
  const from = field('phxGroupMin').value;
  const to = field('phxGroupMax').value;
  rangeStatus.textContent = from && to
   ? 'Manuell eingetragener Bereich · Kingdoms #' + from + '–#' + to
   : 'Die Kingdom-Grenzen der Gruppe sind optional.';
 };
 const form = field('phxEventPlanForm');
 form.addEventListener('input', () => {
  showRange();
  status.textContent = 'Ungespeicherte Änderungen.';
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  const plan = Object.fromEntries(ids.map(id => [id, field(id).value]));
  for (const id of ['phxEventGroup', 'phxGroupMin', 'phxGroupMax', 'phxTargetKingdom']) {
   if (!plan[id]) continue;
   const value = field(id).valueAsNumber;
   if (!Number.isSafeInteger(value) || value < 1) {
    status.textContent = 'Transfergruppe und Kingdom-Nummern müssen positive Ganzzahlen sein.';
    return;
   }
   plan[id] = String(value);
  }
  plan.phxEventCapSource = plan.phxEventCapSource.trim();
  plan.phxEventCapVerified = documented.checked;
  const from = Number(plan.phxGroupMin);
  const to = Number(plan.phxGroupMax);
  const target = Number(plan.phxTargetKingdom);
  if (Boolean(from) !== Boolean(to) || from > to) {
   status.textContent = 'Bitte beide Kingdom-Grenzen in aufsteigender Reihenfolge eingeben.';
   return;
  }
  if (from && target && (target < from || target > to)) {
   status.textContent = 'Das Zielkönigreich liegt außerhalb des eingetragenen Gruppenbereichs.';
   return;
  }
  if (plan.phxEventStart && plan.phxEventEnd && plan.phxEventEnd < plan.phxEventStart) {
   status.textContent = 'Das Transferfenster endet vor seinem Beginn.';
   return;
  }
  if (plan.phxEventCapVerified && (!plan.phxEventCap || !plan.phxEventCapSource || !plan.phxEventCapVerifiedAt)) {
   status.textContent = 'Für den dokumentierten Beleg bitte Power-Limit, Quelle und Belegdatum eingeben.';
   return;
  }
  try {
   localStorage.setItem(transferPlanKey, JSON.stringify(plan));
  } catch {
   status.textContent = 'Speichern auf diesem Gerät fehlgeschlagen.';
   return;
  }
  showSavedPlan(plan);
  window.dispatchEvent(new Event(transferPlanUpdated));
  status.textContent = 'Auf diesem Gerät gespeichert · manuelle Planung.';
 });

 showSavedPlan(saved);
 showRange();
 const needs = tools.querySelector('details.sub-disclosure');
 const comparison = field('externalIntelPanel');
 const exportButton = field('toolsCsv');
 if (comparison && needs) needs.before(comparison);
 if (exportButton) tools.append(exportButton);
}
