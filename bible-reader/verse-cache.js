// ─── Verse Fetcher + localStorage Cache ───
// Pulls KJV text from bible-api.com, caches permanently

const VerseCache = {
  _cache: {},
  _STORAGE_PREFIX: 'bible_kjv_',

  async getChapter(book, chapter) {
    const key = `${book}_${chapter}`;

    if (this._cache[key]) return this._cache[key];

    const stored = localStorage.getItem(this._STORAGE_PREFIX + key);
    if (stored) {
      const parsed = JSON.parse(stored);
      this._cache[key] = parsed;
      return parsed;
    }

    const apiBook = book.replace(/\s+/g, '+');
    const url = `https://bible-api.com/${apiBook}+${chapter}?translation=kjv`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      const verses = data.verses.map(v => ({
        num: v.verse,
        text: v.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      }));

      this._cache[key] = verses;
      try {
        localStorage.setItem(this._STORAGE_PREFIX + key, JSON.stringify(verses));
      } catch (e) { /* storage full, no big deal */ }

      return verses;
    } catch (err) {
      console.warn(`[VerseCache] Failed to fetch ${book} ${chapter}:`, err);
      return null;
    }
  },

  prefetchBook(book, totalChapters) {
    for (let ch = 1; ch <= totalChapters; ch++) {
      const key = `${book}_${ch}`;
      if (!this._cache[key] && !localStorage.getItem(this._STORAGE_PREFIX + key)) {
        setTimeout(() => this.getChapter(book, ch), ch * 400);
      }
    }
  },

  isChapterCached(book, chapter) {
    const key = `${book}_${chapter}`;
    return !!(this._cache[key] || localStorage.getItem(this._STORAGE_PREFIX + key));
  },
};
