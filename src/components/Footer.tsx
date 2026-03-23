"use client";

import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-8 border-t border-slate-800/50"
    >
      <div className="text-center">
        <p className="text-slate-400">
          &copy; 2025 Rifat Hosen. All rights reserved.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Made with &hearts; by Rifat Hosen
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
