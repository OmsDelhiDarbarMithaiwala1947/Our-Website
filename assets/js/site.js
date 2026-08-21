/* ==========================================================================
   OM'S DEHLII DARBAR MITHAIWALA — site behaviour
   Vanilla JS. No framework, no build step, no browser storage of any kind.
   All content lives in products.js — you should never need to edit this file.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var isTBC = function (v) { return String(v).indexOf('[[') !== -1; };
  var inr   = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
  var phFmt = function (t) { return esc(t).replace(/\[\[([^\]]+)\]\]/g, '<span class="ph-note">[[$1]]</span>'); };

  /* ── THE WHATSAPP PRE-FILL — the core mechanic of the whole site ────────── */
  function waLink(item, extra) {
    var msg = "Hello Om's Dehlii Darbar! I'd like to order: *" + item + "*.";
    if (extra) { msg += ' ' + extra; }
    msg += ' Delivery area: ____';
    return 'https://wa.me/' + SHOP.whatsapp + '?text=' + encodeURIComponent(msg);
  }
  function attr(u) { return u.replace(/&/g, '&amp;'); }

  /* every kind of card builds its own item string */
  function productItem(p) {
    if (p.pricePerKg == null) { return p.name; }
    if (p.unit === 'piece')   { return p.name + ' — ' + inr(p.pricePerKg) + ' per piece'; }
    return p.name + ' — ' + inr(p.pricePerKg) + ' per kg';
  }
  function productWa(p) {
    return waLink(productItem(p), p.pricePerKg == null ? 'Please tell me the price.' : '');
  }
  var BOXNOTE = 'I understand fancy box charges are extra.';

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
    call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h3l2-2h8l2 2h3v11H3z"/><circle cx="12" cy="13" r="3.4"/></svg>'
  };

  var imgSeen = 0;
  function picture(slug, alt, sizes, label) {
    if (!slug) {
      /* No photograph for this sweet yet. Rather than a hole in the grid we set the
         shop's own mandala on cream. Add a photo in products.js and it replaces this. */
      /* two medallion designs, alternating, so a grid of them does not tile flat */
      imgSeen++;
      var med = (imgSeen % 2) ? 'medallion-b' : 'medallion';
      return '<div class="noimg"><img class="nomed" src="assets/img/' + med + '.svg" alt="" ' +
             'aria-hidden="true" width="96" height="96" loading="lazy" decoding="async">' +
             (label ? '<span class="nodev">' + esc(label) + '</span>' : '') + '</div>';
    }
    imgSeen++;
    var eager = imgSeen === 1;  /* the LCP candidate only */
    var s = sizes || '(min-width:1100px) 260px, (min-width:600px) 45vw, 92vw';
    return '<picture>' +
      '<source type="image/webp" sizes="' + s + '" srcset="assets/img/' + slug + '-400.webp 400w, assets/img/' + slug + '-800.webp 800w">' +
      '<img src="assets/img/' + slug + '-400.jpg" sizes="' + s + '" srcset="assets/img/' + slug + '-400.jpg 400w, assets/img/' + slug + '-800.jpg 800w" ' +
      'width="400" height="300" loading="' + (eager ? 'eager' : 'lazy') + '" ' +
      (imgSeen === 1 ? 'fetchpriority="high" ' : '') + 'decoding="async" alt="' + esc(alt) + '">' +
      '</picture>';
  }

  /* ── STOREFRONT PRODUCT CARD (square photo, weight, price, order) ──────── */
  function pcard(p) {
    var wt = p.unit === 'piece' ? 'Sold by the piece'
           : (p.weightOptions && p.weightOptions.length ? p.weightOptions.join(' · ') : 'Per kg');
    var price, sub;
    if (p.pricePerKg == null) {
      price = '<span class="ph-note">[[price]]</span>'; sub = 'Ask on WhatsApp';
    } else {
      price = inr(p.pricePerKg); sub = p.unit === 'piece' ? 'per piece' : 'per kg';
      if (p.verify) { sub += ' · [[verify]]'; }
    }
    var flag = p.flag ? '<span class="ribbonflag' + (p.flag === 'Signature' ? ' hot' : '') + '">' +
               esc(p.flag) + '</span>' : '';
    return '<article class="pcard" data-cat="' + p.category + '">' + flag +
      '<div class="pimg">' + picture(p.photo, p.name + ' — ' + p.desc, '(min-width:900px) 260px, 46vw', p.nameHi) + '</div>' +
      '<div class="pbd"><h3>' + esc(p.name) + '</h3>' +
        '<div class="deva">' + esc(p.nameHi) + '</div>' +
        '<div class="wt">' + esc(wt) + (p.shelfLifeHours ? ' · eat within ' + p.shelfLifeHours + ' hrs' : '') + '</div></div>' +
      '<div class="pfoot"><div class="ppr">' + price + '<small>' +
        sub.replace('[[verify]]', '<span class="ph-note">[[verify]]</span>') + '</small></div>' +
        '<a class="padd" href="' + attr(productWa(p)) + '" rel="noopener" aria-label="Order ' + esc(p.name) +
        ' on WhatsApp">' + ICON.wa + 'Order</a></div>' +
    '</article>';
  }

  /* ── CATEGORY TILE ──────────────────────────────────────────────────────── */
  function catTile(c) {
    var pic = c.photo
      ? '<img src="assets/img/' + c.photo + '-400.jpg" width="400" height="400" loading="lazy" decoding="async" alt="">'
      : '<div class="noimg" style="display:flex;align-items:center;justify-content:center;color:#F0C86A">' + ICON.camera + '</div>';
    return '<a class="cat" href="' + c.href + '"><div class="disc">' + pic + '</div>' +
      '<b>' + esc(c.label) + '</b><span>' + esc(c.note) + '</span></a>';
  }

  /* ── SWEET CARD ─────────────────────────────────────────────────────────── */
  function sweetCard(p) {
    var tags = (p.allergens || []).map(function (t) {
      var label = { nuts: 'Contains nuts', dairy: 'Contains dairy', varq: 'Silver varq', wheat: 'Contains wheat' }[t] || t;
      return '<span class="chip ' + t + '">' + label + '</span>';
    }).join('');
    var shelf = p.shelfLifeHours
      ? '<span class="chip fresh">Eat within ' + p.shelfLifeHours + ' hours</span>'
      : '';
    var price;
    if (p.pricePerKg == null) {
      price = '<div class="price"><span class="ph-note">[[price]]</span>' +
              '<span class="u">' + esc(p.priceNote || 'Ask us on WhatsApp') + '</span></div>';
    } else {
      price = '<div class="price">' + inr(p.pricePerKg) +
              '<span class="u">' + (p.unit === 'piece' ? 'per piece' + (p.verify ? ' · [[verify]]' : '') : 'per kg') + '</span></div>';
      if (p.verify) { price = price.replace('[[verify]]', '<span class="ph-note">[[verify]]</span>'); }
    }
    return '<article class="card" data-cat="' + p.category + '">' +
      '<div class="ph">' + (p.flag ? '<span class="flag">' + esc(p.flag) + '</span>' : '') +
        picture(p.photo, p.name + ' — ' + p.desc, null, p.nameHi) + '</div>' +
      '<div class="bd"><h3>' + esc(p.name) + '</h3>' +
        '<div class="deva">' + esc(p.nameHi) + '</div>' +
        '<p class="desc">' + esc(p.desc) + '</p>' +
        '<div class="meta">' + tags + shelf + '</div></div>' +
      '<div class="foot">' + price +
        '<a class="btn btn-wa" href="' + attr(productWa(p)) + '" rel="noopener">' + ICON.wa +
        'Order<span class="sr-only"> ' + esc(p.name) + '</span></a></div>' +
    '</article>';
  }

  /* ── ASSORTMENT BAND CARD ───────────────────────────────────────────────── */
  function bandCard(b, i) {
    return '<article class="band c' + i + '" id="' + b.id + '">' +
      '<div class="bh"><h3>' + esc(b.name) + '</h3>' +
        '<div class="bp">' + inr(b.pricePerKg) + ' <small>per kg</small></div>' +
        '<p class="pitch">' + esc(b.pitch) + '</p></div>' +
      '<ul>' + b.contents.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
      '<div class="act"><a class="btn btn-block" href="' +
        attr(waLink(b.name + ' — ' + inr(b.pricePerKg) + ' per kg')) + '" rel="noopener">' +
        ICON.wa + 'Order this box</a></div></article>';
  }

  /* ── BOX / HAMPER LADDER ────────────────────────────────────────────────── */
  function ladder(title, rows, kind) {
    var body = rows.map(function (r) {
      var item = (kind === 'hamper' ? 'Fancy Rakhi Gift Hamper, ' : '') + r.name +
                 (r.weight && r.weight !== '—' ? ' — ' + r.weight : '') + ' (' + inr(r.price) + ')';
      return '<div class="row"><span class="nm">' + esc(r.name) +
        (r.weight && r.weight !== '—' ? '<span class="lwt">' + esc(r.weight) + '</span>' : '') + '</span>' +
        '<span class="dots"></span><span class="pr">' + inr(r.price) + '</span>' +
        '<a class="btn btn-wa lbtn" href="' +
        attr(waLink(item, BOXNOTE)) + '" rel="noopener" aria-label="Order ' + esc(r.name) +
        '">' + ICON.wa + '<span class="btxt">Order</span></a></div>';
    }).join('');
    return '<div class="ladder"><div class="lh">' + esc(title) + '</div>' +
      '<div class="lb">' + body + '</div>' +
      '<div class="extra">* Fancy Boxes Charges Extra</div></div>';
  }

  /* ── RENDERERS ──────────────────────────────────────────────────────────── */
  function renderCatalogue() {
    var host = $('#catalogue'); if (!host) { return; }
    var live = PRODUCTS.filter(function (p) { return p.live !== false; });
    var bar = $('#filters'), countEl = $('#result-count');
    if (bar) {
      bar.innerHTML = CATEGORIES.map(function (c, i) {
        return '<button type="button" data-cat="' + c.id + '" aria-pressed="' + (i === 0) + '">' + esc(c.label) + '</button>';
      }).join('');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) { return; }
        $$('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        draw(b.dataset.cat);
      });
    }
    function draw(cat) {
      var list = (!cat || cat === 'all') ? live : live.filter(function (p) { return p.category === cat; });
      host.innerHTML = list.map(pcard).join('');
      if (countEl) {
        var label = (CATEGORIES.filter(function (c) { return c.id === cat; })[0] || {}).label;
        countEl.textContent = list.length + (list.length === 1 ? ' sweet' : ' sweets') +
          (cat && cat !== 'all' ? ' in ' + label : ' on the counter');
      }
    }
    draw('all');
  }

  function renderBands() {
    $$('[data-bands]').forEach(function (h) { h.innerHTML = BANDS.map(bandCard).join(''); });
  }
  function renderHampers() {
    $$('[data-hampers]').forEach(function (h) {
      h.innerHTML = ladder('Fancy Rakhi Gift Hampers', HAMPERS, 'hamper');
    });
  }
  function renderBoxes() {
    $$('[data-boxes]').forEach(function (h) { h.innerHTML = ladder('Dry Fruit Boxes', BOXES, 'box'); });
  }
  function renderCats() {
    var host = $('#cattiles'); if (!host) { return; }
    host.innerHTML = [
      { label:'Assortment Boxes', note:'from ₹280/kg', href:'assortments.html', photo:'assorted-tray' },
      { label:'Dry Fruit Sweets', note:'from ₹1,000/kg', href:'sweets.html', photo:'tarbuj' },
      { label:'Milk & Mawa',      note:'from ₹560/kg', href:'sweets.html', photo:'tiranga-barfi' },
      { label:'Milk & Mawa Peda', note:'from ₹500/kg', href:'sweets.html', photo:'assorted-varq' },
      { label:'Gift Hampers',     note:'₹1,400–₹3,000', href:'boxes.html', photo:'assorted-hamper' },
      { label:'Bengali Sweets',   note:'₹40 a piece',  href:'sweets.html', photo:'chandrakala' }
    ].map(catTile).join('');
  }

  function renderRow(id, ids) {
    var host = $(id); if (!host) { return; }
    host.innerHTML = ids.map(function (x) {
      return PRODUCTS.filter(function (p) { return p.id === x; })[0];
    }).filter(Boolean).map(pcard).join('');
  }

  function renderBest() {
    var host = $('#bestsellers'); if (!host) { return; }
    var order = ['sutarfeni', 'tarbuj', 'kaju-katri', 'anarkali',
                 'tiranga-barfi', 'kaju-pista-roll', 'anjeer-katri', 'malai-chap'];
    host.innerHTML = order.map(function (id) {
      return PRODUCTS.filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean).map(pcard).join('');
  }
  function renderFaq() {
    var host = $('#faq'); if (!host) { return; }
    host.innerHTML = FAQS.map(function (f) {
      return '<details><summary>' + esc(f.q) + '</summary><p>' + phFmt(f.a) + '</p></details>';
    }).join('');
  }

  /* ── SHOP DETAILS ───────────────────────────────────────────────────────── */
  function fillShop() {
    var pretty = function (n) { return n.replace(/^(\d{5})(\d{5})$/, '$1 $2'); };
    var map = {
      'shop-name': SHOP.name,
      'shop-address': SHOP.addr1 + ', ' + SHOP.addr2,
      'shop-hours': SHOP.hours,
      'shop-landmark': SHOP.landmark,
      'shop-rating': SHOP.rating,
      'shop-reviews': SHOP.reviews
    };
    Object.keys(map).forEach(function (k) {
      $$('[data-shop="' + k + '"]').forEach(function (el) { el.textContent = map[k]; });
    });
    $$('[data-phones]').forEach(function (el) {
      el.innerHTML = SHOP.phones.map(function (n) {
        return '<a href="tel:+91' + n + '">' + pretty(n) + '</a>';
      }).join('<span aria-hidden="true"> · </span>');
    });
    $$('[data-href="tel"]').forEach(function (a) { a.href = 'tel:+91' + SHOP.whatsapp.slice(2); });
    $$('[data-href="maps"]').forEach(function (a) { a.href = SHOP.maps; });
    $$('[data-href="wa"]').forEach(function (a) {
      a.href = waLink(a.dataset.waItem || 'a Fancy Rakhi Gift Hamper', a.dataset.waExtra || '');
    });
    $$('[data-ph]').forEach(function (el) {
      var k = el.dataset.ph, v = SHOP[k];
      if (isTBC(v)) { el.innerHTML = '<span class="ph-note">' + esc(v) + '</span>'; return; }
      if (k === 'email') {
        el.innerHTML = '<a href="mailto:' + esc(v) + '">' + esc(v) + '</a>';
      } else if (k === 'instagram') {
        el.innerHTML = '<a href="' + esc(v) + '" rel="noopener" target="_blank">@omsddm</a>';
      } else { el.textContent = v; }
    });
  }

  /* ── SEASON BANNER + COUNTDOWN ──────────────────────────────────────────── */
  function season() {
    var target = new Date(SEASON.festivalDate).getTime();
    var passed = Date.now() > target;
    var on = SEASON.rakhiLive && !passed;

    var banner = $('#season-banner');
    if (banner) {
      if (!on) { banner.remove(); }
      else {
        var x = $('.x', banner);
        /* dismissal is held in memory only — nothing is written to the browser */
        if (x) { x.addEventListener('click', function () { banner.remove(); }); }
      }
    }
    if (!on) { $$('[data-season-only]').forEach(function (el) { el.remove(); }); }

    var cd = $('#countdown');
    if (cd) {
      if (passed) {
        cd.outerHTML = '<p class="desc" style="margin-top:16px">Rakshabandhan ' + esc(SEASON.festivalLabel) +
          ' has passed. We make hampers and gift boxes all year — message us and we will put one together.</p>';
        return;
      }
      var tick = function () {
        var d = Math.max(0, target - Date.now());
        cd.innerHTML =
          '<div class="cd"><b>' + Math.floor(d / 864e5) + '</b><span>Days</span></div>' +
          '<div class="cd"><b>' + Math.floor(d % 864e5 / 36e5) + '</b><span>Hours</span></div>' +
          '<div class="cd"><b>' + Math.floor(d % 36e5 / 6e4) + '</b><span>Minutes</span></div>';
      };
      tick(); setInterval(tick, 30000);
    }
  }

  function nav() {
    var btn = $('#navbtn'), menu = $('#nav');
    if (btn && menu) {
      btn.addEventListener('click', function () {
        btn.setAttribute('aria-expanded', String(menu.classList.toggle('open')));
      });
    }
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('#nav a').forEach(function (a) {
      if (a.getAttribute('href') === here) { a.setAttribute('aria-current', 'page'); }
    });
  }

  function corporateForm() {
    var f = $('#corp-form'); if (!f) { return; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { return (f.elements[n] && f.elements[n].value || '').trim(); };
      var lines = ["Hello Om's Dehlii Darbar! Corporate gifting enquiry.",
        'Company: ' + (g('company') || '—'), 'Name: ' + (g('name') || '—'),
        'Item: ' + (g('item') || '—'), 'Quantity: ' + (g('qty') || '—'),
        'Needed by: ' + (g('date') || '—'), 'Delivery area: ' + (g('area') || '—')];
      if (g('notes')) { lines.push('Notes: ' + g('notes')); }
      lines.push('(I understand fancy box charges are extra.)');
      window.open('https://wa.me/' + SHOP.whatsapp + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  }

  /* ── Product JSON-LD — only for items with a real printed rate ──────────── */
  function productSchema() {
    if (!$('#catalogue')) { return; }
    var items = PRODUCTS.filter(function (p) { return p.live !== false && p.pricePerKg != null && !p.verify; })
      .map(function (p) {
        return {
          '@context': 'https://schema.org', '@type': 'Product',
          name: p.name, description: p.desc, category: p.category,
          brand: { '@type': 'Brand', name: SHOP.name },
          offers: {
            '@type': 'Offer', priceCurrency: 'INR', price: p.pricePerKg,
            availability: 'https://schema.org/InStock',
            eligibleQuantity: { '@type': 'QuantitativeValue',
              value: 1, unitCode: p.unit === 'piece' ? 'H87' : 'KGM' },
            seller: { '@type': 'Bakery', name: SHOP.name }
          }
        };
      });
    if (!items.length) { return; }
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(items);
    document.head.appendChild(s);
  }

  function init() {
    nav(); fillShop(); season();
    renderCats(); renderBands(); renderHampers(); renderBoxes(); renderBest();
    renderRow('#row-dryfruit', ['kesar-katri','anjeer-sugarfree','pakeeza-dryfruit','khajur-sugarfree']);
    renderCatalogue(); renderFaq();
    corporateForm(); productSchema();
  }
  var booted = false;
  function boot() { if (booted) { return; } booted = true; init(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }   /* deferred scripts land here: DOM is parsed, nothing painted yet */
})();
