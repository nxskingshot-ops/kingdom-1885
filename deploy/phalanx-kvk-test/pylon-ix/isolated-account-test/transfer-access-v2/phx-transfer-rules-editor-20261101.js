// Local-only transfer-rule draft editor. Never persists or grants rights.
import { forecast } from './phx-transfer-forecast-20261101.js';
export function validateRuleDraft(draft) {
 const errors=[];
 const low=Number(draft.kingdomMin),high=Number(draft.kingdomMax);
 if (!Number.isInteger(low)||!Number.isInteger(high)||low<1||high<low) errors.push('Enter a valid kingdom range.');
 for (const key of ['ordinaryReferenceM','leadingReferenceM']) {
  const value=Number(draft[key]);if(draft[key]===''||!Number.isFinite(value)||value<=0)errors.push('Enter a valid '+key+'.');
 }
 if (!/^https:\/\//.test(draft.source||''))errors.push('Provide an HTTPS evidence source.');
 if (!String(draft.reason||'').trim())errors.push('Explain why these rules changed.');
 if (!['forecast','confirmed'].includes(draft.status))errors.push('Select a rule status.');
 return errors;
}
export function mountRuleDraftEditor(host,{canEdit=false}={}) {
 if(!host)return;
 const section=document.createElement('details');
 const heading=document.createElement('summary');heading.textContent='Transfer Rules Management · Draft only';section.append(heading);
 const note=document.createElement('p');note.textContent='Changes are local drafts only. Nothing is saved or applied to candidate assessments. Official confirmation requires authorized review and an audited backend.';section.append(note);
 if(!canEdit){const p=document.createElement('p');p.textContent='Read-only access. Rule editing requires explicit authorization.';section.append(p);host.append(section);return;}
 const form=document.createElement('form');const fields=[
 ['group','Expected group',forecast.group],['kingdomMin','Kingdom range start',forecast.range[0]],
 ['kingdomMax','Kingdom range end',forecast.range[1]],['ordinaryReferenceM','Ordinary reference (M)',forecast.ordinaryReferenceM],
 ['leadingReferenceM','Leading reference (M)',forecast.leadingReferenceM],['window','Expected window',forecast.window],
 ['source','Evidence URL',forecast.source],['reason','Change reason','']
 ];
 for(const [name,label,value] of fields){const wrap=document.createElement('label'),input=document.createElement('input');wrap.textContent=label+' ';input.name=name;input.value=String(value);input.required=true;wrap.append(input);form.append(wrap,document.createTextNode(' '));}
 const statusLabel=document.createElement('label');statusLabel.textContent='Evidence status ';const status=document.createElement('select');status.name='status';for(const v of ['forecast','confirmed']){const opt=document.createElement('option');opt.value=v;opt.textContent=v==='forecast'?'Forecast — not confirmed':'Confirmed — requires authorized backend approval';status.append(opt);}statusLabel.append(status);form.append(statusLabel);
 const action=document.createElement('button');action.type='submit';action.textContent='Validate draft';form.append(action);
 const feedback=document.createElement('p');feedback.setAttribute('role','status');form.append(feedback);
 form.addEventListener('submit',event=>{event.preventDefault();const draft=Object.fromEntries(new FormData(form));const errors=validateRuleDraft(draft);feedback.textContent=errors.length?errors.join(' '):'Draft validated locally. Not saved, published or confirmed.';});
 section.append(form);host.append(section);
}
