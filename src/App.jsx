import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Phone, Video, MoreVertical, Send, Plus, Search, X,
  Mic, MicOff, Volume2, PhoneOff, CheckCheck, Check, Trash2,
  Pencil, PhoneIncoming, MessageCircle, Camera, PhoneMissed,
  PhoneOutgoing, PhoneCall, Users, RefreshCcw, UserPlus,
  Settings, Volume1, VolumeX, Smile, ArrowRight, ArrowLeft as ArrowLeftIcon,
  Play, Pause, X as CloseIcon, BadgeCheck, Image as ImageIcon, Square,
  Archive as ArchiveIcon, Megaphone, Plus as PlusIcon
} from "lucide-react";

const THEMES = {
  whatsapp: {
    label: "WhatsApp", headerBg: "#FFFFFF", headerText: "#111B21", headerSubText: "#667781",
    chatBg: "#E9DFD3", sentBubble: "#D9FDD3", sentText: "#0B141A", receivedBubble: "#FFFFFF", receivedText: "#0B141A",
    accent: "#25D366", accentDark: "#008069", inputBg: "#F0F0F0",
    font: "'Segoe UI', Helvetica, Arial, sans-serif", callBg: "#0B141A", callAccent: "#25D366",
    tickColor: "#53BDEB", radius: "8px",
  },
  messenger: {
    label: "Messenger", headerBg: "#FFFFFF", headerText: "#050505", headerSubText: "#65676B",
    chatBg: "#FFFFFF", sentBubble: "linear-gradient(135deg,#00C6FF 0%,#0084FF 100%)", sentText: "#FFFFFF",
    receivedBubble: "#F0F0F0", receivedText: "#050505", accent: "#0084FF", accentDark: "#0084FF", inputBg: "#F0F2F5",
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif", callBg: "#08090A", callAccent: "#0084FF",
    tickColor: "#0084FF", radius: "20px",
  },
  imessage: {
    label: "iMessage", headerBg: "#F7F7F8", headerText: "#000000", headerSubText: "#8E8E93",
    chatBg: "#FFFFFF", sentBubble: "#007AFF", sentText: "#FFFFFF", receivedBubble: "#E9E9EB", receivedText: "#000000",
    accent: "#007AFF", accentDark: "#007AFF", inputBg: "#F0F0F0",
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", callBg: "#000000", callAccent: "#30D158",
    tickColor: "#8E8E93", radius: "18px",
  },
};

const doodle = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g fill='none' stroke='%2300000014' stroke-width='2.2'>" +
  "<circle cx='18' cy='22' r='7'/><path d='M55 8 q12 10 0 22 q-12 10 0 22'/>" +
  "<rect x='85' y='16' width='16' height='16' rx='4'/><path d='M12 70 l12 12 l-12 12'/>" +
  "<path d='M70 78 q10 -14 20 0 q10 14 20 0'/><circle cx='100' cy='100' r='6'/>" +
  "<path d='M35 95 l8 -14 l8 14 z'/></g></svg>"
);
const WALLPAPERS = {
  classic: { label: "Classic Tan", css: { backgroundColor: "#E9DFD3" } },
  doodle: { label: "Doodle", css: { backgroundColor: "#E5DDD3", backgroundImage: `url("data:image/svg+xml,${doodle}")`, backgroundSize: "220px" } },
  teal: { label: "Soft Teal", css: { backgroundColor: "#D9F0E8" } },
  blue: { label: "Soft Blue", css: { backgroundColor: "#DCE6F5" } },
  blush: { label: "Soft Blush", css: { backgroundColor: "#F5E1E6" } },
  midnight: { label: "Midnight", css: { backgroundColor: "#0B141A", backgroundImage: `url("data:image/svg+xml,${doodle.replaceAll("%2300000014", "%23FFFFFF10")}")`, backgroundSize: "220px" } },
  sunset: { label: "Sunset", css: { backgroundImage: "linear-gradient(160deg,#FFDDB0 0%,#FFB199 60%,#F97C7C 100%)" } },
  forest: { label: "Forest", css: { backgroundColor: "#DCEFDD", backgroundImage: `url("data:image/svg+xml,${doodle.replaceAll("%2300000014", "%230F5C3220")}")`, backgroundSize: "220px" } },
};

const AVATAR_COLORS = ["#F87171", "#FB923C", "#FBBF24", "#4ADE80", "#2DD4BF", "#60A5FA", "#A78BFA", "#F472B6"];
const NAME_COLORS = ["#E11D48", "#0D9488", "#7C3AED", "#D97706", "#2563EB", "#DB2777", "#059669", "#B45309"];
const WA = "#008069";
const WA_LIGHT = "#25D366";

function colorForName(name) {
  let hash = 0; const n = name || "?";
  for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function nameColorFor(name) {
  let hash = 0; const n = name || "?";
  for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
  return NAME_COLORS[Math.abs(hash) % NAME_COLORS.length];
}
function initials(name) {
  const parts = (name || "?").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function fmtTime(ts) { return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
function dateLabel(ts) {
  const d = new Date(ts); const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}
function fmtCallTime(ts) {
  const d = new Date(ts); const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  if (isYest) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + `, ${time}`;
}
function fmtDuration(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return fmtCallTime(ts);
}
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function genWaveform(n = 24) { return Array.from({ length: n }, () => 6 + Math.round(Math.random() * 16)); }

function resizeImageFile(file, maxDim = 320) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height) { if (width > maxDim) { height = height * (maxDim / width); width = maxDim; } }
      else { if (height > maxDim) { width = width * (maxDim / height); height = maxDim; } }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function Avatar({ entity, size = 50 }) {
  const bg = entity?.color || colorForName(entity?.name);
  if (entity?.avatar) return <img src={entity.avatar} alt="" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.34 }}>
      {entity?.type === "group" ? <Users size={size * 0.44} /> : initials(entity?.name)}
    </div>
  );
}
function LogoMark({ size = 32, rounded = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" style={{ borderRadius: rounded ? size * 0.2 : 0, display: "block" }}>
      <defs>
        <linearGradient id="fcsGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25D366" />
          <stop offset="1" stopColor="#087691" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1024" height="1024" rx="210" fill="url(#fcsGrad)" />
      <ellipse cx="230" cy="150" rx="520" ry="380" fill="#ffffff" opacity="0.06" />
      <rect x="192" y="210" width="560" height="430" rx="90" fill="#ffffff" />
      <polygon points="302,634 262,730 402,634" fill="#ffffff" />
      <rect x="544" y="584" width="330" height="250" rx="60" fill="none" stroke="#ffffff" strokeWidth="26" />
      <polygon points="784,838 834,904 724,838" fill="#ffffff" />
      <rect x="724" y="824" width="110" height="16" fill="#ffffff" />
      <circle cx="382" cy="415" r="26" fill="#087691" />
      <circle cx="472" cy="415" r="26" fill="#25D366" />
      <circle cx="562" cy="415" r="26" fill="#087691" />
    </svg>
  );
}
function VerifiedBadge({ size = 14 }) {
  return <BadgeCheck size={size} color="#fff" fill="#3B82F6" className="inline shrink-0" />;
}
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-11 h-6 rounded-full relative transition shrink-0" style={{ background: checked ? WA_LIGHT : "#D1D5DB" }}>
      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

function useSoundEngine(enabled) {
  const ctxRef = useRef(null);
  function getCtx() {
    if (!enabled) return null;
    try {
      if (!ctxRef.current) { const AC = window.AudioContext || window.webkitAudioContext; ctxRef.current = new AC(); }
      if (ctxRef.current.state === "suspended") ctxRef.current.resume();
      return ctxRef.current;
    } catch (e) { return null; }
  }
  function tone(freq, start, duration, gainVal = 0.16, type = "sine") {
    const c = getCtx(); if (!c) return;
    try {
      const osc = c.createOscillator(); const gain = c.createGain();
      osc.type = type; osc.frequency.value = freq;
      osc.connect(gain); gain.connect(c.destination);
      const t0 = c.currentTime + start;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(gainVal, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.start(t0); osc.stop(t0 + duration + 0.03);
    } catch (e) {}
  }
  return {
    sent: () => { tone(720, 0, 0.07); tone(980, 0.06, 0.09); },
    received: () => { tone(560, 0, 0.07); tone(780, 0.07, 0.11); },
    ring: () => { tone(950, 0, 0.28, 0.13); tone(950, 0.45, 0.28, 0.13); },
    connect: () => { tone(500, 0, 0.08, 0.13); tone(700, 0.08, 0.08, 0.13); tone(900, 0.16, 0.12, 0.13); },
    end: () => { tone(400, 0, 0.15, 0.13); },
  };
}

function VoiceBubble({ msg, isMe, theme, platform }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const waveform = msg.waveform || [];
  const hasRealAudio = !!msg.audioData;

  useEffect(() => {
    if (!hasRealAudio) return;
    const audio = new Audio(msg.audioData);
    audioRef.current = audio;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.pause(); audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, [msg.audioData]);

  useEffect(() => {
    if (hasRealAudio || !playing) return;
    const start = Date.now(); const dur = Math.max(msg.duration, 1) * 1000;
    const iv = setInterval(() => {
      const p = (Date.now() - start) / dur;
      if (p >= 1) { setProgress(1); setPlaying(false); clearInterval(iv); }
      else setProgress(p);
    }, 60);
    return () => clearInterval(iv);
  }, [playing, hasRealAudio]);

  function toggle() {
    if (hasRealAudio) {
      const audio = audioRef.current; if (!audio) return;
      if (playing) { audio.pause(); setPlaying(false); }
      else { if (progress >= 0.999) { audio.currentTime = 0; } audio.play().catch(() => {}); setPlaying(true); }
    } else {
      if (progress >= 1) setProgress(0);
      setPlaying((p) => !p);
    }
  }

  const activeBars = Math.round(progress * waveform.length);
  return (
    <div className="flex items-center gap-2 min-w-[190px]">
      <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: isMe ? "rgba(0,0,0,0.15)" : (platform === "whatsapp" ? "#128C7E" : theme.accent), color: "#fff" }}>
        {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: 1 }} />}
      </button>
      <div className="flex items-end gap-[2px] flex-1 h-6">
        {waveform.map((h, i) => (
          <div key={i} className="w-[3px] rounded-full" style={{ height: h, background: i < activeBars ? (isMe ? (platform === "whatsapp" ? "#0B7A6B" : "#fff") : (theme.accent)) : (isMe ? "rgba(11,20,26,0.35)" : "rgba(0,0,0,0.2)") }} />
        ))}
      </div>
      <span className="text-[10.5px] opacity-70 shrink-0">{fmtDuration(msg.duration)}</span>
    </div>
  );
}

export default function ChatSimulator() {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [vh, setVh] = useState(null);
  useEffect(() => {
    function updateVh() {
      if (window.visualViewport) setVh(window.visualViewport.height);
      else setVh(window.innerHeight);
    }
    updateVh();
    window.visualViewport?.addEventListener("resize", updateVh);
    window.visualViewport?.addEventListener("scroll", updateVh);
    window.addEventListener("resize", updateVh);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateVh);
      window.visualViewport?.removeEventListener("scroll", updateVh);
      window.removeEventListener("resize", updateVh);
    };
  }, []);
  const [statuses, setStatuses] = useState([]);
  const [messages, setMessages] = useState({});
  const [callLogs, setCallLogs] = useState([]);
  const [settings, setSettings] = useState({ soundsEnabled: true, wallpaper: "doodle", myName: "You", myAvatar: null, myAbout: "Hey there! I am using WhatsApp.", myStatus: null, customWallpaper: null });
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("chats");
  const [activeId, setActiveId] = useState(null);
  const [activeCommunityId, setActiveCommunityId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [viewingStatusId, setViewingStatusId] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [call, setCall] = useState(null);
  const [tick, setTick] = useState(0);
  const [input, setInput] = useState("");
  const [sendAs, setSendAs] = useState("me");
  const [avatarTarget, setAvatarTarget] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const outgoingTimeoutRef = useRef(null);
  const callRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const pressTimer = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordTimerRef = useRef(null);
  const recordSecondsRef = useRef(0);

  const [form, setForm] = useState({ name: "", phone: "", bio: "", platform: "whatsapp", avatar: null, verified: false, presence: "" });
  const [groupForm, setGroupForm] = useState({ name: "", bio: "", platform: "whatsapp", memberIds: [], avatar: null, verified: false });
  const [communityForm, setCommunityForm] = useState({ name: "", bio: "", avatar: null, groupIds: [] });
  const [statusForm, setStatusForm] = useState({ text: "", color: "#25D366", ownerId: "me" });

  const sound = useSoundEngine(settings.soundsEnabled);

  useEffect(() => {
    (async () => {
      try { const c = await window.storage.get("contacts", false); if (c && c.value) setContacts(JSON.parse(c.value)); } catch (e) {}
      try { const g = await window.storage.get("groups", false); if (g && g.value) setGroups(JSON.parse(g.value)); } catch (e) {}
      try { const cm = await window.storage.get("communities", false); if (cm && cm.value) setCommunities(JSON.parse(cm.value)); } catch (e) {}
      try { const st = await window.storage.get("statuses", false); if (st && st.value) setStatuses(JSON.parse(st.value)); } catch (e) {}
      try { const m = await window.storage.get("messages", false); if (m && m.value) setMessages(JSON.parse(m.value)); } catch (e) {}
      try { const l = await window.storage.get("callLogs", false); if (l && l.value) setCallLogs(JSON.parse(l.value)); } catch (e) {}
      try { const s = await window.storage.get("settings", false); if (s && s.value) setSettings((prev) => ({ ...prev, ...JSON.parse(s.value) })); } catch (e) {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) window.storage.set("contacts", JSON.stringify(contacts), false).catch(() => {}); }, [contacts, loaded]);
  useEffect(() => { if (loaded) window.storage.set("groups", JSON.stringify(groups), false).catch(() => {}); }, [groups, loaded]);
  useEffect(() => { if (loaded) window.storage.set("communities", JSON.stringify(communities), false).catch(() => {}); }, [communities, loaded]);
  useEffect(() => { if (loaded) window.storage.set("statuses", JSON.stringify(statuses), false).catch(() => {}); }, [statuses, loaded]);
  useEffect(() => { if (loaded) window.storage.set("messages", JSON.stringify(messages), false).catch(() => {}); }, [messages, loaded]);
  useEffect(() => { if (loaded) window.storage.set("callLogs", JSON.stringify(callLogs), false).catch(() => {}); }, [callLogs, loaded]);
  useEffect(() => { if (loaded) window.storage.set("settings", JSON.stringify(settings), false).catch(() => {}); }, [settings, loaded]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, activeId, screen]);

  useEffect(() => {
    if (call && call.status === "active") timerRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [call?.status]);
  useEffect(() => { callRef.current = call; }, [call]);
  useEffect(() => {
    if (call?.status === "ringing") { sound.ring(); const iv = setInterval(() => sound.ring(), 1900); return () => clearInterval(iv); }
  }, [call?.status, settings.soundsEnabled]);

  function getEntity(id) {
    const c = contacts.find((x) => x.id === id); if (c) return { ...c, type: "contact" };
    const g = groups.find((x) => x.id === id); if (g) return { ...g, type: "group" };
    return null;
  }
  function membersOf(entity) {
    if (!entity) return [];
    if (entity.type === "group") return entity.memberIds.map((id) => contacts.find((c) => c.id === id)).filter(Boolean);
    return [entity];
  }
  function senderInfo(entity, senderId) {
    if (senderId === "me") return null;
    if (entity.type === "contact") return entity;
    const m = contacts.find((c) => c.id === senderId);
    return m || { name: "Unknown", color: "#9CA3AF" };
  }

  const activeEntity = getEntity(activeId);
  const theme = activeEntity ? THEMES[activeEntity.platform] : THEMES.whatsapp;
  const activeMembers = membersOf(activeEntity);

  function triggerAvatarPicker(target) { setAvatarTarget(target); fileInputRef.current?.click(); }
  async function handleAvatarFile(e) {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageFile(file, 320);
      if (avatarTarget === "contact") setForm((f) => ({ ...f, avatar: dataUrl }));
      else if (avatarTarget === "group") setGroupForm((f) => ({ ...f, avatar: dataUrl }));
      else if (avatarTarget === "community") setCommunityForm((f) => ({ ...f, avatar: dataUrl }));
      else if (avatarTarget === "me") setSettings((s) => ({ ...s, myAvatar: dataUrl }));
      else if (avatarTarget === "wallpaper") setSettings((s) => ({ ...s, wallpaper: "custom", customWallpaper: dataUrl }));
    } catch (err) {}
  }

  // ---- Status helpers ----
  function activeStatuses() { const cutoff = Date.now() - 24 * 3600 * 1000; return statuses.filter((s) => s.ts > cutoff); }
  function statusOwnerEntity(ownerId) {
    if (ownerId === "me") return { name: settings.myName, avatar: settings.myAvatar, color: WA, type: "contact" };
    return getEntity(ownerId);
  }
  function groupedStatuses() {
    const groups = {};
    activeStatuses().forEach((s) => { (groups[s.ownerId] = groups[s.ownerId] || []).push(s); });
    return Object.entries(groups).map(([ownerId, items]) => ({ ownerId, items: items.sort((a, b) => a.ts - b.ts), latest: Math.max(...items.map((i) => i.ts)) })).sort((a, b) => b.latest - a.latest);
  }
  function postStatus() {
    if (!statusForm.text.trim()) return;
    setStatuses((s) => [...s, { id: uid(), ownerId: statusForm.ownerId || "me", text: statusForm.text.trim(), color: statusForm.color, ts: Date.now() }]);
    setStatusForm({ text: "", color: "#25D366", ownerId: "me" });
    setShowStatusModal(false);
  }
  function deleteStatus(id) { setStatuses((s) => s.filter((x) => x.id !== id)); setViewingStatusId(null); }

  // ---- Community helpers ----
  function resetCommunityForm() { setCommunityForm({ name: "", bio: "", avatar: null, groupIds: [] }); setEditingCommunity(null); }
  function openAddCommunityModal() { resetCommunityForm(); setShowCommunityModal(true); setShowFabMenu(false); }
  function openEditCommunityModal(community) {
    setCommunityForm({ name: community.name, bio: community.bio || "", avatar: community.avatar || null, groupIds: [...community.groupIds] });
    setEditingCommunity(community.id); setShowCommunityModal(true);
  }
  function toggleCommunityGroup(id) { setCommunityForm((f) => ({ ...f, groupIds: f.groupIds.includes(id) ? f.groupIds.filter((g) => g !== id) : [...f.groupIds, id] })); }
  function saveCommunity() {
    if (!communityForm.name.trim()) return;
    if (editingCommunity) setCommunities((cs) => cs.map((c) => (c.id === editingCommunity ? { ...c, ...communityForm } : c)));
    else setCommunities((cs) => [...cs, { id: uid(), color: colorForName(communityForm.name), ...communityForm }]);
    setShowCommunityModal(false); resetCommunityForm();
  }
  function deleteCommunity(id) { setCommunities((cs) => cs.filter((c) => c.id !== id)); if (activeCommunityId === id) setActiveCommunityId(null); }

  function resetForm() { setForm({ name: "", phone: "", bio: "", platform: "whatsapp", avatar: null, verified: false, presence: "" }); setEditing(null); }
  function openAddModal() { resetForm(); setShowModal(true); setShowFabMenu(false); }
  function openEditModal(contact) {
    setForm({ name: contact.name, phone: contact.phone, bio: contact.bio, platform: contact.platform, avatar: contact.avatar || null, verified: !!contact.verified, presence: contact.presence || "" });
    setEditing(contact.id); setMenuOpenFor(null); setShowModal(true);
  }
  function saveContact() {
    if (!form.name.trim()) return;
    if (editing) setContacts((cs) => cs.map((c) => (c.id === editing ? { ...c, ...form } : c)));
    else setContacts((cs) => [...cs, { id: uid(), color: colorForName(form.name), ...form }]);
    setShowModal(false); resetForm();
  }
  function toggleArchive(entity) {
    setMenuOpenFor(null);
    if (entity.type === "group") setGroups((gs) => gs.map((g) => (g.id === entity.id ? { ...g, archived: !g.archived } : g)));
    else setContacts((cs) => cs.map((c) => (c.id === entity.id ? { ...c, archived: !c.archived } : c)));
  }
  function deleteContact(id) {
    setContacts((cs) => cs.filter((c) => c.id !== id));
    setGroups((gs) => gs.map((g) => ({ ...g, memberIds: g.memberIds.filter((m) => m !== id) })));
    setMessages((m) => { const c = { ...m }; delete c[id]; return c; });
    setMenuOpenFor(null);
    if (activeId === id) { setScreen("chats"); setActiveId(null); }
  }

  function resetGroupForm() { setGroupForm({ name: "", bio: "", platform: "whatsapp", memberIds: [], avatar: null, verified: false }); setEditingGroup(null); }
  function openAddGroupModal() { resetGroupForm(); setShowGroupModal(true); setShowFabMenu(false); }
  function openEditGroupModal(group) {
    setGroupForm({ name: group.name, bio: group.bio || "", platform: group.platform, memberIds: [...group.memberIds], avatar: group.avatar || null, verified: !!group.verified });
    setEditingGroup(group.id); setMenuOpenFor(null); setShowGroupModal(true);
  }
  function toggleGroupMember(id) { setGroupForm((f) => ({ ...f, memberIds: f.memberIds.includes(id) ? f.memberIds.filter((m) => m !== id) : [...f.memberIds, id] })); }
  function saveGroup() {
    if (!groupForm.name.trim() || groupForm.memberIds.length === 0) return;
    if (editingGroup) setGroups((gs) => gs.map((g) => (g.id === editingGroup ? { ...g, ...groupForm } : g)));
    else setGroups((gs) => [...gs, { id: uid(), color: colorForName(groupForm.name), ...groupForm }]);
    setShowGroupModal(false); resetGroupForm();
  }
  function deleteGroup(id) {
    setGroups((gs) => gs.filter((g) => g.id !== id));
    setMessages((m) => { const c = { ...m }; delete c[id]; return c; });
    setMenuOpenFor(null);
    if (activeId === id) { setScreen("chats"); setActiveId(null); }
  }

  function openChat(id) { setActiveId(id); setScreen("chat"); setSendAs("me"); setInput(""); setEditingMsgId(null); }

  function sendMessage() {
    if (editingMsgId) { saveEdit(); return; }
    if (!input.trim() || !activeId) return;
    const msg = { id: uid(), sender: sendAs, type: "text", text: input.trim(), ts: Date.now(), status: "sent" };
    setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] || []), msg] }));
    setInput("");
    if (sendAs === "me") sound.sent(); else sound.received();
  }
  function sendFakeVoiceMessage() {
    if (!activeId || editingMsgId) return;
    const msg = { id: uid(), sender: sendAs, type: "voice", duration: 4 + Math.floor(Math.random() * 26), waveform: genWaveform(), ts: Date.now(), status: "sent" };
    setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] || []), msg] }));
    if (sendAs === "me") sound.sent(); else sound.received();
  }

  async function startRecording() {
    if (!activeId || editingMsgId) return;
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start();
      mediaRecorderRef.current = mr;
      streamRef.current = stream;
      recordSecondsRef.current = 0;
      setRecordSeconds(0);
      setRecording(true);
      recordTimerRef.current = setInterval(() => { recordSecondsRef.current += 1; setRecordSeconds(recordSecondsRef.current); }, 1000);
    } catch (err) {
      // Microphone unavailable (denied, unsupported, or blocked in this preview) — fall back to a simulated voice message.
      setMicError("mic-unavailable");
      sendFakeVoiceMessage();
    }
  }
  function stopRecording(send) {
    clearInterval(recordTimerRef.current);
    const mr = mediaRecorderRef.current;
    if (!mr) { setRecording(false); return; }
    mr.onstop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setRecording(false);
      const seconds = recordSecondsRef.current;
      if (send && seconds >= 1) {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const msg = { id: uid(), sender: sendAs, type: "voice", duration: seconds, waveform: genWaveform(), audioData: reader.result, ts: Date.now(), status: "sent" };
          setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] || []), msg] }));
          if (sendAs === "me") sound.sent(); else sound.received();
        };
        reader.readAsDataURL(blob);
      }
      mediaRecorderRef.current = null;
    };
    mr.stop();
  }

  function triggerImagePicker() { imageInputRef.current?.click(); }
  async function handleImageFile(e) {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !activeId) return;
    try {
      const dataUrl = await resizeImageFile(file, 900);
      const msg = { id: uid(), sender: sendAs, type: "image", imageData: dataUrl, ts: Date.now(), status: "sent" };
      setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] || []), msg] }));
      if (sendAs === "me") sound.sent(); else sound.received();
    } catch (err) {}
  }
  function startEdit(msg) { if (msg.type !== "text") return; setEditingMsgId(msg.id); setInput(msg.text || ""); setActiveMsgMenu(null); }
  function cancelEdit() { setEditingMsgId(null); setInput(""); }
  function saveEdit() {
    if (!editingMsgId) return;
    setMessages((m) => ({ ...m, [activeId]: (m[activeId] || []).map((msg) => (msg.id === editingMsgId ? { ...msg, text: input.trim(), edited: true } : msg)) }));
    setEditingMsgId(null); setInput("");
  }
  function deleteMessage(msgId) {
    setMessages((m) => ({ ...m, [activeId]: (m[activeId] || []).filter((x) => x.id !== msgId) }));
    setActiveMsgMenu(null);
  }
  function cycleStatus(msgId) {
    setMessages((m) => ({
      ...m,
      [activeId]: (m[activeId] || []).map((msg) => {
        if (msg.id !== msgId) return msg;
        const next = msg.status === "sent" ? "delivered" : msg.status === "delivered" ? "read" : "sent";
        return { ...msg, status: next };
      }),
    }));
  }
  function handlePressStart(msg) { pressTimer.current = setTimeout(() => setActiveMsgMenu(msg.id), 420); }
  function handlePressEnd() { if (pressTimer.current) clearTimeout(pressTimer.current); }

  function lastMessagePreview(id, entity) {
    const arr = messages[id] || [];
    if (arr.length === 0) return entity.type === "group" ? `${membersOf(entity).length} members` : "No messages yet";
    const last = arr[arr.length - 1];
    const body = last.type === "voice" ? "🎤 Voice message" : last.type === "image" ? "📷 Photo" : last.text;
    if (last.sender === "me") return "You: " + body;
    if (entity.type === "group") { const s = senderInfo(entity, last.sender); return `${s ? s.name.split(" ")[0] : "Unknown"}: ${body}`; }
    return body;
  }
  function lastMessageTime(id) { const arr = messages[id] || []; return arr.length === 0 ? "" : fmtTime(arr[arr.length - 1].ts); }
  function lastMessageTs(id) { const arr = messages[id] || []; return arr.length === 0 ? 0 : arr[arr.length - 1].ts; }

  function startOutgoingCall(kind, entityId) {
    const id = entityId || activeId;
    setActiveId(id); setScreen("call");
    setCall({ kind, direction: "outgoing", status: "ringing", startedAt: null, contactId: id });
    outgoingTimeoutRef.current = setTimeout(() => { setCall((c) => (c ? { ...c, status: "active", startedAt: Date.now() } : c)); setTick(0); sound.connect(); }, 2600);
  }
  function simulateIncomingCall(kind) { setShowHeaderMenu(false); setScreen("call"); setCall({ kind, direction: "incoming", status: "ringing", startedAt: null, contactId: activeId }); }
  function acceptCall() { setCall((c) => (c ? { ...c, status: "active", startedAt: Date.now() } : c)); setTick(0); sound.connect(); }
  function endCall() {
    if (outgoingTimeoutRef.current) clearTimeout(outgoingTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    const c = callRef.current; sound.end();
    if (c) {
      let outcome = "answered"; let duration = 0;
      if (c.status === "active" && c.startedAt) { duration = Math.floor((Date.now() - c.startedAt) / 1000); outcome = "answered"; }
      else outcome = c.direction === "incoming" ? "missed" : "cancelled";
      setCallLogs((logs) => [{ id: uid(), contactId: c.contactId, kind: c.kind, direction: c.direction, outcome, duration, ts: Date.now() }, ...logs]);
    }
    setCall(null); setScreen(c && c.contactId === activeId ? "chat" : "chats");
  }
  const durationSeconds = call && call.status === "active" && call.startedAt ? Math.floor((Date.now() - call.startedAt) / 1000) : 0;
  const missedCount = callLogs.filter((l) => l.outcome === "missed").length;

  function BottomNav() {
    const items = [
      { key: "chats", label: "Chats", icon: MessageCircle, badge: 0 },
      { key: "updates", label: "Updates", icon: RefreshCcw, badge: 0 },
      { key: "communities", label: "Communities", icon: Users, badge: 0 },
      { key: "calls", label: "Calls", icon: Phone, badge: missedCount },
    ];
    return (
      <div className="shrink-0 flex items-stretch border-t border-gray-200 bg-white" style={{ paddingBottom: "2px" }}>
        {items.map((it) => {
          const active = screen === it.key;
          return (
            <button key={it.key} onClick={() => setScreen(it.key)} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative">
              <div className="relative">
                <it.icon size={22} color={active ? WA : "#8696A0"} strokeWidth={active ? 2.3 : 2} />
                {it.badge > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-semibold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">{it.badge}</span>}
              </div>
              <span className="text-[11px]" style={{ color: active ? WA : "#8696A0", fontWeight: active ? 600 : 400 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function renderChatsTab() {
    let allEntities = [...contacts.map((c) => ({ ...c, type: "contact" })), ...groups.map((g) => ({ ...g, type: "group" }))]
      .sort((a, b) => lastMessageTs(b.id) - lastMessageTs(a.id));
    const archivedList = allEntities.filter((e) => e.archived);
    allEntities = allEntities.filter((e) => !e.archived);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      allEntities = allEntities.filter((e) => e.name.toLowerCase().includes(q));
    }
    return (
      <div className="flex flex-col h-full min-h-0 bg-white" style={{ fontFamily: THEMES.whatsapp.font }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <h1 className="text-[26px] font-bold text-gray-900">WhatsApp</h1>
          <div className="flex items-center gap-4 text-gray-700">
            <Camera size={21} />
            <button onClick={() => { setSearchOpen((v) => !v); setSearchQuery(""); }}><Search size={20} /></button>
            <button onClick={() => setScreen("settings")}><Settings size={20} /></button>
          </div>
        </div>
        {searchOpen && (
          <div className="px-3 pb-2 shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search chats" className="flex-1 bg-transparent outline-none text-sm" />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X size={15} className="text-gray-400" /></button>}
            </div>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          {!showArchived && archivedList.length > 0 && !searchQuery && (
            <button onClick={() => setShowArchived(true)} className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 text-left">
              <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><Users size={18} color="#667781" /></div>
              <span className="text-[14.5px] text-gray-700 font-medium">Archived</span>
              <span className="ml-auto text-xs text-gray-400">{archivedList.length}</span>
            </button>
          )}
          {showArchived && (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
              <button onClick={() => setShowArchived(false)} className="p-1"><ArrowLeft size={18} /></button>
              <span className="text-sm font-semibold text-gray-800">Archived chats</span>
            </div>
          )}
          {(showArchived ? archivedList : allEntities).length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 text-gray-400 gap-2">
              <MessageCircle size={40} strokeWidth={1.5} />
              <p className="text-sm">{showArchived ? "No archived chats." : searchQuery ? "No chats match your search." : "No chats yet.\nTap the green button to add a contact or group."}</p>
            </div>
          )}
          {(showArchived ? archivedList : allEntities).map((e) => (
            <div key={e.id} className="relative flex items-center gap-3 px-4 py-2.5 active:bg-gray-50">
              <button onClick={() => openChat(e.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <Avatar entity={e} size={50} />
                <div className="flex-1 min-w-0 border-b border-gray-100 pb-2.5 -mb-2.5 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 truncate text-[16.5px] flex items-center gap-1">{e.name}{e.verified && <VerifiedBadge size={15} />}</span>
                    <span className="text-xs text-gray-400 shrink-0">{lastMessageTime(e.id)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5"><span className="text-[13.5px] text-gray-500 truncate">{lastMessagePreview(e.id, e)}</span></div>
                </div>
              </button>
              <button onClick={() => setMenuOpenFor(menuOpenFor === e.id ? null : e.id)} className="p-2 text-gray-400 self-start mt-1"><MoreVertical size={16} /></button>
              {menuOpenFor === e.id && (
                <div className="absolute right-4 top-12 z-20 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden w-40">
                  <button onClick={() => (e.type === "group" ? openEditGroupModal(e) : openEditModal(e))} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Pencil size={14} /> Edit</button>
                  <button onClick={() => toggleArchive(e)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><ArchiveIcon size={14} /> {e.archived ? "Unarchive" : "Archive"}</button>
                  <button onClick={() => (e.type === "group" ? deleteGroup(e.id) : deleteContact(e.id))} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-gray-50"><Trash2 size={14} /> Delete</button>
                </div>
              )}
            </div>
          ))}
          <div className="absolute bottom-5 right-4 flex flex-col items-end gap-3">
            {showFabMenu && (
              <div className="flex flex-col items-end gap-2 mb-1">
                <button onClick={openAddGroupModal} className="flex items-center gap-2 bg-white shadow-lg rounded-full pl-4 pr-3 py-2.5 text-sm font-medium text-gray-800">New group <Users size={17} color={WA} /></button>
                <button onClick={openAddModal} className="flex items-center gap-2 bg-white shadow-lg rounded-full pl-4 pr-3 py-2.5 text-sm font-medium text-gray-800">New contact <UserPlus size={17} color={WA} /></button>
              </div>
            )}
            <button onClick={() => setShowFabMenu((v) => !v)} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition" style={{ background: WA_LIGHT }}>{showFabMenu ? <X size={24} /> : <MessageCircle size={22} fill="white" />}</button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  function renderCallsTab() {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white" style={{ fontFamily: THEMES.whatsapp.font }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <h1 className="text-[26px] font-bold text-gray-900">Calls</h1>
          <div className="flex items-center gap-4 text-gray-700"><Search size={20} /><button onClick={() => setScreen("settings")}><Settings size={20} /></button></div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          {callLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 text-gray-400 gap-2"><Phone size={40} strokeWidth={1.5} /><p className="text-sm">No recent calls.<br />Tap the green button to start one.</p></div>
          )}
          {callLogs.map((log) => {
            const e = getEntity(log.contactId);
            const missed = log.outcome === "missed"; const cancelled = log.outcome === "cancelled";
            const ArrowIcon = missed ? PhoneMissed : log.direction === "outgoing" ? PhoneOutgoing : PhoneIncoming;
            const arrowColor = missed ? "#FF3B30" : "#25D366";
            const label = cancelled ? "Outgoing call · not answered" : missed ? `Missed ${log.kind} call` : `${log.direction === "outgoing" ? "Outgoing" : "Incoming"} ${log.kind} call`;
            return (
              <div key={log.id} className="flex items-center gap-3 px-4 py-2.5 active:bg-gray-50">
                <Avatar entity={e || { name: "?", color: "#9CA3AF" }} size={50} />
                <div className="flex-1 min-w-0 border-b border-gray-100 py-2">
                  <div className="font-medium truncate text-[16px]" style={{ color: missed ? "#FF3B30" : "#111B21" }}>{e ? e.name : "Unknown"}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-[13px]" style={{ color: missed ? "#FF3B30" : "#667781" }}><ArrowIcon size={13} color={arrowColor} /><span className="truncate">{label}{log.duration > 0 ? ` · ${fmtDuration(log.duration)}` : ""}</span></div>
                </div>
                <div className="flex flex-col items-end gap-2 self-start pt-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{fmtCallTime(log.ts)}</span>
                  {e && <button onClick={() => startOutgoingCall(log.kind, e.id)} className="text-gray-400">{log.kind === "video" ? <Video size={18} /> : <Phone size={17} />}</button>}
                </div>
              </div>
            );
          })}
          <button onClick={() => setShowPicker(true)} className="absolute bottom-5 right-4 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition" style={{ background: WA_LIGHT }}><PhoneCall size={24} /></button>
        </div>
        <BottomNav />
      </div>
    );
  }

  function renderPicker() {
    if (!showPicker) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowPicker(false)}>
        <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3"><h2 className="text-base font-semibold text-gray-900">Call a contact</h2><button onClick={() => setShowPicker(false)}><X size={20} className="text-gray-400" /></button></div>
          {contacts.length === 0 && <p className="text-sm text-gray-400 px-1 py-4">No contacts yet — create one first.</p>}
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-1 py-2">
              <Avatar entity={c} size={44} />
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{c.name}</span>
              <button onClick={() => { setShowPicker(false); startOutgoingCall("voice", c.id); }} className="p-2 text-gray-500"><Phone size={18} /></button>
              <button onClick={() => { setShowPicker(false); startOutgoingCall("video", c.id); }} className="p-2 text-gray-500"><Video size={19} /></button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderChat() {
    if (!activeEntity) return null;
    const msgs = messages[activeId] || [];
    const isIOS = activeEntity.platform === "imessage";
    const isGroup = activeEntity.type === "group";
    const isWA = activeEntity.platform === "whatsapp";
    const customBg = settings.wallpaper === "custom" && settings.customWallpaper
      ? { backgroundImage: `url("${settings.customWallpaper}")`, backgroundSize: "cover", backgroundPosition: "center" }
      : null;
    const bgStyle = isWA ? (customBg || WALLPAPERS[settings.wallpaper]?.css || { backgroundColor: theme.chatBg }) : { backgroundColor: theme.chatBg };

    let lastDay = null;
    const timeline = [];
    msgs.forEach((m) => {
      const day = new Date(m.ts).toDateString();
      if (day !== lastDay) { timeline.push({ __date: true, id: "d-" + day, label: dateLabel(m.ts) }); lastDay = day; }
      timeline.push(m);
    });

    return (
      <div className="flex flex-col h-full min-h-0" style={{ fontFamily: theme.font, ...bgStyle }} onClick={() => { setActiveMsgMenu(null); setShowHeaderMenu(false); }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 shrink-0" style={{ background: theme.headerBg, color: theme.headerText, borderBottom: "1px solid rgba(0,0,0,0.08)" }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setScreen("chats"); setMenuOpenFor(null); }} className="p-1"><ArrowLeft size={22} /></button>
          <Avatar entity={activeEntity} size={36} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate text-[15px] flex items-center gap-1">{activeEntity.name}{activeEntity.verified && <VerifiedBadge size={14} />}</div>
            <div className="text-xs truncate" style={{ color: theme.headerSubText }}>
              {isGroup ? activeMembers.map((m) => m.name.split(" ")[0]).join(", ") : (activeEntity.presence || "tap for contact info")}
            </div>
          </div>
          <button onClick={() => startOutgoingCall("video")} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}><Video size={17} /></button>
          <button onClick={() => startOutgoingCall("voice")} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}><Phone size={15} /></button>
          <div className="relative">
            <button onClick={() => setShowHeaderMenu((v) => !v)} className="p-1"><MoreVertical size={19} /></button>
            {showHeaderMenu && (
              <div className="absolute right-0 top-9 z-20 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden w-52">
                {!isGroup && <button onClick={() => simulateIncomingCall("voice")} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><PhoneIncoming size={15} /> Simulate incoming call</button>}
                <button onClick={() => setShowHeaderMenu(false)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50">Contact info (n/a)</button>
              </div>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1.5">
          {msgs.length === 0 && <div className="text-center text-xs text-gray-500 bg-white/70 px-3 py-1.5 rounded-lg mt-10 mx-auto w-fit">No messages yet. Use the controls below to send as any side.</div>}
          {timeline.map((item) => {
            if (item.__date) return (
              <div key={item.id} className="flex justify-center my-2"><span className="bg-white/85 text-gray-500 text-[12px] px-3 py-1 rounded-lg shadow-sm">{item.label}</span></div>
            );
            const m = item;
            const isMe = m.sender === "me";
            const sender = isMe ? null : senderInfo(activeEntity, m.sender);
            const isEditing = editingMsgId === m.id;
            return (
              <div key={m.id} className="relative">
                {activeMsgMenu === m.id && (
                  <div className={`absolute z-10 -top-9 ${isMe ? "right-1" : "left-9"} bg-white rounded-full shadow-lg flex items-center overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                    {isMe && m.type === "text" && <button onClick={() => startEdit(m)} className="px-3 py-2 text-gray-600"><Pencil size={14} /></button>}
                    <button onClick={() => deleteMessage(m.id)} className="px-3 py-2 text-red-500"><Trash2 size={14} /></button>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1.5`}
                  onMouseDown={() => handlePressStart(m)} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd}
                  onTouchStart={() => handlePressStart(m)} onTouchEnd={handlePressEnd}>
                  {!isMe && isGroup && <Avatar entity={sender} size={24} />}
                  <div className="max-w-[75%] px-3 py-2 text-[14.5px] leading-snug shadow-sm" style={{
                    background: isMe ? theme.sentBubble : theme.receivedBubble, color: isMe ? theme.sentText : theme.receivedText,
                    borderRadius: theme.radius, borderBottomRightRadius: isMe ? "4px" : theme.radius, borderBottomLeftRadius: isMe ? theme.radius : "4px",
                  }}>
                    {!isMe && isGroup && <div className="text-[12px] font-semibold mb-0.5" style={{ color: nameColorFor(sender?.name) }}>{sender?.name}</div>}
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] italic opacity-70">editing…</span>
                      </div>
                    ) : m.type === "voice" ? (
                      <VoiceBubble msg={m} isMe={isMe} theme={theme} platform={activeEntity.platform} />
                    ) : m.type === "image" ? (
                      <button onClick={() => setFullscreenImage(m.imageData)}>
                        <img src={m.imageData} alt="" className="rounded-lg max-w-full block" style={{ maxHeight: 260, minWidth: 120 }} />
                      </button>
                    ) : (
                      <div style={{ wordBreak: "break-word" }}>{m.text}{m.edited && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}</div>
                    )}
                    <div className="flex items-center gap-1 justify-end mt-0.5" style={{ fontSize: "10px", opacity: 0.65 }}>
                      <span>{fmtTime(m.ts)}</span>
                      {isMe && (
                        <button onClick={(e) => { e.stopPropagation(); cycleStatus(m.id); }} title="Tap to change status">
                          {m.status === "sent" && <Check size={13} color="#8696A0" />}
                          {m.status === "delivered" && <CheckCheck size={13} color="#8696A0" />}
                          {(m.status === "read" || !m.status) && <CheckCheck size={13} color={activeEntity.platform === "whatsapp" ? theme.tickColor : "currentColor"} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 px-2.5 pt-2 pb-2.5" style={{ background: isIOS ? "#FFFFFF" : "rgba(255,255,255,0.6)", backdropFilter: "blur(3px)" }} onClick={(e) => e.stopPropagation()}>
          {isGroup ? (
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setSendAs("me")} className="flex items-center gap-1 px-3 py-1.5 rounded-full transition text-xs font-medium shrink-0" style={{ background: sendAs === "me" ? theme.accent : "rgba(0,0,0,0.06)", color: sendAs === "me" ? "#fff" : "#555" }}><ArrowRight size={12} /> Me</button>
              {activeMembers.map((mem) => (
                <button key={mem.id} onClick={() => setSendAs(mem.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full transition text-xs font-medium shrink-0" style={{ background: sendAs === mem.id ? theme.accent : "rgba(0,0,0,0.06)", color: sendAs === mem.id ? "#fff" : "#555" }}><ArrowLeftIcon size={12} /> {mem.name.split(" ")[0]}</button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <button onClick={() => setSendAs(activeMembers[0]?.id)} title={`Send as ${activeEntity.name}`} className="w-9 h-9 rounded-full flex items-center justify-center transition" style={{ background: sendAs !== "me" ? theme.accent : "rgba(0,0,0,0.06)", color: sendAs !== "me" ? "#fff" : "#555" }}><ArrowLeftIcon size={17} /></button>
              <span className="text-[11px] text-gray-500">{sendAs === "me" ? "Sending as you" : `Sending as ${activeEntity.name.split(" ")[0]}`}</span>
              <button onClick={() => setSendAs("me")} title="Send as me" className="w-9 h-9 rounded-full flex items-center justify-center transition" style={{ background: sendAs === "me" ? theme.accent : "rgba(0,0,0,0.06)", color: sendAs === "me" ? "#fff" : "#555" }}><ArrowRight size={17} /></button>
            </div>
          )}
          {recording ? (
            <div className="flex items-center gap-2">
              <button onClick={() => stopRecording(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 shrink-0"><Trash2 size={17} color="#EF4444" /></button>
              <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2.5" style={{ background: theme.inputBg }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-[14px] text-gray-700">Recording… {fmtDuration(recordSeconds)}</span>
              </div>
              <button onClick={() => stopRecording(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 active:scale-95 transition" style={{ background: theme.accent }}><Send size={17} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {editingMsgId && <button onClick={cancelEdit} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 shrink-0"><CloseIcon size={16} /></button>}
              <div className="flex-1 flex items-center gap-2 rounded-full px-3 py-1" style={{ background: theme.inputBg }}>
                {!editingMsgId && <Plus size={19} className="text-gray-500 shrink-0" onClick={triggerImagePicker} />}
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={editingMsgId ? "Edit message" : `Message as ${sendAs === "me" ? "yourself" : (contacts.find((c) => c.id === sendAs)?.name.split(" ")[0] || "them")}`}
                  className="flex-1 min-w-0 py-1.5 outline-none text-[14.5px] bg-transparent" style={{ color: "#000" }} />
                {!editingMsgId && <Smile size={19} className="text-gray-500 shrink-0" />}
              </div>
              {!editingMsgId && <button onClick={triggerImagePicker} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}><Camera size={18} /></button>}
              <button
                onClick={editingMsgId ? saveEdit : (input.trim() ? sendMessage : undefined)}
                onPointerDown={!editingMsgId && !input.trim() ? startRecording : undefined}
                onPointerUp={!editingMsgId && !input.trim() ? () => stopRecording(true) : undefined}
                onPointerLeave={!editingMsgId && !input.trim() ? () => stopRecording(true) : undefined}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 active:scale-95 transition" style={{ background: theme.accent }}>
                {editingMsgId ? <Check size={18} /> : input.trim() ? <Send size={17} /> : <Mic size={18} />}
              </button>
            </div>
          )}
          {!input.trim() && !editingMsgId && !recording && <div className="text-center text-[10px] text-gray-400 mt-1">Hold the mic to record a voice message</div>}
        </div>

        {fullscreenImage && (
          <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}>
            <button className="absolute top-4 right-4 text-white"><CloseIcon size={26} /></button>
            <img src={fullscreenImage} alt="" className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    );
  }

  function CallIconToggle({ icon: Icon, altIcon: AltIcon }) {
    const [on, setOn] = useState(false); const ShowIcon = on ? AltIcon : Icon;
    return <button onClick={() => setOn(!on)} className="w-14 h-14 rounded-full flex items-center justify-center transition" style={{ background: on ? "#fff" : "rgba(255,255,255,0.15)" }}><ShowIcon size={22} color={on ? "#000" : "#fff"} /></button>;
  }
  function renderCall() {
    if (!call || !activeEntity) return null;
    const ringing = call.status === "ringing";
    return (
      <div className="flex flex-col h-full min-h-0 items-center justify-between py-10 px-6 text-white" style={{ background: theme.callBg, fontFamily: theme.font }}>
        <div className="flex flex-col items-center gap-3 mt-6">
          <Avatar entity={activeEntity} size={112} />
          <div className="text-2xl font-medium mt-1">{activeEntity.name}</div>
          <div className="text-sm opacity-60">
            {call.direction === "incoming" && ringing && `Incoming ${call.kind} call · ${theme.label}`}
            {call.direction === "outgoing" && ringing && `Calling via ${theme.label}...`}
            {call.status === "active" && fmtDuration(durationSeconds)}
          </div>
        </div>
        {ringing && call.direction === "incoming" ? (
          <div className="flex items-center gap-16 mb-4">
            <div className="flex flex-col items-center gap-2"><button onClick={endCall} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FF3B30" }}><PhoneOff size={26} /></button><span className="text-xs opacity-60">Decline</span></div>
            <div className="flex flex-col items-center gap-2"><button onClick={acceptCall} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: theme.callAccent }}><Phone size={26} /></button><span className="text-xs opacity-60">Accept</span></div>
          </div>
        ) : (
          <div className="flex items-center gap-8 mb-4">
            <CallIconToggle icon={Mic} altIcon={MicOff} />
            <CallIconToggle icon={Volume2} altIcon={Volume2} />
            <button onClick={endCall} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FF3B30" }}><PhoneOff size={26} /></button>
          </div>
        )}
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white">
        <div className="flex items-center gap-3 px-3 py-2.5 shrink-0 border-b border-gray-100">
          <button onClick={() => setScreen("chats")} className="p-1"><ArrowLeft size={22} /></button>
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center gap-4 px-5 py-5 border-b border-gray-100">
            <button onClick={() => triggerAvatarPicker("me")} className="relative">
              <Avatar entity={{ name: settings.myName, avatar: settings.myAvatar, color: WA }} size={64} />
              <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1 border-2 border-white"><Camera size={12} color="#fff" /></div>
            </button>
            <div className="flex-1 min-w-0">
              <input value={settings.myName} onChange={(e) => setSettings((s) => ({ ...s, myName: e.target.value }))} className="w-full font-semibold text-gray-900 text-[17px] outline-none border-b border-transparent focus:border-gray-300" />
              <input value={settings.myAbout} onChange={(e) => setSettings((s) => ({ ...s, myAbout: e.target.value }))} className="w-full text-sm text-gray-500 outline-none border-b border-transparent focus:border-gray-300 mt-1" />
            </div>
          </div>
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Chat wallpaper</h3>
            <p className="text-xs text-gray-400 mb-3">Applies to WhatsApp-style conversations</p>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(WALLPAPERS).map(([key, w]) => (
                <button key={key} onClick={() => setSettings((s) => ({ ...s, wallpaper: key }))} className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-xl border-2 relative overflow-hidden" style={{ borderColor: settings.wallpaper === key ? WA : "#E5E7EB", ...w.css }}>
                    {settings.wallpaper === key && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><Check size={20} color={WA} strokeWidth={3} /></div>}
                  </div>
                  <span className="text-[10px] text-gray-500">{w.label}</span>
                </button>
              ))}
              <button onClick={() => triggerAvatarPicker("wallpaper")} className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-xl border-2 relative overflow-hidden flex items-center justify-center bg-gray-50" style={{ borderColor: settings.wallpaper === "custom" ? WA : "#E5E7EB", backgroundImage: settings.customWallpaper ? `url("${settings.customWallpaper}")` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                  {!settings.customWallpaper && <ImageIcon size={18} color="#9CA3AF" />}
                  {settings.wallpaper === "custom" && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><Check size={20} color={WA} strokeWidth={3} /></div>}
                </div>
                <span className="text-[10px] text-gray-500">Upload</span>
              </button>
            </div>
          </div>
          <div className="px-5 py-4 border-t border-gray-100 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sounds</h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {settings.soundsEnabled ? <Volume1 size={19} color="#374151" /> : <VolumeX size={19} color="#374151" />}
                <div><div className="text-sm text-gray-800">Sound effects</div><div className="text-xs text-gray-400">Message and call sounds</div></div>
              </div>
              <Toggle checked={settings.soundsEnabled} onChange={(v) => setSettings((s) => ({ ...s, soundsEnabled: v }))} />
            </div>
          </div>
          <div className="px-5 py-6 text-center flex flex-col items-center gap-2">
            <LogoMark size={40} />
            <p className="text-xs text-gray-400">Fake Chat Simulator — for roleplay use only.<br />No real messages are sent, no real calls are made.</p>
          </div>
        </div>
      </div>
    );
  }

  function renderModal() {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
        <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">{editing ? "Edit Contact" : "New Contact"}</h2><button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button></div>
          <div className="flex justify-center mb-4">
            <button onClick={() => triggerAvatarPicker("contact")} className="relative">
              <Avatar entity={{ name: form.name || "?", avatar: form.avatar, color: colorForName(form.name) }} size={84} />
              <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1.5 border-2 border-white"><Camera size={14} color="#fff" /></div>
            </button>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-500">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Jane Doe" /></div>
            <div><label className="text-xs font-medium text-gray-500">Phone Number</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="+1 555 010 2030" /></div>
            <div><label className="text-xs font-medium text-gray-500">Bio</label><input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Hey there! I am using this app." /></div>
            <div><label className="text-xs font-medium text-gray-500">Presence text (shown under name in chat)</label><input value={form.presence} onChange={(e) => setForm({ ...form, presence: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="online / last seen today at 10:42" /></div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Chat style</label>
              <div className="flex gap-2">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => setForm({ ...form, platform: key })} className="flex-1 py-2 rounded-lg text-xs font-medium border transition" style={{ borderColor: form.platform === key ? t.accent : "#E5E7EB", background: form.platform === key ? t.accent : "#fff", color: form.platform === key ? "#fff" : "#374151" }}>{t.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-sm text-gray-700"><VerifiedBadge size={16} /> Verified badge</div>
              <Toggle checked={form.verified} onChange={(v) => setForm({ ...form, verified: v })} />
            </div>
          </div>
          <button onClick={saveContact} disabled={!form.name.trim()} className="w-full mt-5 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40">{editing ? "Save Changes" : "Create Contact"}</button>
        </div>
      </div>
    );
  }

  function renderGroupModal() {
    if (!showGroupModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowGroupModal(false)}>
        <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">{editingGroup ? "Edit Group" : "New Group"}</h2><button onClick={() => setShowGroupModal(false)}><X size={20} className="text-gray-400" /></button></div>
          <div className="flex justify-center mb-4">
            <button onClick={() => triggerAvatarPicker("group")} className="relative">
              <Avatar entity={{ name: groupForm.name || "?", avatar: groupForm.avatar, color: colorForName(groupForm.name), type: "group" }} size={84} />
              <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1.5 border-2 border-white"><Camera size={14} color="#fff" /></div>
            </button>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-500">Group name</label><input value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Weekend Trip" /></div>
            <div><label className="text-xs font-medium text-gray-500">Description</label><input value={groupForm.bio} onChange={(e) => setGroupForm({ ...groupForm, bio: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Optional group description" /></div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Chat style</label>
              <div className="flex gap-2">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => setGroupForm({ ...groupForm, platform: key })} className="flex-1 py-2 rounded-lg text-xs font-medium border transition" style={{ borderColor: groupForm.platform === key ? t.accent : "#E5E7EB", background: groupForm.platform === key ? t.accent : "#fff", color: groupForm.platform === key ? "#fff" : "#374151" }}>{t.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Members ({groupForm.memberIds.length} selected)</label>
              {contacts.length === 0 && <p className="text-xs text-gray-400 py-2">Create some contacts first, then add them here.</p>}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {contacts.map((c) => {
                  const checked = groupForm.memberIds.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleGroupMember(c.id)} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <Avatar entity={c} size={32} />
                      <span className="flex-1 text-sm text-gray-800 text-left truncate">{c.name}</span>
                      <div className="w-5 h-5 rounded-md border flex items-center justify-center" style={{ borderColor: checked ? WA : "#D1D5DB", background: checked ? WA : "transparent" }}>{checked && <Check size={13} color="#fff" />}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-sm text-gray-700"><VerifiedBadge size={16} /> Verified badge</div>
              <Toggle checked={groupForm.verified} onChange={(v) => setGroupForm({ ...groupForm, verified: v })} />
            </div>
          </div>
          <button onClick={saveGroup} disabled={!groupForm.name.trim() || groupForm.memberIds.length === 0} className="w-full mt-5 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40">{editingGroup ? "Save Changes" : "Create Group"}</button>
        </div>
      </div>
    );
  }

  function renderUpdatesTab() {
    const groupedList = groupedStatuses();
    const others = groupedList.filter((g) => g.ownerId !== "me");
    return (
      <div className="flex flex-col h-full min-h-0 bg-white" style={{ fontFamily: THEMES.whatsapp.font }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <h1 className="text-[26px] font-bold text-gray-900">Updates</h1>
          <div className="flex items-center gap-4 text-gray-700"><Search size={20} /><button onClick={() => setScreen("settings")}><Settings size={20} /></button></div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          <h3 className="px-4 pt-2 pb-1 text-sm font-semibold text-gray-500">Status</h3>
          <div className="flex items-center gap-4 px-4 pb-3 overflow-x-auto no-scrollbar">
            <button onClick={() => { setStatusForm({ text: "", color: "#25D366", ownerId: "me" }); setShowStatusModal(true); }} className="flex flex-col items-center gap-1 shrink-0 w-16">
              <div className="relative">
                <Avatar entity={{ name: settings.myName, avatar: settings.myAvatar, color: WA }} size={54} />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white" style={{ background: WA_LIGHT }}><PlusIcon size={12} color="#fff" /></div>
              </div>
              <span className="text-[11px] text-gray-600 truncate w-full text-center">My status</span>
            </button>
            {others.map((g) => {
              const owner = statusOwnerEntity(g.ownerId);
              return (
                <button key={g.ownerId} onClick={() => { setViewingStatusId(g.ownerId); setViewingIndex(0); }} className="flex flex-col items-center gap-1 shrink-0 w-16">
                  <div className="rounded-full p-[2px]" style={{ background: WA_LIGHT }}>
                    <div className="rounded-full p-[2px] bg-white"><Avatar entity={owner} size={50} /></div>
                  </div>
                  <span className="text-[11px] text-gray-600 truncate w-full text-center">{owner?.name?.split(" ")[0]}</span>
                </button>
              );
            })}
            {others.length === 0 && <span className="text-xs text-gray-400 py-4">Post a status as any contact too — tap "My status" then choose who it's from.</span>}
          </div>
          <div className="border-t border-gray-100 mt-1" />
          <h3 className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Channels</h3>
          <p className="px-4 pb-6 text-xs text-gray-400">Channels aren't simulated yet — Status updates above cover the roleplay use case for now.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  function renderStatusModal() {
    if (!showStatusModal) return null;
    const colors = ["#25D366", "#128C7E", "#34B7F1", "#7C3AED", "#F59E0B", "#EF4444", "#111827", "#DB2777"];
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowStatusModal(false)}>
        <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">New status</h2><button onClick={() => setShowStatusModal(false)}><X size={20} className="text-gray-400" /></button></div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Post as</label>
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            <button onClick={() => setStatusForm((f) => ({ ...f, ownerId: "me" }))} className="px-3 py-1.5 rounded-full text-xs font-medium shrink-0" style={{ background: statusForm.ownerId === "me" ? WA : "#F0F0F0", color: statusForm.ownerId === "me" ? "#fff" : "#555" }}>Me</button>
            {contacts.map((c) => (
              <button key={c.id} onClick={() => setStatusForm((f) => ({ ...f, ownerId: c.id }))} className="px-3 py-1.5 rounded-full text-xs font-medium shrink-0" style={{ background: statusForm.ownerId === c.id ? WA : "#F0F0F0", color: statusForm.ownerId === c.id ? "#fff" : "#555" }}>{c.name.split(" ")[0]}</button>
            ))}
          </div>
          <div className="rounded-xl h-40 flex items-center justify-center text-center px-4 mb-3" style={{ background: statusForm.color }}>
            <span className="text-white text-lg font-medium break-words">{statusForm.text || "Type something…"}</span>
          </div>
          <textarea value={statusForm.text} onChange={(e) => setStatusForm((f) => ({ ...f, text: e.target.value }))} rows={2} placeholder="What's on your mind?" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 mb-3" />
          <div className="flex items-center gap-2 mb-4">{colors.map((c) => (
            <button key={c} onClick={() => setStatusForm((f) => ({ ...f, color: c }))} className="w-7 h-7 rounded-full border-2" style={{ background: c, borderColor: statusForm.color === c ? "#111" : "transparent" }} />
          ))}</div>
          <button onClick={postStatus} disabled={!statusForm.text.trim()} className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40">Post status</button>
        </div>
      </div>
    );
  }

  function renderStatusViewer() {
    if (!viewingStatusId) return null;
    const group = groupedStatuses().find((g) => g.ownerId === viewingStatusId);
    if (!group) return null;
    const idx = Math.min(viewingIndex, group.items.length - 1);
    const item = group.items[idx];
    const owner = statusOwnerEntity(group.ownerId);
    function next() { if (idx < group.items.length - 1) setViewingIndex(idx + 1); else setViewingStatusId(null); }
    function prev() { if (idx > 0) setViewingIndex(idx - 1); }
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: item.color }} onClick={() => setViewingStatusId(null)}>
        <div className="absolute top-0 left-0 right-0 flex gap-1 px-2 pt-2">
          {group.items.map((_, i) => <div key={i} className="flex-1 h-[3px] rounded-full" style={{ background: i <= idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }} />)}
        </div>
        <div className="absolute top-5 left-3 right-3 flex items-center gap-2 text-white" onClick={(e) => e.stopPropagation()}>
          <Avatar entity={owner} size={32} />
          <span className="text-sm font-medium flex-1">{owner?.name}</span>
          <span className="text-xs opacity-75">{timeAgo(item.ts)}</span>
          <button onClick={() => deleteStatus(item.id)}><Trash2 size={16} /></button>
          <button onClick={() => setViewingStatusId(null)}><CloseIcon size={20} /></button>
        </div>
        <div className="absolute inset-0 flex">
          <button className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); prev(); }} />
          <div className="w-1/3" />
          <button className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); next(); }} />
        </div>
        <span className="text-white text-2xl font-medium text-center px-8 break-words">{item.text}</span>
      </div>
    );
  }

  function renderCommunitiesTab() {
    if (activeCommunityId) {
      const com = communities.find((c) => c.id === activeCommunityId);
      if (!com) { return null; }
      const memberGroups = com.groupIds.map((id) => groups.find((g) => g.id === id)).filter(Boolean);
      return (
        <div className="flex flex-col h-full min-h-0 bg-white">
          <div className="flex items-center gap-3 px-3 py-2.5 shrink-0 border-b border-gray-100">
            <button onClick={() => setActiveCommunityId(null)} className="p-1"><ArrowLeft size={22} /></button>
            <Avatar entity={{ ...com, type: "group" }} size={36} />
            <div className="flex-1 min-w-0"><div className="font-semibold truncate text-[15px]">{com.name}</div><div className="text-xs text-gray-400 truncate">{memberGroups.length} groups</div></div>
            <button onClick={() => openEditCommunityModal(com)}><Pencil size={17} className="text-gray-500" /></button>
            <button onClick={() => deleteCommunity(com.id)}><Trash2 size={17} className="text-red-500" /></button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: WA }}><Megaphone size={19} color="#fff" /></div>
              <div><div className="text-sm font-medium text-gray-800">Announcements</div><div className="text-xs text-gray-400">Only admins can post — simulated here as a regular group</div></div>
            </div>
            <h3 className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Groups in this community</h3>
            {memberGroups.map((g) => (
              <button key={g.id} onClick={() => openChat(g.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-gray-50">
                <Avatar entity={{ ...g, type: "group" }} size={44} />
                <div className="flex-1 min-w-0"><div className="text-[15px] font-medium text-gray-900 truncate">{g.name}</div><div className="text-xs text-gray-400 truncate">{g.memberIds.length} members</div></div>
              </button>
            ))}
            {memberGroups.length === 0 && <p className="px-4 py-6 text-sm text-gray-400">No groups added yet. Tap edit to add some.</p>}
          </div>
          <BottomNav />
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full min-h-0 bg-white" style={{ fontFamily: THEMES.whatsapp.font }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <h1 className="text-[26px] font-bold text-gray-900">Communities</h1>
          <div className="flex items-center gap-4 text-gray-700"><button onClick={() => setScreen("settings")}><Settings size={20} /></button></div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          {communities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 text-gray-400 gap-2"><Users size={40} strokeWidth={1.5} /><p className="text-sm">No communities yet.<br />Group your existing chats together.</p></div>
          )}
          {communities.map((com) => (
            <button key={com.id} onClick={() => setActiveCommunityId(com.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-gray-50">
              <Avatar entity={{ ...com, type: "group" }} size={50} />
              <div className="flex-1 min-w-0 border-b border-gray-100 pb-2.5 -mb-2.5 pt-0.5"><div className="text-[16.5px] font-medium text-gray-900 truncate">{com.name}</div><div className="text-[13.5px] text-gray-500 truncate">{com.groupIds.length} groups</div></div>
            </button>
          ))}
          <button onClick={openAddCommunityModal} className="absolute bottom-5 right-4 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition" style={{ background: WA_LIGHT }}><Users size={22} /></button>
        </div>
        <BottomNav />
      </div>
    );
  }

  function renderCommunityModal() {
    if (!showCommunityModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowCommunityModal(false)}>
        <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">{editingCommunity ? "Edit Community" : "New Community"}</h2><button onClick={() => setShowCommunityModal(false)}><X size={20} className="text-gray-400" /></button></div>
          <div className="flex justify-center mb-4">
            <button onClick={() => triggerAvatarPicker("community")} className="relative">
              <Avatar entity={{ name: communityForm.name || "?", avatar: communityForm.avatar, color: colorForName(communityForm.name), type: "group" }} size={84} />
              <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1.5 border-2 border-white"><Camera size={14} color="#fff" /></div>
            </button>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-500">Community name</label><input value={communityForm.name} onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Roleplay Friends" /></div>
            <div><label className="text-xs font-medium text-gray-500">Description</label><input value={communityForm.bio} onChange={(e) => setCommunityForm({ ...communityForm, bio: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" placeholder="Optional description" /></div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Groups included ({communityForm.groupIds.length})</label>
              {groups.length === 0 && <p className="text-xs text-gray-400 py-2">Create a group first, then add it here.</p>}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {groups.map((g) => {
                  const checked = communityForm.groupIds.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggleCommunityGroup(g.id)} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <Avatar entity={{ ...g, type: "group" }} size={32} />
                      <span className="flex-1 text-sm text-gray-800 text-left truncate">{g.name}</span>
                      <div className="w-5 h-5 rounded-md border flex items-center justify-center" style={{ borderColor: checked ? WA : "#D1D5DB", background: checked ? WA : "transparent" }}>{checked && <Check size={13} color="#fff" />}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button onClick={saveCommunity} disabled={!communityForm.name.trim()} className="w-full mt-5 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40">{editingCommunity ? "Save Changes" : "Create Community"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col overflow-hidden" style={{ height: vh ? `${vh}px` : "100dvh" }} onClick={() => { showFabMenu && setShowFabMenu(false); }}>
      <div className="flex-1 min-h-0 flex flex-col">
        {screen === "chats" && renderChatsTab()}
        {screen === "calls" && renderCallsTab()}
        {screen === "updates" && renderUpdatesTab()}
        {screen === "communities" && renderCommunitiesTab()}
        {screen === "chat" && renderChat()}
        {screen === "call" && renderCall()}
        {screen === "settings" && renderSettings()}
      </div>
      {renderModal()}
      {renderGroupModal()}
      {renderPicker()}
      {renderStatusModal()}
      {renderStatusViewer()}
      {renderCommunityModal()}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
    </div>
  );
}
