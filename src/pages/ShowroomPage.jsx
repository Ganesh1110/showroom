import { motion } from 'framer-motion'
import Showroom from '../components/showroom/Showroom'
import useStore from '../stores/useStore'

export default function ShowroomPage() {
  const { selectCategory } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Showroom onSelectCategory={selectCategory} />
    </motion.div>
  )
}
