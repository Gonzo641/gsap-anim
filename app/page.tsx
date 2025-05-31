"use client";

import { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { GradientTracing } from "../components/ui/gradient-tracing";
import { HeroSection } from "@/components/blocks/galaxy-interactive-hero-section";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { ease: "hop" },
    });

    const counts = document.querySelectorAll(".count");

    // ---- ETAT INITIAL ----
    gsap.set("#word-1 h1", { y: "-120%", opacity: 0 });
    gsap.set("#word-2 h1", { y: "120%", opacity: 0 });
    gsap.set(".divider", { scaleY: 0, opacity: 0 });
    gsap.set(counts, { opacity: 0 });

    // ✅ Met tous les digits hors écran en bas
    counts.forEach((count) => {
      const digits = count.querySelectorAll(".digit h1");
      gsap.set(digits, { y: "120%" });
    });

    // ---- COMPTEUR ----
    counts.forEach((count, i) => {
      const digits = count.querySelectorAll(".digit h1");

      // Apparition du count
      tl.to(count, { opacity: 1, duration: 0.3 });

      // Animation entrée des digits (un petit décalage entre le premier et le deuxième)
      tl.to(
        digits,
        {
          y: "0%",
          duration: 0.6,
          stagger: 0.1,
        },
        "<"
      );

      // Pause légère avant la sortie
      tl.to(
        digits,
        {
          y: "-120%",
          duration: 0.6,
          stagger: 0.1,
        },
        "+=0.1"
      );

      // Disparition du count
      tl.to(count, { opacity: 0, duration: 0.3 }, "<+0.3");
    });

    // ---- SPINNER DISPARAIT ----
    tl.to(".spinner-container", { opacity: 0, duration: 0.3 });

    // ---- KIND & ROOT ENTRE ----
    tl.to("#word-1 h1", { y: "0%", opacity: 1, duration: 1 });
    tl.to("#word-2 h1", { y: "0%", opacity: 1, duration: 1 }, "<");

    // ---- DIVIDER ENTRE ----
    tl.to(".divider", {
      scaleY: 1,
      opacity: 1,
      duration: 1,
    });

    // ---- KIND & ROOT SORTENT ----
    tl.to("#word-1 h1", { y: "120%", opacity: 0, duration: 1 });
    tl.to("#word-2 h1", { y: "-120%", opacity: 0, duration: 1 }, "<");

    // ---- DIVIDER SORT ----
    tl.to(".divider", { opacity: 0, duration: 0.5 });

    // ---- BLOCS (POLYGONES) SORTENT ----
    tl.to(".block.left", {
      y: "-100%",
      duration: 1,
    });

    tl.to(
      ".block.right",
      {
        y: "-100%",
        duration: 1,
      },
      "-=0.5" // Décalage du 2ème
    );

    // ---- IMAGE ZOOM ----
    tl.to(
      ".hero-img",
      {
        scale: 1,
        duration: 2,
      },
      "<"
    );

    // ---- CONTENU APPARAIT ----
    tl.to(
      [".nav", ".line h1", ".line p"],
      { y: "0%", duration: 1.5, stagger: 0.2 },
      "<"
    );

    tl.to(
      [".cta", ".cta-icon"],
      { scale: 1, duration: 1.5, stagger: 0.75, delay: 0.75 },
      "<"
    );

    tl.to(
      ".cta-label p",
      { y: "0%", duration: 1.5, delay: 0.5 },
      "<"
    );
  }, []);

  return (
    <div className="w-full h-auto">
      <div className="loader fixed top-0 left-0 w-screen h-screen overflow-hidden z-20">
        <div className="overlay absolute top-0 w-full h-full flex">
          <div className="block left w-full h-full bg-black" />
          <div className="block right w-full h-full bg-black" />
        </div>

        <div className="intro-logo ml-3 absolute top-1/2 left-1/2 gap-2 flex translate-x-[-50%] translate-y-[-50%]">
          <div className="word text-white" id="word-1">
            <h1 className="text-5xl font-bold italic">
              <span>Art O</span>
            </h1>
          </div>
          <div className="word text-white" id="word-2">
            <h1 className="text-5xl font-bold italic">
              <span>f Nana</span>
            </h1>
          </div>
        </div>

        <div className="divider absolute top-0 left-1/2 translate-x-[-50%] w-px h-full bg-white" />

        <div className="spinner-container absolute bottom-[10%] left-1/2 translate-x-[-50%]">
          <GradientTracing
            width={200} // Ajustez la largeur selon vos besoins
            height={200} // Ajustez la hauteur selon vos besoins
            baseColor="transparent"
            gradientColors={["#2EB9DF", "#2EB9DF", "#9E00FF"]}
            animationDuration={2}
            strokeWidth={2}
            // Arc de cercle
            // path="M100,100 m0,-75 a75,75 0 1,1 -0.1,0 z"
            // Cercle
            // path="M100,100 m0,-50 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"
            // Vague
            path="M0,100 Q50,50 100,100 T200,100"
          />
        </div>



        {/* COUNTER 👇 */}
        <div className="counter absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20 w-28 h-40 text-white">
          {[["0", "5"], ["0", "4"], ["0", "3"], ["0", "2"], ["0", "1"]].map(
            (digits, i) => (
              <div
                key={i}
                className="count absolute top-0 left-0 w-full h-full flex justify-center opacity-0"
              >
                {digits.map((d, j) => (
                  <div key={j} className="digit relative overflow-hidden w-40 h-40">
                    <h1 className="absolute bottom-0 text-8xl font-bold leading-none">
                      {d}
                    </h1>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <div className="relative w-screen h-screen overflow-hidden">
        <div className="hero-img absolute top-0 w-full h-full overflow-hidden z-[-1] scale-[1.5]">
          <Image
            src="/images/nana1.jpg"
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* <div className="bg-black relative h-screen w-screen">
          <HeroSection />
        </div> */}

        <div className="nav absolute top-0 w-full flex items-center justify-between p-4 gap-6 translate-y-[-120%]">
          <div className="logo">
            <a className="capitalize font-bold text-sm text-white" href="#">
              Art of Nana
            </a>
          </div>
          <div className="nav-links uppercase text-xs font-medium hidden md:flex gap-2 text-white">
            <a href="#">STORYBOARD / BD</a>
            <a href="#">3D</a>
            <a href="#">CHARA DESIGN</a>
            <a href="#">SKETCHES</a>
            <a href="#">ILLUSTRATION</a>
          </div>
        </div>

        <div className="header flex flex-col items-center gap-4 pt-[25vh]">
          <div className="hero-copy text-center">
            <div className="line translate-y-[120%]">
              <h1 className="text-5xl text-white font-bold">
                <span>Rooted</span> in care,
              </h1>
            </div>
            <div className="line translate-y-[120%]">
              <h1 className="text-5xl text-white font-bold">
                grown with <span>kindness</span>
              </h1>
            </div>
            <div className="line translate-y-[120%] mt-12">
              <p className="uppercase text-white text-xs font-medium">
                Skincare that stays true to nature and to you
              </p>
            </div>
          </div>

          <div className="cta absolute bottom-12 left-1/2 translate-x-[-50%] flex items-center justify-between bg-white rounded-full p-2 w-[50%] max-w-xs scale-0">
            <div className="cta-label">
              <p className="text-black font-medium translate-y-[120%]">
                View all product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

