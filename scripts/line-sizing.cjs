'use strict';
const fs=require('fs');
const assert=require('assert');
function num(x,k,zero=false){const v=x[k];if(typeof v!=='number'||!Number.isFinite(v)||(zero?v<0:v<=0))throw Error(`Invalid ${k}`);return v;}
function calculate(x){
 const limit=num(x,'velocityLimitMps');let qh;
 if(x.phase==='liquid')qh=num(x,'actualFlowM3h');
 else if(x.phase==='steam')qh=num(x,'massFlowKgh')*num(x,'specificVolumeM3kg');
 else if(x.phase==='gas')qh=num(x,'normalFlowM3h')*num(x,'normalPressureBarAbs')/num(x,'operatingPressureBarAbs')*num(x,'operatingTemperatureK')/num(x,'normalTemperatureK')*num(x,'operatingZ')/num(x,'normalZ');
 else throw Error('phase must be liquid, gas, or steam');
 const q=qh/3600,d=Math.sqrt(4*q/(Math.PI*limit));
 let h=x.hydraulics,missing=[];
 if(h){for(const k of ['lengthM','densityKgm3','viscosityPas','roughnessMm','sumK','allowableDropBar'])if(h[k]===undefined)missing.push(k);if(!missing.length){for(const k of ['lengthM','roughnessMm','sumK'])num(h,k,true);for(const k of ['densityKgm3','viscosityPas','allowableDropBar'])num(h,k);}}
 const supplied=x.candidates===undefined?[]:x.candidates;if(!Array.isArray(supplied)||supplied.length>100)throw Error('Supply at most 100 candidates');
 const rows=supplied.map(c=>{num(c,'idMm');return c;}).slice().sort((a,b)=>a.idMm-b.idMm).map(c=>{
  const bore=c.idMm/1000,v=4*q/(Math.PI*bore*bore),r={name:c.name,idMm:c.idMm,velocityMps:v,velocityPass:v<=limit,pressureDropStatus:'unverified'};
  if(h&&!missing.length){const re=h.densityKgm3*v*bore/h.viscosityPas;r.reynolds=re;
   if(re>=2300&&re<=4000){r.pressureDropStatus='transitional-flow-unresolved';return r;}
   const f=re<2300?64/re:0.25/Math.log10(h.roughnessMm/1000/(3.7*bore)+5.74/Math.pow(re,0.9))**2;
   r.darcyFrictionFactor=f;r.pressureDropBar=(f*h.lengthM/bore+h.sumK)*h.densityKgm3*v*v/2/1e5;r.pressureDropPass=r.pressureDropBar<=h.allowableDropBar;r.pressureDropStatus=x.phase==='liquid'?'constant-density-friction-check':'compressible-screening-only';
  }return r;
 });
 return {phase:x.phase,actualFlowM3h:qh,actualFlowM3s:q,minimumInternalDiameterMm:d*1000,hydraulicMissingFields:h?missing:['hydraulics'],candidates:rows,firstPassingScreen:rows.find(r=>r.velocityPass&&r.pressureDropPass)||null,scope:'Preliminary single-phase screening; excludes static head, NPSH and final operability approval.'};
}
function test(){
 const w=calculate({phase:'liquid',actualFlowM3h:50,velocityLimitMps:2});assert(Math.abs(w.minimumInternalDiameterMm-94.031597)<0.00001);
 const g={phase:'gas',normalFlowM3h:1000,normalPressureBarAbs:1.013,normalTemperatureK:273,operatingPressureBarAbs:6,operatingTemperatureK:303,normalZ:1,operatingZ:1,velocityLimitMps:15};assert(Math.abs(calculate(g).actualFlowM3h-187.3864469)<0.00001);assert(Math.abs(calculate({...g,operatingPressureBarAbs:12}).minimumInternalDiameterMm/calculate(g).minimumInternalDiameterMm-1/Math.sqrt(2))<1e-12);
 const s=calculate({phase:'steam',massFlowKgh:5000,specificVolumeM3kg:0.177,velocityLimitMps:20});assert(Math.abs(s.minimumInternalDiameterMm-125.1009036)<0.00001);
 const b={phase:'liquid',actualFlowM3h:50,velocityLimitMps:2,candidates:[{name:'large',idMm:154.1},{name:'small',idMm:102.26}],hydraulics:{lengthM:100,densityKgm3:1000,viscosityPas:0.001,roughnessMm:0.045,sumK:3,allowableDropBar:1}};const r=calculate(b);assert(r.candidates[0].velocityMps>r.candidates[1].velocityMps);assert(r.candidates[0].pressureDropBar>r.candidates[1].pressureDropBar);assert(r.firstPassingScreen);assert.strictEqual(calculate({...b,hydraulics:{}}).firstPassingScreen,null);assert.throws(()=>calculate({...g,operatingPressureBarAbs:0}));assert.throws(()=>calculate({...b,candidates:Array(101).fill({idMm:100})}));
 console.log('PASS: reference examples, pressure scaling, bore/loss monotonicity, missing inputs and invalid input bounds');
}
if(require.main===module){try{if(process.argv[2]==='--self-test')test();else if(process.argv[2])console.log(JSON.stringify(calculate(JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''))),null,2));else throw Error('Usage: node line-sizing.cjs input.json | --self-test');}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={calculate};

