import { Link } from "react-router";
import { useArtists } from "./hooks/useArtists";

const ArtExplorer = () => {
  const { data: artists, isLoading: artistsLoading } = useArtists();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Artistas</h1>

      {artistsLoading ? (
        <p>Cargando artistas...</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {artists?.map((artist) => (
            <li key={artist} className="bg-gray-200 p-2 rounded">
              <Link to={`/artist/${encodeURIComponent(artist)}`} className="block">
                {artist}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArtExplorer;
