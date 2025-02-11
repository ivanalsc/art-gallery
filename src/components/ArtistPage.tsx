import { useParams, useNavigate } from "react-router";
import { useArtworksByArtist } from "./hooks/useArtworks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const getImageUrl = (imageId?: string) => {
  return imageId
    ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    : "https://via.placeholder.com/843x600?text=No+Image";
};

const ArtistPage = () => {
  const { artistName } = useParams();
  const navigate = useNavigate();
  const { data: artworks, isLoading, error } = useArtworksByArtist(artistName);

  if (isLoading) return <p>Cargando obras...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="relative">
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
      >
        Volver atrás
      </button>

      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 10000 }}
        speed={800}  // Transición más suave
        modules={[Autoplay, Navigation]}
        className="h-screen"
      >
        {artworks?.map((art) => (
          <SwiperSlide key={art.id} className="relative h-full">
            <motion.img
              src={getImageUrl(art.image_id)}
              alt={art.alt_text || art.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-6">
              <motion.h3
                className="text-3xl font-semibold"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {art.title}
              </motion.h3>
              <motion.p
                className="text-xl text-gray-700"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {art.artist_display}
              </motion.p>
              <motion.p
                className="text-lg text-gray-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {art.date_display}
              </motion.p>
              <motion.p
                className="text-lg text-gray-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {art.medium_display}
              </motion.p>
              <motion.p
                className="text-lg text-gray-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {art.dimensions}
              </motion.p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ArtistPage;
