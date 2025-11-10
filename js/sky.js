// Night sky: stars + periodic shooting star
(function(){
  const sky = document.getElementById("sky");
  if (!sky) return;

  // Stars
  const STAR_COUNT = 150;
  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() < 0.1 ? 3 : 2;       // a few brighter stars
    const dur  = 2 + Math.random() * 3;             // 2–5s twinkle
    s.style.left   = Math.random() * 100 + "vw";
    s.style.top    = Math.random() * 100 + "vh";
    s.style.width  = size + "px";
    s.style.height = size + "px";
    s.style.setProperty("--twinkle", dur + "s");
    sky.appendChild(s);
  }

  // Shooting star
  function shoot() {
    const st = document.createElement("div");
    st.className = "shoot";
    const topVH = 10 + Math.random() * 45;          // spawn in upper half
    st.style.top = topVH + "vh";
    st.style.setProperty("--len", (120 + Math.random() * 140) + "px");
    sky.appendChild(st);
    st.addEventListener("animationend", () => st.remove());
  }

  // Fire every 5–10 seconds
  shoot();
  setInterval(() => shoot(), 5000 + Math.random() * 5000);
})();
