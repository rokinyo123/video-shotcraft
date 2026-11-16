const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1024,height:1024}});
await p.goto('file://'+__dirname+'/badge.html');await p.waitForFunction(()=>document.title==='done');await p.waitForTimeout(300);
await (await p.$('#bg')).screenshot({path:'esgarow_badge.png',omitBackground:true});
await p.evaluate(()=>document.getElementById('bg').classList.add('dark'));
await (await p.$('#bg')).screenshot({path:'esgarow_avatar.png'});await b.close();})();
