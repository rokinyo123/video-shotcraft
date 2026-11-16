const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2,viewport:{width:1400,height:400}});
await p.goto('file://'+__dirname+'/logo2.html');await p.waitForFunction(()=>document.title==='done');await p.waitForTimeout(300);
await (await p.$('#h')).screenshot({path:'esgarow_logo.png',omitBackground:true});
await p.evaluate(()=>{for(const id of ['t','sub'])document.getElementById(id).remove();const s=document.getElementById('s');const bb=s.getBBox();s.setAttribute('viewBox',`${bb.x-14} ${bb.y-14} ${bb.width+28} ${bb.height+28}`);s.setAttribute('width',(bb.width+28)*1.6);s.setAttribute('height',(bb.height+28)*1.6);});
await (await p.$('#h')).screenshot({path:'esgarow_icon.png',omitBackground:true});await b.close();})();
