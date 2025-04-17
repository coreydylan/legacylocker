import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ConciergeServiceSection = () => {
  return (
    <section id="concierge-service" className="bg-legacy-cream/50 py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-legacy-green mb-6">
              Concierge Family Stories
            </h2>
            <p className="text-xl text-legacy-dark/90">
              Let our team of historians and storytellers help preserve your family's legacy
            </p>
          </div>
          
          {/* Service Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="text-legacy-green text-2xl font-bold mb-4">Personal Historian</div>
              <p className="text-legacy-dark/80 mb-4">
                Work one-on-one with a dedicated historian who will help uncover and document your family's unique story
              </p>
              <div className="h-32 bg-legacy-cream/30 rounded-lg"></div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="text-legacy-green text-2xl font-bold mb-4">Archival Research</div>
              <p className="text-legacy-dark/80 mb-4">
                Access to professional genealogists and archivists to discover historical records and documents
              </p>
              <div className="h-32 bg-legacy-cream/30 rounded-lg"></div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="text-legacy-green text-2xl font-bold mb-4">Custom Illustrations</div>
              <p className="text-legacy-dark/80 mb-4">
                Beautiful custom artwork that brings your family's story to life
              </p>
              <div className="h-32 bg-legacy-cream/30 rounded-lg"></div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="text-legacy-green text-2xl font-bold mb-4">Digital Archive</div>
              <p className="text-legacy-dark/80 mb-4">
                Secure digital preservation of photos, documents, and recorded stories
              </p>
              <div className="h-32 bg-legacy-cream/30 rounded-lg"></div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Button 
              className="bg-legacy-green hover:bg-legacy-green/90 text-white py-6 px-8 rounded text-lg"
              onClick={() => window.location.href = "#contact"}
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 