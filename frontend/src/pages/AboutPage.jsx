import React from "react";
import { ArrowRight, Compass, ShieldCheck, Feather, Cpu } from "lucide-react";

export function AboutPage({ onNavigate }) {
  return (
    <div className="py-16 pb-24">
      <div className="storefront-container max-w-[960px]">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            The Atelier
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 tracking-[-0.03em]">
            The Pixel Perfect Story
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mt-3 max-w-[680px] mx-auto leading-relaxed">
            Crafting tactile sanctuaries of thought through precision metals, sustainable fibers, and timeless analog stationery.
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-[var(--radius-lg)] overflow-hidden h-[340px] sm:h-[420px] mb-16 border border-[var(--border-subtle)]">
          <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1400&auto=format&fit=crop"
            alt="Pixel Perfect Workshop"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Paragraphs */}
        <div className="flex flex-col gap-8 text-base leading-loose text-[var(--text-secondary)] mb-18">
          <p>
            <strong className="text-[var(--text-primary)]">Pixel Perfect</strong> was founded in response to the ephemeral nature of modern digital workflows.
            While screens facilitate speed, they often rob our thinking of friction—the deliberate, contemplative resistance that allows deep ideas to take shape.
          </p>
          <p>
            We set out to engineer stationery that feels substantial in the hand and endures for generations.
            From the tactile snap of our raw brass pens to the smooth, ink-receptive fiber of Swedish Munken paper,
            every material is selected for its sensory feedback and archival durability.
          </p>
          <p>
            Our workshop operates in small, deliberate batches. We work closely with master papermakers in Sweden,
            CNC machinists in Bavaria, and traditional leather artisans in Florence to bring each design to life without compromise.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="mb-18">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] mb-8">
            Our Four Tenets
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-7 rounded-[var(--radius-md)]">
              <div className="text-xl font-extrabold font-mono mb-2">01</div>
              <h3 className="text-base font-bold m-0 mb-1.5">Material Honesty</h3>
              <p className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed m-0">
                Solid brass without artificial coatings. 100% cotton rags without chemical bleaching. Pure materials that age with dignity.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-7 rounded-[var(--radius-md)]">
              <div className="text-xl font-extrabold font-mono mb-2">02</div>
              <h3 className="text-base font-bold m-0 mb-1.5">Micron Precision</h3>
              <p className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed m-0">
                CNC turning tolerances down to 0.01mm ensure perfect balance, effortless cap threading, and flawless ink cartridge seating.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-7 rounded-[var(--radius-md)]">
              <div className="text-xl font-extrabold font-mono mb-2">03</div>
              <h3 className="text-base font-bold m-0 mb-1.5">Lay-Flat Binding</h3>
              <p className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed m-0">
                Every notebook uses authentic Smyth sewn binding that opens 180 degrees completely flat, respecting both left and right-handed writers.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-7 rounded-[var(--radius-md)]">
              <div className="text-xl font-extrabold font-mono mb-2">04</div>
              <h3 className="text-base font-bold m-0 mb-1.5">Lifelong Support</h3>
              <p className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed m-0">
                Refillable standard international fountain pen cartridges and modular replacement parts for all desk objects.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-lg)] p-12 text-center flex flex-col items-center gap-3.5">
          <h2 className="text-2xl font-extrabold m-0">Experience The Analog Difference</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-[480px]">
            Explore our curated range of notebooks, machined writing instruments, and desk objects.
          </p>
          <button onClick={() => onNavigate("products")} className="btn btn-primary gap-1.5 mt-1.5">
            <span>Explore The Collection</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
