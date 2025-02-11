import { useQuery } from "@tanstack/react-query";

interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  image_id?: string;
}

export interface ApiResponse {
  data: Artwork[];
}

const fetchArtworks = async (): Promise<ApiResponse> => {
  const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=1&limit=100`);
  if (!response.ok) throw new Error("Error al obtener artworks");
  return response.json();
};

export function useArtists() {
  return useQuery<ApiResponse, Error, string[]>({
    queryKey: ["artists"],
    queryFn: fetchArtworks,
    select: (data: ApiResponse): string[] => {
      // Extraer artistas únicos
      const artistsSet = new Set(data.data.map((art) => art.artist_display).filter(Boolean));
      return Array.from(artistsSet);
    },
  });
}
