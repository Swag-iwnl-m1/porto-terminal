import { useEffect, useMemo, useRef, useState } from "react";

// Terminal‑style portfolio — commands: help, projects, about, skills, links, clear, cd <path>, open <url>
export default function App() {
  const [lines, setLines] = useState([welcomeBanner()]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~/portfolio");
  const endRef = useRef(null);

  const prompt = useMemo(() => `guest@you:${cwd}$`, [cwd]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function push(out) {
    setLines((prev) => prev.concat(Array.isArray(out) ? out : [out]));
  }

  function onCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    // tampilkan prompt + command
    push(`${prompt} ${cmd}`);

    const [name, ...args] = cmd.split(/\s+/);

    switch ((name || "").toLowerCase()) {
      case "help":
        push(renderHelp());
        break;
      case "clear":
        setLines([]);
        break;
      case "whoami":
      case "about":
        push(renderAbout());
        break;
      case "skills":
        push(renderSkills());
        break;
      case "projects":
      case "ls":
        push(renderProjects());
        break;
      case "open":
        push(openCmd(args.join(" ")));
        break;
      case "cd":
        setCwd((prev) => resolveCwd(prev, args[0] || ""));
        break;
      case "social":
      case "links":
        push(renderLinks());
        break;
      default:
        push(`Command not found: ${name}. Type 'help'`);
    }

    setInput("");
  }

return (
  <div className="flex flex-col min-h-screen bg-black text-[#c5f36b] font-mono">
    {/* top bar */}
    <div className="sticky top-0 z-10 border-b border-[#355c0a] bg-[#0b0f05]/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <span className="text-[#9cd93b]">my@portfolio — tty1</span>
        </div>
        <div className="hidden sm:flex gap-3 text-xs text-[#9cd93b]">
          <button onClick={() => push(renderHelp())} className="hover:underline">help</button>
          <button onClick={() => push(renderProjects())} className="hover:underline">projects</button>
          <button onClick={() => push(renderAbout())} className="hover:underline">about</button>
        </div>
      </div>
    </div>

    {/* terminal area */}
    <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-[#355c0a] bg-[#0b0f05] shadow-[0_0_120px_rgba(197,243,107,0.08)_inset]">
        <div className="p-4 leading-relaxed whitespace-pre-wrap">
          {lines.map((l, i) => (
            <Line key={i} text={l} />
          ))}

          {/* Prompt */}
          <div className="flex items-center gap-2">
            <span className="text-[#8bd524]">{prompt}</span>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCommand(input);
              }}
              className="flex-1 bg-transparent outline-none caret-[#c5f36b] text-[#c5f36b] placeholder-[#7aa31d]/70"
              placeholder="type a command, e.g. projects"
            />
          </div>

          <div ref={endRef} />
        </div>
      </div>

      <div className="mt-4 text-xs text-[#9cd93b]/80">
        Tip: try `help`, `projects`, `about`, `skills`, `links`, `clear`.
      </div>
    </main>

    {/* footer */}
    <footer className="py-6 text-center text-xs text-[#7aa31d] border-t border-[#355c0a] bg-[#0b0f05]">
      © {new Date().getFullYear()} swag — built with React + Tailwind.
    </footer>
  </div>
);
}

function Line({ text }) {
  // efek typewriter untuk banner awal
  const isBanner = text.startsWith("┌") || text.startsWith("Welcome");
  const [out, setOut] = useState(isBanner ? "" : text);
  useEffect(() => {
    if (!isBanner) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 6);
    return () => clearInterval(id);
  }, [text, isBanner]);
  return <div className="text-sm sm:text-[15px]">{out}</div>;
}

function welcomeBanner() {
  const art = [
    "┌────────────────────────────────────────────┐",
    "│  Terminal                                  │",
    "│  Type 'help' to get started                │",
    "└────────────────────────────────────────────┘",
  ];
  return art.join("\n");
}

function renderHelp() {
  return [
    "\nAvailable commands:",
    "  help        — show this help",
    "  projects    — list featured projects",
    "  about       — short bio",
    "  skills      — tech stack",
    "  links       — GitHub/Discord",
    "  clear       — clear the screen",
    "  cd <path>   — change directory (cosmetic)",
    "  open <url>  — open a link",
    "",
  ];
}

function renderAbout() {
  return [
    "\nabout.txt:",
    "  I’m a developer that focus on Backend, Game development with roblox studio & cybersecurity.",
    "  Sometimes i like to learn physics and math to spare time",
    "",
  ];
}

function renderSkills() {
  return [
    "\nskills.json:",
    "  [C, C++, Python, PHP, Linux, Lua]",
    "",
  ];
}



function renderProjects() {
  const list = [
    { n: "discord-bot", d: "Moderation + music + AI Gemini", t: "Python, discord.py", u: "https://github.com/Swag-iwnl-m1/Dampang-Bot" },
    { n: "Roblox game", d: "Make horror game about my campus", t: "Lua, Roblox studio", u: "https://www.roblox.com/share?code=b07d1de09e05904082cd79912dc4a567&type=ExperienceDetails&stamp=1756125186597" }
  ];
  const header = "\n./projects (" + list.length + "):\n";
  const lines = list.map((p) => `  - ${p.n}\n      ${p.d}\n      tech: ${p.t}\n      open: ${p.u}`);
  return [header, ...lines, ""]; 
}

const PROJECTS = [
  { key: "discord-bot", url: "https://github.com/Swag-iwnl-m1/Dampang-Bot" },
  { key: "roblox-game", url: "https://www.roblox.com/share?code=b07d1de09e05904082cd79912dc4a567&type=ExperienceDetails&stamp=1756125186597" },
];

function openCmd(arg) {
  const q = (arg || "").trim();
  if (!q) return "Usage: open <url|project-key>";

  const found = PROJECTS.find(
    (p) => p.key.toLowerCase() === q.toLowerCase()
  );
  const target = found ? found.url : q;

  try {
    window.open(target, "_blank", "noopener,noreferrer");
    return `opening → ${target}`;
  } catch {
    return `failed to open: ${target}`;
  }
}


function renderLinks() {
  return [
    "\nlinks:",
    "  GitHub   → https://github.com/swag-iwnl-m1",
    "  Discord  → add kido8518 "
  ];
}



function resolveCwd(prev, path) {
  if (!path || path === ".") return prev;
  if (path === "..") return prev.split("/").slice(0, -1).join("/") || "~";
  if (path.startsWith("/")) return path;
  if (path.startsWith("~")) return path;
  return `${prev}/${path}`;
}

function openCmd(url) {
  const u = (url || "").trim();
  if (!u) return "Usage: open <url>";
  try {
    window.open(u, "_blank", "noopener,noreferrer");
    return `opening → ${u}`;
  } catch (e) {
    return `failed to open: ${u}`;
  }
}
