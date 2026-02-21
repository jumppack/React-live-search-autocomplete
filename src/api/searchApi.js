// We use the Open Library API — it's free and requires no API key.
// This returns book titles and authors, which makes for a rich search experience.

const BASE_URL = 'https://openlibrary.org/search.json';

export async function searchBooks(query) {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,first_publish_year,cover_i`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize the API response into a clean, predictable shape
  // for our UI components to consume.
  return data.docs.map((book) => ({
    id: book.key,
    title: book.title,
    author: book.author_name?.[0] ?? 'Unknown Author',
    year: book.first_publish_year ?? '—',
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
      : null,
  }));
}
