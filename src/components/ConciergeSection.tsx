import React from "react";
import { motion } from "framer-motion";

export const ConciergeSection = () => {
  return (
    <section id="concierge-editions" className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-6">
        <div className="space-y-8">
          {/* Title Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[clamp(20px,2vw,26px)] leading-relaxed"
          >
            <div className="text-[clamp(24px,2.4vw,32px)]">
              <span className="font-bold bg-orange-500/10 px-3 py-1 rounded-md text-orange-500">
                concierge
              </span>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                Some stories are too important to rush. They deserve time, care, and someone to help bring them to life.
              </p>

              <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                Concierge Editions are our most hands-on offering — a fully guided process where our team works with you to uncover and preserve a meaningful story. Whether it's a legacy gift for a parent, a tribute to someone you love, or the untold history of your family, we help shape it into something extraordinary.
              </p>

              <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                You'll work one-on-one with our researchers, writers, and illustrators to craft a 12-card story series — each card arriving throughout the year, beautifully written, illustrated, and timed to perfection.
              </p>

              <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                It's for the stories that should never be forgotten — and the people who deserve to receive them.
              </p>

              <div className="pt-6">
                <button
                  onClick={() => (window as any).handleStoryEditionSelection('concierge')}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 hover:bg-orange-500/15 text-orange-500 font-medium rounded-sm transition-colors group text-[clamp(20px,2vw,26px)]"
                >
                  Connect with a Concierge
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 