/* SAHNE 1 — HABERLER (0–10 s)  Dört iddia
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  const INK = LI.INK_RGB, AM = LI.AMBER_RGB;
  function line(ctx, p, q, a, seed, color, w = 3) { if (a > 0) Ink.path(ctx, [p, q], { w, alpha: a, seed, taper: [0, 0], color }); }
  function T(ctx, env, s, x, y, a, o = {}) { if (a > 0) F().T(ctx, s, x, y, Object.assign({ size: KD.L(env).G.s * 0.55, alpha: a, halo: true }, o)); }
  function rect(ctx, x0, y0, x1, y1, a, fill, seed) { if (a <= 0) return; ctx.fillStyle = fill; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0)); Ink.path(ctx, [[x0, y0], [x0, y1], [x1, y1], [x1, y0]], { w: 3, alpha: a, seed, taper: [0, 0] }); }
  function headline(ctx, env, s, a) { if (a <= 0) return; const R = KD.L(env).FG, cx = (R.x0 + R.x1) / 2, y = R.y1 + 6; const w = Math.min(R.x1 - R.x0, F().width(ctx, s, KD.L(env).G.s * 0.62) + 50); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fillRect(cx - w / 2, y - 28, w, 56); Ink.path(ctx, [[cx - w / 2, y - 28], [cx + w / 2, y - 28], [cx + w / 2, y + 28], [cx - w / 2, y + 28], [cx - w / 2, y - 28]], { w: 2.5, alpha: a, seed: 4500, taper: [0, 0] }); T(ctx, env, s, cx, y, a, { size: KD.L(env).G.s * 0.62 }); }
  /* S2: the bar chart with a cut axis, then the honest one */
  function bars(ctx, env, t, a) {
    if (a <= 0) return; const R = KD.L(env).FG, gx0 = R.x0 + 110, gx1 = R.x1 - 60, gy0 = R.y0 - 20, gy1 = R.y1 + 80;
    const base = lerp(46, 0, inOut(seg(t, 21.0, 23.0))), top = lerp(53, 60, inOut(seg(t, 21.0, 23.0)));
    const Y = (v) => lerp(gy0, gy1, (v - base) / (top - base));
    line(ctx, [gx0, gy0], [gx1, gy0], a, 4510); line(ctx, [gx0, gy0], [gx0, gy1 - 10], a, 4511);
    const ticks = base > 20 ? [46, 48, 50, 52] : [0, 20, 40, 60];
    ticks.forEach((v, i) => { if (v >= base - 0.01 && v <= top + 0.01) { T(ctx, env, String(v), gx0 - 30, Y(v), a * 0.85, { color: base > 20 && v === 46 ? A.amber : undefined }); line(ctx, [gx0 - 6, Y(v)], [gx0 + 6, Y(v)], a, 4512 + i); } });
    [['Pazartesi', 48, 0.3], ['Cuma', 52, 0.7]].forEach(([n, v, f], i) => { const x = lerp(gx0, gx1, f), k = seg(t, 12.0 + i * 0.5, 12.6 + i * 0.5); rect(ctx, x - 50, gy0, x + 50, lerp(gy0, Y(v), k), a, `rgba(${i ? AM : INK},${0.25 * a})`, 4520 + i); T(ctx, env, n, x, gy0 + 26, a); T(ctx, env, String(v), x, lerp(gy0, Y(v), k) - 22, a * seg(t, 16.0, 16.4), { color: A.amber }); });
    if (base > 20) { const z = a * seg(t, 18.6, 19.0) * (1 - seg(t, 20.6, 21.0)); if (z > 0) { Ink.path(ctx, [[gx0 - 12, gy0 - 14], [gx0 + 12, gy0 - 22]], { w: 3, alpha: z, seed: 4530, taper: [0, 0], color: AM }); Ink.path(ctx, [[gx0 - 12, gy0 - 24], [gx0 + 12, gy0 - 32]], { w: 3, alpha: z, seed: 4531, taper: [0, 0], color: AM }); } }
  }
  /* S3: the school of 400 and the biased sample of 20 */
  function school(ctx, env, t, a) {
    if (a <= 0) return; const R = KD.L(env).FG, nc = 25, nr = 16, cw = Math.min((R.x1 - R.x0 - 40) / nc, (R.y0 - R.y1 - 60) / nr), x0 = (R.x0 + R.x1) / 2 - cw * nc / 2, y0 = R.y1 + 40;
    const shown = seg(t, 29.2, 31.0);
    for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
      const idx = i * nc + j; if (idx / 400 > shown) continue;
      const inCourt = i >= 12 && j >= 20, rnd = ((idx * 37) % 400) < 20 && !inCourt;
      const hot = inCourt && t > 32.0, pick = rnd && t > 40.0;
      ctx.beginPath(); ctx.arc(x0 + (j + 0.5) * cw, y0 + (i + 0.5) * cw, cw * (hot || pick ? 0.34 : 0.22), 0, 7);
      ctx.fillStyle = hot ? `rgba(${AM},${a * (t > 39.6 ? 0.35 : 1)})` : pick ? `rgba(${AM},${a})` : `rgba(${INK},${a * 0.45})`; ctx.fill();
    }
    const c = a * seg(t, 32.0, 32.4); if (c > 0) { Ink.path(ctx, [[x0 + 20 * cw, y0 + 12 * cw], [x0 + 25 * cw, y0 + 12 * cw], [x0 + 25 * cw, y0 + 16 * cw], [x0 + 20 * cw, y0 + 16 * cw], [x0 + 20 * cw, y0 + 12 * cw]], { w: 3, alpha: c, seed: 4540, taper: [0, 0], color: AM }); T(ctx, env, 'basketbol sahası', x0 + 22.5 * cw, y0 + 12 * cw - 20, c, { color: A.amber }); }
    T(ctx, env, '400 öğrenci', x0 + cw * 3, y0 - 20, a * seg(t, 30.4, 30.8));
  }
  /* dot plots */
  function plot(ctx, env, D, y, lo, hi, step, a, t0, t, col, seed, name, rad = 7) {
    if (a <= 0) return; const R = KD.L(env).FG, gx0 = R.x0 + 110, gx1 = R.x1 - 20, X = (v) => lerp(gx0, gx1, (v - lo) / (hi - lo));
    line(ctx, [gx0 - 10, y], [gx1 + 10, y], a, seed); if (name) T(ctx, env, name, R.x0 + 44, y - 16, a, { color: col === AM ? A.amber : undefined });
    for (let v = lo; v <= hi; v += step) { line(ctx, [X(v), y - 6], [X(v), y + 6], a, seed + 1 + v); T(ctx, env, String(v), X(v), y + 26, a * 0.75); }
    const cnt = {}; D.forEach((v, i) => { const key = Math.round((v - lo) / ((hi - lo) / 60)); const c = (cnt[key] = (cnt[key] || 0) + 1); dot(ctx, [X(v), y - 4 - c * (rad * 2 + 3)], a * seg(t, t0 + i * 0.1, t0 + i * 0.1 + 0.3), col); });
    return X;
  }
  const PG = [20, 25, 25, 30, 30, 30, 35, 35, 40, 730];
  const RAIN = [36, 38, 40, 40, 41, 42, 42, 43, 44, 45, 46, 47], SUN = [20, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 30];
  function marker(ctx, x, y, a, seed, label, env, dy = 44) { if (a <= 0) return; Ink.path(ctx, [[x - 10, y + dy], [x, y + dy - 14], [x + 10, y + dy], [x - 10, y + dy]], { w: 3, alpha: a, seed, taper: [0, 0], color: AM }); T(ctx, env, label, x, y + dy + 26, a, { color: A.amber }); }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Okul gazetesinde dört haber'],
      [10.6, 27.8, 'Haber 1: Tost satışları katlandı!'],
      [28.4, 45.8, 'Haber 2: Öğrencilerin %90’ı maç izlemek istiyor!'],
      [46.4, 63.8, 'Haber 3: Çoğumuz haftada 100 sayfa okuyor!'],
      [64.4, 79.8, 'Haber 4: Yağmurlu günlerde kütüphane daha kalabalık'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), R = KD.L(env).FG;
    const h = a * win(t, 5.0, 10.4); if (h > 0) { const cx = (R.x0 + R.x1) / 2; ['Tost satışları katlandı!', 'Öğrencilerin %90’ı maç istiyor!', 'Çoğumuz 100 sayfa okuyor!', 'Yağmurda kütüphane dolu!'].forEach((s, i) => { const k = h * seg(t, 5.4 + i * 0.6, 5.8 + i * 0.6); if (k <= 0) return; const y = R.y1 + 40 + i * 80, w = 470; ctx.fillStyle = `rgba(${LI.PAPER_RGB},${k})`; ctx.fillRect(cx - w / 2, y - 30, w, 60); Ink.path(ctx, [[cx - w / 2, y - 30], [cx + w / 2, y - 30], [cx + w / 2, y + 30], [cx - w / 2, y + 30], [cx - w / 2, y - 30]], { w: 2.5, alpha: k, seed: 4600 + i, taper: [0, 0] }); T(ctx, env, s, cx, y, k, { size: KD.L(env).G.s * 0.6 }); }); }
    bars(ctx, env, t, a * win(t, 11.2, 27.8));
    school(ctx, env, t, a * win(t, 29.0, 45.8));
    // S4: pages read
    const a4 = a * win(t, 46.8, 63.8);
    if (a4 > 0) { const y = R.y1 + (R.y0 - R.y1) * 0.55; const X = plot(ctx, env, PG, y, 0, 750, 150, a4, 47.4, t, INK, 4700, '', 7); marker(ctx, X(100), y, a4 * seg(t, 51.0, 51.4), 4720, 'ortalama 100', env); marker(ctx, X(30), y, a4 * seg(t, 56.4, 56.8), 4721, 'ortanca 30', env, 96); const o = a4 * seg(t, 53.4, 53.8); if (o > 0) { arcAt(ctx, [X(730), y - 21], 22, 0, 2 * Math.PI, o, 4722, AM); T(ctx, env, 'uç değer', X(730), y - 64, o, { color: A.amber }); } }
    // S5: the library
    const a5 = a * win(t, 64.8, 79.8);
    if (a5 > 0) { const y1 = R.y1 + (R.y0 - R.y1) * 0.45, y2 = R.y0 - 10; const X1 = plot(ctx, env, RAIN, y1, 15, 50, 5, a5, 65.6, t, AM, 4800, 'yağmurlu', 7); const X2 = plot(ctx, env, SUN, y2, 15, 50, 5, a5, 67.0, t, INK, 4830, 'güneşli', 7); marker(ctx, X1(42), y1, a5 * seg(t, 69.0, 69.4), 4850, '42', env); marker(ctx, X2(25), y2, a5 * seg(t, 69.6, 70.0), 4851, '25', env); }
    tally(ctx, env, t, [[12.0, 27.8, 'Veri: Pazartesi 48, Cuma 52 tost'], [16.6, 27.8, '52 ÷ 48 ≈ 1,08: yalnızca %8 artış'], [18.8, 27.8, 'Eksen 46’dan başlıyor: yanıltıcı'], [23.4, 27.8, 'Karar: iddia çürütüldü ✗', true]]);
    tally(ctx, env, t, [[30.8, 45.8, 'Okulda 400 öğrenci var'], [32.4, 45.8, 'Anket: sahadaki 20 kişi, 18’i evet'], [35.6, 45.8, 'Örneklem yanlı: sadece sahadakiler'], [38.0, 45.8, 'Karar: bu veriyle kabul edilemez ✗', true]]);
    tally(ctx, env, t, [[48.2, 63.8, 'Ortalama: 1000 ÷ 10 = 100 sayfa'], [51.8, 63.8, 'Ama 9 kişi 40 sayfa ya da daha az'], [53.6, 63.8, 'Bir kişi 730 sayfa: uç değer'], [56.8, 63.8, 'Ortanca 30: "çoğumuz" yanlış ✗', true]]);
    tally(ctx, env, t, [[65.4, 79.8, 'Bir ayda 12 yağmurlu, 18 güneşli gün'], [69.2, 79.8, 'Ortalama: 42 kişi ve 25 kişi'], [71.4, 79.8, 'Dağılımlar hiç örtüşmüyor'], [73.6, 79.8, 'Karar: veri iddiayı destekliyor ✓', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Her iddiayı verisiyle sınayalım'],
      [11.4, 27.8, 'Grafik iki katı gösteriyor, sayılar ne diyor?'],
      [29.4, 45.8, 'Soruyu kimlere sordular?'],
      [47.4, 63.8, 'Ortalama her zaman "çoğunluğu" anlatmaz'],
      [65.4, 79.8, 'Bu kez veriye yakından bakalım']]);
    exprs(ctx, t, at(W, 1), [[21.0, 27.8, 'Eksen sıfırdan başlayınca fark küçücük'],
      [36.0, 45.8, 'Maçı seven zaten sahada'],
      [54.0, 63.8, 'Uç değer ortalamayı büyütüyor'],
      [71.6, 79.8, 'Yağmurlu günlerin hepsi güneşli günlerden kalabalık']]);
    exprs(ctx, t, at(W, 2), [[25.0, 27.8, 'Eksene bak: nereden başlıyor?', true], [40.4, 45.8, 'Örneklem rastgele seçilmeli', true],
      [59.6, 63.8, 'Uç değer varsa ortanca daha iyi anlatır', true], [75.8, 79.8, 'Yalnız bir ay: yine de dikkatli ol', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Eksene bak: nereden başlıyor?', 80.6], ['Örnekleme bak: kimlere soruldu?', 81.6], ['Uç değere bak: ortalama mı, ortanca mı?', 82.6], ['Veriyle kabul et ya da çürüt!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Headlines', nameTr: 'Haberler', concept: 'Four claims', conceptTr: 'Dört iddia', render });
})(window.LI = window.LI || {});
