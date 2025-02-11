import { useQuery } from "@tanstack/react-query";

interface Artwork {
  id: number;
  title: string;
  api_link: string;
  image_id?: string;
  artist_display?: string;
  date_display?: string;
  medium_display?: string;
  dimensions?: string;
  place_of_origin?: string;
  department_title?: string;
  classification_title?: string;
  credit_line?: string;
  alt_text?: string;
}

interface ApiResponse {
  data: Artwork[];
}

const fetchArtworksByArtist = async (artist: string): Promise<Artwork[]> => {
  const searchResponse = await fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
      artist
    )}&fields=id,title,api_link`
  );

  if (!searchResponse.ok) {
    throw new Error("Error al obtener las obras del artista");
  }

  const searchData: ApiResponse = await searchResponse.json();

  // 🔹 Obtener datos detallados de cada obra consultando su `api_link`
  const artworksWithDetails = await Promise.all(
    searchData.data.map(async (artwork) => {
      const detailsResponse = await fetch(artwork.api_link);
      const detailsData = await detailsResponse.json();

      return {
        ...artwork,
        image_id: detailsData.data.image_id,
        artist_display: detailsData.data.artist_display,
        date_display: detailsData.data.date_display,
        medium_display: detailsData.data.medium_display,
        dimensions: detailsData.data.dimensions,
        place_of_origin: detailsData.data.place_of_origin,
        department_title: detailsData.data.department_title,
        classification_title: detailsData.data.classification_title,
        credit_line: detailsData.data.credit_line,
        alt_text: detailsData.data.thumbnail?.alt_text,
      };
    })
  );

  return artworksWithDetails;
};

export function useArtworksByArtist(artist?: string) {
  return useQuery<Artwork[], Error>({
    queryKey: ["artworks", artist],
    queryFn: () => (artist ? fetchArtworksByArtist(artist) : Promise.resolve([])),
    enabled: !!artist, // 🔹 Solo ejecuta la query si hay un artista seleccionado
  });
}
