import React, { useState, useEffect } from 'react';
import { Search, Globe, ArrowLeft, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

interface WiredBrowserProps {
  onSwitchProgram: (program: string) => void;
}

interface SearchResult {
  id: number;
  title: string;
  url: string;
  description: string;
  type: 'normal' | 'wired' | 'classified';
}

export const WiredBrowser: React.FC<WiredBrowserProps> = ({ onSwitchProgram }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('wired://home');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['wired://home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { playSound } = useAudio();

  const wiredSites = [
    {
      id: 1,
      title: "The Wired - Main Protocol",
      url: "wired://protocol",
      description: "Central hub for all Wired communications. Everyone is connected here.",
      type: "wired" as const
    },
    {
      id: 2,
      title: "Knights of Eastern Calculus",
      url: "wired://knights",
      description: "Mysterious organization operating within the Wired's deeper layers.",
      type: "classified" as const
    },
    {
      id: 3,
      title: "Cyberia Club - Virtual Space",
      url: "wired://cyberia",
      description: "Digital nightclub where reality and virtuality merge seamlessly.",
      type: "wired" as const
    },
    {
      id: 4,
      title: "Tachibana Labs Research",
      url: "wired://tachibana",
      description: "Advanced neural interface research and development facility.",
      type: "normal" as const
    },
    {
      id: 5,
      title: "NAVI Operating System",
      url: "wired://navi",
      description: "Next-generation neural interface operating system documentation.",
      type: "normal" as const
    },
    {
      id: 6,
      title: "[CLASSIFIED] - Access Denied",
      url: "wired://classified",
      description: "████████████████████████████████████████████████",
      type: "classified" as const
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    playSound('scan');
    
    setTimeout(() => {
      const filtered = wiredSites.filter(site => 
        site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Add some random "search results" for realism
      const additionalResults = [
        {
          id: 100,
          title: `Search results for "${searchQuery}"`,
          url: `wired://search?q=${encodeURIComponent(searchQuery)}`,
          description: `Found ${filtered.length + Math.floor(Math.random() * 10)} results in the Wired.`,
          type: "normal" as const
        }
      ];
      
      setSearchResults([...additionalResults, ...filtered]);
      setIsLoading(false);
      setCurrentUrl(`wired://search?q=${encodeURIComponent(searchQuery)}`);
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, 1000 + Math.random() * 2000);
  };

  const handleResultClick = (result: SearchResult) => {
    playSound('select');
    setCurrentUrl(result.url);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(result.url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
      playSound('key');
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
      playSound('key');
    }
  };

  const goHome = () => {
    setCurrentUrl('wired://home');
    setSearchResults([]);
    setSearchQuery('');
    playSound('select');
  };

  const refresh = () => {
    playSound('scan');
    if (searchQuery) {
      handleSearch();
    }
  };

  useEffect(() => {
    // Initialize with some default "sites"
    if (currentUrl === 'wired://home') {
      setSearchResults(wiredSites.slice(0, 4));
    }
  }, [currentUrl]);

  return (
    <div className="wired-browser">
      <div className="browser-toolbar">
        <div className="browser-navigation">
          <button 
            className="nav-btn" 
            onClick={goBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            className="nav-btn" 
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            <ArrowRight size={16} />
          </button>
          <button className="nav-btn" onClick={refresh}>
            <RotateCcw size={16} />
          </button>
          <button className="nav-btn" onClick={goHome}>
            <Home size={16} />
          </button>
        </div>
        
        <div className="address-bar">
          <Globe size={16} />
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="url-input"
          />
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-logo">
            <img 
              src="/ChatGPT Image Jul 10, 2025, 10_18_57 AM.png" 
              alt="Wired Search" 
              className="wired-logo"
            />
            <h1>Browse the Wired</h1>
          </div>
          
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search the Wired..."
              className="search-input"
            />
            <button 
              className="search-btn"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="search-results">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="loading-text">Connecting to the Wired...</div>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        ) : (
          <div className="results-container">
            {searchResults.map(result => (
              <div
                key={result.id}
                className={`search-result ${result.type}`}
                onClick={() => handleResultClick(result)}
              >
                <div className="result-header">
                  <h3 className="result-title">{result.title}</h3>
                  <span className="result-url">{result.url}</span>
                </div>
                <p className="result-description">
                  {result.type === 'classified' ? (
                    <span className="classified-text">
                      {result.description}
                    </span>
                  ) : (
                    result.description
                  )}
                </p>
                {result.type === 'wired' && (
                  <div className="wired-indicator">
                    <span>🌐 WIRED PROTOCOL</span>
                  </div>
                )}
                {result.type === 'classified' && (
                  <div className="classified-indicator">
                    <span>🔒 CLASSIFIED ACCESS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};