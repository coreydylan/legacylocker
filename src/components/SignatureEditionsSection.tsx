import { motion } from "framer-motion";

export const SignatureEditionsSection = () => {
  return (
    <section id="signature-editions" className="bg-legacy-cream py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-legacy-green mb-6">
            Signature Editions
          </h2>
          <p className="text-xl text-legacy-dark/90 mb-12">
            Curated collections that tell the stories of places, moments, and movements that shaped our world.
          </p>
          
          {/* Placeholder for signature editions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Edition cards will go here */}
            <div className="aspect-[3/4] bg-white rounded-lg shadow-md"></div>
            <div className="aspect-[3/4] bg-white rounded-lg shadow-md"></div>
            <div className="aspect-[3/4] bg-white rounded-lg shadow-md"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 