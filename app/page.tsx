"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ListMusic,
  Menu,
  Pause,
  Play,
  Repeat1,
  Settings,
  SkipForward,
  X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { localeOptions, translations, type Locale } from "./i18n";

type Copy = (typeof translations)[Locale];

const serviceMedia = [
  ["/spatial-light-installation.png", "/studio-key-visual-v2.png"],
  ["/studio-key-visual-v2.png", "/infinity-key-visual.png"],
  ["/spatial-light-installation.png", "/infinity-key-visual.png"],
  ["/infinity-key-visual.png", "/studio-key-visual-v2.png"],
];

const audioTracks = [
  { title: "The Morning Render", src: "/audio/the-morning-render.mp3" },
  { title: "Glass Walls At Dawn", src: "/audio/glass-walls-at-dawn.mp3" },
  { title: "Glass and Gravity", src: "/audio/glass-and-gravity.mp3" },
  { title: "Glass Horizon", src: "/audio/glass-horizon.mp3" },
] as const;

type PlaybackMode = "playlist" | "repeat-one";

const audioPlayerCopy: Record<Locale, {
  soundtrack: string;
  tapToPlay: string;
  play: string;
  pause: string;
  next: string;
  chooseTrack: string;
  sequence: string;
  repeatOne: string;
}> = {
  en: { soundtrack: "Soundtrack", tapToPlay: "Interact to enable sound", play: "Play", pause: "Pause", next: "Next track", chooseTrack: "Choose track", sequence: "Play in order", repeatOne: "Repeat one" },
  vi: { soundtrack: "Nhạc nền", tapToPlay: "Tương tác để bật âm thanh", play: "Phát", pause: "Tạm dừng", next: "Bài tiếp theo", chooseTrack: "Chọn bài", sequence: "Phát lần lượt", repeatOne: "Lặp một bài" },
  zh: { soundtrack: "背景音乐", tapToPlay: "互动后开启声音", play: "播放", pause: "暂停", next: "下一首", chooseTrack: "选择曲目", sequence: "顺序播放", repeatOne: "单曲循环" },
  ja: { soundtrack: "サウンドトラック", tapToPlay: "操作すると音声が有効になります", play: "再生", pause: "一時停止", next: "次の曲", chooseTrack: "曲を選ぶ", sequence: "順番に再生", repeatOne: "1曲リピート" },
  ko: { soundtrack: "사운드트랙", tapToPlay: "상호작용하면 사운드가 켜집니다", play: "재생", pause: "일시정지", next: "다음 곡", chooseTrack: "트랙 선택", sequence: "순서대로 재생", repeatOne: "한 곡 반복" },
};

const settingsCopy: Record<Locale, {
  settings: string;
  language: string;
  languageDescription: string;
  close: string;
}> = {
  en: { settings: "Settings", language: "Language", languageDescription: "Choose the interface language", close: "Close settings" },
  vi: { settings: "Cài đặt", language: "Ngôn ngữ", languageDescription: "Chọn ngôn ngữ giao diện", close: "Đóng cài đặt" },
  zh: { settings: "设置", language: "语言", languageDescription: "选择界面语言", close: "关闭设置" },
  ja: { settings: "設定", language: "言語", languageDescription: "表示言語を選択", close: "設定を閉じる" },
  ko: { settings: "설정", language: "언어", languageDescription: "인터페이스 언어 선택", close: "설정 닫기" },
};

const projects = [
  {
    no: "01",
    year: "2026",
    kind: "video",
    src: "/projects/virtual360-showreel.mp4",
    poster: "/projects/virtual360-showreel-poster.jpg",
  },
  {
    no: "02",
    year: "2026",
    kind: "image",
    src: "/projects/booking-panorama.png",
    fit: "contain",
  },
  {
    no: "03",
    year: "2026",
    kind: "image",
    src: "/projects/coworking-virtual360.jpg",
  },
  {
    no: "04",
    year: "2026",
    kind: "image",
    src: "/projects/real-estate-virtual360.png",
  },
] as const;

const cursorCopy: Record<Locale, { view: string; explore: string; hello: string; write: string; lab: string }> = {
  en: { view: "VIEW", explore: "EXPLORE", hello: "HELLO", write: "WRITE", lab: "R&D" },
  vi: { view: "XEM", explore: "KHÁM PHÁ", hello: "LIÊN HỆ", write: "VIẾT", lab: "R&D" },
  zh: { view: "查看", explore: "探索", hello: "联系", write: "写信", lab: "研发" },
  ja: { view: "見る", explore: "探る", hello: "相談", write: "メール", lab: "R&D" },
  ko: { view: "보기", explore: "탐색", hello: "문의", write: "메일", lab: "R&D" },
};

const localeDateTime: Record<Locale, { tag: string; label: string; city: string }> = {
  en: { tag: "en-US", label: "Live local time", city: "Saigon" },
  vi: { tag: "vi-VN", label: "Không gian ảo - Thời gian thực", city: "Sài Gòn" },
  zh: { tag: "zh-CN", label: "实时本地时间", city: "西贡" },
  ja: { tag: "ja-JP", label: "現在時刻", city: "サイゴン" },
  ko: { tag: "ko-KR", label: "실시간 현지 시간", city: "사이공" },
};

function LiveClock({ locale }: { locale: Locale }) {
  const [now, setNow] = useState<Date | null>(null);
  const copy = localeDateTime[locale];

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat(copy.tag, {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: locale === "en",
      }).format(now)
    : "--:--:--";

  const date = now
    ? new Intl.DateTimeFormat(copy.tag, {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now)
    : "GMT+07";

  return (
    <div className="live-clock" aria-live="polite" data-cursor="TIME">
      <span>{copy.label}</span>
      <strong>{time}</strong>
      <i>{copy.city} / GMT+07</i>
      <small>{date}</small>
    </div>
  );
}

function PageLoader() {
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("page-loading");

    const frame = window.requestAnimationFrame(() => setStarted(true));
    const leaveTimer = window.setTimeout(() => setLeaving(true), reduceMotion ? 420 : 2700);
    const doneTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("page-loading");
    }, reduceMotion ? 700 : 3500);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove("page-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`page-loader ${started ? "is-forming" : ""} ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-label="Loading Sense and Scene Studio"
    >
      <div className="page-loader-grid" aria-hidden="true" />
      <div className="page-loader-stars" aria-hidden="true">
        {Array.from({ length: 104 }, (_, index) => {
          const angle = (index / 104) * Math.PI * 2;
          const x = 50 + 38 * Math.cos(angle);
          const y = 50 + 18 * Math.sin(angle * 2);
          const seedX = Math.sin((index + 1) * 12.9898) * 43758.5453;
          const seedY = Math.sin((index + 11) * 78.233) * 43758.5453;
          const dx = ((seedX - Math.floor(seedX)) - 0.5) * 150;
          const dy = ((seedY - Math.floor(seedY)) - 0.5) * 120;
          const style = {
            "--loader-x": `${x.toFixed(4)}%`,
            "--loader-y": `${y.toFixed(4)}%`,
            "--loader-dx": `${dx.toFixed(3)}vw`,
            "--loader-dy": `${dy.toFixed(3)}vh`,
            "--loader-delay": `${(index % 17) * 32}ms`,
            "--loader-size": ["1px", "1.65px", "2.3px", "2.95px"][index % 4],
          } as CSSProperties;

          return <i className="page-loader-star" style={style} key={index} />;
        })}
      </div>

      <div className="page-loader-infinity" aria-hidden="true">
        <span className="page-loader-loop-glow is-left" />
        <span className="page-loader-loop-glow is-right" />
        <span className="page-loader-prism" />
        <span className="page-loader-flare" />
        <div className="page-loader-sparks">
          {Array.from({ length: 12 }, (_, index) => (
            <i
              className="page-loader-spark"
              key={index}
              style={{
                "--spark-angle": `${index * 30}deg`,
                "--spark-distance": `${76 + (index % 4) * 22}px`,
                "--spark-delay": `${index * 18}ms`,
              } as CSSProperties}
            />
          ))}
        </div>
        <svg viewBox="0 0 200 100" focusable="false">
          <defs>
            <linearGradient id="loader-infinity-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#61f1ff" />
              <stop offset="0.48" stopColor="#f5f5ff" />
              <stop offset="1" stopColor="#8f79ff" />
            </linearGradient>
          </defs>
          <path
            className="page-loader-orbit-glow"
            d="M100 50 C82 24 62 18 44 22 C18 28 18 72 44 78 C62 82 82 76 100 50 C118 24 138 18 156 22 C182 28 182 72 156 78 C138 82 118 76 100 50"
          />
          <path
            className="page-loader-orbit"
            d="M100 50 C82 24 62 18 44 22 C18 28 18 72 44 78 C62 82 82 76 100 50 C118 24 138 18 156 22 C182 28 182 72 156 78 C138 82 118 76 100 50"
          />
          <path
            className="page-loader-orbit-pulse"
            d="M100 50 C82 24 62 18 44 22 C18 28 18 72 44 78 C62 82 82 76 100 50 C118 24 138 18 156 22 C182 28 182 72 156 78 C138 82 118 76 100 50"
          />
        </svg>
      </div>

      <div className="page-loader-brand" aria-hidden="true">
        <small>VISUAL TECHNOLOGY STUDIO</small>
        <div><span>SENSE</span><i>&amp;</i><span>SCENE</span></div>
      </div>
    </div>
  );
}

function AudioPlayer({ locale }: { locale: Locale }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const shouldPlayRef = useRef(false);
  const playAttemptRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PlaybackMode>("playlist");
  const copy = audioPlayerCopy[locale];
  const currentTrack = audioTracks[currentIndex];

  const playAudio = useCallback(async (force = false) => {
    const audio = audioRef.current;
    if (!audio || !audio.paused || (playAttemptRef.current && !force)) return;

    playAttemptRef.current = true;
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    } finally {
      playAttemptRef.current = false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.46;
    audio.load();
    if (shouldPlayRef.current) void playAudio(true);
  }, [currentIndex, playAudio]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!playerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      shouldPlayRef.current = true;
      void playAudio(true);
    } else {
      shouldPlayRef.current = false;
      audio.pause();
    }
  };

  const selectTrack = (index: number) => {
    shouldPlayRef.current = true;

    if (index === currentIndex) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      void playAudio(true);
      return;
    }

    setCurrentIndex(index);
  };

  const playNext = () => {
    shouldPlayRef.current = true;
    setCurrentIndex((index) => (index + 1) % audioTracks.length);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        loop={mode === "repeat-one"}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (mode === "playlist") playNext();
        }}
      />

      <div ref={playerRef} className={`music-player ${isOpen ? "is-open" : ""}`} aria-label={copy.soundtrack}>
      <button
        type="button"
        className="music-art-trigger"
        aria-label={copy.chooseTrack}
        aria-haspopup="dialog"
        aria-controls="music-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Image src="/music-button.png" alt="" fill sizes="42px" aria-hidden="true" />
        <span className={`music-trigger-equalizer ${isPlaying ? "is-playing" : ""}`} aria-hidden="true">
          <i /><i /><i />
        </span>
      </button>

      <section className="music-playlist" id="music-panel" role="dialog" aria-label={copy.chooseTrack}>
        <div className="music-playlist-head">
          <span>{copy.chooseTrack}</span>
          <span>{String(audioTracks.length).padStart(2, "0")} TRACKS</span>
          <button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="music-mode" aria-label="Playback mode">
          <button
            type="button"
            className={mode === "playlist" ? "is-active" : ""}
            aria-pressed={mode === "playlist"}
            onClick={() => setMode("playlist")}
          >
            <ListMusic size={14} aria-hidden="true" /> {copy.sequence}
          </button>
          <button
            type="button"
            className={mode === "repeat-one" ? "is-active" : ""}
            aria-pressed={mode === "repeat-one"}
            onClick={() => setMode("repeat-one")}
          >
            <Repeat1 size={14} aria-hidden="true" /> {copy.repeatOne}
          </button>
        </div>

        <div className="music-track-list">
          {audioTracks.map((track, index) => (
            <button
              type="button"
              key={track.src}
              className={currentIndex === index ? "is-current" : ""}
              aria-current={currentIndex === index ? "true" : undefined}
              onClick={() => selectTrack(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{track.title}</strong>
              {currentIndex === index && <i aria-hidden="true">●</i>}
            </button>
          ))}
        </div>

      <div className="music-player-bar">
        <button
          type="button"
          className="music-play-button"
          aria-label={isPlaying ? copy.pause : copy.play}
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}
        </button>

        <div className="music-now-playing" aria-live="polite">
          <span>{copy.soundtrack}</span>
          <strong>{currentTrack.title}</strong>
        </div>

        <span className={`music-equalizer ${isPlaying ? "is-playing" : ""}`} aria-hidden="true">
          <i /><i /><i /><i />
        </span>

        <button type="button" className="music-next" aria-label={copy.next} onClick={playNext}>
          <SkipForward size={15} fill="currentColor" aria-hidden="true" />
        </button>

      </div>
      </section>
      </div>
    </>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let pointerX = -80;
    let pointerY = -80;
    let cursorX = -80;
    let cursorY = -80;
    let hasPointer = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!hasPointer) {
        cursorX = pointerX;
        cursorY = pointerY;
        hasPointer = true;
      }
    };

    const render = () => {
      cursorX += (pointerX - cursorX) * 0.26;
      cursorY += (pointerY - cursorY) * 0.26;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${cursorX}px, ${cursorY}px, 0)`,
      );
      frame = requestAnimationFrame(render);
    };

    const onEnter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      if (labelRef.current) labelRef.current.textContent = target.dataset.cursor ?? "VIEW";
      cursorRef.current?.classList.add("is-active");
    };

    const onLeave = () => cursorRef.current?.classList.remove("is-active");
    const targets = document.querySelectorAll<HTMLElement>("[data-cursor]");

    targets.forEach((target) => {
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
    });
    window.addEventListener("pointermove", onMove, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <span ref={labelRef} />
    </div>
  );
}

function SettingsMenu({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const copy = settingsCopy[locale];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("settings-open", open);
    return () => document.body.classList.remove("settings-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeSettings = () => setOpen(false);

  const dialog = (
    <div
      className={`settings-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) closeSettings();
      }}
    >
      <section className="settings-dialog" id="site-settings" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-dialog-head">
          <span className="settings-head-spacer" />

          <div>
            <span>{copy.settings}</span>
            <h2 id="settings-title">{copy.language}</h2>
          </div>

          <button type="button" className="settings-close" aria-label={copy.close} onClick={closeSettings}>
            <X size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="settings-dialog-body">
          <p className="settings-language-description">{copy.languageDescription}</p>
          <div className="settings-language" role="radiogroup" aria-label={copy.language}>
            {localeOptions.map((option) => (
              <button
                type="button"
                role="radio"
                aria-checked={locale === option.code}
                className={locale === option.code ? "is-current" : ""}
                key={option.code}
                onClick={() => {
                  onChange(option.code);
                  closeSettings();
                }}
              >
                <span className="language-code">{option.short}</span>
                <strong>{option.label}</strong>
                {locale === option.code && <Check size={15} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <button
        className="settings-trigger"
        type="button"
        aria-label={copy.settings}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-settings"
        onClick={() => setOpen(true)}
        data-magnetic
      >
        <Settings size={15} aria-hidden="true" />
        <span>{copy.settings}</span>
      </button>
      {mounted && createPortal(dialog, document.body)}
    </>
  );
}

function Header({
  locale,
  onLocaleChange,
  t,
  cursor,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  t: Copy;
  cursor: (typeof cursorCopy)[Locale];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="header-brand brand-target" href="#top" aria-label={t.a11y.home} data-magnetic>
          <Image
            src="/sense-scene-logo-dark.png"
            alt="Sense & Scene Studio"
            fill
            priority
            sizes="(max-width: 760px) 128px, 170px"
          />
        </a>

        <nav className="desktop-nav" aria-label={t.a11y.primaryNavigation}>
          <a href="#services" data-magnetic>{t.nav.services}</a>
          <a href="#projects" data-magnetic>{t.nav.projects}</a>
          <a href="#about" data-magnetic>{t.nav.studio}</a>
        </nav>

        <div className="header-actions">
          <SettingsMenu locale={locale} onChange={onLocaleChange} />
          <a className="header-cta" href="#contact" data-cursor={cursor.hello} data-magnetic>
            {t.nav.startProject} <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setMenuOpen((openValue) => !openValue)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu" aria-hidden={!menuOpen}>
        <nav aria-label={t.a11y.mobileNavigation}>
          <a href="#services" onClick={closeMenu}><span>01</span> {t.nav.services}</a>
          <a href="#projects" onClick={closeMenu}><span>02</span> {t.nav.projects}</a>
          <a href="#about" onClick={closeMenu}><span>03</span> {t.nav.studio}</a>
          <a href="#contact" onClick={closeMenu}><span>04</span> {t.nav.contact}</a>
        </nav>
        <p>{t.hero.location}<br />GMT +07:00</p>
      </div>
    </>
  );
}

const textSelectors = [
  ".hero-word-sense-prefix", ".hero-anchor-stack", ".hero-studio", ".hero-meta span", ".hero-copy p", ".hero-bottom p", ".hero-scroll-cta", ".live-clock span", ".live-clock strong", ".live-clock i", ".live-clock small",
  ".statement h2 span", ".statement-copy",
  ".services h2 span", ".services .section-heading p", ".service-row h3", ".service-row p", ".service-row li", ".services .text-link",
  ".projects h2 span", ".projects .section-heading p", ".project-info h3", ".project-info p",
  ".about-copy .word-inner", ".studio-facts div span", ".studio-facts div strong", ".lab-copy h2 span", ".lab-copy p", ".lab-copy a",
  ".footer-top p", ".footer-top h2 span", ".footer-top a", ".footer-meta div span", ".footer-meta div a", ".footer-meta div p", ".footer-wordmark span"
].join(", ");

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [locale, setLocale] = useState<Locale>("en");
  const languageTransitioningRef = useRef(false);

  const t = translations[locale];
  const cursor = cursorCopy[locale];
  const isCharacterLanguage = locale === "zh" || locale === "ja";
  const aboutUnits = isCharacterLanguage ? Array.from(t.about.body) : t.about.body.split(/\s+/);

  useEffect(() => {
    const supported = localeOptions.map((option) => option.code) as readonly string[];
    const saved = window.localStorage.getItem("sense-scene-locale");
    const browserLocale = window.navigator.language.slice(0, 2).toLowerCase();
    const detected = supported.includes(saved ?? "")
      ? saved
      : supported.includes(browserLocale)
        ? browserLocale
        : "en";
    setLocale(detected as Locale);
  }, []);

  const isInitialMount = useRef(true);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale || languageTransitioningRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setLocale(newLocale);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const targets = document.querySelectorAll(textSelectors);
    const loader = document.querySelector(".language-loader");
    const loaderParts = document.querySelectorAll(".language-loader span, .language-loader i");

    languageTransitioningRef.current = true;
    document.body.classList.add("is-language-loading");
    gsap.killTweensOf([targets, loader, loaderParts]);
    gsap.set(loader, {
      autoAlpha: 1,
      clipPath: "inset(0% 100% 0% 0%)",
    });

    gsap.timeline({
      onComplete: () => {
        setLocale(newLocale);
      },
    })
      .to(loader, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: isMobile ? 0.28 : 0.42,
        ease: "power4.out",
      }, 0)
      .fromTo(
        loaderParts,
        { yPercent: isMobile ? 36 : 90, opacity: 0, filter: `blur(${isMobile ? 6 : 18}px)` },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: isMobile ? 0.26 : 0.46,
          stagger: isMobile ? 0.018 : 0.055,
          ease: "power4.out",
        },
        isMobile ? 0.03 : 0.06,
      )
      .to(targets, {
        y: isMobile ? -8 : -22,
        opacity: 0,
        rotateX: isMobile ? 0 : 18,
        scale: isMobile ? 0.998 : 0.985,
        filter: `blur(${isMobile ? 3 : 12}px)`,
        transformOrigin: "50% 50% -80px",
        duration: isMobile ? 0.22 : 0.4,
        stagger: { each: isMobile ? 0.0002 : 0.0025, from: "random" },
        ease: "power3.in",
      }, 0.03);
  };

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
    window.localStorage.setItem("sense-scene-locale", locale);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const targets = document.querySelectorAll(textSelectors);
    const loader = document.querySelector(".language-loader");
    const loaderParts = document.querySelectorAll(".language-loader span, .language-loader i");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;

    if (reduceMotion) {
      document.body.classList.remove("is-language-loading");
      languageTransitioningRef.current = false;
      gsap.set(loader, { autoAlpha: 0, clipPath: "inset(0% 0% 0% 100%)" });
      gsap.set(targets, { clearProps: "transform,opacity,filter,willChange" });
      return;
    }

    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-language-loading");
        languageTransitioningRef.current = false;
        gsap.set(loader, { autoAlpha: 0, clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(targets, { clearProps: "transform,opacity,filter,willChange" });
        gsap.set(".type-bridge span, .type-bridge i", { clearProps: "transform" });
        void document.fonts.ready.then(() => {
          window.requestAnimationFrame(() => ScrollTrigger.refresh());
        });
      },
    })
      .fromTo(
        targets,
        {
          y: isMobile ? 10 : 30,
          opacity: 0,
          rotateX: isMobile ? 0 : -28,
          scale: isMobile ? 0.998 : 0.985,
          filter: `blur(${isMobile ? 4 : 16}px)`,
          willChange: "transform,opacity,filter",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: isMobile ? 0.34 : 0.78,
          stagger: { each: isMobile ? 0.0003 : 0.004, from: "start" },
          ease: "power4.out",
        },
        0.08,
      )
      .to(loaderParts, {
        yPercent: isMobile ? -30 : -80,
        opacity: 0,
        filter: `blur(${isMobile ? 4 : 14}px)`,
        duration: isMobile ? 0.2 : 0.34,
        stagger: isMobile ? 0.014 : 0.04,
        ease: "power3.in",
      }, 0)
      .to(loader, {
        clipPath: "inset(0% 0% 0% 100%)",
        duration: isMobile ? 0.28 : 0.48,
        ease: "power4.inOut",
      }, isMobile ? 0.08 : 0.12);
  }, [locale]);

  useEffect(() => {
    // Initial entrance animations
    const tl = gsap.timeline();
    tl.fromTo(".site-header",
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(".hero-word-sense-prefix, .hero-anchor-stack, .hero-studio",
      { yPercent: 110, rotate: 1.5, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: "power4.out" },
      "-=0.6"
    );
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduceMotion ? 0 : 1.1,
      smoothWheel: !reduceMotion,
      wheelMultiplier: 0.85,
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const context = gsap.context(() => {
      // Scroll progress bar
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
        },
      });

      if (!reduceMotion) {
        // Move the complete brand lockup so STUDIO stays attached on scroll.
        gsap.to(".hero-brand-lockup", {
          y: () => {
            const logo = document.querySelector(".header-brand");
            const lockup = document.querySelector(".hero-brand-lockup");
            if (logo && lockup) {
              return logo.getBoundingClientRect().top - lockup.getBoundingClientRect().top;
            }
            return -200;
          },
          x: () => {
            const logo = document.querySelector(".header-brand");
            const lockup = document.querySelector(".hero-brand-lockup");
            if (logo && lockup) {
              return logo.getBoundingClientRect().left - lockup.getBoundingClientRect().left;
            }
            return 0;
          },
          scale: 0.15,
          opacity: 0,
          transformOrigin: "left top",
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "10% top",
            end: "70% top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Restore the original central orbit and keep its scroll-linked spin.
        gsap.set(".hero-orbit-original", { xPercent: -50, yPercent: -52 });
        gsap.to(".hero-orbit-original", {
          rotate: 150,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(".grid-line.horizontal", {
          scaleX: 1.65,
          opacity: 0.48,
          transformOrigin: "center",
          duration: 4.5,
          stagger: { each: 0.35, repeat: -1, yoyo: true },
          ease: "sine.inOut",
        });

        gsap.to(".grid-line.vertical", {
          scaleY: 1.45,
          opacity: 0.4,
          transformOrigin: "center",
          duration: 5.2,
          stagger: { each: 0.42, repeat: -1, yoyo: true },
          ease: "sine.inOut",
        });

        gsap.to(".hero-frame i", {
          scale: 1.9,
          opacity: 0.45,
          duration: 1.9,
          stagger: { each: 0.16, repeat: -1, yoyo: true },
          ease: "power1.inOut",
        });

        gsap.to(".hero-particles span", {
          y: -46,
          x: "random(-18, 18)",
          opacity: "random(0.28, 0.82)",
          scale: "random(0.65, 1.55)",
          duration: "random(2.8, 6.2)",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.08, from: "random" },
          ease: "sine.inOut",
        });

        gsap.to(".hero-data-rain span", {
          yPercent: 130,
          opacity: "random(0.1, 0.75)",
          duration: "random(3.4, 7.4)",
          repeat: -1,
          delay: "random(0, 2.4)",
          ease: "none",
          stagger: { each: 0.08, from: "random" },
        });

        gsap.to(".hero-prism-field span", {
          xPercent: "random(-16, 16)",
          yPercent: "random(-12, 12)",
          rotate: "random(-8, 8)",
          opacity: "random(0.16, 0.5)",
          duration: "random(4.5, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.18,
        });

        gsap.fromTo(
          ".live-clock",
          { autoAlpha: 0, y: 22, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.7 }
        );

        // Hero bottom elements fade
        gsap.fromTo(
          ".hero-bottom",
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            delay: 0.8,
          }
        );

        // Hero meta fade in
        gsap.fromTo(
          ".hero-meta span",
          { autoAlpha: 0, y: -10 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power2.out",
            delay: 0.4,
          }
        );

        // Generic reveal elements (fade up)
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 72, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
            },
          );
        });

        // Staggered service rows
        gsap.fromTo(
          ".service-row",
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: ".service-list", start: "top 88%", once: true },
          }
        );

        // Project rows stagger
        gsap.fromTo(
          ".project-row",
          { x: -40, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: ".project-list", start: "top 88%", once: true },
          }
        );

        // Studio facts count-up effect
        document.querySelectorAll<HTMLElement>(".studio-facts strong").forEach((el) => {
          const target = el.textContent?.trim();
          if (!target || target === "∞") return;
          const num = parseInt(target, 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: num,
            duration: 1.8,
            ease: "power2.out",
            snap: { val: 1 },
            onUpdate: () => { el.textContent = String(Math.round(obj.val)).padStart(2, "0"); },
            scrollTrigger: { trigger: ".studio-facts", start: "top 85%", once: true },
          });
        });

        // 3D Stagger Card Entry Reveal for studio facts
        gsap.fromTo(
          ".studio-facts > div",
          { rotationY: 25, rotationX: 18, transformOrigin: "left center", autoAlpha: 0, y: 64 },
          {
            rotationY: 0,
            rotationX: 0,
            autoAlpha: 1,
            y: 0,
            stagger: 0.16,
            duration: 1.3,
            ease: "power4.out",
            scrollTrigger: { trigger: ".studio-facts", start: "top 88%", once: true },
          }
        );

        // About copy word reveal
        gsap.fromTo(
          ".about-copy .word-inner",
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            stagger: 0.018,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-copy", start: "top 86%", once: true },
          }
        );

        // Lab card parallax image
        gsap.to(".lab-visual img", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".lab-card",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        // Statement heading char reveal
        gsap.fromTo(
          ".statement h2 span",
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: ".statement h2", start: "top 90%", once: true },
          }
        );

        // Vietnamese uses stable native metrics; keep this bridge typographic and static.
        if (locale === "vi") {
          gsap.set(".type-bridge span, .type-bridge i", { clearProps: "transform" });
        } else {
          gsap.fromTo(
            ".type-bridge span:first-child",
            { xPercent: -5 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".type-bridge",
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            }
          );

          gsap.fromTo(
            ".type-bridge span:last-child",
            { xPercent: 5 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".type-bridge",
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            }
          );
        }

        gsap.fromTo(
          ".section-heading h2 span, .lab-copy h2 span, .footer-top h2 span",
          { yPercent: 42, rotateX: -34, autoAlpha: 0, filter: "blur(14px)" },
          {
            yPercent: 0,
            rotateX: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".services",
              start: "top 82%",
              end: "bottom top",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          ".project-background",
          { scale: 1.08, rotate: -0.6 },
          {
            scale: 1,
            rotate: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: ".projects",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );

        gsap.fromTo(
          ".footer-wordmark span, .footer-wordmark i",
          { yPercent: 42, filter: "blur(18px)" },
          {
            yPercent: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 1.25,
            ease: "power4.out",
            scrollTrigger: { trigger: "footer", start: "top 82%", once: true },
          }
        );
      }
    }, pageRef);

    // Hero background 3D tilt
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const quickRotateX = gsap.quickTo(heroMediaRef.current, "rotationX", { duration: 0.55, ease: "power3.out" });
    const quickRotateY = gsap.quickTo(heroMediaRef.current, "rotationY", { duration: 0.55, ease: "power3.out" });
    const ambientGlow = document.querySelector(".ambient-light-glow");
    const quickGlowX = ambientGlow
      ? gsap.quickTo(ambientGlow, "x", { duration: 0.42, ease: "power3.out" })
      : null;
    const quickGlowY = ambientGlow
      ? gsap.quickTo(ambientGlow, "y", { duration: 0.42, ease: "power3.out" })
      : null;

    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion || isCoarsePointer) return;
      quickRotateX((event.clientY / window.innerHeight - 0.5) * -4);
      quickRotateY((event.clientX / window.innerWidth - 0.5) * 6);
      quickGlowX?.(event.clientX);
      quickGlowY?.(event.clientY);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Interactive magnetic hover elements
    const magneticElements = document.querySelectorAll("[data-magnetic]");
    const magneticCleanups: Array<() => void> = [];

    magneticElements.forEach((el) => {
      const quickX = gsap.quickTo(el, "x", { duration: 0.2, ease: "power3.out" });
      const quickY = gsap.quickTo(el, "y", { duration: 0.2, ease: "power3.out" });
      const onMove = (e: Event) => {
        const pe = e as PointerEvent;
        const rect = el.getBoundingClientRect();
        const x = pe.clientX - rect.left - rect.width / 2;
        const y = pe.clientY - rect.top - rect.height / 2;
        quickX(x * 0.24);
        quickY(y * 0.24);
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)"
        });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      magneticCleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });

    // Service row hover follow media
    const serviceRows = document.querySelectorAll<HTMLElement>(".service-row");
    const serviceCleanups: Array<() => void> = [];

    if (!reduceMotion && !window.matchMedia("(max-width: 760px)").matches) {
      serviceRows.forEach((row) => {
        const media = row.querySelector<HTMLElement>(".service-media");
        if (!media) return;

        let lastX = 0;
        let lastY = 0;

        const onRowMove = (e: Event) => {
          const pe = e as PointerEvent;
          const rect = row.getBoundingClientRect();
          const x = pe.clientX - rect.left;
          const y = pe.clientY - rect.top;

          // Calculate mouse speed for skew effect
          const speedX = lastX ? Math.min(Math.abs(pe.clientX - lastX) * 0.04, 10) : 0;
          const speedY = lastY ? Math.min(Math.abs(pe.clientY - lastY) * 0.04, 10) : 0;

          const directionX = pe.clientX > lastX ? 1 : -1;
          const directionY = pe.clientY > lastY ? 1 : -1;

          lastX = pe.clientX;
          lastY = pe.clientY;

          gsap.to(media, {
            x: x - (rect.width * 0.35),
            y: y - 90,
            skewX: speedX * directionX,
            skewY: speedY * directionY,
            rotate: (pe.clientX - rect.left - rect.width / 2) * 0.015,
            duration: 0.85,
            ease: "power3.out",
            overwrite: "auto"
          });
        };

        const onRowEnter = () => {
          gsap.to(media, { autoAlpha: 1, scale: 1.05, duration: 0.4, ease: "power2.out" });
        };

        const onRowLeave = () => {
          gsap.to(media, { autoAlpha: 0, scale: 0.9, duration: 0.4, ease: "power2.in" });
        };

        row.addEventListener("pointermove", onRowMove);
        row.addEventListener("pointerenter", onRowEnter);
        row.addEventListener("pointerleave", onRowLeave);

        serviceCleanups.push(() => {
          row.removeEventListener("pointermove", onRowMove);
          row.removeEventListener("pointerenter", onRowEnter);
          row.removeEventListener("pointerleave", onRowLeave);
        });
      });
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      magneticCleanups.forEach((cleanup) => cleanup());
      serviceCleanups.forEach((cleanup) => cleanup());
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [isCharacterLanguage, locale]);

  return (
    <main ref={pageRef} id="top">
      <PageLoader />
      {/* ─── AMBIENT GRID & GLOW ─── */}
      <div className="ambient-grid" aria-hidden="true">
        <div className="noise-field" />
        <div className="light-mesh" />
        <div className="scan-field" />
        <div className="aurora-band band-a" />
        <div className="aurora-band band-b" />
        <div className="precision-ring ring-a" />
        <div className="precision-ring ring-b" />
        <div className="grid-line horizontal" style={{ top: "20%" }} />
        <div className="grid-line horizontal" style={{ top: "40%" }} />
        <div className="grid-line horizontal" style={{ top: "60%" }} />
        <div className="grid-line horizontal" style={{ top: "80%" }} />
        <div className="grid-line vertical" style={{ left: "25%" }} />
        <div className="grid-line vertical" style={{ left: "50%" }} />
        <div className="grid-line vertical" style={{ left: "75%" }} />
        <div className="ambient-light-glow" />
      </div>

      <div className="language-loader" aria-hidden="true">
        <span>SENSE</span>
        <i>&amp;</i>
        <span>SCENE</span>
      </div>

      <CustomCursor />
      <Header locale={locale} onLocaleChange={handleLocaleChange} t={t} cursor={cursor} />
      <AudioPlayer locale={locale} />

      <div className="site-content">
        {/* ─── HERO ─── */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-sticky">
            <div className="hero-media" ref={heroMediaRef}>
              <Image
                className="hero-background"
                src="/hero-spatial-background.png"
                alt=""
                fill
                priority
                quality={92}
                sizes="100vw"
                aria-hidden="true"
              />
              <div className="hero-vignette" aria-hidden="true" />
            </div>

            <div className="hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="hero-orbit hero-orbit-original" aria-hidden="true"><span>∞</span></div>
            <div className="hero-logo-quarter-stage" aria-hidden="true">
              <div className="hero-logo-quarter-motion">
                <div className="hero-orbiting-logo">
                  {Array.from({ length: 8 }, (_, index) => (
                    <span className={`hero-logo-satellite is-${index + 1}`} key={index}><i /></span>
                  ))}
                  <Image
                    src="/sense-scene-symbol.png"
                    alt=""
                    width={343}
                    height={638}
                    sizes="(max-width: 760px) 104px, 168px"
                  />
                </div>
              </div>
            </div>
            <div className="hero-particles" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => <span key={index} />)}
            </div>
            <div className="hero-data-rain" aria-hidden="true">
              {Array.from({ length: 22 }, (_, index) => <span key={index} />)}
            </div>
            <div className="hero-prism-field" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="hero-meta">
              <span>{t.hero.studioType}</span>
              <span>{t.hero.location}</span>
              <span>{t.hero.independent}</span>
            </div>

            <LiveClock locale={locale} />

            <div className="hero-copy">
              <p className="hero-disciplines">{t.hero.disciplines}</p>
              <div className="hero-brand-lockup">
                <h1 className="hero-title" id="hero-title">
                  <span className="hero-word-sense-prefix">S</span>
                  <span className="hero-anchor-stack">
                    <span className="hero-sense-end">
                      <span className="hero-word-sense-anchor">E</span>
                      <span className="hero-word-sense-suffix">NSE</span>
                      <em className="hero-ampersand">&amp;</em>
                    </span>
                    <span className="hero-word-scene">SCENE</span>
                  </span>
                </h1>
                <strong className="hero-studio"><span>STUDIO</span></strong>
              </div>
            </div>

            <div className="hero-bottom">
              <p>{t.hero.promise}</p>
              <a href="#projects" data-cursor={cursor.explore} className="hero-scroll-cta" data-magnetic>
                <span className="hero-scroll-icon"><ArrowDown size={14} aria-hidden="true" /></span>
                {t.hero.selectedWork}
              </a>
            </div>
          </div>
        </section>

        {/* ─── TICKER ─── */}
        <div className="ticker" aria-hidden="true">
          <div>
            {[...t.ticker, ...t.ticker].map((item, index) => (
              <Fragment key={`${item}-${index}`}><span>{item}</span><i>∞</i></Fragment>
            ))}
          </div>
        </div>

        {/* ─── STATEMENT ─── */}
        <section className="statement page-pad">
          <div className="section-label" data-reveal><span>[ 00 ]</span><span>{t.statement.label}</span></div>
          <h2>
            {t.statement.lines.map((line, index) => (
              <span className={index === 1 ? "accent" : ""} key={line}>{line}</span>
            ))}
          </h2>
          <p className="statement-copy" data-reveal>{t.statement.body}</p>
        </section>

        {/* ─── SERVICES ─── */}
        <section className="services page-pad" id="services">
          <div className="section-heading" data-reveal>
            <div className="section-label"><span>[ 01 ]</span><span>{t.services.label}</span></div>
            <h2>{t.services.heading.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.services.intro}</p>
          </div>

          <div className="service-list">
            {t.services.items.map((service, serviceIndex) => (
              <article className="service-row" key={serviceIndex} data-cursor={cursor.explore}>
                <span className="service-no">{String(serviceIndex + 1).padStart(2, "0")}</span>
                <div className="service-title">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ul>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="service-media" aria-hidden="true">
                  {serviceMedia[serviceIndex].map((src, imageIndex) => (
                    <figure key={src} className={imageIndex === 0 ? "media-primary" : "media-secondary"}>
                      <Image src={src} alt="" fill sizes="(max-width: 860px) 88vw, 28vw" />
                    </figure>
                  ))}
                </div>
                <ArrowUpRight className="service-arrow" size={22} aria-hidden="true" />
              </article>
            ))}
          </div>

          <a className="text-link" href="#projects" data-cursor={cursor.explore} data-magnetic>
            SHOW ALL <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </section>

        {/* ─── PROJECTS ─── */}
        <section className="projects" id="projects">
          <div className="project-background" aria-hidden="true">
            {projects.map((project, index) => {
              const mediaClass = [
                "project-media",
                project.kind === "image" && "fit" in project && project.fit === "contain" ? "is-contained" : "",
                index === activeProject ? "is-active" : "",
              ].filter(Boolean).join(" ");

              if (project.kind === "video") {
                return (
                  <video
                    key={`${project.no}-${project.src}`}
                    className={mediaClass}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster={project.poster}
                  >
                    <source src={project.src} type="video/mp4" />
                  </video>
                );
              }

              return (
                <Image
                  key={`${project.no}-${project.src}`}
                  className={mediaClass}
                  src={project.src}
                  alt=""
                  fill
                  sizes="100vw"
                />
              );
            })}
            <div className="project-overlay" />
          </div>

          <div className="projects-inner page-pad">
            <div className="section-heading is-light" data-reveal>
              <div className="section-label"><span>[ 02 ]</span><span>{t.projects.label}</span></div>
              <h2>{t.projects.heading.map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{t.projects.intro}</p>
            </div>

            <div className="project-list" role="list">
              {projects.map((project, index) => (
                <a
                  className="project-row"
                  href="#contact"
                  key={project.no}
                  role="listitem"
                  onMouseEnter={() => setActiveProject(index)}
                  onFocus={() => setActiveProject(index)}
                  data-cursor={cursor.view}
                >
                  <span className="project-num">{project.no}</span>
                  <div className="project-info">
                    <h3>{t.projects.items[index].title}</h3>
                    <p>{t.projects.items[index].type}</p>
                  </div>
                  <time>{project.year}</time>
                  <div
                    className={`project-mobile-media${project.kind === "image" && "fit" in project && project.fit === "contain" ? " is-contained" : ""}`}
                    aria-hidden="true"
                  >
                    {project.kind === "video" ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster={project.poster}
                        disablePictureInPicture
                      >
                        <source src={project.src} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={project.src}
                        alt=""
                        fill
                        sizes="(max-width: 760px) calc(100vw - 40px), 1px"
                      />
                    )}
                    {project.kind === "video" && <span className="project-mobile-play">AUTO · 08S</span>}
                  </div>
                  <span className="project-play"><Play size={12} fill="currentColor" aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BRIDGE ─── */}
        <div className="type-bridge" aria-hidden="true">
          <span>{t.bridge[0]}</span><i>{t.bridge[1]}</i><span>{t.bridge[2]}</span>
        </div>

        {/* ─── ABOUT ─── */}
        <section className="about page-pad" id="about">
          <div className="about-intro">
            <div className="section-label"><span>[ 03 ]</span><span>{t.about.label}</span></div>
            <p className="about-copy">
              {aboutUnits.map((unit, index) => (
                <span key={`${locale}-${index}`} className="word-wrapper" style={{ overflow: "hidden", display: "inline-flex", paddingBlock: "0.15em", marginBlock: "-0.15em" }}>
                  <span className="word-inner" style={{ display: "inline-block" }}>{unit}</span>
                  {!isCharacterLanguage && <span>&nbsp;</span>}
                </span>
              ))}
            </p>
          </div>

          <div className="studio-facts" data-reveal>
            <div><strong>04</strong><span>{t.about.facts[0]}</span></div>
            <div><strong>01</strong><span>{t.about.facts[1]}</span></div>
            <div><strong>∞</strong><span>{t.about.facts[2]}</span></div>
          </div>

          <div className="lab-card" data-reveal>
            <div className="lab-visual" data-cursor={cursor.lab}>
              <Image src="/spatial-light-installation.png" alt="Immersive violet light installation" fill sizes="(max-width: 860px) 100vw, 52vw" />
              <span>{t.about.labKeywords}</span>
            </div>
            <div className="lab-copy">
              <div className="section-label"><span>[ {t.about.labLabel} ]</span><span>{t.about.openPractice}</span></div>
              <h2>{t.about.labHeading.map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{t.about.labBody}</p>
              <a href="#contact">{t.about.labCta} <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </div>

      {/* ─── FOOTER ─── */}
      <footer id="contact">
        <div className="footer-energy" aria-hidden="true" />
        <div className="footer-top">
          <p>[ {t.footer.prompt} ]</p>
          <h2>{t.footer.heading.map((line) => <span key={line}>{line}</span>)}</h2>
          <a href="mailto:hello@senseandscene.studio" data-cursor={cursor.write} data-magnetic>
            hello@senseandscene.studio <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="footer-meta">
          <div><span>{t.footer.social}</span><a href="#" data-magnetic>Instagram</a><a href="#" data-magnetic>Behance</a><a href="#" data-magnetic>Vimeo</a></div>
          <div><span>{t.footer.studio}</span><p>Ho Chi Minh City, Vietnam</p><p>GMT +07:00</p></div>
          <div><span>{t.footer.availability}</span><p>{t.footer.booking}</p><p>{t.footer.copyright}</p></div>
        </div>

        <div className="footer-wordmark" aria-label="Sense and Scene Studio">
          <span>SENSE</span><i>&amp;</i><span>SCENE</span>
        </div>
      </footer>
    </main>
  );
}
