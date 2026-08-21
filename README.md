> **This is site build 2026-08-21.**
> Open any page and look at the very bottom of the footer — it prints `Site build 2026-08-21`.
> If it says anything else, you are looking at an older copy: delete the old unzipped folder
> first, then unzip this one fresh. The stylesheet and the price file are linked with a
> `?v=2026-08-21` stamp, so your browser cannot serve you the previous version by mistake.

# Om's Dehlii Darbar Mithaiwala — website

A plain website. No accounts, no cart, no monthly software bill. Every "Order"
button opens WhatsApp with the sweet and its exact rate already typed in, so you
just reply with a time and an amount.

Upload the folder and it works.

---

## 1. The only file you normally touch

**`assets/js/products.js`**

Open it in Notepad, TextEdit, or the file editor in your hosting panel. Every
rate, every sweet name, every FAQ answer and the shop's own details are in that
one file. Nothing else needs opening.

### Change a price

Find the sweet. Change the number after `pricePerKg:` — no quote marks, no ₹ sign.

```js
{ "name":"Kaju Katri", ... "pricePerKg":1000, "unit":"kg", ... }
```

becomes

```js
{ "name":"Kaju Katri", ... "pricePerKg":1100, "unit":"kg", ... }
```

Save, upload. That rate now updates on the sweet's card **and** inside the
WhatsApp message the customer sends you. You never change it twice.

### Fill in a missing price

Where a sweet shows `"pricePerKg":null`, the printed menu has never carried a
rate for it. The site displays `[[price]]` in a coloured box so nobody misses it.
Put the real number in place of `null`:

```js
"pricePerKg":null       becomes       "pricePerKg":900
```

Right now that applies to **Sutarfeni, Rasgulla, Ras Malai, Badam Pista Burfi**
and **Farsan**.

### Hide a sweet that's off the counter

```js
"live":true        becomes        "live":false
```

It disappears. Change it back when it returns. Nothing is deleted.

### Rules

- Never delete a comma `,` or a curly brace `{ }`.
- Keep quote marks around words. Do **not** put them around numbers.
- If the site looks broken after an edit, you deleted a comma or a brace. Undo and retry.

---

## 2. Turn off the Rakhi banner after 28 August

In `assets/js/products.js`, near the top:

```js
const SEASON = {
  rakhiLive: true,
```

Change `true` to `false`. That one word removes the red banner, the countdown,
the Rakhi section on the home page and the Rakhi link in the menu. Everything
else stays.

**You may not need to.** The site checks the date itself. After midnight on
28 August 2026 the banner and countdown disappear on their own and the Rakhi page
says we take orders all year. Setting `rakhiLive: false` is for switching it off
earlier.

---

## 3. Re-dress it for Diwali in October

Three edits, about ten minutes:

1. **In `assets/js/products.js`** — change the season block:

   ```js
   rakhiLive: true,
   festivalDate: "2026-11-08T23:59:59+05:30",   // whatever Diwali falls on
   festivalLabel: "8 November 2026"
   ```

2. **In `build_site.py`** — search for `Rakhi` and replace with `Diwali`. The
   phrases that matter are "Fancy Rakhi Gift Hampers" (the printed menu calls
   them "Fancy Diwali Gift Hampers" for Diwali) and "Celebrate the Sweetest
   Bandhan" on the Rakhi page. Then run `python3 build_site.py`.

3. **The ornaments.** The hanging rakhi threads live in `../brand.py`, in the
   function `rakhi_drop()`. For Diwali, swap them back to hanging diyas — the
   drop positions and weights are already right, only the shape at the bottom of
   the cord changes.

The brochure re-dresses the same way: edit `LETTER_DIWALI` / `LETTER_RAKHI` in
`../menu.py`, then run `../brochure/build_brochure.py`.

---

## 4. Swap or add a photo

1. Save the photo as `.jpg`, about 800 pixels wide.
2. Name it with no spaces, in two sizes: `sutarfeni-400.jpg` and `sutarfeni-800.jpg`.
   (One size works too — just make the `-400` one.)
3. Put both in `assets/img/`.
4. In `products.js`, on that sweet's line:

   ```js
   "photo":null        becomes        "photo":"sutarfeni"
   ```

Where `photo` stays `null` the site shows a tidy "photograph needed" tile in the
shop's crimson and gold. It never shows a broken image.

**Photo advice.** One sweet, close, near a window, no flash. A tight crop of a
single piece beats a wide shot of the whole tray every time.

---

## 5. Put it online

**Netlify (free, easiest)**

1. Make an account at netlify.com.
2. Drag this whole folder onto the "drag and drop your site folder" box.
3. It is live in about ten seconds, with a web address.
4. Buy a domain and point it at the site from Netlify's Domain settings.

**Your existing hosting (cPanel, Hostinger, GoDaddy)** — open File Manager, go
into `public_html`, upload everything here keeping the folder structure exactly.

**GitHub Pages** — make a repository, upload these files, then
Settings → Pages → Deploy from branch → main.

To update later: edit the file, upload it over the old one.

### One thing to change before going live

Near the top of `build_site.py`:

```python
SITE = 'https://REPLACE-WITH-YOUR-DOMAIN'
```

Put the real web address there and run `python3 build_site.py`. This fixes the
preview card that appears when someone shares the site on WhatsApp. If you would
rather not run the script, ask whoever set the site up to do that one
find-and-replace across the eight `.html` files, `sitemap.xml` and `robots.txt`.

---

## 6. What's in the folder

```
index.html          Home
rakhi.html          Rakhi Specials — where both brochure QR codes land
assortments.html    The four assortment boxes (₹1,400 / ₹700 / ₹560 / ₹280)
sweets.html         The full counter, filterable
boxes.html          Dry Fruit Boxes & Gift Hampers, ₹700 to ₹3,000
corporate.html      Corporate & bulk gifting
story.html          Our Story
visit.html          Visit Us — map and directions
sitemap.xml         Tells Google which pages exist
robots.txt          Tells Google it may read them all
build_site.py       Only needed for the domain, a re-dress, or a layout change
assets/
  css/site.css      How it looks
  js/products.js    ← EVERYTHING YOU EDIT IS HERE
  js/site.js        How it works. You should not need to open this.
  img/              Photographs, the logo, the mandala band
  fonts/            The typefaces, stored here so the site loads fast
README.md           This file
```

---

## 7. Worth knowing

- **Nothing is stored about your customers.** No cookies, no tracking, no
  accounts, no browser storage of any kind. The corporate form sends nothing
  anywhere — it just opens WhatsApp with the details typed out.
- **Dismissing the Rakhi banner is temporary.** If a customer closes it, it comes
  back next visit. That is deliberate — nothing is remembered between visits.
- **The 12-hour and 6-hour rules are on every page**, in the footer and as a full
  block on six of the eight pages. They are the shop's strongest trust signal, so
  they are set large rather than buried.
- **"\* Fancy Boxes Charges Extra"** appears under every box and hamper price, and
  travels inside the WhatsApp message too, so nobody is surprised at the counter.
- **Google.** The site hands Google your address, hours, both numbers and the
  4.8 rating in the format it prefers. Update your Google Business Profile so the
  two agree — see the corrections list supplied with this build.
- **Speed.** The home page shows its main image in about 1.9 seconds on a
  mid-range Android on slow 4G. Keep photos under about 200 KB and it stays that way.

---

## 8. Still to be filled in

All of these live in `assets/js/products.js` and appear on the site inside
coloured boxes so you can spot them at a glance.

| What | Where |
|---|---|
| Sutarfeni price | that sweet's `pricePerKg` |
| Rasgulla / Ras Malai price | their `pricePerKg` |
| Badam Pista Burfi price | its `pricePerKg` |
| Farsan rates (none on the menu at all) | its `pricePerKg` |
| Rakhi order cut-off date | `SHOP.orderCutOff` |
| Email address | `SHOP.email` |
| Instagram / Facebook | `SHOP.instagram`, `SHOP.facebook` |
| FSSAI licence number | `SHOP.fssai` |
| GST number | `SHOP.gst` |
| Delivery areas and charges | `SHOP.deliveryAreas` |
| Corporate minimum order | `SHOP.corporateMOQ` |
| Corporate lead time | `SHOP.corporateLead` |
| The four per-piece rates marked `[[verify]]` | Kala Jamun, Gulab Jamun, Malai Chap, Gajra |
| Your web address | `SITE` in `build_site.py` |

Nothing was invented. Where a fact was not on the printed menu, the site says so
out loud rather than guessing.
