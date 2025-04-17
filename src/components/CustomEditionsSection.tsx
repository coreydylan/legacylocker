import { motion } from "framer-motion";

export const CustomEditionsSection = () => {
  return (
    <section id="custom-editions" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-legacy-green mb-6">
            Custom Editions
          </h2>
          <p className="text-xl text-legacy-dark/90 mb-12">
            Transform your personal memories, family history, or organization's journey into a beautifully crafted story series.
          </p>
          
          {/* Placeholder for custom editions showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-video bg-legacy-cream rounded-lg shadow-md"></div>
            <div className="space-y-6">
              <div className="h-12 bg-legacy-cream/50 rounded-md w-3/4"></div>
              <div className="h-12 bg-legacy-cream/50 rounded-md"></div>
              <div className="h-12 bg-legacy-cream/50 rounded-md w-5/6"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 