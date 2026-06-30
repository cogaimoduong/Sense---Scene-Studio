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

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let pointerX = -80;
    let pointerY = -80;
    let cursorX = -80;
    let cursorY = -80;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const render = () => {
      cursorX += (pointerX - cursorX) * 0.18;
      cursorY += (pointerY - cursorY) * 0.18;
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
        <a className="header-brand brand-target" href="#top" aria-label={t.a11y.home}>
          <Image
            src="/sense-scene-logo-dark.png"
            alt="Sense & Scene Studio"
            fill
            priority
            sizes="(max-width: 760px) 128px, 170px"
          />
        </a>

        <nav className="desktop-nav" aria-label={t.a11y.primaryNavigation}>
          <a href="#services">{t.nav.services}</a>
          <a href="#projects">{t.nav.projects}</a>
          <a href="#about">{t.nav.studio}</a>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} label={t.a11y.selectLanguage} />
          <a className="header-cta" href="#contact" data-cursor={cursor.hello}>
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

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
    window.localStorage.setItem("sense-scene-locale", locale);
  }, [locale]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduceMotion ? 0 : 1.08,
      smoothWheel: !reduceMotion,
      wheelMultiplier: 0.9,
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const context = gsap.context(() => {
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
        gsap.to(".hero-media", {
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(".hero-title", {
          yPercent: -70,
          scale: 0.42,
          opacity: 0,
          transformOrigin: "left top",
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "10% top",
            end: "68% top",
            scrub: 1,
          },
        });

        gsap.to(".hero-orbit", {
          rotate: 150,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 56, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });

      }
    }, pageRef);

    const quickRotateX = gsap.quickTo(heroMediaRef.current, "rotationX", { duration: 1, ease: "power3.out" });
    const quickRotateY = gsap.quickTo(heroMediaRef.current, "rotationY", { duration: 1, ease: "power3.out" });
    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
      quickRotateX((event.clientY / window.innerHeight - 0.5) * -3);
      quickRotateY((event.clientX / window.innerWidth - 0.5) * 5);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [isCharacterLanguage, locale]);

  return (
    <main ref={pageRef} id="top">
      <CustomCursor />
      <Header locale={locale} onLocaleChange={setLocale} t={t} cursor={cursor} />

      <div className="site-content">
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
            </div>

            <div className="hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="hero-orbit" aria-hidden="true"><span>∞</span></div>

            <div className="hero-meta">
              <span>{t.hero.studioType}</span>
              <span>{t.hero.location}</span>
              <span>{t.hero.independent}</span>
            </div>

            <div className="hero-copy">
              <p>{t.hero.disciplines}</p>
              <h1 className="hero-title" id="hero-title">
                <span>Sense <em>&amp;</em></span>
                <span>Scene Studio</span>
              </h1>
            </div>

            <div className="hero-bottom">
              <p>{t.hero.promise}</p>
              <a href="#projects" data-cursor={cursor.explore}>
                <ArrowDown size={15} aria-hidden="true" /> {t.hero.selectedWork}
              </a>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div>
            {[...t.ticker, ...t.ticker].map((item, index) => (
              <Fragment key={`${item}-${index}`}><span>{item}</span><i>∞</i></Fragment>
            ))}
          </div>
        </div>

        <section className="statement page-pad">
          <div className="section-label" data-reveal><span>[ 00 ]</span><span>{t.statement.label}</span></div>
          <h2 data-reveal>
            {t.statement.lines.map((line, index) => (
              <span className={index === 1 ? "accent" : ""} key={line}>{line}</span>
            ))}
          </h2>
          <p className="statement-copy" data-reveal>{t.statement.body}</p>
        </section>

        <section className="services page-pad" id="services">
          <div className="section-heading" data-reveal>
            <div className="section-label"><span>[ 01 ]</span><span>{t.services.label}</span></div>
            <h2>{t.services.heading.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.services.intro}</p>
          </div>

          <div className="service-list">
            {t.services.items.map((service, serviceIndex) => (
              <article className="service-row" key={serviceIndex} data-cursor={cursor.explore} data-reveal>
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

          <a className="text-link" href="#contact" data-cursor={cursor.hello}>
            {t.services.discuss} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </section>

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
                  <span>{project.no}</span>
                  <h3>{t.projects.items[index].title}</h3>
                  <p>{t.projects.items[index].type}</p>
                  <time>{project.year}</time>
                  <div
                    className={`project-mobile-media${project.kind === "image" && "fit" in project && project.fit === "contain" ? " is-contained" : ""}`}
                    aria-hidden="true"
                  >
                    <Image
                      src={project.kind === "video" ? project.poster : project.src}
                      alt=""
                      fill
                      sizes="(max-width: 760px) calc(100vw - 40px), 1px"
                    />
                    {project.kind === "video" && (
                      <span className="project-mobile-play"><Play size={12} fill="currentColor" /> 08S</span>
                    )}
                  </div>
                  <span className="project-play"><Play size={12} fill="currentColor" aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="type-bridge" aria-hidden="true">
          <span>{t.bridge[0]}</span><i>{t.bridge[1]}</i><span>{t.bridge[2]}</span>
        </div>

        <section className="about page-pad" id="about">
          <div className="about-intro">
            <div className="section-label"><span>[ 03 ]</span><span>{t.about.label}</span></div>
            <p className="about-copy">
              {aboutUnits.map((unit, index) => (
                <span key={`${locale}-${index}`}>{unit}{isCharacterLanguage ? "" : " "}</span>
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

      <footer id="contact">
        <div className="footer-top">
          <p>[ {t.footer.prompt} ]</p>
          <h2>{t.footer.heading.map((line) => <span key={line}>{line}</span>)}</h2>
          <a href="mailto:hello@senseandscene.studio" data-cursor={cursor.write}>
            hello@senseandscene.studio <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="footer-meta">
          <div><span>{t.footer.social}</span><a href="#">Instagram</a><a href="#">Behance</a><a href="#">Vimeo</a></div>
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
