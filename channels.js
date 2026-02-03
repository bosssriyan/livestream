(async () => {
  const PLAYLISTS = [
    "https://raw.githubusercontent.com/etcvai/ExtenderMax/refs/heads/main/iptv.m3u8",
    "https://iptv-org.github.io/iptv/categories/sports.m3u",
    "https://raw.githubusercontent.com/siksa40/xPola-Player/main/ARENA.m3u",
	"https://raw.githubusercontent.com/raid35/channel-links/main/8K.m3u",
  ];

  function parseM3U(text) {
    const lines = text.split(/\r?\n/);
    const out = [];
    let current = null;

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      if (line.startsWith("#EXTINF")) {
        const name = (line.split(",").slice(1).join(",") || "Channel").trim();
        const logo = (line.match(/tvg-logo="([^"]*)"/i) || [])[1] || "";
        current = {
          name,
          logo,
          url: "",
          icon: (name[0] || "T").toUpperCase(),
          group: "All"
        };
      } else if (!line.startsWith("#") && current) {
        current.url = line;
        out.push(current);
        current = null;
      }
    }
    return out;
  }

  const all = [];
  for (const u of PLAYLISTS) {
    const t = await fetch(u).then(r => r.text());
    all.push(...parseM3U(t));
  }

  window.channels = all;
})();

