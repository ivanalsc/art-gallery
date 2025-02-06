import { motion } from "framer-motion";
import "./index.css";
import { useState } from "react";

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="m-auto  w-[500px]">
      {/* <p>AAA</p>
      <motion.div
        className="box"
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
       <motion.div
        className="box"
        animate={{ scale: [1, 2, 2, 3, 3,4,3,2,1] }}
        transition={{ duration: 5, ease: "easeInOut" }}
      /> */}
      <motion.div
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective-1000"
      >
        <motion.div
          variants={{ front: { rotateY: 0 }, back: { rotateY: 180 } }}
          initial="front"
          animate={isFlipped? 'back': 'front'}
          transition={{duration: 0.6}}
          className="w-64 h-40 bg-white rounded-lg shadow-lg overflow-hidden transform-3d"
        >
          <div className="absolute inset-0 bg-white flex items-center justify-center text-xl font-bold">
            Front side
          </div>
          <div className="absolute inset-0 bg-blue-500 flex items-center justify-center text-xl font-bold rotate-y-180">
            Back side
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
