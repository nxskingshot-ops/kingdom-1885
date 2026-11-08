/* PHALANX Tools menu; moves existing nodes, does not alter stored data. */
(()=>{'use strict';function init(){
const tools=document.querySelector('#workspace-tools .tools-body');
if(!tools||document.getElementById('phxToolsMenu'))return;
const items=[
['Plan Transfers','Event window, transfer group, and evidence',tools.querySelector('.phx-planning-context')],
['Calculate Transfer Power','Planning scenarios',document.getElementById('phxPowerScenario')],
['Compare Kingdom #1885','Compare players and alliances',document.getElementById('externalIntelPanel')],
['Alliance Needs & Kingdoms','Recruitment needs and kingdom notes',document.getElementById('phxAllianceNeeds')],
['Export Data','Save candidates as CSV',document.getElementById('toolsCsv')]
];
if(items.some(([, ,el])=>!el||!tools.contains(el))){document.documentElement.dataset.phxToolsMenu='waiting-for-module';return;}
const menu=document.createElement('nav');menu.id='phxToolsMenu';menu.setAttribute('aria-label','Transfer tools');
const css=document.createElement('style');css.textContent='#phxToolsMenu{display:grid;gap:10px;min-width:0}#phxToolsMenu>.phx-tool-item{min-width:0;border:1px solid #ae8349;background:#091925}#phxToolsMenu>.phx-tool-item>summary{cursor:pointer;padding:14px;color:#eccc93;font:600 19px Georgia,serif;overflow-wrap:anywhere}#phxToolsMenu>.phx-tool-item>summary small{display:block;margin-top:5px;font:13px system-ui,sans-serif;color:#aebbc6}#phxToolsMenu .phx-tool-content{padding:8px;min-width:0}#phxToolsMenu .phx-tool-content>.panel{max-width:100%;margin:0}#phxToolsMenu .phx-tool-content>.export-tile{max-width:100%;white-space:normal}#phxToolsMenu .phx-tool-item>summary:focus-visible{outline:3px solid #ecc98c;outline-offset:-3px}';menu.append(css);
items.forEach(([name,hint,element])=>{const section=document.createElement('details');section.className='phx-tool-item';const summary=document.createElement('summary');summary.append(document.createTextNode(name));const small=document.createElement('small');small.textContent=hint;summary.append(small);const body=document.createElement('div');body.className='phx-tool-content';if(element.id==='externalIntelPanel')body.id='phxToolsComparisonContent';body.append(element);section.append(summary,body);menu.append(section);section.addEventListener('toggle',()=>{if(section.open)menu.querySelectorAll('details.phx-tool-item').forEach(other=>{if(other!==section)other.open=false;});});});tools.prepend(menu);document.documentElement.dataset.phxToolsMenu='ready';
const powerContent=menu.querySelectorAll('.phx-tool-content')[1];
const power=document.getElementById('phxPowerScenario');
if(power){powerContent.append(power);power.hidden=false;power.removeAttribute('style');}
Array.from(tools.children).filter(el=>el.matches('p.smallprint')).forEach(el=>{if(el.textContent.startsWith('Export the currently filtered'))el.hidden=true;});
}window.phxInitToolsMenu=init;if(document.readyState==='complete')init();else document.addEventListener('DOMContentLoaded',init,{once:true});})();