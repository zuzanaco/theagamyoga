# Gallery and tablet follow-up QA

Implemented locally on 10 November 2026. No push or deployment.

## Layout

- Phones below 700px: identical 4:5 image frames, each 84vw wide, with a 16px gap and a next-slide peek. Fill-positioned images use `object-fit: cover`; source ratios cannot set frame height.
- Tablets 700–1023px: identical 3:4 frames, each 42vw wide. Two substantial images are visible. The 744/768px iPad Mini portrait belongs to this layout, as do 768/820px iPads.
- Desktop from 1024px: existing gallery width `clamp(13rem,24vw,18rem)`, 3:4 ratio, crops and arrow placement are unchanged. Mini landscape at 1133×744 uses this layout.
- Default crop is centered. The side-plank photo uses 58% horizontal positioning to favor the body/face; the portrait group-class photo uses 72% vertical positioning to favor the participants over the ceiling. These adjustments apply only below 1024px. Cropping preserves proportions; some peripheral parts of wide photos fall outside portrait frames.
- No image files, order, captions, approved copy, or gallery loop/scroll functions changed. Next Image `sizes` now matches the phone/tablet frame widths.

## Global breakpoint changes

Previously shared phone/tablet styles ended at 860px, and the narrow-phone overrides ended at 560px. Shared touch-friendly styles now end at 1023px, with explicit tablet composition beginning at 700px and phone overrides ending at 699px.

Tablet hero/About and contact have two columns; principle cards have three; offerings and reviews show two substantial cards. Calendar remains full-width with details below and restores two agenda previews plus the remaining-event summary per day. Phones retain compact markers and stacked sections. Tablet navigation keeps the accessible drawer; its resize cleanup now activates at 1024px. The enquiry form keeps two field columns on tablets and one on phones. Offering adaptive height is phone-only so two tablet cards cannot clip one another. Decorative rings remain static through tablet widths. Water-specific preview styles remain preserved.

## Browser QA

English and German measured at 320, 375, 390, 430, 744, 768, 820, 1024, 1133 and 1280px. Also checked the 699/700px transition. Every width has uniform gallery frame dimensions, `cover` images, no stretched images or empty contain bands, no overflowing primary titles/Tamil/contact links/calendar, and no page-level horizontal overflow.

| Width | Gallery frame (rounded px) | Layout |
| --- | --- | --- |
| 320 | 269×336 | Phone, 4:5 |
| 375 | 315×394 | Phone, 4:5 |
| 390 | 328×409 | Phone, 4:5 |
| 430 | 361×451 | Phone, 4:5 |
| 744 | 312×417 | Tablet, 3:4 |
| 768 | 323×430 | Tablet, 3:4 |
| 820 | 344×459 | Tablet, 3:4 |
| 1024 | 246×328 | Desktop, 3:4 |
| 1133 | 272×363 | Desktop, 3:4 |
| 1280 | 288×384 | Desktop, 3:4 |

Gallery arrows and native horizontal scrolling work. Tablet menu scroll lock and cleanup on desktop resize work. Offerings next control works with two cards and no forced viewport height. Tablet calendar selects a three-event day and displays two previews plus `+1 more`. Review dialog opens/closes inside the viewport. Enquiry panel fits all measured widths with a 44px close control; tablet fields use two columns. No real enquiry was sent.

Viewport emulation and native browser horizontal scrolling were used; physical iPad/iOS touch-swipe testing was not available.
