import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const useArtistsWithArtwork = () => {
  return useQuery<ApiResponse, Error, Artist[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      // Pedimos explícitamente todos los campos relacionados con imágenes
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=rating:1&fields=id,title,artist_display,image_id,thumbnail&limit=100`
      );
      if (!response.ok) throw new Error("Error al obtener artworks");
      return response.json();
    },
    select: (data: ApiResponse): Artist[] => {
      const artistsMap = new Map<string, Artist>();
      
      data.data.forEach((artwork) => {
        // Solo procesamos obras que tienen artista y thumbnail
        if (
          artwork.artist_display && 
          !artistsMap.has(artwork.artist_display) && 
          artwork.thumbnail && 
          artwork.thumbnail.lqip // verificamos que tenga imagen
        ) {
          artistsMap.set(artwork.artist_display, {
            name: artwork.artist_display.toUpperCase(),
            representativeWork: {
              title: artwork.title,
              // Usamos la URL pública correcta
              imageUrl: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
            }
          });
        }
      });
      
      return Array.from(artistsMap.values())
        .filter(artist => artist.representativeWork)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });
};

interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  image_id: string;
  thumbnail: {
    lqip: string;
    width: number;
    height: number;
  };
}

interface Artist {
  name: string;
  representativeWork: {
    title: string;
    imageUrl: string;
  };
}

interface ApiResponse {
  data: Artwork[];
  config: {
    iiif_url: string;
  };
}

const ArtExplorer = () => {
  const { data: artists, isLoading, error } = useArtistsWithArtwork();
  const [hoveredArtist, setHoveredArtist] = useState<Artist | null>(null);
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = "smooth";
    }
  }, []);

  const handleArtistClick = (artist: Artist) => {
    if (artist.representativeWork) {
      sessionStorage.setItem('initialArtwork', JSON.stringify({
        imageUrl: artist.representativeWork.imageUrl,
        title: artist.representativeWork.title
      }));
    }
    navigate(`/artist/${encodeURIComponent(artist.name)}`);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">Error al cargar los artistas</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex"
     
    >
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-1/2 bg-gray-100 h-1/2 flex flex-col items-center justify-between p-8 pt-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-gray-900  self-start"
        >
          ART GALLERY
        </motion.h1>
        <AnimatePresence mode="wait">
          {hoveredArtist?.representativeWork ? (
            <motion.div 
              key="artwork"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-20"
              layoutId="main-artwork"
            >
              <motion.img
                src={hoveredArtist.representativeWork.imageUrl}
                alt={hoveredArtist.representativeWork.title}
                className="max-h-[60vh] max-w-full object-contain mx-auto rounded-lg shadow-lg"
                layoutId="main-artwork-image"
              />
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-sm text-gray-600"
              >
                {hoveredArtist.representativeWork.title}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400"
            >
              <img 
                src="https://api.artic.edu/docs/assets/logo.svg" 
                alt="Art Institute of Chicago"
                className="w-32 h-32 opacity-50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-1/2 p-8 overflow-y-auto overflow-x-hidden"
          ref={scrollRef}
      >
        {isLoading ? (
          <motion.div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <ul className="space-y-0">
            {artists?.map((artist, index) => (
              <motion.li 
                key={artist.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut" 
                }}
                className="border-b border-gray-200 py-4 last:border-b-0"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    x: 0,
                    transition: { 
                      type: "spring", 
                      stiffness: 300,
                      damping: 15,
                      mass: 0.8
                    }
                  }}
                  className="cursor-pointer group"
                >
                  <button
                    onClick={() => handleArtistClick(artist)}
                    className="w-full text-right flex flex-col items-end px-10 "
                    onMouseEnter={() => setHoveredArtist(artist)}
                    onMouseLeave={() => setHoveredArtist(null)}
                  >
                    <span className="text-xl font-bold text-gray-500 tracking-wide 
                      group-hover:text-[#010101] cursor-pointer group-hover:scale-105 transition-all duration-300">
                      {artist.name}
                    </span>
                    {artist.representativeWork && (
                      <span className="text-sm text-gray-500 mt-1">
                        {artist.representativeWork.title}
                      </span>
                    )}
                  </button>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ArtExplorer;