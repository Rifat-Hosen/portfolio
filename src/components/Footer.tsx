"use client";

import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-8 border-t border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-slate-300 font-medium tracking-wide">
          &copy; {currentYear} Rifat Hosen. All rights reserved.
        </p>
         
      </div>
    </motion.footer>
  );
};

export default Footer;
