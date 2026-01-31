const db = {
  "notice":"WELCOME TO BD PAID IPTV BD - BDIX WEBPLAY",
  "watermark_text":"BDIX - PAID IPTV BD",
  "watermark_color":"#FFD700",
  "channels": []
};
        
    
    const player = videojs('vid', {
        html5: {
            hls: {
                overrideNative: true
            }
        }
    });

    // --- AUTO ROTATE LOGIC ---
    player.on('fullscreenchange', function() {
        if (player.isFullscreen()) {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch((e)=>{});
            }
        } else {
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        }
    });

    player.on('error', function() {
        const errorDisplay = player.errorDisplay;
        errorDisplay.el().setAttribute('data-content', '⛔ CHANNEL OFFLINE OR GEOLOCKED');
        document.querySelector('.vjs-loading-spinner').style.display = 'none';
    });

    function init() {
        document.getElementById('noticeText').innerText = db.notice || "WELCOME";
        if(db.watermark_text) {
            const wm = document.getElementById('watermark');
            wm.innerText = db.watermark_text;
            wm.style.color = db.watermark_color;
            wm.style.borderColor = db.watermark_color;
        }

        const cats = new Set(db.channels.map(c => c.group || 'Others'));
        const menu = document.getElementById('catMenu');
        Array.from(cats).sort().forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.innerText = c;
            btn.onclick = () => setCat(c);
            menu.appendChild(btn);
        });

        render(db.channels);
        if(db.channels.length > 0) play(db.channels[0]);
    }

    function render(list) {
        const el = document.getElementById('chList');
        el.innerHTML = '';
        if(list.length===0) {
            el.innerHTML = '<p style="padding:20px;text-align:center;">NO CHANNELS</p>';
            return;
        }

        list.forEach(c => {
            const div = document.createElement('div');
            div.className = 'item';
            const logo = c.logo ? `<img src="${c.logo}" class="c-icon" onerror="this.nextElementSibling.style.display='grid';this.style.display='none'">` : '';
            const txtIcon = `<div class="c-txt-icon" style="display:${c.logo?'none':'grid'}">${c.icon}</div>`;

            div.innerHTML = `
                ${logo}
                ${txtIcon}
                <div class="c-meta" onclick="playChannel('${c.url}', '${c.name.replace(/'/g, "\\'")}', this)">
                    <div class="c-name">${c.name}</div>
                    <div class="c-cat">${c.group}</div>
                </div>
            `;
            el.appendChild(div);
        });
    }

    function playChannel(url, name, el) {
        document.getElementById('chName').innerText = name;
        let type = url.includes('.mp4') ? 'video/mp4' : 'application/x-mpegURL';
        player.src({ src: url, type: type });
        player.play().catch(()=>{});

        player.error(null);

        if(el) {
            document.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
            el.parentElement.classList.add('active');
        }
        if(window.innerWidth < 900) {
            document.getElementById('playerTarget').scrollIntoView({behavior:'smooth'});
        }
    }

    function play(c) {
        playChannel(c.url, c.name, document.querySelector('.item'));
    }

    function setCat(cat) {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
        render(cat === 'All' ? db.channels : db.channels.filter(c => c.group === cat));
    }

    function search(t) {
        render(db.channels.filter(c => c.name.toLowerCase().includes(t.toLowerCase())));
    }

    function waitChannels() {
  if (window.channels && window.channels.length) {
    db.channels = window.channels;
    init();
  } else {
    setTimeout(waitChannels, 300);
  }
}
waitChannels();

const PASS = "1234";
  const bnToEn = (s="") => s.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));

  const lockEl = document.getElementById("bdixLock");
  const passEl = document.getElementById("bdixPass");
  const btnEl  = document.getElementById("bdixBtn");
  const msgEl  = document.getElementById("bdixMsg");

  if (localStorage.getItem("bdix_ok") === "1") {
    lockEl.style.display = "none";
  }

  function unlock(){
    const v = bnToEn((passEl.value || "").trim());
    if(v === PASS){
      localStorage.setItem("bdix_ok","1");
      lockEl.style.display = "none";
    } else {
      msgEl.textContent = "WRONG PASSWORD!";
      passEl.value = "";
      passEl.focus();
    }
  }

  btnEl.addEventListener("click", unlock);
  passEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter") unlock(); });