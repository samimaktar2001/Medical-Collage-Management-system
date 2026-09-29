# Selected website design QA

Source visual truth: `docs/website-audit/selected-option-1.png` (copy of first displayed Image Gen result `exec-51af411b-6247-488f-a039-70848329fd0d.png`).

Implementation: `/institution`. State: current approved English notices, anonymous visitor, all categories.

Source image dimensions and target CSS viewport: to be recorded during the matched visual comparison. Implementation screenshot: not yet captured after the changes.

Full-view and focused-region comparisons: pending. No visual fidelity pass can be inferred from source code or compilation.

Required surfaces — typography, spacing/layout rhythm, colors/tokens, image quality and copy/content — need comparison against the live rendered page. Generated campus asset inspected independently; it is labelled illustrative and is not evidence of a real facility.

Intentional product constraints: admission stage is 'Not yet announced' rather than the image's fictional scheduled stage; no cycle is configured. Department links reflect the two demonstration departments instead of inventing a full clinical directory. Forms link is named 'Forms & service requests' because a public application builder is not shipped.

Blocking issue: browser policy rejected the stale connection-error tab after server restart. No browser workaround attempted. User asked to reopen `http://localhost:3000/institution`. Need desktop and phone captures, keyboard/menu/filter/search/detail interaction checks, console inspection, and side-by-side full and focused visual comparisons. Any P0/P1/P2 findings must be fixed and recaptured.

Comparison history: baseline captured before changes. Post-change comparison not yet available.

final result: blocked
