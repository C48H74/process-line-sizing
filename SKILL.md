---
name: process-line-sizing
description: Size and audit single-phase liquid, gas, and steam process lines using velocity, actual pipe bore, and bounded Darcy-Weisbach screening. Use for line-sizing calculations and educational diagrams, with explicit pressure and flow reference conditions.
---

# Process line sizing

Translations: [Portugues](SKILL.pt-BR.md) | [Espanol](SKILL.es.md). Keep technical nomenclature in English across all versions.

Deliver traceable preliminary sizing with units, source-backed properties, actual internal diameter, and an explicit hydraulic verification status. Read [references/method.md](references/method.md) for input schema, equations, and scope.

Use `node scripts/line-sizing.cjs input.json` from this folder for repeatable calculation. `node scripts/line-sizing.cjs --self-test` runs invariant checks. The script uses only Node built-ins and does not fetch properties.

Before calculating, distinguish actual m3/h from normal/standard m3/h and identify reference temperature, absolute pressure, and compressibility. Convert gauge pressure with the stated ambient pressure; never silently equate barg and bara. Obtain steam properties at absolute pressure and specify saturated dry vapor versus wet or superheated steam. Cite current authoritative property sources and applicable editions when making normative claims.

Calculate the minimum bore from velocity, then check user-supplied pipe candidates using their actual internal diameters and schedule. DN/NPS is a designation, not a bore. Do not call a nominal selection final without its bore and pressure-drop check. If candidates are unavailable, report the required bore and a provisional nominal suggestion only.

For a requested verification loop, run independent unit/property checks and evaluate the finite supplied candidate list once in increasing bore order (maximum 100 candidates). Recalculate after a justified correction; stop when the candidates are exhausted or the inputs are unchanged. Report the passes, corrections, unresolved inputs, and convergence criterion. Do not create an indefinite loop or recurring automation unless specifically requested.

For Darcy-Weisbach, require length, density, dynamic viscosity, roughness, fitting/valve loss coefficients, and allowable pressure loss. Missing entries mean pressure loss is unverified, not zero. Elevation, terminal pressures, acceleration, NPSH, flashing, water hammer, and compressible effects are separate checks; pressure loss alone does not establish operability. Use a suitable compressible model where density changes materially; the script's constant-density gas/steam results are screening only.

Before continuing to Pressure drop calculation or hydraulic acceptance, check which required inputs are already supplied. Ask the user for only the missing inputs in one concise question: "To continue with Pressure drop, please provide the missing values: Allowable pressure drop (bar, or a clearly defined bar/100 m criterion), Pipe length (m), Internal diameter/Pipe schedule, Density (kg/m³), Dynamic viscosity (Pa·s), Roughness (mm), and fittings/valves with Loss coefficients or sufficient specifications to determine them." Adapt the list to the actual gaps; do not ask again for documented values. Also request Elevation change and inlet/outlet Absolute pressure where needed for the operating-pressure balance or Compressible flow model. Do not invent these values or silently use zero losses. If Allowable pressure drop is unknown, ask for the project criterion or inlet/required outlet conditions to establish a pressure budget; do not adopt a generic range as an approved criterion. While awaiting inputs, provide any valid Velocity-only calculation labelled "PRELIMINARY — VELOCITY CHECK ONLY; Pressure drop unverified". Resume the hydraulic calculation when sufficient inputs arrive; do not describe the pipe selection as final before the required checks pass.

Treat velocity/pressure-drop ranges from social posts as design heuristics, not requirements. ASME B31.3 does not supply one universal sizing velocity, and API 610 should not be cited as a universal suction/discharge velocity table without a verified clause and edition. Use project criteria where available.

For images, use checked rounded values and visibly distinguish assumptions, preliminary nominal choice, and missing hydraulic checks. Show actual-flow conversion for gases and absolute pressure for steam. Never turn an unchecked infographic into engineering approval.
