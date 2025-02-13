import { motion } from "framer-motion";

interface HeaderTypes{
    position: string
}

const Header = ({position}: HeaderTypes) => {
  return (
    <header className={position === 'right' ? "hidden px-10 py-5 bg-transparent absolute  justify-end w-[100vw] z-2 md:flex":"hidden px-10 py-5 bg-stone-100 md:flex" }>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold text-gray-900  self-start"
      >
        ART GALLERY
      </motion.h1>
    </header>
  );
};

export default Header;
