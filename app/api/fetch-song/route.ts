import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GuitarVault/1.0; +https://github.com)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 400 });
    }

    const html = await response.text();

    // Extract title
    let title = "";
    let artist = "";
    let lyrics_chords = "";

    // Try to extract title from <title> tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const rawTitle = titleMatch[1].replace(/&amp;/g, "&").trim();
      // Common patterns: "Song - Artist | Site" or "Artist - Song Chords"
      const parts = rawTitle.split(/\s*[-–|]\s*/);
      if (parts.length >= 2) {
        title = parts[0].trim();
        artist = parts[1].replace(/chords|tabs|lyrics|guitar/gi, "").trim();
      } else {
        title = rawTitle;
      }
    }

    // Try Open Graph
    const ogTitleMatch = html.match(
      /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i
    );
    if (ogTitleMatch && !title) {
      title = ogTitleMatch[1];
    }

    // Try to extract chords/lyrics from common tab sites
    // Ultimate Guitar specific
    const ugMatch = html.match(
      /class="js-store"[^>]+data-content="([^"]+)"/i
    );
    if (ugMatch) {
      try {
        const decoded = ugMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&");
        const data = JSON.parse(decoded);
        const content =
          data?.store?.page?.data?.tab_view?.wiki_tab?.content;
        if (content) {
          lyrics_chords = content
            .replace(/\[tab\]/gi, "")
            .replace(/\[\/tab\]/gi, "")
            .replace(/\[ch\]/gi, "[")
            .replace(/\[\/ch\]/gi, "]")
            .trim();
        }
        if (data?.store?.page?.data?.tab?.song_name) {
          title = data.store.page.data.tab.song_name;
        }
        if (data?.store?.page?.data?.tab?.artist_name) {
          artist = data.store.page.data.tab.artist_name;
        }
      } catch {
        // ignore parse errors
      }
    }

    // Generic: try to find pre/code blocks with tab content
    if (!lyrics_chords) {
      const preMatches = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
      if (preMatches) {
        const longestPre = preMatches.reduce((a, b) =>
          a.length > b.length ? a : b
        );
        lyrics_chords = longestPre
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .trim()
          .slice(0, 5000);
      }
    }

    return NextResponse.json({ title, artist, lyrics_chords });
  } catch (error) {
    console.error("Fetch song error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
