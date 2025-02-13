import { useParams, useNavigate } from "react-router";
import { useArtworksByArtist } from "./hooks/useArtworks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Header from "./Header";
import transition from "../transition";

const getImageUrl = (imageId?: string) => {
  return imageId
    ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    : "https://via.placeholder.com/843x600?text=No+Image";
};

const ArtistPage = () => {
  const { artistName } = useParams();
  const navigate = useNavigate();
  const { data: artworks, isLoading, error } = useArtworksByArtist(artistName);

  const [activeIndex, setActiveIndex] = useState(0); // Estado para trackear el slide actual

  if (isLoading) return <p>Loading artworks...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Header position='right'/>
      <div className="relative w-full h-screen flex flex-col md:flex-row bg-stone-100">
      {/* Botón de Volver */}
      <button
        onClick={handleBackClick}
        className="absolute cursor-pointer top-4 left-4 z-50 text-white bg-black bg-opacity-50 px-4 py-2 transition-all duration-300 ease-in-out  hover:text-black hover:bg-white"
      >
        Go back
      </button>

      <div className="relative w-full md:w-3/5 h-[70vh] md:h-full">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          autoplay={{ delay: 10000 }}
          speed={800}
          modules={[Autoplay, Navigation]}
          className="h-full"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} 
        >
          {artworks?.map((art) => (
            <SwiperSlide key={art.id} className="h-full">
              <motion.img
                src={getImageUrl(art.image_id)}
                alt={art.alt_text || art.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.div
                className="absolute max-w-[60%] bottom-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <h3 className="text-2xl md:text-3xl font-semibold">{art.title}</h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-6 right-6 flex gap-4 z-50">
          <button className="custom-prev cursor-pointer bg-stone-100 bg-opacity-50 text-black p-2 border-2 transition-all duration-300 ease-in-out hover:bg-black hover:text-white">←</button>
          <button className="custom-next cursor-pointer bg-stone-100 bg-opacity-50 text-black p-2 border-2 transition-all duration-300 ease-in-out hover:bg-black hover:text-white">→</button>
        </div>
      </div>

    
      <div className="w-full md:w-2/5 bg-white p-8 flex flex-col justify-center">
        {artworks?.[activeIndex] && (
          <>
            <motion.p
              className="text-xl text-gray-700"
              key={activeIndex + "-artist"} // Clave única para animaciones fluidas
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {artworks[activeIndex].artist_display}
            </motion.p>
            <motion.p
              className="text-lg text-gray-500"
              key={activeIndex + "-date"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {artworks[activeIndex].date_display}
            </motion.p>
            <motion.p
              className="text-lg text-gray-500"
              key={activeIndex + "-medium"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {artworks[activeIndex].medium_display}
            </motion.p>
            <motion.p
              className="text-lg text-gray-500"
              key={activeIndex + "-dimensions"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {artworks[activeIndex].dimensions}
            </motion.p>
          </>
        )}
      </div>
    </div>
    </>
    
  );
};

export default transition(ArtistPage);
