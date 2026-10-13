# Method and input

JSON fields (SI unless named otherwise):
- `phase`: `liquid`, `gas`, or `steam`; `velocityLimitMps`.
- Liquid: `actualFlowM3h`.
- Gas: `normalFlowM3h`, `normalPressureBarAbs`, `normalTemperatureK`, `operatingPressureBarAbs`, `operatingTemperatureK`, `normalZ`, `operatingZ`. Supply Z=1 explicitly for an ideal-gas assumption.
- Steam: `massFlowKgh`, `specificVolumeM3kg` from a cited property source. Pressure and property provenance belong in the accompanying report.
- Optional `candidates`: array of `{ "name": "DN100 Sch40", "idMm": 102.26 }`; the name/ID association is supplied data, not verified by the script.
- Optional `hydraulics`: requires all `lengthM`, `densityKgm3`, `viscosityPas`, `roughnessMm`, `sumK`, `allowableDropBar`. Zero length/roughness/K is allowed only when expressly justified.

Examples:

```json
{"phase":"liquid","actualFlowM3h":50,"velocityLimitMps":2,"candidates":[{"name":"illustrative bore","idMm":102.26}]}
```

```json
{"phase":"gas","normalFlowM3h":1000,"normalPressureBarAbs":1.013,"normalTemperatureK":273,"operatingPressureBarAbs":6,"operatingTemperatureK":303,"normalZ":1,"operatingZ":1,"velocityLimitMps":15}
```

Equations:

- Liquid: Q = actual volumetric flow / 3600.
- Steam: Q = mass flow x specific volume / 3600.
- Gas: Qactual = Qnormal x (Pnormal/Pactual) x (Tactual/Tnormal) x (Zactual/Znormal).
- Minimum bore: D = sqrt(4Q/(pi vmax)).
- Candidate velocity: v = 4Q/(pi D^2).
- Reynolds number: Re = rho v D / mu.
- Darcy friction factor: 64/Re for Re < 2300; Swamee-Jain approximation for Re > 4000. Transitional flow is unresolved. This is the Darcy factor, not the Fanning factor.
- Friction/local loss: deltaP = (f L/D + sumK) rho v^2 / 2.

This hydraulic calculation excludes static head, equipment losses not captured in K, and changing density. Gas and steam candidate losses are flagged as screening even if they satisfy a supplied limit. A missing hydraulic object or missing fields cannot produce a selected/verified candidate.

Corrections to the supplied social-post examples: the steam multiplication must use 5000 kg/h, not 50000; gas conversion must use 1000 Nm3/h, not 10000. The quoted steam volume 0.194 m3/kg corresponds approximately to 10 bara saturated vapor, not 10 barg. Refresh the property value for the stated absolute pressure instead of accepting it because the arithmetic is consistent. Using the post's 0.194 gives Q=970 m3/h and D=130.97 mm, but retains that property mismatch. The gas case uses an approximate 6 bara; state the assumed atmospheric pressure or use the precise supplied pressure.

Verified rounded reference case: at 10 barg, using Specific volume=0.177 m3/kg from the saturated-steam table, 5000 kg/h gives 885 m3/h and Minimum internal diameter=125.1009 mm at 20 m/s. DN125 Sch40 with Internal diameter=128.2 mm gives Velocity=19.0447 m/s; it passes this Velocity criterion, with Pressure drop still unverified. Cross-check tabulated bores against OD - 2 x wall thickness and imperial/metric conversions: a published table can contain transcription errors. Reference source: https://www.spiraxsarco.com/learn-about-steam/steam-engineering-principles-and-heat-transfer/steam-tables . Recheck the current table and pressure convention before reuse.

Educational image deliverables from this session: [Line sizing principles](../assets/images/line-sizing-principles-en.png) and [Verified examples](../assets/images/verified-examples-en.png). The images are bundled with this repository. Detailed audit: [Verification](../docs/verification.md).

Exact property source used for the example: https://content.spiraxsarco.com/-/media/spiraxsarco/international/documents/en/ti/dry-saturated-ti-gcm-01-en.ashx?rev=4141e63c01044ef296aae42c0b091703 . Page 2 lists 0.177 m3/kg at 10 barg and 0.194 m3/kg at 9 barg.

