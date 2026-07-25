(() => {
  "use strict";

  const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];
  const MBTI_DETAILS = {
    INTJ: "独立 · 规划", INTP: "逻辑 · 探索", ENTJ: "组织 · 推进", ENTP: "创变 · 辩证",
    INFJ: "洞察 · 共情", INFP: "价值 · 想象", ENFJ: "连接 · 鼓舞", ENFP: "灵感 · 开放",
    ISTJ: "秩序 · 可靠", ISFJ: "细致 · 守护", ESTJ: "执行 · 负责", ESFJ: "协作 · 关怀",
    ISTP: "拆解 · 应变", ISFP: "感知 · 自由", ESTP: "行动 · 现场", ESFP: "热情 · 体验"
  };
  const ZODIAC_DETAILS = [
    { label: "白羊座", english: "Aries", symbol: "♈" },
    { label: "金牛座", english: "Taurus", symbol: "♉" },
    { label: "双子座", english: "Gemini", symbol: "♊" },
    { label: "巨蟹座", english: "Cancer", symbol: "♋" },
    { label: "狮子座", english: "Leo", symbol: "♌" },
    { label: "处女座", english: "Virgo", symbol: "♍" },
    { label: "天秤座", english: "Libra", symbol: "♎" },
    { label: "天蝎座", english: "Scorpio", symbol: "♏" },
    { label: "射手座", english: "Sagittarius", symbol: "♐" },
    { label: "摩羯座", english: "Capricorn", symbol: "♑" },
    { label: "水瓶座", english: "Aquarius", symbol: "♒" },
    { label: "双鱼座", english: "Pisces", symbol: "♓" }
  ];
  const ZODIACS = ZODIAC_DETAILS.map(sign => sign.label);

  const ROOMS = [
    { id: "square", kind: "featured", label: "同频广场", eyebrow: "OPEN SQUARE", description: "从人格标签开始，但不被标签限制。聊真实经历，也允许彼此不同。", count: 128 },
    ...MBTI_TYPES.map((type, index) => ({
      id: type.toLowerCase(),
      kind: "mbti",
      label: `${type} 房间`,
      eyebrow: "PERSONALITY ROOM",
      description: `${type} 只是进入对话的一种语言。分享真实行为、环境差异与生活经验，不把四个字母当成限制。`,
      count: 46 + ((index * 17) % 89)
    })),
    { id: "career", kind: "topic", label: "职业方向", eyebrow: "CAREER ROOM", description: "讨论行业、工作环境、转型、实习与职业试错。拒绝保证成功的职业预测。", count: 164 },
    { id: "relationships", kind: "topic", label: "关系沟通", eyebrow: "RELATIONSHIP ROOM", description: "分享友情、亲密关系和冲突沟通，不把人格类型当作关系判决。", count: 117 },
    { id: "campus", kind: "topic", label: "校园与毕业", eyebrow: "EARLY CAREER ROOM", description: "给学生和刚毕业的人一个讨论选择、焦虑、实习与第一份工作的地方。", count: 93 },
    { id: "worklife", kind: "topic", label: "职场与生活", eyebrow: "WORK LIFE ROOM", description: "聊边界、恢复、团队文化与工作方式，区分工作量和长期消耗。", count: 142 }
  ];

  const PROMPTS = {
    square: ["哪一种人格描述曾经让你觉得很准，但后来发现不完全是？", "最近哪件事让你更理解自己？", "你希望别人停止怎样误解你的类型？"],
    career: ["你的工作最消耗你的，是任务还是环境？", "哪一次实习或项目让你排除了一个方向？", "你现在最想验证哪一项能力？"],
    relationships: ["发生冲突时，你通常先需要空间还是沟通？", "别人最容易误解你的表达方式是什么？", "什么样的边界会让关系更安全？"],
    campus: ["第一份工作，你更重视学习、收入还是环境？", "有什么是学校没有教、进入职场才发现的？", "你正在犹豫哪一个专业或方向？"],
    worklife: ["你怎样判断自己是累，还是不适合这个环境？", "什么团队习惯最影响你的能量？", "你理想的一天工作节奏是什么？"],
    mbti: ["这个类型最常被误解的地方是什么？", "你在不同环境下会像另一个类型吗？", "哪一个偏好最明显，哪一个最接近边界？"]
  };

  const SEED_POSTS = [
    {
      id: "seed-1",
      room: "square",
      authorId: "seed-lin",
      nickname: "Lin",
      mbti: "INFJ",
      zodiac: "双鱼座",
      content: "测评说我偏内向，但在熟悉的工作团队里我反而是最常组织讨论的人。现在觉得，类型更像能量来源，不是社交能力。",
      tags: ["边界型", "真实经历"],
      likes: 38,
      createdAt: Date.now() - 1000 * 60 * 36,
      replies: [
        { id: "reply-1", nickname: "Ming", mbti: "INTP", content: "很有共鸣。环境安全以后，行为真的会变很多。", createdAt: Date.now() - 1000 * 60 * 22 }
      ]
    },
    {
      id: "seed-2",
      room: "career",
      authorId: "seed-jia",
      nickname: "Jia",
      mbti: "ENFP",
      zodiac: "双子座",
      content: "我以前一直找“最适合 ENFP 的工作”，后来真正有帮助的是去看日常任务。我喜欢创意，但不喜欢每天都要高强度社交。",
      tags: ["职业试错", "工作环境"],
      likes: 64,
      createdAt: Date.now() - 1000 * 60 * 94,
      replies: []
    },
    {
      id: "seed-3",
      room: "intj",
      authorId: "seed-yu",
      nickname: "Yu",
      mbti: "INTJ",
      zodiac: "摩羯座",
      content: "INTJ 房间想问：你们会不会在计划已经很完整时，反而因为担心执行不够好而迟迟不开始？",
      tags: ["行动", "完美主义"],
      likes: 29,
      createdAt: Date.now() - 1000 * 60 * 145,
      replies: [
        { id: "reply-2", nickname: "An", mbti: "INTJ", content: "会。我现在强迫自己先交一个 60 分版本，再决定值不值得优化。", createdAt: Date.now() - 1000 * 60 * 80 }
      ]
    },
    {
      id: "seed-4",
      room: "relationships",
      authorId: "seed-chen",
      nickname: "Chen",
      mbti: "ESTJ",
      zodiac: "狮子座",
      content: "我发现自己不是不在乎感受，只是习惯太快进入解决问题模式。后来先问一句“你需要我听还是一起想办法”，冲突少很多。",
      tags: ["沟通", "关系经验"],
      likes: 87,
      createdAt: Date.now() - 1000 * 60 * 260,
      replies: []
    },
    {
      id: "seed-5",
      room: "campus",
      authorId: "seed-moon",
      nickname: "Moon",
      mbti: "ISFP",
      zodiac: "天秤座",
      content: "刚毕业最大的变化，是不再问“我要一次选对什么”，而是问“下一份工作能帮我验证什么”。焦虑真的少了一点。",
      tags: ["刚毕业", "职业方向"],
      likes: 51,
      createdAt: Date.now() - 1000 * 60 * 410,
      replies: []
    }
  ];

  const SEED_MESSAGES = [
    { id: "msg-1", room: "square", nickname: "Aster", mbti: "INFP", content: "晚上好，今天有人刚完成测评吗？", createdAt: Date.now() - 1000 * 60 * 18 },
    { id: "msg-2", room: "square", nickname: "K", mbti: "ENTP", content: "刚测完。我的 J/P 很接近，比四个字母本身更有意思。", createdAt: Date.now() - 1000 * 60 * 15 },
    { id: "msg-3", room: "career", nickname: "Wei", mbti: "ISTJ", content: "有人从运营转数据分析吗？想了解真实学习成本。", createdAt: Date.now() - 1000 * 60 * 12 }
  ];

  const KEYS = {
    profile: "astromind.community.profile.v1",
    posts: "astromind.community.posts.v1",
    messages: "astromind.community.messages.v1",
    likes: "astromind.community.likes.v1",
    reports: "astromind.community.reports.v1",
    hidden: "astromind.community.hidden.v1",
    latestReport: "astromind.latestReport.v1"
  };

  const memoryStore = new Map();
  function readStore(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }
  }
  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      memoryStore.set(key, value);
    }
  }
  function uid(prefix) {
    if (window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function initials(value) {
    const text = String(value || "?").trim();
    return text.slice(0, 2).toUpperCase();
  }
  function formatTime(timestamp) {
    const difference = Math.max(0, Date.now() - Number(timestamp));
    const minutes = Math.floor(difference / 60000);
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    return `${Math.floor(hours / 24)} 天前`;
  }

  let profile = readStore(KEYS.profile, null);
  let posts = readStore(KEYS.posts, []);
  let messages = readStore(KEYS.messages, []);
  let likedPosts = new Set(readStore(KEYS.likes, []));
  let hiddenPosts = new Set(readStore(KEYS.hidden, []));
  let currentRoomId = "square";
  let currentMode = "discussion";
  let pendingAction = null;
  const expandedReplies = new Set();

  const elements = {
    profileButton: document.getElementById("profileButton"),
    editProfileButton: document.getElementById("editProfileButton"),
    shareProfileButton: document.getElementById("shareProfileButton"),
    sidebarAvatar: document.getElementById("sidebarAvatar"),
    sidebarName: document.getElementById("sidebarName"),
    sidebarMeta: document.getElementById("sidebarMeta"),
    composerAvatar: document.getElementById("composerAvatar"),
    recommendedRooms: document.getElementById("recommendedRooms"),
    mbtiRooms: document.getElementById("mbtiRooms"),
    topicRooms: document.getElementById("topicRooms"),
    mobileRoomStrip: document.getElementById("mobileRoomStrip"),
    roomEyebrow: document.getElementById("roomEyebrow"),
    roomTitle: document.getElementById("roomTitle"),
    roomDescription: document.getElementById("roomDescription"),
    roomOnlineCount: document.getElementById("roomOnlineCount"),
    discussionTab: document.getElementById("discussionTab"),
    chatTab: document.getElementById("chatTab"),
    discussionView: document.getElementById("discussionView"),
    chatView: document.getElementById("chatView"),
    modeNote: document.getElementById("modeNote"),
    postForm: document.getElementById("postForm"),
    postInput: document.getElementById("postInput"),
    postCount: document.getElementById("postCount"),
    postList: document.getElementById("postList"),
    chatForm: document.getElementById("chatForm"),
    chatInput: document.getElementById("chatInput"),
    chatStream: document.getElementById("chatStream"),
    promptList: document.getElementById("promptList"),
    profileModal: document.getElementById("profileModal"),
    profileForm: document.getElementById("profileForm"),
    profileNickname: document.getElementById("profileNickname"),
    profileMbti: document.getElementById("profileMbti"),
    profileMbtiPicker: document.getElementById("profileMbtiPicker"),
    profileMbtiTrigger: document.getElementById("profileMbtiTrigger"),
    profileMbtiOptions: document.getElementById("profileMbtiOptions"),
    profileMbtiMark: document.getElementById("profileMbtiMark"),
    profileMbtiSelected: document.getElementById("profileMbtiSelected"),
    profileMbtiHint: document.getElementById("profileMbtiHint"),
    profileZodiac: document.getElementById("profileZodiac"),
    profileZodiacPicker: document.getElementById("profileZodiacPicker"),
    profileZodiacTrigger: document.getElementById("profileZodiacTrigger"),
    profileZodiacOptions: document.getElementById("profileZodiacOptions"),
    profileZodiacMark: document.getElementById("profileZodiacMark"),
    profileZodiacSelected: document.getElementById("profileZodiacSelected"),
    profileZodiacHint: document.getElementById("profileZodiacHint"),
    profileBio: document.getElementById("profileBio"),
    profileAgreement: document.getElementById("profileAgreement"),
    profileError: document.getElementById("profileError"),
    closeProfileModal: document.getElementById("closeProfileModal"),
    cancelProfileButton: document.getElementById("cancelProfileButton"),
    toast: document.getElementById("toast")
  };

  function hydrateFromQuery() {
    const params = new URLSearchParams(location.search);
    const mbti = String(params.get("mbti") || "").toUpperCase();
    const zodiac = params.get("zodiac") || "";
    const nickname = params.get("nickname") || "";
    const title = params.get("title") || "";
    const interest = params.get("interest") || "";
    if (!MBTI_TYPES.includes(mbti) && !ZODIACS.includes(zodiac) && !nickname) return;

    const publicReport = {
      nickname: nickname.slice(0, 24),
      mbti: MBTI_TYPES.includes(mbti) ? mbti : "",
      zodiac: ZODIACS.includes(zodiac) ? zodiac : "",
      title: title.slice(0, 60),
      interest: interest.slice(0, 8),
      receivedAt: Date.now()
    };
    writeStore(KEYS.latestReport, publicReport);

    if (!profile && publicReport.nickname && publicReport.mbti && publicReport.zodiac) {
      profile = {
        id: uid("profile"),
        nickname: publicReport.nickname,
        mbti: publicReport.mbti,
        zodiac: publicReport.zodiac,
        title: publicReport.title,
        interest: publicReport.interest,
        bio: "",
        createdAt: Date.now()
      };
      writeStore(KEYS.profile, profile);
    }
  }

  function currentRoom() {
    return ROOMS.find(room => room.id === currentRoomId) || ROOMS[0];
  }
  function roomPosts() {
    const allPosts = [...posts, ...SEED_POSTS].filter(post => !hiddenPosts.has(post.id));
    const filtered = currentRoomId === "square"
      ? allPosts
      : allPosts.filter(post => post.room === currentRoomId);
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }
  function roomMessages() {
    return [...messages, ...SEED_MESSAGES]
      .filter(message => message.room === currentRoomId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function populateProfileFields() {
    elements.profileMbtiOptions.innerHTML = MBTI_TYPES.map(type => `
      <button class="choice-option" type="button" role="option" aria-selected="false" data-choice-kind="mbti" data-choice-value="${type}">
        <span class="choice-option-copy">
          <strong>${type}</strong>
          <small>${MBTI_DETAILS[type]}</small>
        </span>
      </button>`).join("");
    elements.profileZodiacOptions.innerHTML = ZODIAC_DETAILS.map(sign => `
      <button class="choice-option" type="button" role="option" aria-selected="false" data-choice-kind="zodiac" data-choice-value="${sign.label}">
        <span class="zodiac-symbol" aria-hidden="true">${sign.symbol}</span>
        <span class="choice-option-copy">
          <strong>${sign.label}</strong>
          <small>${sign.english}</small>
        </span>
      </button>`).join("");
    const report = readStore(KEYS.latestReport, {});
    elements.profileNickname.value = profile?.nickname || report.nickname || "";
    setProfileChoice("mbti", profile?.mbti || report.mbti || "");
    setProfileChoice("zodiac", profile?.zodiac || report.zodiac || "");
    elements.profileBio.value = profile?.bio || "";
    elements.profileAgreement.checked = Boolean(profile);
  }

  function profileChoiceElements(kind) {
    return kind === "mbti"
      ? {
          input: elements.profileMbti,
          picker: elements.profileMbtiPicker,
          trigger: elements.profileMbtiTrigger,
          options: elements.profileMbtiOptions,
          mark: elements.profileMbtiMark,
          selected: elements.profileMbtiSelected,
          hint: elements.profileMbtiHint
        }
      : {
          input: elements.profileZodiac,
          picker: elements.profileZodiacPicker,
          trigger: elements.profileZodiacTrigger,
          options: elements.profileZodiacOptions,
          mark: elements.profileZodiacMark,
          selected: elements.profileZodiacSelected,
          hint: elements.profileZodiacHint
        };
  }

  function closeProfileChoices(exceptKind = "") {
    ["mbti", "zodiac"].forEach(kind => {
      if (kind === exceptKind) return;
      const choice = profileChoiceElements(kind);
      choice.picker.classList.remove("open");
      choice.options.classList.add("hidden");
      choice.trigger.setAttribute("aria-expanded", "false");
    });
  }

  function toggleProfileChoice(kind) {
    const choice = profileChoiceElements(kind);
    const willOpen = choice.options.classList.contains("hidden");
    closeProfileChoices(willOpen ? kind : "");
    choice.picker.classList.toggle("open", willOpen);
    choice.options.classList.toggle("hidden", !willOpen);
    choice.trigger.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
      const selectedOption = choice.options.querySelector('[aria-selected="true"]');
      setTimeout(() => (selectedOption || choice.options.querySelector(".choice-option"))?.focus(), 20);
    }
  }

  function setProfileChoice(kind, value) {
    const choice = profileChoiceElements(kind);
    const valid = kind === "mbti" ? MBTI_TYPES.includes(value) : ZODIACS.includes(value);
    const safeValue = valid ? value : "";
    choice.input.value = safeValue;
    choice.trigger.classList.toggle("has-value", Boolean(safeValue));
    choice.options.querySelectorAll("[data-choice-value]").forEach(option => {
      option.setAttribute("aria-selected", String(option.dataset.choiceValue === safeValue));
    });

    if (kind === "mbti") {
      choice.mark.textContent = safeValue || "16";
      choice.selected.textContent = safeValue || "选择你的 MBTI";
      choice.hint.textContent = safeValue ? MBTI_DETAILS[safeValue] : "从四组偏好中找到最接近你的类型";
      return;
    }

    const zodiac = ZODIAC_DETAILS.find(sign => sign.label === safeValue);
    choice.mark.textContent = zodiac?.symbol || "✦";
    choice.selected.textContent = zodiac?.label || "选择你的星座";
    choice.hint.textContent = zodiac ? `${zodiac.english} · 情绪与动机辅助层` : "作为情绪与动机风格的辅助参考";
  }

  function renderProfile() {
    const report = readStore(KEYS.latestReport, {});
    const visibleProfile = profile || (report.mbti ? report : null);
    if (!visibleProfile) {
      elements.sidebarAvatar.textContent = "?";
      elements.composerAvatar.textContent = "?";
      elements.sidebarName.textContent = "游客";
      elements.sidebarMeta.textContent = "浏览公开内容";
      elements.profileButton.textContent = "建立身份";
      return;
    }
    const label = visibleProfile.nickname || "匿名用户";
    const meta = [visibleProfile.mbti, visibleProfile.zodiac].filter(Boolean).join(" · ");
    elements.sidebarAvatar.textContent = initials(label);
    elements.composerAvatar.textContent = initials(label);
    elements.sidebarName.textContent = label;
    elements.sidebarMeta.textContent = meta || "公开人格卡";
    elements.profileButton.textContent = profile ? initials(label) : "建立身份";
  }

  function roomButton(room) {
    return `
      <button class="room-button ${room.id === currentRoomId ? "active" : ""}" type="button" data-room="${escapeHTML(room.id)}" data-kind="${escapeHTML(room.kind)}">
        <span class="room-mark"></span>
        <span class="room-label">${escapeHTML(room.label)}</span>
        <span class="room-count">${room.count}</span>
      </button>`;
  }
  function renderRooms() {
    const ownRoom = profile?.mbti ? ROOMS.find(room => room.id === profile.mbti.toLowerCase()) : null;
    const recommended = [ROOMS[0], ownRoom, ROOMS.find(room => room.id === "career")]
      .filter((room, index, list) => room && list.findIndex(item => item && item.id === room.id) === index);
    elements.recommendedRooms.innerHTML = recommended.map(roomButton).join("");
    elements.mbtiRooms.innerHTML = ROOMS.filter(room => room.kind === "mbti").map(roomButton).join("");
    elements.topicRooms.innerHTML = ROOMS.filter(room => room.kind === "topic").map(roomButton).join("");
    const mobileRooms = [...recommended, ...ROOMS.filter(room => room.kind === "topic")].filter((room, index, list) => list.findIndex(item => item.id === room.id) === index);
    elements.mobileRoomStrip.innerHTML = mobileRooms.map(room => `<button class="room-chip ${room.id === currentRoomId ? "active" : ""}" type="button" data-room="${escapeHTML(room.id)}">${escapeHTML(room.label)}</button>`).join("");
  }

  function renderRoomHeader() {
    const room = currentRoom();
    elements.roomEyebrow.textContent = room.eyebrow;
    elements.roomTitle.textContent = room.label;
    elements.roomDescription.textContent = room.description;
    elements.roomOnlineCount.textContent = room.count;
    document.title = `${room.label}｜AstroMind 同频空间`;
  }

  function postTemplate(post, index) {
    const liked = likedPosts.has(post.id);
    const replyOpen = expandedReplies.has(post.id);
    const replies = Array.isArray(post.replies) ? post.replies : [];
    const own = profile && post.authorId === profile.id;
    return `
      <article class="post" data-post-id="${escapeHTML(post.id)}" style="animation-delay:${Math.min(index * 35, 210)}ms">
        <div class="post-head">
          <div class="post-author">
            <div class="avatar">${escapeHTML(initials(post.nickname))}</div>
            <div>
              <b>${escapeHTML(post.nickname)}</b>
              <span class="post-meta">${escapeHTML(post.mbti || "未分类")} · ${escapeHTML(post.zodiac || "星座未公开")} · ${formatTime(post.createdAt)}</span>
            </div>
          </div>
          <button class="text-button" type="button" data-action="${own ? "delete" : "report"}">${own ? "删除" : "举报"}</button>
        </div>
        <p class="post-content">${escapeHTML(post.content)}</p>
        <div class="post-tags">${(post.tags || []).map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
        <div class="post-actions">
          <button class="post-action ${liked ? "active" : ""}" type="button" data-action="like">共鸣 ${Number(post.likes || 0) + (liked ? 1 : 0)}</button>
          <button class="post-action" type="button" data-action="reply">回应 ${replies.length}</button>
          <button class="post-action" type="button" data-action="hide">屏蔽此内容</button>
        </div>
        <div class="reply-zone ${replyOpen ? "" : "hidden"}">
          <div class="reply-list">
            ${replies.map(reply => `
              <div class="reply">
                <b>${escapeHTML(reply.nickname)} · ${escapeHTML(reply.mbti || "")}</b>
                <p>${escapeHTML(reply.content)}</p>
              </div>`).join("")}
          </div>
          <form class="reply-form" data-reply-form="${escapeHTML(post.id)}">
            <input maxlength="180" placeholder="写下回应……" aria-label="回应内容" />
            <button class="button small" type="submit">发送</button>
          </form>
        </div>
      </article>`;
  }

  function renderPosts() {
    const visible = roomPosts();
    elements.postList.innerHTML = visible.length
      ? visible.map(postTemplate).join("")
      : `<div class="empty-state">这个房间还没有讨论。你可以成为第一个开口的人。</div>`;
  }

  function renderChat() {
    const visible = roomMessages();
    elements.chatStream.innerHTML = visible.length
      ? `<div class="chat-day">今天 · 公开群聊</div>${visible.map(message => `
        <div class="message">
          <div class="avatar">${escapeHTML(initials(message.nickname))}</div>
          <div>
            <div class="message-head"><b>${escapeHTML(message.nickname)} · ${escapeHTML(message.mbti || "")}</b><span>${formatTime(message.createdAt)}</span></div>
            <p>${escapeHTML(message.content)}</p>
          </div>
        </div>`).join("")}`
      : `<div class="empty-state">群聊暂时安静。说一句不需要完美的话。</div>`;
    elements.chatStream.scrollTop = elements.chatStream.scrollHeight;
  }

  function renderPrompts() {
    const room = currentRoom();
    const prompts = PROMPTS[room.id] || (room.kind === "mbti" ? PROMPTS.mbti : PROMPTS.square);
    elements.promptList.innerHTML = prompts.map(prompt => `<button class="prompt text-button" type="button" data-prompt="${escapeHTML(prompt)}">${escapeHTML(prompt)}</button>`).join("");
  }

  function renderMode() {
    const discussion = currentMode === "discussion";
    elements.discussionTab.classList.toggle("active", discussion);
    elements.chatTab.classList.toggle("active", !discussion);
    elements.discussionTab.setAttribute("aria-selected", String(discussion));
    elements.chatTab.setAttribute("aria-selected", String(!discussion));
    elements.discussionView.classList.toggle("hidden", !discussion);
    elements.chatView.classList.toggle("hidden", discussion);
    elements.modeNote.textContent = discussion
      ? "测试模式 · 贴文保存在这台设备"
      : "本机实时模拟 · 正式上线后连接 Realtime";
    if (!discussion) renderChat();
  }

  function renderAll() {
    renderProfile();
    renderRooms();
    renderRoomHeader();
    renderPosts();
    renderPrompts();
    renderMode();
  }

  function switchRoom(roomId) {
    if (!ROOMS.some(room => room.id === roomId)) return;
    currentRoomId = roomId;
    history.replaceState(null, "", `${location.pathname}${location.search}#${roomId}`);
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openProfileModal(afterSave) {
    pendingAction = typeof afterSave === "function" ? afterSave : null;
    populateProfileFields();
    elements.profileError.textContent = "";
    elements.profileModal.classList.remove("hidden");
    setTimeout(() => elements.profileNickname.focus(), 20);
  }
  function closeProfileModal() {
    pendingAction = null;
    closeProfileChoices();
    elements.profileModal.classList.add("hidden");
  }
  function requireProfile(action) {
    if (profile) {
      action();
      return;
    }
    openProfileModal(action);
  }

  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.remove("hidden");
    toastTimer = setTimeout(() => elements.toast.classList.add("hidden"), 2600);
  }

  function persistPosts() {
    writeStore(KEYS.posts, posts);
  }
  function persistMessages() {
    writeStore(KEYS.messages, messages);
  }
  function findPost(postId) {
    return posts.find(post => post.id === postId) || SEED_POSTS.find(post => post.id === postId);
  }
  function editablePost(postId) {
    const localPost = posts.find(post => post.id === postId);
    if (localPost) return localPost;
    const seed = SEED_POSTS.find(post => post.id === postId);
    if (!seed) return null;
    const copy = { ...seed, replies: [...(seed.replies || [])] };
    posts.push(copy);
    return copy;
  }

  function shareUrl() {
    const report = readStore(KEYS.latestReport, {});
    const source = {
      nickname: profile?.nickname || report.nickname || "匿名用户",
      mbti: profile?.mbti || report.mbti || "",
      zodiac: profile?.zodiac || report.zodiac || "",
      title: profile?.title || report.title || `${profile?.mbti || report.mbti || ""} 同频人格`,
      interest: profile?.interest || report.interest || ""
    };
    const params = new URLSearchParams(source);
    return `share.html?${params.toString()}`;
  }

  document.addEventListener("click", event => {
    const roomTarget = event.target.closest("[data-room]");
    if (roomTarget) {
      switchRoom(roomTarget.dataset.room);
      return;
    }
    const promptTarget = event.target.closest("[data-prompt]");
    if (promptTarget) {
      currentMode = "discussion";
      renderMode();
      elements.postInput.value = promptTarget.dataset.prompt;
      elements.postCount.textContent = elements.postInput.value.length;
      elements.postInput.focus();
    }
  });

  elements.profileButton.addEventListener("click", () => openProfileModal());
  elements.editProfileButton.addEventListener("click", () => openProfileModal());
  elements.shareProfileButton.addEventListener("click", () => {
    location.href = shareUrl();
  });
  elements.closeProfileModal.addEventListener("click", closeProfileModal);
  elements.cancelProfileButton.addEventListener("click", closeProfileModal);
  elements.profileModal.addEventListener("click", event => {
    if (event.target === elements.profileModal) closeProfileModal();
  });
  elements.profileMbtiTrigger.addEventListener("click", () => toggleProfileChoice("mbti"));
  elements.profileZodiacTrigger.addEventListener("click", () => toggleProfileChoice("zodiac"));
  elements.profileForm.addEventListener("click", event => {
    const option = event.target.closest("[data-choice-kind][data-choice-value]");
    if (option) {
      const kind = option.dataset.choiceKind;
      setProfileChoice(kind, option.dataset.choiceValue);
      closeProfileChoices();
      profileChoiceElements(kind).trigger.focus();
      elements.profileError.textContent = "";
      return;
    }
    if (!event.target.closest(".choice-picker")) closeProfileChoices();
  });

  elements.profileForm.addEventListener("submit", event => {
    event.preventDefault();
    const nickname = elements.profileNickname.value.trim();
    const mbti = elements.profileMbti.value;
    const zodiac = elements.profileZodiac.value;
    if (!nickname || !MBTI_TYPES.includes(mbti) || !ZODIACS.includes(zodiac)) {
      elements.profileError.textContent = "请填写昵称，并选择 MBTI 与星座。";
      return;
    }
    if (!elements.profileAgreement.checked) {
      elements.profileError.textContent = "请先同意社区边界。";
      return;
    }
    const report = readStore(KEYS.latestReport, {});
    profile = {
      id: profile?.id || uid("profile"),
      nickname: nickname.slice(0, 24),
      mbti,
      zodiac,
      bio: elements.profileBio.value.trim().slice(0, 70),
      title: profile?.title || report.title || "",
      interest: profile?.interest || report.interest || "",
      createdAt: profile?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    writeStore(KEYS.profile, profile);
    elements.profileModal.classList.add("hidden");
    const action = pendingAction;
    pendingAction = null;
    renderAll();
    showToast("同频身份已保存。");
    if (action) setTimeout(action, 0);
  });

  elements.postInput.addEventListener("input", () => {
    elements.postCount.textContent = elements.postInput.value.length;
  });
  elements.postForm.addEventListener("submit", event => {
    event.preventDefault();
    const content = elements.postInput.value.trim();
    if (!content) {
      showToast("先写下一段真实内容。");
      return;
    }
    requireProfile(() => {
      posts.push({
        id: uid("post"),
        room: currentRoomId,
        authorId: profile.id,
        nickname: profile.nickname,
        mbti: profile.mbti,
        zodiac: profile.zodiac,
        content: content.slice(0, 360),
        tags: [currentRoom().label, profile.mbti],
        likes: 0,
        replies: [],
        createdAt: Date.now()
      });
      persistPosts();
      elements.postInput.value = "";
      elements.postCount.textContent = "0";
      renderPosts();
      showToast("讨论已发布。");
    });
  });

  elements.postList.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const article = actionButton.closest("[data-post-id]");
    const postId = article?.dataset.postId;
    if (!postId) return;
    const action = actionButton.dataset.action;

    if (action === "like") {
      if (likedPosts.has(postId)) likedPosts.delete(postId);
      else likedPosts.add(postId);
      writeStore(KEYS.likes, [...likedPosts]);
      renderPosts();
    }
    if (action === "reply") {
      if (expandedReplies.has(postId)) expandedReplies.delete(postId);
      else expandedReplies.add(postId);
      renderPosts();
      setTimeout(() => elements.postList.querySelector(`[data-post-id="${CSS.escape(postId)}"] .reply-form input`)?.focus(), 0);
    }
    if (action === "hide") {
      hiddenPosts.add(postId);
      writeStore(KEYS.hidden, [...hiddenPosts]);
      renderPosts();
      showToast("这条内容已在你的设备上隐藏。");
    }
    if (action === "report") {
      hiddenPosts.add(postId);
      writeStore(KEYS.hidden, [...hiddenPosts]);
      renderPosts();
      showToast("举报已记录，正式上线后会进入审核队列。");
    }
    if (action === "delete") {
      posts = posts.filter(post => post.id !== postId);
      persistPosts();
      renderPosts();
      showToast("你的讨论已删除。");
    }
  });

  elements.postList.addEventListener("submit", event => {
    const form = event.target.closest("[data-reply-form]");
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector("input");
    const content = input.value.trim();
    if (!content) return;
    requireProfile(() => {
      const post = editablePost(form.dataset.replyForm);
      if (!post) return;
      post.replies = post.replies || [];
      post.replies.push({
        id: uid("reply"),
        authorId: profile.id,
        nickname: profile.nickname,
        mbti: profile.mbti,
        content: content.slice(0, 180),
        createdAt: Date.now()
      });
      persistPosts();
      expandedReplies.add(post.id);
      renderPosts();
      showToast("回应已发布。");
    });
  });

  elements.discussionTab.addEventListener("click", () => {
    currentMode = "discussion";
    renderMode();
  });
  elements.chatTab.addEventListener("click", () => {
    currentMode = "chat";
    renderMode();
  });
  elements.chatForm.addEventListener("submit", event => {
    event.preventDefault();
    const content = elements.chatInput.value.trim();
    if (!content) return;
    requireProfile(() => {
      messages.push({
        id: uid("message"),
        room: currentRoomId,
        authorId: profile.id,
        nickname: profile.nickname,
        mbti: profile.mbti,
        content: content.slice(0, 240),
        createdAt: Date.now()
      });
      persistMessages();
      elements.chatInput.value = "";
      renderChat();
    });
  });

  window.addEventListener("storage", event => {
    if (event.key === KEYS.posts) {
      posts = readStore(KEYS.posts, []);
      renderPosts();
    }
    if (event.key === KEYS.messages) {
      messages = readStore(KEYS.messages, []);
      renderChat();
    }
  });
  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && !elements.profileModal.classList.contains("hidden")) {
      const openChoice = elements.profileForm.querySelector(".choice-picker.open");
      if (openChoice) {
        closeProfileChoices();
        openChoice.querySelector(".choice-trigger")?.focus();
      } else {
        closeProfileModal();
      }
    }
  });

  hydrateFromQuery();
  const hashRoom = location.hash.replace("#", "");
  if (ROOMS.some(room => room.id === hashRoom)) currentRoomId = hashRoom;
  populateProfileFields();
  renderAll();
})();
