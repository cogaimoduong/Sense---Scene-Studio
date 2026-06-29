"use client";

import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
  { no: "01", title: "Creative Direction", tags: ["Concept development", "Campaign systems", "Visual language"] },
  { no: "02", title: "CGI & Motion", tags: ["3D animation", "Product films", "Motion identity"] },
  { no: "03", title: "Spatial Visuals", tags: ["Projection mapping", "Immersive content", "Digital installation"] },
  { no: "04", title: "R&D / New Media", tags: ["Real-time graphics", "Generative systems", "Creative technology"] },
];

const projects = [
  { no: "01", title: "Liquid Memory", type: "CGI / Art Film", year: "2026", tone: "violet" },
  { no: "02", title: "Future Matter", type: "Product / Motion", year: "2026", tone: "silver" },
  { no: "03", title: "Echoes of Light", type: "Spatial / Installation", year: "2025", tone: "blue" },
  { no: "04", title: "Infinite Form", type: "Identity / R&D", year: "2025", tone: "mono" },
];

function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -100, y = -100, cx = -100, cy = -100, frame = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const render = () => {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      if (cursor.current) cursor.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      frame = requestAnimationFrame(render);
    };
    const enter = (e: Event) => setLabel((e.currentTarget as HTMLElement).dataset.cursor || "VIEW");
    const leave = () => setLabel("");
    const targets = document.querySelectorAll<HTMLElement>("[data-cursor]");
    targets.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    window.addEventListener("mousemove", move); render();
    return () => {
      cancelAnimationFrame(frame); window.removeEventListener("mousemove", move);
      targets.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, []);

  return <div ref={cursor} className={`cursor ${label ? "cursor--active" : ""}`}><span>{label}</span></div>;
}

function Header() {
  return (
    <><div className="scroll-progress"/><header className="header">
      <a href="#top" className="mini-logo" aria-label="Sense and Scene home">
        <Image src="/sense-scene-logo.jpg" alt="Sense & Scene Studio" fill priority sizes="150px"/>
      </a>
      <nav aria-label="Main navigation">
        <a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a>
      </nav>
      <a className="contact-pill" href="mailto:hello@senseandscene.studio" data-cursor="HELLO">Contact <ArrowUpRight size={13}/></a>
    </header></>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const heroMedia = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const update = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(update); gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.to(".hero-title", { scale: 0.72, yPercent: -55, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "68% top", scrub: 1 } });
      gsap.to(".hero-actions", { y: -35, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "55% top", scrub: 1 } });
      gsap.to(".hero-media", { scale: 0.86, opacity: 0.35, filter: "blur(10px)", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.2 } });
      gsap.to(".hero-orbit", { rotate: 180, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray<HTMLElement>(".about-copy span").forEach((word, i) => {
        gsap.fromTo(word, { opacity: 0.12 }, { opacity: 1, scrollTrigger: { trigger: ".about-copy", start: `top+=${i * 8} 78%`, end: `top+=${i * 8 + 160} 58%`, scrub: true } });
      });
    }, root);

    const swing = (e: MouseEvent) => {
      if (!heroMedia.current) return;
      const rx = (e.clientY / innerHeight - 0.5) * -3;
      const ry = (e.clientX / innerWidth - 0.5) * 5;
      gsap.to(heroMedia.current, { rotationX: rx, rotationY: ry, duration: 1.2, ease: "power3.out" });
    };
    window.addEventListener("mousemove", swing);
    return () => { window.removeEventListener("mousemove", swing); ctx.revert(); lenis.destroy(); gsap.ticker.remove(update); };
  }, []);

  const about = "We are a visual technology studio exploring the point where image, space and feeling become one. Through CGI, motion and creative R&D, we build scenes that stay with people.";

  return (
    <main ref={root} id="top">
      <Cursor/><Header/>
      <section className="hero">
        <div className="hero-sticky">
          <div className="hero-media" ref={heroMedia}>
            <Image src="/infinity-key-visual.png" alt="Translucent infinity sculpture" fill priority sizes="100vw"/>
            <div className="hero-noise"/>
          </div>
          <div className="hero-frame" aria-hidden="true"><i/><i/><i/><i/></div>
          <div className="hero-orbit" aria-hidden="true"><span>∞</span></div>
          <div className="hero-kicker"><span>Visual technology studio</span><span>Saigon / Vietnam</span><span>EST. 2025</span></div>
          <div className="hero-spec"><span>Frame / 001</span><span>CGI — MOTION — NEW MEDIA</span><span>3840 × 2160</span></div>
          <div className="hero-copy">
            <p className="hero-slogan">Visual technology studio</p>
            <h1 className="hero-title" aria-label="Sense and Scene Studio"><span>SENSE</span><span><i>&</i> SCENE</span></h1>
            <div className="hero-actions"><a href="#contact">Start a project</a><a href="#projects">View projects</a></div>
          </div>
          <div className="scroll-note"><ArrowDownRight size={16}/><span>Scroll to enter</span></div>
        </div>
      </section>

      <div className="manifesto-ticker" aria-hidden="true"><div><span>IMAGE IS MATERIAL</span><i>∞</i><span>MOTION IS LANGUAGE</span><i>∞</i><span>TECHNOLOGY IS EMOTION</span><i>∞</i><span>IMAGE IS MATERIAL</span><i>∞</i><span>MOTION IS LANGUAGE</span><i>∞</i></div></div>

      <section className="statement page-pad" data-reveal>
        <p className="eyebrow">[ Our point of view ]</p>
        <h2>BESPOKE VISUAL<br/><em>WORLDS</em> BUILT FOR<br/>YOUR STORY.</h2>
        <p className="statement-note">No templates. No generic frames. Every visual system begins with the identity, space and emotion unique to your project.</p>
      </section>

      <section className="services page-pad" id="services">
        <div className="section-head" data-reveal><p className="eyebrow">[ 01 — Capabilities ]</p><p>From idea to final frame<br/>and everything in between.</p><span className="section-code">S&S / SERVICE INDEX<br/>04 DISCIPLINES</span></div>
        <div className="service-list">
          {services.map((item, i) => <article className="service-row" key={item.no} data-cursor="EXPLORE" data-reveal>
            <span>{item.no}</span><h3>{item.title}</h3><ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            <div className={`service-media service-media--${i + 1}`} aria-hidden="true"><Image src="/infinity-key-visual.png" alt="" fill sizes="32vw"/></div>
            <ArrowUpRight className="service-arrow"/>
          </article>)}
        </div>
        <a className="show-all" href="#projects">Show all capabilities <ArrowUpRight size={15}/></a>
      </section>

      <section className="projects" id="projects">
        <div className={`project-backdrop tone-${projects[project].tone}`}>
          <Image src="/infinity-key-visual.png" alt="" fill sizes="100vw" priority/>
          <div className="project-shade"/>
        </div>
        <div className="projects-inner page-pad">
          <div className="section-head light" data-reveal><p className="eyebrow">[ 02 — Selected work ]</p><p>Experiments, commissions<br/>and moving worlds.</p><span className="section-code">ARCHIVE / 2025—2026<br/>HOVER TO PREVIEW</span></div>
          <div className="project-list">
            {projects.map((item, i) => <a href="#contact" className="project-row" key={item.no} onMouseEnter={() => setProject(i)} data-cursor="VIEW">
              <span>{item.no}</span><h3>{item.title}</h3><p>{item.type}</p><time>{item.year}</time><span className="project-play"><Play size={12} fill="currentColor"/></span>
            </a>)}
          </div>
        </div>
      </section>

      <div className="type-bridge" aria-hidden="true"><span>SCENES</span><i>BETWEEN</i><span>SENSES</span></div>

      <section className="about page-pad" id="about">
        <div className="about-grid"><p className="eyebrow">[ 03 — About studio ]</p><p className="about-copy">{about.split(" ").map((word, i) => <span key={i}>{word}{" "}</span>)}</p></div>
        <div className="about-meta" data-reveal>
          <div><strong>04</strong><span>Core disciplines</span></div><div><strong>∞</strong><span>Ways to imagine</span></div><div><strong>01</strong><span>Shared vision</span></div>
        </div>
        <div className="lab-card" data-reveal>
          <div className="lab-visual"><Image src="/sense-scene-logo.jpg" alt="Sense and Scene Studio logo" fill sizes="45vw"/></div>
          <div className="lab-copy"><p className="eyebrow">[ R&D / Open practice ]</p><h3>Technology is our material.<br/>Emotion is our measure.</h3><p>We prototype new visual forms with real-time tools, procedural systems and a restless curiosity for what comes next.</p></div>
        </div>
      </section>

      <div className="footer-spacer"/>
      <footer id="contact">
        <div className="footer-top"><p>Have a scene in mind?</p><a href="mailto:hello@senseandscene.studio" data-cursor="WRITE">Let&apos;s make it real <ArrowUpRight/></a></div>
        <div className="footer-meta"><div><span>Social</span><a href="#">Instagram</a><a href="#">Behance</a><a href="#">Vimeo</a></div><div><span>Contact</span><a href="mailto:hello@senseandscene.studio">hello@senseandscene.studio</a><p>Ho Chi Minh City, Vietnam</p></div><div><span>Local time</span><p>GMT +07:00</p><p>© 2026 S&S Studio</p></div></div>
        <div className="footer-wordmark"><span>SENSE</span><i>&</i><span>SCENE</span></div>
      </footer>
    </main>
  );
}
