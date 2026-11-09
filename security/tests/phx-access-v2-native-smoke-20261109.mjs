import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { createServer, request } from 'node:http';
import { createWriteStream, readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, extname, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import pg from 'pg';
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { build } from 'esbuild';
import { createClient } from '@supabase/supabase-js';

const repo=resolve(process.argv[2] ?? '.');
const base='http://127.0.0.1:53910';
const authPort=53912, restPort=53913, smtpPort=53914;
const source=join(repo,'deploy/phalanx-kvk-test/pylon-ix');
const paths='transfer-pr42';
const stage=base+'/'+paths+'/transfer-scouting-id-stage-20261030.html';
const signup=base+'/'+paths+'/transfer-register.html';
const dbUri='postgresql://postgres@127.0.0.1:53911/phx_access_fixture';
const jwtSecret=randomBytes(48).toString('hex');
const token=(role)=> {
  const enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
  const message=enc({typ:'JWT',alg:'HS256'})+'.'+enc({role,exp:Math.floor(Date.now()/1000)+3600});
  return message+'.'+createHmac('sha256',jwtSecret).update(message).digest('base64url');
};
const anon=token('anon'), service=token('service_role');
const password=()=>randomBytes(30).toString('base64url')+'a2!';
const clients=[], messages=[];
const sql=new pg.Pool({connectionString:dbUri});
let smtp, gateway, browser;

function start(file,env,log) {
  const out=createWriteStream(log,{mode:0o600});
  const child=spawn(file,[],{env:{...process.env,...env},stdio:['ignore','pipe','pipe']});
  child.stdout.pipe(out,{end:false}); child.stderr.pipe(out,{end:false});
  child.on('exit',()=>out.end()); clients.push(child);
}
async function waitFor(fn,name) {
  for(let i=0;i<100;i++){
    try{ const result=await fn(); if(result)return result; }catch{}
    await delay(100);
  }
  throw new Error('Timed out: '+name);
}
function send(res,status,type,body){res.writeHead(status,{'content-type':type,'cache-control':'no-store'});res.end(body);}
function mailLink(email,type='signup'){
  const item=messages.findLast(m=>m.to?.value.some(a=>a.address===email));
  const link=(item?.html||'').match(/href="([^"]*\/verify\?[^"]+)"/)?.[1];
  const href=link?.replaceAll('&amp;','&');
  return href && new URL(href).searchParams.get('type')===type ? href : null;
}
function rpc(client,action,args={}){
  return client.rpc('phx_access_management',{p_action:action,...args});
}
function ok(result){ if(result.error)throw new Error(result.error.code+' '+result.error.message); return result.data; }
const ctx={persistSession:false,autoRefreshToken:false,detectSessionInUrl:false};
const api=(key=anon)=>createClient(base,key,{auth:ctx});
const assertions=[], testUsers=new Map();
try{
  const guard=await sql.query(`
    SELECT current_database() AS name, EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname IN ('public','auth','app_private') AND c.relkind='r'
    ) AS populated
  `);
  assert.deepEqual(guard.rows,[{name:'phx_access_fixture',populated:false}]);
  await sql.query(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE ROLE authenticator LOGIN NOINHERIT;
    GRANT anon,authenticated,service_role TO authenticator;
    CREATE ROLE supabase_auth_admin LOGIN CREATEROLE NOINHERIT;
    CREATE SCHEMA auth AUTHORIZATION supabase_auth_admin;
    ALTER ROLE supabase_auth_admin SET search_path TO auth;
    GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role,supabase_auth_admin;
  `);
  smtp=new SMTPServer({authOptional:true,disabledCommands:['STARTTLS','AUTH'],
    onData(stream,session,done){
      simpleParser(stream).then(m=>{messages.push(m);done();},done);
    }
  });
  await new Promise(r=>smtp.listen(smtpPort,'127.0.0.1',r));
  const bundle=(await build({stdin:{contents:"export {createClient} from '@supabase/supabase-js';",resolveDir:process.cwd()},platform:'browser',bundle:true,write:false,format:'esm'})).outputFiles[0].text;
  gateway=createServer((req,res)=>{
    const url=new URL(req.url,base);
    if(url.pathname.startsWith('/auth/v1/')||url.pathname.startsWith('/rest/v1/')){
      const auth=url.pathname.startsWith('/auth/');
      const proxy=request({host:'127.0.0.1',port:auth?authPort:restPort,method:req.method,path:url.pathname.slice(8)+url.search,headers:req.headers}, reply=>{
        res.writeHead(reply.statusCode,reply.headers);reply.pipe(res);
      });
      proxy.on('error',()=>send(res,502,'text/plain','Unavailable'));req.pipe(proxy);return;
    }
    if(url.pathname==='/supabase.mjs')return send(res,200,'text/javascript',bundle);
    const f=resolve(source,'.'+url.pathname+(url.pathname.endsWith('transfer-scouting-id-stage-20261030')?'.html':''));
    if(!f.startsWith(source+'/')||!existsSync(f)||!['.html','.js','.css'].includes(extname(f)))return send(res,404,'text/plain','Missing');
    let content=readFileSync(f,'utf8');
    if(extname(f)==='.js'){
      content=content.replaceAll('https://hcjrdofkdkasznywvcxo.supabase.co',base)
        .replace(/sb_publishable_[A-Za-z0-9_-]+/g,anon)
        .replace(/https:\/\/esm\.sh\/@supabase\/supabase-js@2(?:\.\d+){0,2}/g,base+'/supabase.mjs');
    }
    const type={'.html':'text/html','.css':'text/css','.js':'text/javascript'}[extname(f)];
    send(res,200,type,content);
  });
  await new Promise(r=>gateway.listen(53910,'127.0.0.1',r));
  start('./auth',{
    GOTRUE_JWT_SECRET:jwtSecret,GOTRUE_JWT_AUD:'authenticated',GOTRUE_JWT_DEFAULT_GROUP_NAME:'authenticated',
    GOTRUE_JWT_ADMIN_ROLES:'service_role',GOTRUE_API_HOST:'127.0.0.1',PORT:String(authPort),
    GOTRUE_DB_DRIVER:'postgres',DB_NAMESPACE:'auth',
    DATABASE_URL:'postgresql://supabase_auth_admin@127.0.0.1:53911/phx_access_fixture',
    API_EXTERNAL_URL:base+'/auth/v1',GOTRUE_SITE_URL:stage,GOTRUE_URI_ALLOW_LIST:stage+','+stage.slice(0,-5),
    GOTRUE_EXTERNAL_EMAIL_ENABLED:'true',GOTRUE_EXTERNAL_PHONE_ENABLED:'false',
    GOTRUE_MAILER_AUTOCONFIRM:'false',GOTRUE_SMTP_HOST:'127.0.0.1',GOTRUE_SMTP_PORT:String(smtpPort),
    GOTRUE_SMTP_ADMIN_EMAIL:'auth@fixture.example.com',GOTRUE_SMTP_MAX_FREQUENCY:'0s',
    GOTRUE_RATE_LIMIT_EMAIL_SENT:'100',GOTRUE_MAILER_URLPATHS_CONFIRMATION:'/auth/v1/verify',
    GOTRUE_MAILER_URLPATHS_RECOVERY:'/auth/v1/verify',
  },'auth.log');
  await waitFor(async()=>(await fetch(base+'/auth/v1/health')).ok,'GoTrue startup');
  await sql.query(readFileSync(new URL('./phx-access-v2-native-baseline-20261109.sql',import.meta.url),'utf8'));
  await sql.query(readFileSync(join(repo,'security/patches/PHX-ACCESS-MANAGEMENT-STAGE-20261109.sql'),'utf8'));
  await sql.query(readFileSync(join(repo,'security/patches/PHX-ACCESS-V2-TRANSFER-SCOUTING-20261109.sql'),'utf8'));
  const bootstrap=api(service);
  const ownerMail='owner@fixture.example.com', ownerPass=password();
  const delegateMail='delegate@fixture.example.com', delegatePass=password();
  const make=async(email,password)=>ok(await bootstrap.auth.admin.createUser({email,password,email_confirm:true})).user.id;
  const owner=await make(ownerMail,ownerPass), delegate=await make(delegateMail,delegatePass);
  await sql.query('INSERT INTO public.nxs_memberships (user_id,role,active) VALUES ($1,\'admin\',true),($2,\'r5\',true)',[owner,delegate]);
  await sql.query('INSERT INTO app_private.phx_access_settings (protected_user_id,delegate_user_id,scouting_roles_enabled) VALUES ($1,$2,true)',[owner,delegate]);
  start('./postgrest',{
    PGRST_DB_URI:'postgresql://authenticator@127.0.0.1:53911/phx_access_fixture',
    PGRST_DB_SCHEMAS:'public',PGRST_DB_ANON_ROLE:'anon',PGRST_JWT_SECRET:jwtSecret,
    PGRST_SERVER_HOST:'127.0.0.1',PGRST_SERVER_PORT:String(restPort),PGRST_LOG_LEVEL:'warn',
  },'rest.log');
  await waitFor(async()=>(await fetch(base+'/rest/v1/')).ok,'PostgREST startup');
  const {chromium}=await import(process.env.PHX_PLAYWRIGHT);
  browser=await chromium.launch({executablePath:process.env.PHX_CHROMIUM,args:['--no-sandbox']});
  const browserPage=async()=>{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    page.setDefaultTimeout(10000);
    await page.route('**/*',route=>route.request().url().startsWith(base+'/')?route.continue():route.abort());
    page.on('dialog',d=>d.accept());
    return page;
  };
  const logIn=async(page,email,password)=>{
    await page.goto(stage);
    await page.locator('#email').fill(email);await page.locator('#password').fill(password);
    await page.getByRole('button',{name:'Sign in',exact:true}).click();
  };
  const adminPage=await browserPage();
  await logIn(adminPage,delegateMail,delegatePass);
  await adminPage.locator('#private').waitFor({state:'visible'});
  await adminPage.locator('[data-view="workspace-tools"]').click();
  const panel=adminPage.locator('#phxAccessManagement');
  await panel.locator(':scope > summary').click();
  await panel.getByText('Invite Player',{exact:true}).click();
  for(const [index,role] of ['observer','operator','administrator'].entries()){
    const email=role+'@fixture.example.com', pass=password(), player=String(291790010+index);
    await panel.getByLabel('Email',{exact:true}).fill(email);
    await panel.getByLabel('Kingshot Player ID').fill(player);
    await panel.getByLabel('Access role',{exact:true}).selectOption(role);
    await panel.getByRole('button',{name:'Create invitation'}).click();
    await panel.getByText('Invitation created.',{exact:false}).waitFor();
    const page=await browserPage();
    await page.goto(signup);
    await page.locator('#email').fill(email);await page.locator('#playerId').fill(player);
    await page.locator('#password').fill(pass);await page.locator('#confirm').fill(pass);
    await page.getByRole('button',{name:'Create account'}).click();
    await page.getByText('Check your inbox',{exact:false}).waitFor();
    const user=api();
    assert.equal((await user.auth.signInWithPassword({email,password:pass})).error?.code,'email_not_confirmed');
    const link=await waitFor(()=>mailLink(email),'local confirmation mail');
    assert.equal(new URL(link).origin,base);
    const confirmation=await fetch(link,{redirect:'manual'});
    assert.equal(confirmation.status,303,'Confirmation response for '+new URL(link).pathname);
    assert.equal(new URL(confirmation.headers.get('location')).searchParams.has('error'),false);
    await logIn(page,email,pass);
    await page.getByText('no approved NXS membership was found',{exact:false}).waitFor();
    await panel.getByRole('button',{name:'Approvals',exact:true}).click();
    await panel.getByLabel('Email or player ID',{exact:true}).fill(player);
    await panel.getByRole('button',{name:'Search',exact:true}).click();
    const card=panel.locator('article').filter({hasText:email});
    await card.getByLabel('Approval role').waitFor();
    assert.equal(await card.getByLabel('Approval role').inputValue(),role);
    await card.getByRole('button',{name:'Approve access'}).click();
    await panel.getByText('Account updated.',{exact:true}).waitFor();
    await page.reload();
    await page.locator('#private').waitFor({state:'visible'});
    assert.equal(await page.locator('#phxIdentityMeta').textContent(),role.toUpperCase()+' · ACTIVE');
    ok(await user.auth.signInWithPassword({email,password:pass}));
    testUsers.set(role,{user,email,pass,player});
    const access=ok(await rpc(user,'check'));
    assert.equal(access.scouting_role,role);
    assert.equal(access.allowed,role==='administrator');
    if(role==='observer'){
      assert.equal((await user.from('transfer_candidates').insert({candidate_id:'deny',player_name:'Denied'})).error?.code,'42501');
      assert.equal((await rpc(user,'list')).error?.code,'42501');
    }else{
      ok(await user.from('transfer_candidates').insert({candidate_id:player,player_name:'Synthetic '+role}));
      const changed=ok(await user.from('transfer_candidates').update({notes:'Updated through PostgREST'}).eq('candidate_id',player).select('notes'));
      assert.equal(changed[0].notes,'Updated through PostgREST');
      assert.deepEqual(ok(await user.from('transfer_candidates').delete().eq('candidate_id',player).select('candidate_id')),[]);
    }
    if(role==='administrator'){
      for(const target of [owner,delegate]){
        assert.equal((await rpc(user,'set_scouting_role',{p_user_id:target,p_role:'observer',p_email:'Synthetic guard test'})).error?.code,'42501');
      }
      const self=ok(await user.auth.getUser()).user.id;
      assert.equal((await rpc(user,'suspend',{p_user_id:self})).error?.code,'42501');
    }
    await page.close();
    assertions.push(role);
    await panel.getByLabel('Email or player ID',{exact:true}).fill('');
    await panel.getByRole('button',{name:'Refresh',exact:true}).click();
  }
  const observer=testUsers.get('observer');
  const observerId=ok(await observer.user.auth.getUser()).user.id;
  assert.equal(ok(await observer.user.from('transfer_candidates').select('candidate_id')).length,2);
  await panel.getByRole('button',{name:'Accounts',exact:true}).click();
  const observerCard=panel.locator('article').filter({hasText:observer.email});
  for(const role of ['operator','observer']){
    await observerCard.getByText('Change role',{exact:true}).click();
    await observerCard.getByLabel('Member role',{exact:true}).selectOption(role);
    await observerCard.getByLabel('Reason for change').fill('Native browser audit test');
    await observerCard.getByRole('button',{name:'Save role',exact:true}).click();
    await waitFor(async()=>(await rpc(observer.user,'check')).data?.scouting_role===role,'database role readback');
    await observerCard.locator(':scope > p').filter({hasText:new RegExp(role,'i')}).waitFor();
  }
  const auditRole=await sql.query(
    "SELECT after_data->>'reason' AS reason FROM public.nxs_audit_log WHERE operation='set_scouting_role' AND record_key=$1 ORDER BY id",
    [observerId]);
  assert.deepEqual(auditRole.rows,[{reason:'Native browser audit test'},{reason:'Native browser audit test'}]);

  ok(await api().auth.resetPasswordForEmail(observer.email,{redirectTo:stage}));
  const recovery=await waitFor(()=>mailLink(observer.email,'recovery'),'local password recovery mail');
  assert.equal(new URL(recovery).origin,base);
  const recoveryResponse=await fetch(recovery,{redirect:'manual'});
  assert.equal(recoveryResponse.status,303);
  const callback=new URL(recoveryResponse.headers.get('location'));
  const tokens=new URLSearchParams(callback.hash.slice(1));
  assert.ok(tokens.get('access_token')&&tokens.get('refresh_token'),'Recovery returned a session');
  const recovering=api();
  ok(await recovering.auth.setSession({access_token:tokens.get('access_token'),refresh_token:tokens.get('refresh_token')}));
  const nextPass=password();
  ok(await recovering.auth.updateUser({password:nextPass}));
  assert.equal((await api().auth.signInWithPassword({email:observer.email,password:observer.pass})).error?.code,'invalid_credentials');
  const recovered=api();
  ok(await recovered.auth.signInWithPassword({email:observer.email,password:nextPass}));
  assert.equal(ok(await rpc(recovered,'check')).scouting_role,'observer');
  const previouslyAuthorized=ok(await recovered.auth.getSession()).session.access_token;
  ok(await recovered.auth.signOut({scope:'global'}));
  const stale=createClient(base,anon,{global:{headers:{Authorization:'Bearer '+previouslyAuthorized}},auth:ctx});
  const staleAccess=ok(await rpc(stale,'check'));
  assert.equal(staleAccess.scouting_role,null);
  assert.equal(staleAccess.allowed,false);
  const readback=await sql.query("SELECT scouting_role, count(*)::int count FROM public.nxs_memberships WHERE scouting_role IS NOT NULL GROUP BY 1 ORDER BY 1");
  assert.deepEqual(readback.rows.map(r=>r.scouting_role),['administrator','observer','operator']);
  const audit=await sql.query("SELECT operation,count(*)::int count FROM public.nxs_audit_log GROUP BY operation ORDER BY operation");
  console.log('PASS native PostgreSQL 17.9, GoTrue 2.197.0 and PostgREST 16.5: browser registration, captured SMTP confirmation, real sessions and recovery, three approvals, browser role editing, native RLS, candidate writes, protected targets and revoked-session denial.',assertions.join(', '));
  console.log('Audit operation counts:', JSON.stringify(audit.rows));
} catch(e) {
  console.error(e.message);
  process.exitCode=1;
} finally {
  if(browser) await browser.close();
  for(const p of clients) p.kill('SIGTERM');
  if(gateway) gateway.close();
  if(smtp) smtp.close();
  await sql.end();
}
