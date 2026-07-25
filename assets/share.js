(() => {
  "use strict";

  const MBTI_PATTERN = /^[EI][SN][TF][JP]$/;
  const KEYS = {
    profile: "astromind.community.profile.v1",
    latestReport: "astromind.latestReport.v1"
  };

  function readStore(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }
  function clean(value, maxLength) {
    return String(value || "").trim().slice(0, maxLength);
  }
  function getData() {
    const params = new URLSearchParams(location.search);
    const report = readStore(KEYS.latestReport, {});
    const profile = readStore(KEYS.profile, {});
    const mbtiCandidate = clean(params.get("mbti") || profile.mbti || report.mbti, 4).toUpperCase();
    return {
      nickname: clean(params.get("nickname") || profile.nickname || report.nickname || "匿名用户", 24),
      mbti: MBTI_PATTERN.test(mbtiCandidate) ? mbtiCandidate : "----",
      zodiac: clean(params.get("zodiac") || profile.zodiac || report.zodiac || "星座未公开", 8),
      title: clean(params.get("title") || profile.title || report.title || "隐藏人格观察者", 30),
      interest: clean(params.get("interest") || profile.interest || report.interest, 8)
    };
  }
  function publicUrl(data, pageName = "share.html") {
    const params = new URLSearchParams();
    params.set("nickname", data.nickname);
    if (data.mbti !== "----") params.set("mbti", data.mbti);
    if (data.zodiac !== "星座未公开") params.set("zodiac", data.zodiac);
    params.set("title", data.title);
    if (data.interest) params.set("interest", data.interest);
    return `${pageName}?${params.toString()}`;
  }
  function absoluteShareUrl(data) {
    return new URL(publicUrl(data), location.href).href;
  }
  function setStatus(message) {
    const target = document.getElementById("shareStatus");
    target.textContent = message;
    setTimeout(() => {
      if (target.textContent === message) target.textContent = "";
    }, 2800);
  }
  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const characters = [...text];
    let line = "";
    let lineCount = 0;
    for (const character of characters) {
      const test = line + character;
      if (context.measureText(test).width > maxWidth && line) {
        context.fillText(line, x, y + lineCount * lineHeight);
        line = character;
        lineCount += 1;
        if (lineCount >= maxLines) return y + lineCount * lineHeight;
      } else {
        line = test;
      }
    }
    if (line && lineCount < maxLines) {
      context.fillText(line, x, y + lineCount * lineHeight);
      lineCount += 1;
    }
    return y + lineCount * lineHeight;
  }
  function drawBackground(context, image) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#060607");
    gradient.addColorStop(.44, "#14312b");
    gradient.addColorStop(.72, "#6f2448");
    gradient.addColorStop(1, "#b38c52");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (image) {
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      context.globalAlpha = .72;
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      context.globalAlpha = 1;
    }

    const shade = context.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, "rgba(0,0,0,.24)");
    shade.addColorStop(.48, "rgba(0,0,0,.4)");
    shade.addColorStop(1, "rgba(0,0,0,.76)");
    context.fillStyle = shade;
    context.fillRect(0, 0, width, height);
  }
  function loadBackground() {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = "assets/astromind-liquid-cosmos.webp";
    });
  }
  async function renderCanvas(data) {
    const canvas = document.getElementById("shareCanvas");
    const context = canvas.getContext("2d");
    const image = location.protocol === "file:" ? null : await loadBackground();
    drawBackground(context, image);

    context.strokeStyle = "rgba(255,255,255,.48)";
    context.lineWidth = 2;
    context.strokeRect(74, 74, canvas.width - 148, canvas.height - 148);

    context.fillStyle = "rgba(255,255,255,.74)";
    context.font = "600 24px Arial, sans-serif";
    context.fillText("ASTROMIND / PUBLIC PERSONALITY CARD", 112, 132);
    context.textAlign = "right";
    context.fillText(data.mbti, canvas.width - 112, 132);
    context.textAlign = "left";

    context.fillStyle = "rgba(255,255,255,.72)";
    context.font = "400 28px Arial, sans-serif";
    context.fillText(`${data.nickname} 的人格结果`, 112, 500);

    context.fillStyle = "#ffffff";
    context.font = "500 94px Arial, sans-serif";
    const titleEnd = wrapText(context, data.title, 112, 600, 820, 104, 3);

    context.fillStyle = "rgba(255,255,255,.8)";
    context.font = "400 30px Arial, sans-serif";
    context.fillText(`${data.mbti}  ×  ${data.zodiac}`, 112, titleEnd + 34);
    if (data.interest) context.fillText(`职业兴趣线索  ${data.interest}`, 112, titleEnd + 82);

    context.strokeStyle = "rgba(255,255,255,.34)";
    context.beginPath();
    context.moveTo(112, 1088);
    context.lineTo(canvas.width - 112, 1088);
    context.stroke();

    context.fillStyle = "rgba(255,255,255,.68)";
    context.font = "400 22px Arial, sans-serif";
    wrapText(context, "人格标签适合开启对话，不适合决定能力、关系或未来。", 112, 1146, 640, 36, 2);

    context.strokeStyle = "rgba(255,255,255,.42)";
    context.strokeRect(842, 1120, 104, 104);
    context.fillStyle = "rgba(255,255,255,.8)";
    context.font = "600 16px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("ASTROMIND", 894, 1166);
    context.fillText("SHARE", 894, 1191);
    context.textAlign = "left";
    return canvas;
  }
  async function downloadCard(data) {
    const canvas = await renderCanvas(data);
    const link = document.createElement("a");
    link.download = `AstroMind-${data.mbti}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("分享图片已生成。");
  }

  const data = getData();
  document.getElementById("cardMbtiTop").textContent = data.mbti;
  document.getElementById("cardName").textContent = `${data.nickname} 的人格结果`;
  document.getElementById("cardTitle").textContent = data.title;
  document.getElementById("cardLine").textContent = `${data.mbti} × ${data.zodiac}。这张卡只显示你主动公开的人格摘要。`;
  document.getElementById("cardTags").innerHTML = [
    data.mbti,
    data.zodiac,
    data.interest ? `兴趣 ${data.interest}` : ""
  ].filter(Boolean).map(tag => `<span>${tag.replace(/[<>&"']/g, "")}</span>`).join("");
  document.getElementById("communityLink").href = publicUrl(data, "community.html");

  if (!location.search) history.replaceState(null, "", publicUrl(data));

  document.getElementById("downloadCardButton").addEventListener("click", () => downloadCard(data));
  document.getElementById("copyLinkButton").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(absoluteShareUrl(data));
      setStatus("分享链接已复制。");
    } catch {
      window.prompt("复制这个分享链接：", absoluteShareUrl(data));
    }
  });
  document.getElementById("systemShareButton").addEventListener("click", async () => {
    if (!navigator.share) {
      setStatus("当前浏览器不支持系统分享，请使用复制链接。");
      return;
    }
    try {
      await navigator.share({
        title: `${data.nickname} 的 AstroMind 人格卡`,
        text: `我的隐藏人格是「${data.title}」｜${data.mbti} × ${data.zodiac}`,
        url: absoluteShareUrl(data)
      });
    } catch (error) {
      if (error?.name !== "AbortError") setStatus("分享没有完成，请改用复制链接。");
    }
  });
})();
