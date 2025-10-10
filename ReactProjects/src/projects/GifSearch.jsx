import { useState } from 'react'

const GifSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);

  const searchGifs = () => {
    // TODO: Implement Giphy API integration
    // For now, just placeholder data
    if (searchTerm.trim()) {
      const placeholderGifs = [
        { id: 1, url: 'https://via.placeholder.com/200x200/FF6B6B/ffffff?text=GIF+1' },
        { id: 2, url: 'https://via.placeholder.com/200x200/4ECDC4/ffffff?text=GIF+2' },
        { id: 3, url: 'https://via.placeholder.com/200x200/45B7D1/ffffff?text=GIF+3' },
        { id: 4, url: 'https://via.placeholder.com/200x200/FFA07A/ffffff?text=GIF+4' },
      ];
      setGifs(placeholderGifs);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchGifs();
    }
  };

  return (
    <div className="project-content">
      <h2>GIF Search</h2>
      <div className="gif-container">
        <div className="gif-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for GIFs..."
          />
          <button onClick={searchGifs}>Search</button>
        </div>
        <div className="gif-grid">
          {gifs.length === 0 ? (
            <p className="empty-message">Search for GIFs to see results</p>
          ) : (
            gifs.map(gif => (
              <div key={gif.id} className="gif-item">
                <img src={gif.url} alt="GIF" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GifSearch;
