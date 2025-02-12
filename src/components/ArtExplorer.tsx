import { useState } from 'react';
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  image_id?: string;
}

interface Artist {
  name: string;
  representativeWork?: {
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





const useArtistsWithArtwork = () => {
  return useQuery<ApiResponse, Error, Artist[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=1&limit=100&fields=id,title,artist_display,image_id`
      );
      if (!response.ok) throw new Error("Error al obtener artworks");
      return response.json();
    },
    select: (data: ApiResponse): Artist[] => {
      const artistsMap = new Map<string, Artist>();
      
      data.data.forEach((artwork) => {
        if (artwork.artist_display && !artistsMap.has(artwork.artist_display)) {
          artistsMap.set(artwork.artist_display, {
            name: artwork.artist_display.toUpperCase(), // Convertir a mayúsculas
            representativeWork: artwork.image_id ? {
              title: artwork.title,
              imageUrl: `${data.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`
            } : undefined
          });
        }
      });
      
      return Array.from(artistsMap.values());
    },
  });
};




const ArtExplorer = () => {
  const { data: artists, isLoading } = useArtistsWithArtwork();
  const [hoveredArtist, setHoveredArtist] = useState<Artist | null>(null);
  const navigate = useNavigate();

  const handleArtistClick = (artist: Artist) => {
    if (artist.representativeWork) {
      sessionStorage.setItem('initialArtwork', JSON.stringify({
        imageUrl: artist.representativeWork.imageUrl,
        title: artist.representativeWork.title
      }));
    }
    navigate(`/artist/${encodeURIComponent(artist.name)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex"
    >
      {/* Área de la imagen */}
      <div className="h-screen flex">
      {/* Área de la imagen */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-1/2 bg-gray-100 flex items-center justify-center p-8"
      >
        <AnimatePresence mode="wait">
          {hoveredArtist?.representativeWork ? (
            <motion.div 
              key="artwork"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
              layoutId="main-artwork"
            >
              <motion.img
                src={hoveredArtist.representativeWork.imageUrl}
                alt={hoveredArtist.representativeWork.title}
                className="max-h-[70vh] max-w-full object-contain mx-auto"
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
              <img src="https://api.artic.edu/docs/assets/logo.svg" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-1/2 p-8 overflow-y-auto overflow-x-hidden"
      >
        {isLoading ? (
          <motion.p className="text-gray-600">
            Cargando artistas...
          </motion.p>
        ) : (
          <ul className="space-y-4">
            {artists?.map((artist, index) => (
              <motion.li 
                key={artist.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  ease: "easeOut" 
                }}
                className="text-right"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    x: -10,
                    transition: { 
                      type: "spring", 
                      stiffness: 200,
                      damping: 10
                    }
                  }}
                >
                  <button
                    onClick={() => handleArtistClick(artist)}
                    className="text-xl hover:text-blue-600 tracking-wide text-right cursor-pointer"
                    onMouseEnter={() => setHoveredArtist(artist)}
                    onMouseLeave={() => setHoveredArtist(null)}
                  >
                    {artist.name}
                  </button>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>

    
     
    </motion.div>
  );
};



export default ArtExplorer;