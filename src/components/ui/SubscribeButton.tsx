'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBackground } from '@/context/BackgroundContext';

const SubscribeButton = () => {
  const { isDark } = useBackground();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [1, 1.05, 1],
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        <motion.a
          href="https://cipherprojects.kit.com/bf48063930"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-block
            relative
            px-4
            py-2
            text-lg
            font-normal
            tracking-wide
            rounded
            bg-gradient-to-r
            from-gray-300/80
            via-gray-100/80
            to-gray-300/80
            backdrop-blur-sm
            ${isDark ? 'text-black' : 'text-black'}
            hover:from-gray-200
            hover:via-white
            hover:to-gray-200
            shadow-lg
            hover:shadow-xl
            transition-all
            duration-300
          `}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.a>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscribeButton;
