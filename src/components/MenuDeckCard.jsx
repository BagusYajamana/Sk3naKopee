import { motion } from 'framer-motion'
import MenuCardFace from './MenuCardFace'

function MenuDeckCard({
  item,
  depth,
  zIndex,
  categoryDirection,
  visibleCount,
  categoryCardPresenceVariants,
  textWidth,
  measuredHeight,
  isTopCard,
  activeThrow,
  isTopCardFlipped,
  handleDeckDragEnd,
  handleTopCardPointerDown,
  handleTopCardPointerMove,
  handleTopCardPointerRelease,
  isPointerOverTopCardRef,
  wheelDeltaRef,
  animateConfig,
  transitionConfig,
  completeDeckCycle,
  showRecommendedBadge,
}) {
  const MotionArticle = motion.article
  const backImage = item.image

  return (
    <motion.div
      className="absolute left-0 top-0 mt-[54px]"
      style={{
        zIndex,
      }}
      custom={{
        depth,
        direction: categoryDirection,
        visibleCount,
      }}
      variants={categoryCardPresenceVariants}
    >
      <MotionArticle
        className="relative max-w-full rounded-xl px-8 py-9 md:px-10 md:py-10"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)',
          border: '3px solid #6b3f2a',
          width: `min(100%, ${textWidth + 260}px)`,
          pointerEvents: isTopCard ? 'auto' : 'none',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        drag={isTopCard && !activeThrow && !isTopCardFlipped}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragElastic={0.22}
        dragMomentum={false}
        onDragEnd={isTopCard ? handleDeckDragEnd : undefined}
        onPointerDown={isTopCard ? handleTopCardPointerDown : undefined}
        onPointerMove={isTopCard ? handleTopCardPointerMove : undefined}
        onPointerUp={isTopCard ? handleTopCardPointerRelease : undefined}
        onPointerCancel={isTopCard ? handleTopCardPointerRelease : undefined}
        onPointerEnter={
          isTopCard
            ? () => {
                isPointerOverTopCardRef.current = true
              }
            : undefined
        }
        onPointerLeave={
          isTopCard
            ? () => {
                isPointerOverTopCardRef.current = false
                wheelDeltaRef.current = 0
              }
            : undefined
        }
        animate={animateConfig}
        transition={transitionConfig}
        onAnimationComplete={isTopCard && activeThrow ? completeDeckCycle : undefined}
      >
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          <div className="[backface-visibility:hidden]">
            <MenuCardFace
              item={item}
              textWidth={textWidth}
              measuredHeight={measuredHeight}
              showRecommendedBadge={showRecommendedBadge}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-[#fffdf9] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <img
              src={backImage}
              alt={`${item.name} menu image`}
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>
        </div>
      </MotionArticle>
    </motion.div>
  )
}

export default MenuDeckCard
