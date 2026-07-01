"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  Play,
  X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
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
  vi: { tag: "vi-VN", label: "Giờ thời gian thực", city: "Sài Gòn" },
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

function LanguageSwitcher({
  locale,
  onChange,
  label,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const current = localeOptions.find((option) => option.code === locale) ?? localeOptions[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button
        className="language-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        data-magnetic
      >
        <span>{current.short}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>

      <div className={`language-menu ${open ? "is-open" : ""}`} role="menu" aria-label={label}>
        {localeOptions.map((option) => (
          <button
            type="button"
            role="menuitemradio"
            aria-checked={locale === option.code}
            key={option.code}
            onClick={() => {
              onChange(option.code);
              setOpen(false);
            }}
          >
            <span className="language-code">{option.short}</span>
            <span>{option.label}</span>
            {locale === option.code && <Check size={14} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
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
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} label={t.a11y.selectLanguage} />
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
  ".hero-title span", ".hero-meta span", ".hero-copy p", ".hero-bottom p", ".hero-scroll-cta", ".live-clock span", ".live-clock strong", ".live-clock i", ".live-clock small",
  ".statement h2 span", ".statement-copy",
  ".services h2 span", ".services .section-heading p", ".service-row h3", ".service-row p", ".service-row li", ".services .text-link",
  ".projects h2 span", ".projects .section-heading p", ".project-info h3", ".project-info p",
  ".type-bridge span", ".type-bridge i",
  ".about-copy .word-inner", ".studio-facts div span", ".studio-facts div strong", ".lab-copy h2 span", ".lab-copy p", ".lab-copy a",
  ".footer-top p", ".footer-top h2 span", ".footer-top a", ".footer-meta div span", ".footer-meta div a", ".footer-meta div p", ".footer-wordmark span"
].join(", ");

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [locale, setLocale] = useState<Locale>("en");

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
    if (newLocale === locale) return;
    const targets = document.querySelectorAll(textSelectors);
    const loader = document.querySelector(".language-loader");
    const loaderParts = document.querySelectorAll(".language-loader span, .language-loader i");

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
        duration: 0.42,
        ease: "power4.out",
      }, 0)
      .fromTo(
        loaderParts,
        { yPercent: 90, opacity: 0, filter: "blur(18px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.46, stagger: 0.055, ease: "power4.out" },
        0.06,
      )
      .to(targets, {
        y: -22,
        opacity: 0,
        rotateX: 18,
        scale: 0.985,
        filter: "blur(12px)",
        transformOrigin: "50% 50% -80px",
        duration: 0.4,
        stagger: { each: 0.0025, from: "random" },
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

    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-language-loading");
        gsap.set(loader, { autoAlpha: 0, clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(targets, { clearProps: "transform,opacity,filter,willChange" });
      },
    })
      .fromTo(
        targets,
        {
          y: 30,
          opacity: 0,
          rotateX: -28,
          scale: 0.985,
          filter: "blur(16px)",
          willChange: "transform,opacity,filter",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.78,
          stagger: { each: 0.004, from: "start" },
          ease: "power4.out",
        },
        0.08,
      )
      .to(loaderParts, {
        yPercent: -80,
        opacity: 0,
        filter: "blur(14px)",
        duration: 0.34,
        stagger: 0.04,
        ease: "power3.in",
      }, 0)
      .to(loader, {
        clipPath: "inset(0% 0% 0% 100%)",
        duration: 0.48,
        ease: "power4.inOut",
      }, 0.12);
  }, [locale]);

  useEffect(() => {
    // Initial entrance animations
    const tl = gsap.timeline();
    tl.fromTo(".site-header",
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    );
    tl.fromTo(".hero-title span",
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
        // Morphing clipPath & parallax scale on scroll (card morph)
        gsap.fromTo(".hero-media",
          { clipPath: "inset(12% 16% 12% 16% round 40px)", scale: 1 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Hero title shrink scroll
        gsap.to(".hero-title", {
          y: () => {
            const logo = document.querySelector(".header-brand");
            const title = document.querySelector(".hero-title");
            if (logo && title) {
              return logo.getBoundingClientRect().top - title.getBoundingClientRect().top;
            }
            return -200;
          },
          x: () => {
            const logo = document.querySelector(".header-brand");
            const title = document.querySelector(".hero-title");
            if (logo && title) {
              return logo.getBoundingClientRect().left - title.getBoundingClientRect().left;
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

        // Orbit spin
        gsap.to(".hero-orbit", {
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

        // Type bridge parallax
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

    // Hero media and orbit 3D tilt
    gsap.set(".hero-orbit", { xPercent: -50, yPercent: -52 });
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const quickRotateX = gsap.quickTo(heroMediaRef.current, "rotationX", { duration: 0.55, ease: "power3.out" });
    const quickRotateY = gsap.quickTo(heroMediaRef.current, "rotationY", { duration: 0.55, ease: "power3.out" });
    const quickOrbitX = gsap.quickTo(".hero-orbit", "x", { duration: 0.72, ease: "power3.out" });
    const quickOrbitY = gsap.quickTo(".hero-orbit", "y", { duration: 0.72, ease: "power3.out" });
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
      quickOrbitX((event.clientX / window.innerWidth - 0.5) * -36);
      quickOrbitY((event.clientY / window.innerHeight - 0.5) * -36);
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

      <div className="site-content">
        {/* ─── HERO ─── */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-sticky">
            <div className="hero-media" ref={heroMediaRef}>
              <video
                className="hero-video"
                autoPlay
                loop
                muted
                playsInline
                poster="/hero-light-visual.png?v=2"
                aria-hidden="true"
              >
                <source src="/hero-loop-light.mp4?v=2" type="video/mp4" />
              </video>
              <div className="hero-vignette" />
              <div className="hero-scanlines" />
            </div>

            <div className="hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="hero-orbit" aria-hidden="true"><span>∞</span></div>
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
              <h1 className="hero-title" id="hero-title">
                <span>Sense <em>&amp;</em></span>
                <span>Scene Studio</span>
              </h1>
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
