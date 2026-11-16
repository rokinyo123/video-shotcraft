const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2,viewport:{width:1400,height:400}});
await p.goto('file://'+__dirname+'/logo2.html');await p.waitForFunction(()=>document.title==='done');await p.waitForTimeout(300);
await (await p.$('#h')).screenshot({path:'esgarow_logo.png',omitBackground:true});await b.close();})();
