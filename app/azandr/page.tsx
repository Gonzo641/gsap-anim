"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { logoData } from "../components/logoData"; // Vérifie bien le chemin selon ta structure
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function AzandrHero() {
  // Refs pour manipuler le DOM
  const heroImgContainerRef = useRef<HTMLDivElement>(null);
  const heroImgLogoRef = useRef<HTMLDivElement>(null);
  const heroImgCopyRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);
  const logoMaskRef = useRef<SVGPathElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const overlayCopyRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Sécurité : on s'assure que tous les refs existent
    if (
      !heroImgContainerRef.current ||
      !heroImgLogoRef.current ||
      !heroImgCopyRef.current ||
      !fadeOverlayRef.current ||
      !svgOverlayRef.current ||
      !logoMaskRef.current ||
      !logoContainerRef.current ||
      !overlayCopyRef.current
    )
      return;

    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    // 👉 Fixe 1 : Stocker la fonction pour remove plus tard
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Set up SVG mask path
    logoMaskRef.current.setAttribute("d", logoData);

    // Calculate logo scaling/position
    const logoDimensions = logoContainerRef.current.getBoundingClientRect();
    const logoBoundingBox = logoMaskRef.current.getBBox();
    const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
    const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
    const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

    const logoHorizontalPosition =
      logoDimensions.left +
      (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
      logoBoundingBox.x * logoScaleFactor;
    const logoVerticalPosition =
      logoDimensions.top +
      (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
      logoBoundingBox.y * logoScaleFactor;

    logoMaskRef.current.setAttribute(
      "transform",
      `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`
    );

    // Animation scroll
    const initialOverlayScale = 350;
    ScrollTrigger.create({
      trigger: heroImgContainerRef.current,
      start: "top top",
      end: `${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        const fadeOpacity = 1 - scrollProgress * (1 / 0.15);

        // Animation du logo et du texte de la hero
        if (scrollProgress <= 0.15) {
          gsap.set(
            [heroImgLogoRef.current!, heroImgCopyRef.current!],
            {
              opacity: fadeOpacity,
            }
          );
        } else {
          gsap.set(
            [heroImgLogoRef.current!, heroImgCopyRef.current!],
            {
              opacity: 0,
            }
          );
        }

        // Animation du scale de la hero et de l'overlay SVG
        if (scrollProgress <= 0.85) {
          const normalizedProgress = scrollProgress * (1 / 0.85);
          const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;
          const overlayScale =
            initialOverlayScale *
            Math.pow(1 / initialOverlayScale, normalizedProgress);
          let fadeOverlayOpacity = 0;

          gsap.set(heroImgContainerRef.current!, {
            scale: heroImgContainerScale,
          });

          gsap.set(svgOverlayRef.current!, {
            scale: overlayScale,
          });

          if (scrollProgress >= 0.25) {
            fadeOverlayOpacity = Math.min(
              1,
              (scrollProgress - 0.25) * (1 / 0.4)
            );
          }

          gsap.set(fadeOverlayRef.current!, {
            opacity: fadeOverlayOpacity,
          });
        }

        // Animation du texte d’outro (overlayCopy)
        if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
          const overlayCopyRevealProgress =
            (scrollProgress - 0.6) * (1 / 0.25);
          const gradientSpread = 100;
          const gradientBottomPosition =
            240 - overlayCopyRevealProgress * 280;
          const gradientTopPosition =
            gradientBottomPosition - gradientSpread;
          const overlayCopyScale =
            1.25 - 0.25 * overlayCopyRevealProgress;

          // 👉 Fixe 2 : overlayCopyRef.current! (non-null assertion)
          overlayCopyRef.current!.style.background =
            `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`;
          overlayCopyRef.current!.style.backgroundClip = "text";
          (overlayCopyRef.current!.style as any).webkitBackgroundClip = "text";
          (overlayCopyRef.current!.style as any).webkitTextFillColor = "transparent";

          gsap.set(overlayCopyRef.current!, {
            scale: overlayCopyScale,
            opacity: overlayCopyRevealProgress,
          });
        } else if (scrollProgress < 0.6) {
          gsap.set(overlayCopyRef.current!, {
            opacity: 0,
          });
        }
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove(tickerFn); // 👉 Retire bien la même fonction qu'à l'ajout
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#111117] text-white font-dmsans">
      {/* Section HERO */}
      <section
        className="w-screen h-screen relative flex justify-center items-center overflow-hidden"
        ref={heroImgContainerRef}
      >
        <Image
          src="/images/azandr/Azandr3.png"
          alt="AZANDR Background"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute z-20 pb-[200px] pr-[40px]"
          ref={heroImgLogoRef}
        >
          <Image
            src="/images/azandr/azandr-logo.png"
            alt="AZANDR Logo"
            width={650}
            height={120}
            className="object-contain"
          />
        </div>
        <div style={{ width: 700, height: 600, position: "relative" }} 
        className="z-30 mt-[382px]">
        <Image
            src="/images/azandr/Azandr2.png"
            alt=""
            fill
            className="object-cover"
        />
        </div>
        <div
          className="absolute bottom-1/5 left-1/2 -translate-x-1/2 z-10"
          ref={heroImgCopyRef}
        >
          <p className="text-[0.65rem] uppercase">Scroll down to reveal</p>
        </div>
      </section>

      {/* Fade overlay */}
      <div
        className="fade-overlay fixed inset-0 bg-white pointer-events-none will-change-[opacity]"
        ref={fadeOverlayRef}
        style={{ opacity: 0 }}
      />

      {/* SVG Overlay */}
      <div
        className="overlay absolute top-0 left-0 w-full h-[200%] z-10"
        ref={svgOverlayRef}
      >
        <svg width="100%" height="100%" viewBox="0 0 640 104">
        <defs>
            <mask id="logoRevealMask">
            <rect width="100%" height="100%" fill="white" />
            <path id="logoMask" ref={logoMaskRef}></path>
            </mask>
        </defs>
        <rect
            width="100%"
            height="100%"
            fill="#111117"
            mask="url(#logoRevealMask)"
        />
        </svg>
      </div>

      {/* Logo Container */}
      <div
        className="logo-container fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] z-20"
        ref={logoContainerRef}
      />

      {/* Overlay Copy */}
      <div className="overlay-copy absolute bottom-1/4 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center">
        <h1
          ref={overlayCopyRef}
          className="uppercase font-bold tracking-tight text-[6rem] leading-[0.8] bg-clip-text text-transparent"
        >
          Animation <br />
          Experiment 452 <br />
          By Codegrid
        </h1>
      </div>

      {/* Outro */}
      <section className="outro w-full min-h-[20vh] flex items-center justify-center text-center bg-transparent">
        <p className="uppercase text-xl font-semibold">Build your empire. Rule your city.</p>
      </section>
    </div>
  );
}



// ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
