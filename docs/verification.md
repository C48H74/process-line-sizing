# Line sizing — independent verification
Date: 2026-10-13. Status: preliminary velocity sizing verified; pressure-drop approval pending.

## Calculation basis
Q = A V; A = pi D_i²/4; D_i = sqrt(4Q/(pi V)). D_i is the internal diameter, not DN. All flow rates in this equation are actual volumetric flow in m³/s. Full pi is used; 0.785 is rounded pi/4.

| Case | Corrected actual flow | Velocity criterion | Required internal diameter | Illustrative Sch40 selection | Actual velocity |
|---|---:|---:|---:|---|---:|
| Water | 50 m³/h = 0.0138889 m³/s | 2 m/s | 94.0316 mm | DN100/NPS4; ID102.3 mm | 1.6898 m/s |
| Dry saturated steam, 10 barg | 5000 × 0.177 = 885 m³/h = 0.2458333 m³/s | 20 m/s | 125.1009 mm | DN150/NPS6; ID154.1 mm | 13.1809 m/s |
| Air | 187.38645 m³/h = 0.05205179 m³/s | 15 m/s | 66.4702 mm | DN80/NPS3; ID77.9 mm | 10.9212 m/s |

Steam alternative: DN125/NPS5 Sch40 ID = OD141.3 - 2×wall6.55 = 128.2 mm; actual velocity = 19.0447 m/s. It meets the assumed 20 m/s criterion. DN150 is a conservative candidate, not the smallest passing nominal size. Hydraulic losses may require DN150 or larger. The manufacturer table has an apparent typo in the NPS5 metric ID cell (158.2); its own OD and wall, and imperial ID5.047in, support 128.2 mm. Never copy the inconsistent cell.

## Errors corrected
1. Steam source flow is 5000 kg/h. The written multiplication used 50000 incorrectly. Even with 0.194 m³/kg, the result 970 m³/h corresponds to 5000 kg/h, not 50000.
2. At 10 barg, dry saturated steam specific volume is approximately 0.177 m³/kg. 0.194 is associated with approximately 10 bara / 9 barg. Gauge pressure and absolute pressure must not be interchanged. Rounded source properties imply rounded results.
3. Air source flow is 1000 Nm³/h; the written gas-law expression used 10000 incorrectly. With the user's convention Pn=1.013 bara, Tn=273 K, Pop=6 bara and Top=303 K: Qactual = 1000(1.013/6)(303/273) =187.38645 m³/h, assuming ideal gas, Zop/Zn=1.
4. 5 barg + 1.013 bar atmospheric pressure gives 6.013 bara. Keeping all other original rounding yields Recalculation gives Qactual =187.38645×6/6.013 =186.98132 m³/h and D=66.3984 mm. The main table deliberately retains the supplied approximate 6 bara basis. Normal conditions are contract-specific; 273.15 K may be required instead of273 K.

## Finite verification loop executed
Cycle1: corrected transcription, units and pressure basis; checked primary source steam table and nominal pipe dimensions.
Cycle2: computed D from Q and V using full pi; back-substituted Q=A V. Absolute residual below 3×10^-17 m³/s in each case.
Cycle3: recomputed actual velocity with selected internal bores; reviewed smaller adjacent pipe candidates, pressure-drop completeness and norm attribution. Three numerical closure passes agree. Repeating unchanged arithmetic indefinitely adds no evidence; restart the loop whenever a property, bore or process condition changes.

## Pressure drop is not yet calculated
For a single-phase constant-density segment, friction plus local losses: deltaP_loss = (f_D L/D_i + sumK) rho V²/2. Reynolds number Re = rho V D_i/mu. f_D is the Darcy friction factor (not Fanning). Add elevation and acceleration effects when determining required upstream/downstream pressure. Avoid double counting fittings through both K and equivalent length.

Missing data: developed length, material/roughness, wall schedule and actual bore, viscosity and temperature, fitting/valve quantities and K/Cv, elevation changes, upstream and required downstream absolute pressures, allowable pressure drop defined by process, min/max flow, and equipment boundary requirements. Pump suction also needs NPSH assessment. Gas/steam with appreciable pressure variation require compressible calculations/segments with updated density, temperature and compressibility, plus choking review where relevant. Wet steam/two-phase flow requires a suitable model and condensate management.

## Criteria and codes
The original velocity ranges and pressure-drop budgets are rules of thumb, not universal normative limits. Spirax Sarco cites other saturated-steam ranges depending on conditions (25–40 m/s as a general starting range, lower speeds for long runs), illustrating this dependency. ASME B31.3 covers piping integrity/design/fabrication/examination/testing. API610 concerns centrifugal pump requirements. No clause was established that makes the supplied velocity or pressure-drop tables compulsory under either standard. Use the applicable licensed edition and project/company criteria.

## Primary sources checked live
- Spirax Sarco, Dry Saturated Steam Tables TI-GCM-01, page2: 10 barg, specific volume0.177 m³/kg; 9 barg,0.194 m³/kg. https://content.spiraxsarco.com/-/media/spiraxsarco/international/documents/en/ti/dry-saturated-ti-gcm-01-en.ashx?rev=4141e63c01044ef296aae42c0b091703
- Wheatland Tube, Schedule40 Submittal Sheet, page2: NPS3 ID77.9mm; NPS4 ID102.3mm; NPS6 ID154.1mm. Used for illustrative geometry, not endorsement of sprinkler product for process or steam service. NPS5 metric ID typo cross-checked against same-row OD/wall/imperial ID. https://www.wheatland.com/wp-content/uploads/2017/12/Schedule-40-Submittal-Sheet.pdf
- Spirax Sarco, Pipes and Pipe Sizing: https://www.spiraxsarco.com/learn-about-steam/steam-distribution/pipes-and-pipe-sizing
- ASME, B31.3 Process Piping scope: https://www.asme.org/codes-standards/find-codes-standards/b31-3-process-piping
- API, standard scope confirmed via announcement: https://www.api.org/products-and-services/standards/important-standards-announcements/rp697

Conclusion: the continuity calculations are internally consistent after correction. Nominal pipe choices remain preliminary until hydraulic and mechanical checks are complete.

