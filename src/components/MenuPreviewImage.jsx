import { motion } from 'framer-motion'

function MenuPreviewImage({ topItem, topMenuImage }) {
  return (
    <motion.img
      key={topItem?.name}
      src={topMenuImage}
      alt={topItem ? `${topItem.name} menu item` : 'Menu item'}
      className="relative z-10 h-full w-full object-contain drop-shadow-[0_30px_34px_rgba(43,29,16,0.2)]"
      initial={{ opacity: 0, scale: 0.9, rotate: -1.7, x: 0, y: 6 }}
      animate={{
        opacity: [0, 1, 1, 1, 1],
        scale: [0.9, 1.06, 0.99, 1.015, 1],
        rotate: [-1.7, 1.1, -0.85, 0.45, 0],
        x: [0, -4, 4, -1, 0],
        y: [6, -2, 1, 0, 0],
      }}
      transition={{
        duration: 0.36,
        ease: 'easeOut',
        times: [0, 0.22, 0.5, 0.76, 1],
      }}
    />
  )
}

export default MenuPreviewImage
