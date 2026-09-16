# Figma 22–34 mapping and pose-guide migration to 35

## Status: mapped and prototyped

Figma access is now working through the official MCP. Inspected the full Page 1 metadata and screenshots of every numbered frame from 22 through 34: **13 frames, each 360 × 800**. No numbered frame 35 was found in the inspected document. `tela-35-guia-pose-silhueta.html` and `assets/css/telas/tela-35.css` are the existing camera pose guide relocated from repository screen 22. The new visual prototypes use `tela-22-prototype.html` through `tela-34-prototype.html`.

Source: https://www.figma.com/design/czhmT51jYwMJkgTKWwJWyO/Benchmark?node-id=550-177&m=dev

Evidence saved in `docs/figma-reference/`:
- `inventory.json`: verified Figma numbers, exact names, node IDs and dimensions.
- `frame-22.png` through `frame-34.png`: actual downloaded Figma screenshots.
- Matching `frame-N.xml`: extracted metadata from the full-page MCP result.
- Contact sheets `frames-22-25.png`, `frames-26-29.png`, `frames-30-34.png`.

Frame names in Figma are simply `tela 22`, etc.; functional names below come from visible screen content. **Routes below are proposed integration contracts inferred from controls and feature context, not verified Figma prototype connections.** Metadata/screenshot inspection does not expose those connections. Exact style tokens, editable design context, exportable component assets and hidden interaction states remain implementation prerequisites.

## Context and existing entry point

User requirement: repository `tela-11-assistente-estudo.html` precedes Figma frame 22. Preserve the existing study assistant rather than replacing it.

Current verified flow:

`08 camera-estudo -> 09 selecao-fotos-ia -> 11 assistente-estudo`

Screen 11 has a chapter card, exercise steps, AI summary and static Q&A. Its `IR` button currently returns to 08. PDF/share actions are placeholder toasts. There is no game continuation.

**Proposed integration:** add a clear study-game CTA to 11 leading to 22, carrying the selected album context. Keep `IR` and the current navigation intact unless separately approved. Do not redirect every `Diário` link globally as part of an import.

## Frame-to-repository map

All proposed HTML files are under `telas/`. No filenames below have been created or renamed by this mapping step.

| Figma frame / node | Visible feature/state | Proposed repository destination | Existing context and planned connections |
|---|---|---|---|
| 22 — `550:177` | **Estudo**: resume card, albums, source-photo storage | `tela-22-estudo.html` | New continuation after 11. Album -> 23; resume/spin -> 25 with album context. New notebook -> source capture, NOT frame 24 in attempt mode. Storage management destination is not designed here. |
| 23 — `550:1110` | **Cálculo · Capítulo 5**: four photos, six topics and generated questions | `tela-23-estudo-album.html` | New album detail after 22. Back -> 22; album roulette -> 25. Add-page -> source capture with existing album ID. Topic rows need an explicit topic-detail/practice contract. |
| 24 — `550:359` | **Tentativa 01**: photograph exercise and incomplete resolution | `tela-24-estudo-tentativa.html` | New exercise-scoped capture, not a generic notebook import. Require album + exercise + attempt + return-route context. Gallery/shutter need acquisition/review states; post-capture route is not established. |
| 25 — `550:437` | **Jogo de estudo**: six-topic roulette, streak, XP and crowns | `tela-25-estudo-roleta.html` | New game hub after 22/23 or replay from 30. Spin -> a supported question type 26/27/28; not a guaranteed linear chain. Back -> caller, preserving album. |
| 26 — `550:613` | **Limites**: multiple choice, correct answer already selected | `tela-26-estudo-quiz.html` | New question renderer/state. Next -> next session question or 30 when session ends. Close -> 25 with progress handling. Must implement unanswered/incorrect states too. |
| 27 — `550:714` | **Caça ao erro**: erroneous worked step correctly identified | `tela-27-estudo-caca-erro.html` | New question type. Same session/close/next contract as 26. Red highlights a bad mathematical step, NOT a wrong learner selection; shown feedback confirms success. |
| 28 — `550:813` | **Complete a expressão**: correctly filled ordered tokens | `tela-28-estudo-completar-expressao.html` | New token question type. Same session contract. Implement selection, undo, incomplete and incorrect states; screenshot is completed, not initial. |
| 29 — `550:911` | **Quadro fragmentado**: investigation 1 of 2; 0/3 photos placed | `tela-29-estudo-quadro-fragmentado.html` | New investigation activity, related to study. Entry from game/album is a proposal pending confirmation. Verify only after three placements; correct order, second investigation and completion destination are unspecified. Do not treat this as automatically following 28. |
| 30 — `550:1059` | **Reward**: +35, crown completion, combo, streak, XP | `tela-30-estudo-resultado.html` | New end-of-session state. Replay -> 25; add-page -> source capture preserving album. Award once per completed session, not on reload/back. |
| 31 — `550:1638` | **Farol activation simulation**, lock-screen appearance, 3× volume | `tela-31-modo-farol-ativacao.html` | Same feature as existing 20. Proposed canonical destination from 32; simulated activation -> 33 via an explicitly labelled recipient-view demo. This is not a study or sleep screen. |
| 32 — `553:1749` | **Modo Farol** configuration: gestures and trusted recipients | `tela-32-modo-farol-configurar.html` | Same feature as existing 19. Settings 17 -> 32; simulate -> 31; back -> 17. Existing 19 has extra contact/test/transmission controls; review before removing them. |
| 33 — `553:2032` | **Alerta do Farol**, recipient perspective, live status, location, help | `tela-33-modo-farol-contato.html` | Same feature as existing 21. Recipient-view simulation after 31, NOT a normal next page on the sender's phone. Live/map/emergency/dismiss actions need safe demo contracts. |
| 34 — `553:1846` | **Modo Blindagem**, boleto preview with safe-result banner | `tela-34-modo-blindagem.html` | Same feature as existing 18. Settings 17 -> 34. Preserve Boleto/Pix/Anúncio/QR switching and scan feedback; image shows only one result state. |
| Repository 22 -> 35, **not a Figma frame** | **Guia de pose / silhueta**, existing Lacar camera flow | `tela-35-guia-pose-silhueta.html` | User-approved numbering change, not yet applied. Camera 13 thumbnails -> 35 with `?pose=0/1/2`; close/change-pose -> 13. Independent of all study routes. |

### Proposed domain routes

```text
STUDY
08 -> 09 -> 11 -> 22
                 22 -> 23 -> 25 -> question session (26 / 27 / 28) -> 30
                 22 -------> 25 <--------------------------------- 30
                 new/add-page -> SOURCE capture (reuse 08/09 with album context)
                 exercise attempt -> 24 -> review/return [needs definition]
                 investigation -> 29 -> investigation 2/result [needs definition]

SAFETY (not part of the study sequence)
17 -> 32 configure -> 31 simulate activation -> 33 recipient-view demo
17 -> 34 blindagem

CAMERA
13 -> 35 pose guide -> 13
```

For safety counterparts, proposed canonical numbering is Figma 31–34. If accepted at implementation, migrate/reuse the existing functionality and update inbound links; retain compatibility redirects from legacy 20/19/21/18 where needed. **Do not maintain two independently implemented versions of each feature.** The user has only explicitly approved the pose guide's 22 -> 35 numbering so far; safety route migration is a proposal.

## Pose guide: exact migration scope

1. Rename `telas/tela-22-guia-pose-silhueta.html` -> `telas/tela-35-guia-pose-silhueta.html`.
2. Rename its dedicated `assets/css/telas/tela-22.css` -> `assets/css/telas/tela-35.css`.
3. Update the guide stylesheet href, numbered comments, CSS heading and the three thumbnail onclick URLs in `tela-13-camera.html`, preserving the exact `?pose=0`, `?pose=1`, `?pose=2` values. Update the camera comment that refers to this guide.
4. Keep `assets/js/pose-guide.js`, contour SVG assets, voice preference `jovi-voice-guide` and return links to camera 13 unchanged.
5. Add screen 35 to `index.html`; the guide is currently absent from the screen catalog.
6. Check selected pose on entry, switching pose, voice caption preference and return navigation in a browser.

Do NOT globally replace `tela-22`: `.tela-22`, `assets/css/larii/tela22.css` and `assets/js/tela22.js` are also legacy identifiers for Modo Blindagem. They are unrelated to the pose-guide rename.

## Problems found before import

### Routing / source context

- **Frame 24 is the wrong default source-capture destination.** It asks `O que você tentou até aqui?` and labels the image `Tentativa 01`. New notebook, add-page and exercise-attempt capture must have distinct intent and save destinations, even if they share a camera component.
- **Screen order is not navigation order.** Study home can go directly to roulette. Farol config 32 naturally precedes lock-screen simulation 31. Screens 31–34 must not be appended to a study completion chain.
- **Photo provenance conflicts:** frame 23 assigns Teorema fundamental to Foto 2; frame 28 shows Foto 4 for that topic. The notebook-attempt image appears as the fourth album thumbnail in frame 23, while frame 27 calls its notebook source Foto 2. Define stable photo IDs and correct captions/topic associations before sharing state.
- **Existing album fixture differs:** repository 11 says `3 fotos`; the new calculus album says four pages. Choose one coherent demo album dataset across the existing assistant and new pages. Do not silently change source counts during navigation.

### Gamification / interaction

- **Crown semantics are inconsistent/unclear.** Frame 22 shows three crown slots at album level; 23 shows three per topic; 25 reports `2 de 6` crowns and single crown markers for two topics. Define whether mini-crowns are steps toward one completed-topic crown and reconcile all totals.
- **Shown question states are post-answer states.** Frames 26–28 require unanswered, selection, incorrect, feedback and next-button handling. A static import of the selected answers is not a working quiz.
- **Frame 29 is incomplete as a flow.** It shows investigation 1 of 2, no placements and a disabled-looking verify button. No second investigation or solved/error screenshot was found among 22–34. Define order, validation, undo and completion.
- **Reward state must be data-driven.** Frame 25 shows 240 XP and frame 30 also shows 240 XP alongside a +35 reward. These may be illustrative snapshots, but they cannot be assumed to be a consistent sequential session. Define reward timing and idempotency instead of hardcoding every screen.
- **Resume meaning is unclear:** frame 22 says continue where you stopped but offers a new spin. Decide whether unfinished questions/attempts resume directly.
- **Wheel center and footer both say spin.** If both are interactive, use one handler and shared disabled/spinning state.
- **Source deletion removes topics per frame 23 copy.** Specify what happens to generated questions, session resume, crowns and history; do not discard earned progress accidentally.
- Album topic rows, source thumbnails and `Gerenciar` have visible affordances without mapped detail/manage frames. They need actual targets or explicit demo behaviour.

### Styling / assets / layout

- Reuse the study assistant's Lacar shell, `assets/css/tokens.css`, `assets/css/lacar-componentes.css` and `assets/js/theme.js`; add feature-scoped study components rather than replacing global CSS.
- Historical filenames are misleading: study HTML 11 loads `tela-13.css`; camera HTML 13 loads `tela-16.css`. Farol HTML 19/20/21 uses legacy 23/24/25 styles/scripts. **Do not create study `tela-23.css`, `tela-24.css`, `tela-25.css` over the existing safety files.** Prefer names such as `estudo-componentes.css`, `estudo-roleta.css`, `estudo-quiz.js`.
- Several metadata layer names explicitly say to change fonts to JOVI Sans CN Demibold/Bold. Treat them as unresolved design annotations, not proof the visible font is already correct. Actual font exports/tokens need design-context review.
- All inspected new frames are 360×800; no separately named dark variants for 22–34 were found. Most study/configuration screenshots are light; activation/recipient are dark and Blindagem is camera-over-media. Do not invent dark-mode fidelity; define theme behaviour deliberately.
- Frame 22 storage content extends below its content viewport; frame 25's topic list extends behind the fixed action area. Implement intentional scrolling and adequate bottom padding. Avoid copying all absolute coordinates into rigid layouts.
- Screenshots are references, not runtime background substitutes. Export/reuse the board crops, notebook attempt, source thumbnails, roulette sectors, crowns and icons as actual assets. Fine-grained asset exports and exact token values have not been collected yet.

### Safety feature constraints / existing behaviour

- Figma 32 is visually simpler than existing 19: current page includes `Testar gesto`, add-contact and camera/audio/location switches. A straight replacement would remove capabilities; reconcile scope first.
- Existing Farol gesture/contact JS changes visual classes without persisting the configuration. A shared demo state must carry the selected gesture and recipients into activation. Frame 31 only depicts volume3; define other selected gestures rather than ignoring them.
- A static web prototype cannot promise working locked-phone hardware gestures, silent background camera/audio streaming or actual trusted-contact alert delivery. Label simulations; real implementations require platform APIs, permissions and backend work.
- Keep recipient and sender roles distinct. Do not auto-call 190 or transmit camera/audio during tests; use safe simulated actions unless an explicitly authorised real integration is added.
- Blindagem uses preset per-target verdicts and a timed scan animation (`assets/js/tela22.js`), not actual fraud detection. `Nenhum risco encontrado` is a depicted demo result, not a guarantee a real payment is safe.
- Current camera 13 and pose guide shutter route to the lecture/media viewer 15. That existing semantic mismatch is separate from moving pose guide to 35; do not claim the camera save/review flow is complete just because its target exists.

## Proposed implementation contracts

- **Album/source state:** stable album ID, source-photo IDs, topic/source relationships, generated-question IDs; distinguish `new-album`, `add-page`, `exercise-attempt` intents and return routes.
- **Session state:** session ID, album ID, selected topic, question type/index, responses, feedback state, combo, earned rewards and completion flag. Share one question bank and rules across 25–30.
- **Attempt state:** exercise ID, attempt number, source/photo capture, acquisition/review/error state and return destination.
- **Investigation state:** fragment IDs, chosen order, validated expected sequence, investigation index and completion rule; no guessed correct order.
- **Safety demo state:** enabled flag, chosen gesture, selected recipients, transmission settings, activation simulation and recipient-view mode. No real alerts/calls in smoke tests.
- **Migration:** preserve old inbound URLs with deliberate redirects/aliases when safety route renumbering is approved; avoid global number replacements or duplicate feature implementations.

## Readiness / remaining gates

Completed:
- Read-only Figma access; page-wide frame discovery and complete 22–34 screenshot inventory.
- Functional mapping of study, safety and camera domains to existing repository entry points.
- Recorded user-directed pose 22 -> 35 migration and identified its dependent URLs/CSS.
- Saved evidence and issues; existing application files left unchanged during mapping.

Before coding/import:
- Confirm the proposed canonical safety migration and unresolved study edges (attempt capture, investigation, source management).
- Resolve shared demo data, provenance, crowns/reward timing and missing states.
- Load Figma design-to-code guidance and `get_design_context` per implementation frame; obtain actual assets, tokens and editable layout details. Preserve the project's HTML/CSS/Bootstrap stack rather than pasting generated React/Tailwind.

Before claiming implementation complete:
- Validate all HTML/CSS/JS local resources, inline navigation and JS-assigned URLs.
- Test new/add-page/attempt intents, back/close/reload, question types and rewards without duplication.
- Regression-test 08 -> 09 -> 11, camera 13 -> 35 pose choices/voice state, and legacy safety links.
- Render at 360×800, inspect scroll/sticky controls, applicable themes, keyboard/focus states and console/network failures.
- Compare every implemented state against saved Figma evidence; clearly label demo-only AI/camera/safety behaviour.

Completed in this prototype pass:
- Added screenshot-backed interactive prototype pages `tela-22-prototype.html` through `tela-34-prototype.html`.
- Added shared hotspot routing for the study story and safety story.
- Added the 11 -> 22 study entry action and catalog links for 22–35.
- Relocated the camera pose guide from 22 to 35 and updated its inbound links.
- Stored durable 360×800 Figma references in `assets/img/figma-reference/`; source evidence remains in `docs/figma-reference/`.
- Verified prototype route/resource tests, JavaScript syntax, static local references and HTTP serving for every prototype page.

The new prototype pages use the downloaded Figma frame images as exact visual surfaces plus transparent HTML hotspots. They are a navigable visual prototype, not yet a native component-by-component reconstruction. No Figma document was modified and no git commit was created.
