/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Dört haber', en: 'Four headlines',
      note: 'Okul gazetesinde verilere dayanan dört haber var. Her iddiayı verisiyle sınayalım.' },
    { scene: 2, start: 10.8, end: 19.2, tr: 'Katlandı mı?', en: 'Doubled?',
      note: 'Grafikte Cuma sütunu Pazartesinin iki katı gibi. Oysa sayılar 48 ve 52: yalnızca yüzde 8 artış.' },
    { scene: 2, start: 19.4, end: 27.8, tr: 'Eksen 46’dan başlıyor', en: 'The axis starts at 46',
      note: 'Eksen 46 dan başladığı için fark büyük görünüyor. Sıfırdan başlayınca fark küçücük. İddiayı çürütüyoruz.' },
    { scene: 3, start: 28.8, end: 37.2, tr: 'Kimlere soruldu?', en: 'Who was asked?',
      note: 'Okulda 400 öğrenci var. Anket yalnızca basketbol sahasındaki 20 kişiye yapılmış; 18’i evet demiş.' },
    { scene: 3, start: 37.4, end: 45.8, tr: 'Yanlı örneklem', en: 'A biased sample',
      note: 'Maçı seven zaten sahada. Örneklem yanlı; rastgele seçilmeli. Bu veriyle iddia kabul edilemez.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Ortalama 100', en: 'A mean of 100',
      note: 'On kişinin okuduğu sayfaların ortalaması 100. Ama dokuz kişi 40 sayfa ya da daha az okumuş.' },
    { scene: 4, start: 55.2, end: 63.8, tr: 'Uç değer', en: 'An outlier',
      note: 'Bir kişi 730 sayfa okumuş; bu uç değer ortalamayı büyütüyor. Ortanca 30: çoğumuz 100 sayfa okumuyor.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Yağmurlu ve güneşli', en: 'Rainy and sunny',
      note: 'Bir ayda 12 yağmurlu günde ortalama 42, 18 güneşli günde ortalama 25 kişi kütüphaneye gelmiş.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'Veri destekliyor', en: 'The data supports it',
      note: 'İki dağılım hiç örtüşmüyor: veri iddiayı destekliyor, kabul ediyoruz. Ama tek bir ay: yine de dikkatli olalım.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Üç soru', en: 'Three questions',
      note: 'Aklında kalsın: eksen nereden başlıyor, örneklem kimlerden oluşuyor, uç değer var mı?' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Kabul et ya da çürüt!', en: 'Accept or refute!',
      note: 'Veriyle kabul et ya da çürüt!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
