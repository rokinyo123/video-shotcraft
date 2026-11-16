const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/logo_brain.html');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.fonts.check("700 40px 'Cormorant Garamond'")));
await (await p.$('#h')).screenshot({path:'esgarow_logo_brain.png',omitBackground:true});

await b.close();})();
