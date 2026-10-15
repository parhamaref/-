/**
 * @file AboutUsStory.tsx
 * DANIELS — ABOUT US: THE STORY BEHIND THE BRAND
 * Complete, unabridged brand chronicle and heritage manifesto.
 * Preserves the exact narrative, historical timeline, philosophy, values, and vision.
 */

import React from 'react';
import {
  Sparkles,
  Scissors,
  Compass,
  Heart,
  Globe2,
  Users,
  Award,
  ShieldCheck,
  ChevronRight,
  Quote,
  Layers,
  Cpu,
} from 'lucide-react';

export const AboutUsStory: React.FC<{ onExploreCollections?: () => void }> = ({
  onExploreCollections,
}) => {
  return (
    <article className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-fadeIn text-left text-neutral-300 font-sans">
      {/* Title & Masthead */}
      <header className="text-center space-y-6 border-b border-[#262626] pb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-mono text-[10px] tracking-[0.3em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>DANIEL’S MAISON • OFFICIAL BRAND HERITAGE</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-widest font-bold leading-tight">
          ABOUT US — THE STORY BEHIND THE BRAND
        </h1>

        <p className="font-serif text-xl sm:text-2xl text-amber-300/90 italic tracking-wide max-w-3xl mx-auto">
          A Legacy of Skill, Curiosity and Courage
        </p>

        <div className="w-16 h-[1px] bg-amber-400/60 mx-auto mt-4" />
      </header>

      {/* Prologue / Introduction */}
      <section className="space-y-6 text-base sm:text-lg leading-relaxed text-neutral-200 font-sans max-w-4xl mx-auto">
        <p className="leading-relaxed">
          <strong className="text-white font-semibold">DANIELS</strong> is the result of a lifetime of experience — an experience shaped by craftsmanship, the textile industry, entrepreneurship, and a deep belief in the value of people.
        </p>
        <p className="leading-relaxed">
          At its heart, DANIELS is more than a fashion brand. It is the continuation of a family story that began with hardship, grew through knowledge and skill, and has now evolved into a vision for a new generation of luxury.
        </p>
      </section>

      {/* Chapter 1: Where Did the Story Begin? */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter I</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          Where Did the Story Begin?
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>The story begins with Daniel’s father.</p>
          <p>
            He was only seven or eight years old when he lost his own father, and suddenly found himself carrying responsibilities far beyond his years. He had to support his mother and two sisters while combining his childhood education with work and family responsibilities.
          </p>
          <p>
            He began working in his uncle’s tailoring workshop. The environment was demanding and physically challenging, but it introduced him to a world that would later become his lifelong profession: fabrics, tailoring, machinery and manufacturing skills.
          </p>
          <p>
            Whenever he had the opportunity, he studied. He worked long hours and continued to support his family.
          </p>
        </div>
      </section>

      {/* Chapter 2: From Apprentice to Textile Specialist */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter II</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          From Apprentice to Textile Specialist
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            As he grew older, the circumstances of the time — including the consequences of the Second World War — made life increasingly difficult.
          </p>
          <p>
            During his military service, his talent for tailoring and garment production led him to work in the production of military clothing. This valuable practical experience further developed his knowledge and skills while he continued to support his family.
          </p>
          <p>
            After completing his service, he made an important decision: to build his professional future in the textile industry.
          </p>
          <p>
            He continued his education and developed his knowledge through both academic training and practical experience. Guidance from skilled and educated people he encountered throughout his life helped him build a strong technical foundation for the future.
          </p>
          <p>
            Eventually, he travelled to Italy to deepen his knowledge of textile technology. There, he trained in textile machinery, particularly spinning and yarn-production technology, and later continued developing his specialist knowledge of weaving, fabrics and luxury textiles.
          </p>
        </div>
      </section>

      {/* Chapter 3: Building an Industry, Building a Family */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter III</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          Building an Industry, Building a Family
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            After returning home, he brought with him knowledge, ambition and a strong desire to contribute to the development of the country’s textile industry.
          </p>
          <p>
            He became involved in the development and production of textile machinery, applying the knowledge he had gained abroad to domestic manufacturing.
          </p>
          <p>
            His work attracted attention across the textile industry. Machinery was produced and installed and subsequently used by manufacturers in different parts of the country, while his technical reputation continued to grow.
          </p>
          <p>
            Eventually, he established his own factory, bringing together years of knowledge and experience within one organisation.
          </p>
          <p>
            Daniel and his older brother grew up in this environment. From an early age, they were exposed to machinery, manufacturing and the realities of running a factory. They learned not only from books, but through observation, helping out and experiencing the industry from the ground up.
          </p>
        </div>
      </section>

      {/* Chapter 4: Daniel: Learning from A to Z */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter IV</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          Daniel: Learning from A to Z
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>Daniel developed a particular interest in understanding every part of a business.</p>
          <p>
            His father believed that real knowledge was not something simply handed down; it had to be earned.
          </p>
          <p>
            Daniel and his brother were therefore encouraged to learn the entire production process, from raw fibres through to finished yarn and fabric.
          </p>
          <p>
            They experienced the demanding stages of traditional textile production: fibre preparation and blending, opening and cleaning, carding, roving, ring spinning, winding and preparation for weaving.
          </p>
          <p>
            Many of these processes were still highly manual at the time. Learning them required patience, discipline and months of practical experience.
          </p>
          <p>
            This hands-on education became one of Daniel’s greatest assets. He learned to understand raw materials, machinery, quality, production, people and processes not as separate subjects, but as interconnected parts of one complete system.
          </p>
        </div>
      </section>

      {/* Chapter 5: Education, Service and Entering a Wider World */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter V</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          Education, Service and Entering a Wider World
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            Daniel later studied Textile Engineering in Isfahan, combining university education with the practical training he had received from his family.
          </p>
          <p>
            After university, he completed his military service in the Air Force, where he served in an aviation training environment and gained another important experience in discipline, responsibility and organisation.
          </p>
          <p>After completing his service, his father taught him another important lesson:</p>
          <blockquote className="p-4 rounded-xl bg-[#141414] border-l-2 border-amber-400 text-amber-200 italic font-serif">
            If Daniel wanted to become a successful businessman, he first needed to understand what it meant to work for someone else.
          </blockquote>
          <p>
            Daniel accepted the challenge and took responsibility for managing a spinning factory.
          </p>
          <p>
            At first, travelling to the factory involved approximately 100 kilometres each way — almost 200 kilometres every day for the round trip.
          </p>
          <p>
            It was demanding, but the experience taught him the realities of management, production, quality, productivity and responsibility.
          </p>
          <p>
            Later, he also managed a carpet manufacturing business, gaining further experience in production, quality, output and commercial performance.
          </p>
        </div>
      </section>

      {/* Chapter 6: Entrepreneurship, Setbacks and Starting Again */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter VI</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          Entrepreneurship, Setbacks and Starting Again
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>These experiences gave Daniel the confidence to establish businesses of his own.</p>
          <p>Daniel’s first independent factory was focused on carpet manufacturing.</p>
          <p>
            Although the project involved considerable effort and ambition, difficult market conditions and challenges with business partners eventually brought the operation to an end.
          </p>
          <p>
            Rather than seeing the experience simply as a failure, Daniel regarded it as one of the most valuable lessons of his entrepreneurial life.
          </p>
          <p>
            It taught him the importance of choosing the right partners, understanding commercial risk and taking responsibility for every aspect of a business.
          </p>
          <p>
            With the support and guidance of his father, Daniel then established himself further in the textile trade.
          </p>
          <p>
            He built relationships with influential people in the business world and began importing textile raw materials, including wool, cotton, viscose, silk and polyester.
          </p>
          <p>
            His understanding of both manufacturing and trade allowed him to build a strong position in the market.
          </p>
        </div>
      </section>

      {/* Chapter 7: From Yarn to Fabric and Innovation in Nonwoven Textiles */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter VII</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          From Yarn to Fabric and Innovation in Nonwoven Textiles
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            Daniel continued working alongside his father and brother and returned to manufacturing — first through yarn production and then by establishing a specialised fabric manufacturing facility.
          </p>
          <p>
            The business invested in advanced Italian weaving machinery, including high-quality equipment capable of producing complex and patterned fabrics.
          </p>
          <p>
            The fabrics produced became recognised for their quality and distinctive design capabilities.
          </p>
          <p>
            Daniel’s ambition eventually led to the establishment of a large-scale nonwoven textile manufacturing operation using modern production technology.
          </p>
          <p>
            The business grew successfully until wider economic and political circumstances surrounding the war brought its activities to a halt and opened a new chapter abroad.
          </p>
        </div>
      </section>

      {/* Chapter 8: A New Chapter in Britain */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter VIII</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          A New Chapter in Britain
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            Daniel came to Britain with decades of knowledge and experience in textiles, fabrics, structure, manufacturing and trade.
          </p>
          <p>
            Recognising that the world was changing rapidly, he also invested in updating his knowledge of digital business, design and digital marketing.
          </p>
          <p>
            During this period, Daniel met designers and founders connected with established fashion brands.
          </p>
          <p>
            He studied how modern fashion brands were created and developed and recognised an opportunity to combine his own technical background with the creativity of talented specialists and people from different disciplines.
          </p>
        </div>
      </section>

      {/* Chapter 9: The Birth of DANIELS */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Chapter IX</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          The Birth of DANIELS
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>DANIELS is the result of this entire journey.</p>
          <p>
            The brand has been designed as a platform where experience, craftsmanship, design and technology come together.
          </p>
          <p>
            Daniel’s vision is to build a brand that brings together designers, artisans, manufacturers and talented creative specialists — people who can share their knowledge and work together to create exceptional products.
          </p>
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm sm:text-base font-serif italic text-center">
            The philosophy is simple:
            <br />
            <strong className="text-white not-italic block mt-1 font-serif text-base sm:text-lg">
              Talent should be recognised, expertise should be shared, and people should have the opportunity to grow together.
            </strong>
          </div>
          <p>
            At DANIELS, collaboration is not limited by nationality, language, ethnicity, skin colour or religion.
          </p>
          <p>
            The brand is founded on respect for people and on the belief that diversity of experience can create stronger ideas, better skills and more meaningful products.
          </p>
        </div>
      </section>

      {/* Chapter 10: Our Philosophy */}
      <section className="space-y-8 p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#333]">
        <div className="text-center space-y-3">
          <span className="text-amber-400 font-mono text-xs tracking-widest uppercase">
            CORE FOUNDATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-wide uppercase">
            Our Philosophy
          </h2>
          <p className="text-sm text-neutral-400">DANIELS is built on one simple principle:</p>
          <div className="py-3">
            <span className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-300 tracking-widest uppercase drop-shadow-md">
              WE GROW TOGETHER.
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed pt-4 border-t border-[#262626]">
          <h3 className="font-serif text-xl text-white font-semibold">
            Our Philosophy — Continued
          </h3>
          <p>
            The brand seeks to work with talented people, learn from them and create an environment where knowledge and opportunity can be shared.
          </p>
          <p>
            We believe luxury is not defined only by the material of a product, the name of a brand or its price.
          </p>
          <p>
            Luxury is about the quality of an idea, the skill behind its creation, attention to every detail and the experience it creates for the person who wears or uses it.
          </p>
          <p>
            Our goal is to personalise fashion — creating distinctive garments for distinctive people and important moments in their lives.
          </p>
          <p>We believe great things are created when talented people work together.</p>
        </div>

        {/* Pillars: Innovation & Humanity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg">
              <Cpu className="w-5 h-5" />
              <span>Innovation</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              We combine heritage and experience with modern technology and new ideas.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg">
              <Heart className="w-5 h-5" />
              <span>Humanity</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              We believe success should be accompanied by kindness, dignity and respect.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 11: A Brand with a Future */}
      <section className="space-y-6 p-8 sm:p-10 rounded-2xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-amber-400" />
          <span>Vision & Trajectory</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide font-bold">
          A Brand with a Future
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            DANIELS has a history that began generations ago, but its purpose is firmly focused on the future.
          </p>
          <p>
            The brand brings together Daniel’s family heritage in the textile industry, his experience in manufacturing and trade, and his belief in the creative power of collaboration.
          </p>
          <div className="p-4 rounded-xl bg-[#161616] border border-[#333] space-y-1">
            <span className="text-xs uppercase text-amber-400 font-mono">The Goal</span>
            <p className="text-base text-white font-serif font-medium">
              To build something beyond a fashion brand: A global community of designers, makers, specialists and customers who share a passion for quality, individuality and meaningful design.
            </p>
          </div>
          <p>
            From the earliest lessons learned in a small tailoring workshop to modern luxury fashion, the journey has always been about one thing:
          </p>
          <p className="text-amber-200 font-serif text-base italic">
            Learning, creating, overcoming challenges and moving forward.
          </p>
        </div>
      </section>

      {/* Chapter 12: A Message from DANIELS */}
      <section className="p-8 sm:p-12 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-4">
        <Quote className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
        <h3 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-wide uppercase">
          A Message from DANIELS
        </h3>
        <blockquote className="font-serif text-lg sm:text-xl text-neutral-200 italic max-w-3xl mx-auto leading-relaxed">
          “We want to create exceptional clothing for exceptional moments, and create exceptional moments for exceptional people.
          <br className="hidden sm:inline" /> Every customer should feel that their experience matters and that their product has been created with genuine care, precision and passion.”
        </blockquote>
      </section>

      {/* Chapter 13: Our Values */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-amber-400 font-mono text-xs tracking-widest uppercase">
            Guiding Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-wide uppercase">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
          <div className="p-6 rounded-xl bg-[#0e0e0e] border border-[#222] space-y-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Respect</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We respect every person, every culture and every individual story.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0e0e0e] border border-[#222] space-y-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Excellence</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We value craftsmanship, quality, precision and continuous improvement.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0e0e0e] border border-[#222] space-y-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Capability</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We believe talented people should have opportunities to contribute, lead and grow.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0e0e0e] border border-[#222] space-y-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Collaboration</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We believe the best results are created when talented people share their knowledge and experience with one another.
            </p>
          </div>
        </div>
      </section>

      {/* Concluding Signature Monogram Banner */}
      <footer className="text-center py-12 border-t border-[#262626] space-y-5">
        <div className="font-serif text-3xl sm:text-4xl font-bold tracking-widest text-white uppercase">
          DANIELS
        </div>
        <p className="font-serif text-base sm:text-lg text-amber-300 italic tracking-wider">
          FROM YESTERDAY’S HERITAGE, TO TOMORROW’S FUTURE.
        </p>
        <p className="font-mono text-xs sm:text-sm text-neutral-400 tracking-[0.25em] uppercase">
          EXPERIENCE • CRAFTSMANSHIP • INNOVATION • HUMANITY
        </p>

        {onExploreCollections && (
          <div className="pt-6">
            <button
              onClick={onExploreCollections}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-amber-500/20"
            >
              <span>Explore Bespoke Collections</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="pt-8 border-t border-[#222222]/80 space-y-2">
          <p className="font-mono text-[9px] text-neutral-500 tracking-wider uppercase">
            © 2026 DANIEL’S MAISON. FROM YESTERDAY’S HERITAGE, TO TOMORROW’S FUTURE. WE GROW TOGETHER.
          </p>
          <p className="text-neutral-400 font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.2em] sm:tracking-[0.28em] uppercase">
            DESIGNER, ARCHITECT &amp; GRAPHIC ARTIST: <span className="text-amber-400 font-semibold tracking-widest">ENG. PARHAM AREF</span>
          </p>
        </div>
      </footer>
    </article>
  );
};
