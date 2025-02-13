// ArtExplorer.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from './Header';

const useArtistsWithArtwork = () => {
  return useQuery<ApiResponse, Error, Artist[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=rating:1&fields=id,title,artist_display,image_id,thumbnail&limit=100`
      );
      if (!response.ok) throw new Error("Error al obtener artworks");
      return response.json();
    },
    select: (data: ApiResponse): Artist[] => {
      const artistsMap = new Map<string, Artist>();
      
      data.data.forEach((artwork) => {
        if (
          artwork.artist_display && 
          !artistsMap.has(artwork.artist_display) && 
          artwork.thumbnail && 
          artwork.thumbnail.lqip
        ) {
          artistsMap.set(artwork.artist_display, {
            name: artwork.artist_display.toUpperCase(),
            representativeWork: {
              title: artwork.title,
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
        title: artist.representativeWork.title,
        artistName: artist.name
      }));
   
        navigate(`/artist/${encodeURIComponent(artist.name)}`);
 
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading artists</p>
      </div>
    );
  }

  return (
    <div>
    <Header position='left' />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
     
      className="h-screen flex bg-stone-100 flex-col md:flex-row"
    >
      <motion.div 
        className="w-2/2 flex flex-col items-center justify-center p-8 pt-8 md:w-1/2"
      >
          {hoveredArtist?.representativeWork ? (
            <motion.div 
              key="artwork"
              className="text-center mt-20"
              layoutId="shared-artwork"
              transition={{
                layout: { duration: 0.5 },
                opacity: { duration: 0.3 }
              }}
            >
              <motion.div
                className="relative"
                layoutId="shared-image-container"
              >
                <motion.img
                  src={hoveredArtist.representativeWork.imageUrl}
                  alt={hoveredArtist.representativeWork.title}
                  className="max-h-[60vh] max-w-full object-contain mx-auto rounded-lg shadow-lg"
                  layoutId="shared-image"
                />
              </motion.div>
              <motion.p 
                className="mt-4 text-sm text-gray-600"
                layoutId="shared-title"
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
        </motion.div>

        <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-2/2 p-8 overflow-y-auto overflow-x-hidden md:w-1/2"
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
                    className="w-full text-right flex flex-col items-end px-10"
                    onMouseEnter={() => setHoveredArtist(artist)}
                    onMouseLeave={() => setHoveredArtist(null)}
                  >
                    <span className="text-xl font-bold text-gray-500 tracking-wide 
                      group-hover:text-neutral-900 cursor-pointer group-hover:scale-105 transition-all duration-300">
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
    </div>
  );
};

export default ArtExplorer;