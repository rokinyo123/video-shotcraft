const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/logo.html');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.fonts.check("700 40px 'Cormorant Garamond'")));
await (await p.$('#h')).screenshot({path:'esgarow_logo.png',omitBackground:true});
await (await p.$('svg')).screenshot({path:'esgarow_icon.png',omitBackground:true});
await b.close();})();
