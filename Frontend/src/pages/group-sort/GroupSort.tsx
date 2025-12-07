import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Pause, Play, Timer, Lock } from "lucide-react";
import thumbnailPlaceholder from "../../assets/images/thumbnail-placeholder.png";
import AudioControls from "@/components/ui/audio-controls";

interface Item {
  id: string;
  text: string;
  image: string | null;
  correctCategoryId: string;
}

interface Category {
  id: string;
  name: string;
  items: Item[];
}

interface GameData {
  categories: Category[];
  timeLimit: number;
  scorePerItem: number;
}

interface GroupSortGame {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string | null;
  is_published: boolean;
  game_data: GameData;
}

// Cyberpunk Loading Screen Component with Rotating Box
function IntroScreen({ onStart }: { onStart: () => void }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing System...");
  const [chars, setChars] = useState("");

  useEffect(() => {
    const messages = [
      "Initializing System...",
      "Loading Game Data...",
      "Preparing Game Session...",
      "Loading Game Rules...",
      "Starting Game...",
    ];

    let msgIndex = 0;
    let prog = 0;

    const interval = setInterval(() => {
      prog += 20;
      setProgress(prog);
      
      if (msgIndex < messages.length - 1) {
        msgIndex++;
        setMessage(messages[msgIndex]);
      }

      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(onStart, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onStart]);

  // Glitch text effect
  useEffect(() => {
    const glitchChars = "!<>-_\\/[]{}—=+*^?#________";
    const targetText = message;
    let iteration = 0;

    const glitchInterval = setInterval(() => {
      setChars(
        targetText
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(glitchInterval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(glitchInterval);
  }, [message]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Rotating 3D Box with Glow */}
        <div className="relative w-48 h-48 mx-auto perspective-1000">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-lg blur-2xl bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50 animate-pulse" />
          
          {/* Rotating box container */}
          <div className="relative w-full h-full" style={{
            transformStyle: 'preserve-3d',
            animation: 'rotate3d 3s linear infinite'
          }}>
            {/* Main rotating box */}
            <div className="absolute inset-4 border-4 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.8)]" style={{
              transform: 'rotateX(25deg) rotateY(45deg)',
              transformStyle: 'preserve-3d',
              animation: 'boxRotate 4s linear infinite'
            }}>
              {/* Inner box */}
              <div className="absolute inset-2 border-2 border-purple-500" style={{
                animation: 'innerRotate 3s linear infinite reverse'
              }} />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-600 font-mono" style={{
                  textShadow: '0 0 20px rgba(6,182,212,0.8)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  GS
                </span>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-400" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-400" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-pink-400" />
          </div>
        </div>
        
        {/* Glitch text */}
        <div className="space-y-4">
          <Typography 
            variant="h2" 
            className="text-purple-400 font-mono text-2xl tracking-widest"
          >
            &gt; {chars}
          </Typography>
          
          {/* Progress bar with scan effect */}
          <div className="w-96 max-w-full mx-auto space-y-2">
            <div className="h-2 bg-gray-900 border border-cyan-500/50 relative overflow-hidden rounded-sm">
              <div
                className="h-full bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent" style={{
                  animation: 'shine 1s ease-in-out infinite'
                }} />
              </div>
              {/* Scan line */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)',
                animation: 'scan 2s linear infinite'
              }} />
            </div>
            <Typography variant="p" className="text-cyan-400 font-mono text-sm tracking-wider">
              [{progress}%] LOADING...
            </Typography>
          </div>
        </div>

        {/* Terminal lines */}
        <div className="space-y-1 text-left max-w-md mx-auto font-mono text-xs">
          <Typography variant="p" className="text-green-500 opacity-70">
            &gt; Establishing secure connection... <span className="text-cyan-400">[OK]</span>
          </Typography>
          <Typography variant="p" className="text-green-500 opacity-70">
            &gt; Bypassing firewall protocols... <span className="text-cyan-400">[OK]</span>
          </Typography>
          <Typography variant="p" className="text-green-500 opacity-70">
            &gt; Decrypting game data... <span className="text-yellow-400">[PROCESSING]</span>
          </Typography>
          <Typography variant="p" className="text-cyan-500 flex items-center gap-2">
            &gt; <span className="animate-pulse bg-cyan-400 w-2 h-4 inline-block" />
          </Typography>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes rotate3d {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(360deg); }
        }
        @keyframes boxRotate {
          0% { transform: rotateX(25deg) rotateY(0deg); }
          100% { transform: rotateX(25deg) rotateY(360deg); }
        }
        @keyframes innerRotate {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes slideInGlow {
          0% { 
            opacity: 0;
            transform: translateY(20px);
            box-shadow: none;
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
          }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3), 0 0 90px rgba(168, 85, 247, 0.1); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.5); }
          50% { text-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5); }
        }
        @keyframes pulsatingLight {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.9);
            box-shadow: 
              0 0 80px rgba(6, 182, 212, 0.4),
              0 0 160px rgba(6, 182, 212, 0.2),
              0 0 240px rgba(168, 85, 247, 0.15),
              inset 0 0 60px rgba(6, 182, 212, 0.1);
          }
          25% {
            opacity: 0.6;
            transform: scale(1.05);
            box-shadow: 
              0 0 120px rgba(168, 85, 247, 0.5),
              0 0 200px rgba(168, 85, 247, 0.3),
              0 0 300px rgba(6, 182, 212, 0.2),
              inset 0 0 80px rgba(168, 85, 247, 0.15);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.15);
            box-shadow: 
              0 0 150px rgba(236, 72, 153, 0.6),
              0 0 250px rgba(236, 72, 153, 0.4),
              0 0 350px rgba(168, 85, 247, 0.25),
              inset 0 0 100px rgba(236, 72, 153, 0.2);
          }
          75% {
            opacity: 0.6;
            transform: scale(1.05);
            box-shadow: 
              0 0 120px rgba(168, 85, 247, 0.5),
              0 0 200px rgba(168, 85, 247, 0.3),
              0 0 300px rgba(6, 182, 212, 0.2),
              inset 0 0 80px rgba(168, 85, 247, 0.15);
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

// Level Selection Screen
function LevelSelection({ onSelectLevel }: { onSelectLevel: (gameId: string) => void }) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/game?gameTypeSlug=group-sort");
        setGames(response.data.data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        toast.error("Failed to load games");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <Typography 
            variant="h1" 
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-mono text-4xl tracking-wider animate-pulse"
            style={{ textShadow: '0 0 30px rgba(6,182,212,0.5)' }}
          >
            &gt; PILIH LEVEL
          </Typography>
          <Typography variant="p" className="text-cyan-300 font-mono text-sm tracking-wide">
            &gt; Pilih tantangan yang sesuai dengan kemampuanmu. Setiap level menawarkan
            pengalaman unik dengan item dan kategori yang berbeda.
          </Typography>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 border-4 border-dashed border-cyan-500/30 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm animate-pulse">
              <Lock size={48} className="text-cyan-500/50" />
            </div>
            <Typography variant="h3" className="text-cyan-400 mb-2 font-mono">
              &gt; Belum Ada Game
            </Typography>
            <Typography variant="p" className="text-cyan-300/70 font-mono text-sm">
              &gt; Belum ada Group Sort game yang tersedia saat ini.
            </Typography>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="group relative rounded-lg overflow-hidden border-2 border-cyan-500/50 hover:border-purple-500 cursor-pointer hover:scale-105 transition-all duration-300 bg-black/30 backdrop-blur-sm"
                onClick={() => onSelectLevel(game.id)}
                style={{
                  boxShadow: '0 0 20px rgba(6,182,212,0.2), inset 0 0 20px rgba(6,182,212,0.1)'
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/10 group-hover:to-pink-500/20 transition-all duration-300 z-10" />
                
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      game.thumbnail_image
                        ? `${import.meta.env.VITE_API_URL}/${game.thumbnail_image}`
                        : thumbnailPlaceholder
                    }
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 opacity-70" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400 opacity-70" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-400 opacity-70" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-pink-400 opacity-70" />
                </div>

                <div className="p-6 space-y-3 relative z-20">
                  <Typography 
                    variant="h3" 
                    className="text-cyan-300 font-mono text-lg tracking-wide group-hover:text-cyan-200 transition-colors"
                    style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
                  >
                    &gt; {game.name}
                  </Typography>
                  <Typography variant="p" className="text-cyan-200/70 text-sm line-clamp-2 font-mono">
                    {game.description}
                  </Typography>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-purple-400 font-mono">
                      &gt; BY: {game.creator_name || "Unknown"}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500 group-hover:bg-cyan-500/30 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300">
                      PLAY &gt;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Audio Controls */}
      <AudioControls />
    </div>
  );
}

function GroupSort() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Add overscroll control to body
  useEffect(() => {
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const originalBodyOverflow = document.body.style.overflowY;
    const originalHtmlOverflow = document.documentElement.style.overflowY;
    
    // Prevent overscroll behavior
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehaviorY = 'none';
    document.documentElement.style.overscrollBehaviorY = 'none';
    
    // Set fixed height to prevent extra scrollable area
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overflowY = originalBodyOverflow;
      document.documentElement.style.overflowY = originalHtmlOverflow;
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.overflowX = '';
      document.body.style.overscrollBehaviorY = '';
      document.documentElement.style.overscrollBehaviorY = '';
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<GroupSortGame | null>(null);
  const [showIntro, setShowIntro] = useState(true); // Always show intro first
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(id || null);

  // Game state
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [placedItems, setPlacedItems] = useState<{ [categoryId: string]: Item[] }>({});
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Result state
  const [result, setResult] = useState<{
    correctItems: number;
    totalItems: number;
    accuracy: number;
    timeTaken: number;
    score: number;
  } | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const gameId = selectedGameId || id;
      if (!gameId) return;

      try {
        setLoading(true);
        let gameData;
        
        // Try public endpoint first
        try {
          const response = await api.get(
            `/api/game/game-type/group-sort/${gameId}/play/public`
          );
          gameData = response.data.data;
        } catch (publicError: any) {
          // If public fails (404 - unpublished), try private endpoint for testing
          if (publicError.response?.status === 404) {
            try {
              const privateResponse = await api.get(
                `/api/game/game-type/group-sort/${gameId}/play/private`
              );
              gameData = privateResponse.data.data;
              toast.success("Playing private game (testing mode)");
            } catch (privateError) {
              throw publicError; // Throw original error if both fail
            }
          } else {
            throw publicError;
          }
        }

        setGame(gameData);

        // Flatten all items from all categories
        const items: Item[] = [];
        gameData.game_data.categories.forEach((cat: Category) => {
          cat.items.forEach((item: any) => {
            items.push({
              ...item,
              correctCategoryId: cat.id,
            });
          });
        });

        // Shuffle items
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setAllItems(shuffled);
        setTimeLeft(gameData.game_data.timeLimit);

        // Initialize empty placement
        const emptyPlacement: { [key: string]: Item[] } = {};
        gameData.game_data.categories.forEach((cat: Category) => {
          emptyPlacement[cat.id] = [];
        });
        setPlacedItems(emptyPlacement);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [selectedGameId, id]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !isPaused && !gameFinished && !showTimeUpPopup && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowTimeUpPopup(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      // Clear timer when conditions are not met
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [gameStarted, isPaused, gameFinished, showTimeUpPopup, timeLeft]);

  const startGame = () => {
    setShowIntro(false);
    // If coming from URL with id, skip level selection and start game directly
    if (id) {
      setShowLevelSelection(false);
      setGameStarted(true);
    } else {
      setShowLevelSelection(true);
    }
  };

  const startLevel = (gameId: string) => {
    setSelectedGameId(gameId);
    setShowLevelSelection(false);
    setGameStarted(true);
  };

  const handleDragStart = (item: Item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (categoryId: string) => {
    if (!draggedItem) return;

    // Remove from allItems if it's from there
    setAllItems((prev) => prev.filter((item) => item.id !== draggedItem.id));

    // Remove from any other category
    const updatedPlacement = { ...placedItems };
    Object.keys(updatedPlacement).forEach((catId) => {
      updatedPlacement[catId] = updatedPlacement[catId].filter(
        (item) => item.id !== draggedItem.id
      );
    });

    // Add to new category
    updatedPlacement[categoryId] = [...updatedPlacement[categoryId], draggedItem];
    setPlacedItems(updatedPlacement);
    setDraggedItem(null);
  };

  const handleDropToPool = () => {
    if (!draggedItem) return;

    // Remove from all categories
    const updatedPlacement = { ...placedItems };
    Object.keys(updatedPlacement).forEach((catId) => {
      updatedPlacement[catId] = updatedPlacement[catId].filter(
        (item) => item.id !== draggedItem.id
      );
    });
    setPlacedItems(updatedPlacement);

    // Add back to pool
    setAllItems((prev) => [...prev, draggedItem]);
    setDraggedItem(null);
  };

  const handleSubmit = async (fromTimeUp = false) => {
    // Prevent multiple submissions
    if (gameFinished) return;
    
    // For manual submission, check if all items are placed
    if (!fromTimeUp && allItems.length > 0) {
      toast.error("⚠ TASK INCOMPLETE!\nPlace all items before submitting!", {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.95))',
          color: '#f87171',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)',
          backdropFilter: 'blur(10px)',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: 'rgba(15, 23, 42, 0.95)',
        }
      });
      return;
    }

    setGameFinished(true);
    
    // Set pause only for manual submission
    if (!fromTimeUp) {
      setIsPaused(true);
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const timeTaken = game!.game_data.timeLimit - timeLeft;

    // Calculate total items from all categories
    let totalItemsCount = 0;
    if (game?.game_data?.categories) {
      game.game_data.categories.forEach((cat) => {
        if (cat.items && Array.isArray(cat.items)) {
          totalItemsCount += cat.items.length;
        }
      });
    }

    console.log("Total items calculated:", totalItemsCount);
    console.log("Categories:", game?.game_data?.categories);

    try {
      // Build answers array for check-answer endpoint
      const answers: { item_id: string; category_id: string }[] = [];
      Object.keys(placedItems).forEach((categoryId) => {
        placedItems[categoryId].forEach((item) => {
          answers.push({
            item_id: item.id,
            category_id: categoryId,
          });
        });
      });

      console.log("Submitting answers:", answers);

      // Submit answers to backend for validation
      const response = await api.post(
        `/api/game/game-type/group-sort/${game!.id}/check-answer`,
        { answers }
      );

      console.log("Backend response:", response.data);

      const { correct_count, total_count, score, percentage } = response.data.data;

      setResult({
        correctItems: correct_count,
        totalItems: total_count,
        accuracy: percentage,
        timeTaken,
        score,
      });

      toast.success(`🎯 MISSION ACCOMPLISHED!\nScore: ${score} points (${percentage}% correct)`, {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.95))',
          color: '#34d399',
          border: '2px solid rgba(52, 211, 153, 0.5)',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(52, 211, 153, 0.8)',
          boxShadow: '0 0 30px rgba(52, 211, 153, 0.3), inset 0 0 20px rgba(52, 211, 153, 0.1)',
          backdropFilter: 'blur(10px)',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: 'rgba(15, 23, 42, 0.95)',
        }
      });
    } catch (err: any) {
      console.error("Failed to check answers:", err);
      toast.error(err.response?.data?.message || "Failed to submit answers");
      
      // Fallback to client-side calculation if backend fails
      let correct = 0;
      let placedCount = 0;
      Object.keys(placedItems).forEach((categoryId) => {
        placedItems[categoryId].forEach((item) => {
          placedCount++;
          if (item.correctCategoryId === categoryId) {
            correct++;
          }
        });
      });

      console.log("Fallback - Correct:", correct, "Total:", totalItemsCount, "Placed:", placedCount);

      const accuracy = totalItemsCount > 0 ? Math.round((correct / totalItemsCount) * 100) : 0;
      const fallbackScore = correct * (game?.game_data?.scorePerItem || 10);
      
      setResult({
        correctItems: correct,
        totalItems: totalItemsCount,
        accuracy,
        timeTaken,
        score: fallbackScore,
      });
    }

    // Update play count
    try {
      await api.post("/api/game/play-count", {
        game_id: id,
      });
    } catch (err) {
      console.error("Failed to update play count:", err);
    }
  };

  const handleViewScore = async () => {
    setShowTimeUpPopup(false);
    await handleSubmit(true);
  };

  const handleExit = async () => {
    // Make sure to send play count before exiting
    try {
      await api.post("/api/game/play-count", {
        game_id: id,
      });
    } catch (err) {
      console.error("Failed to update play count:", err);
    }
    navigate("/");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <Typography variant="p">Game not found</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Show intro screen
  if (showIntro) {
    return <IntroScreen onStart={startGame} />;
  }

  // Show level selection
  if (showLevelSelection) {
    return <LevelSelection onSelectLevel={startLevel} />;
  }

  // Show result screen
  if (gameFinished && result) {
    const { correctItems, totalItems, accuracy } = result;

    let message = "MISI SELESAI";
    let subMessage = "Task Analysis Complete";
    let rating = "LUAR BIASA!";

    if (accuracy === 100) {
      rating = "LUAR BIASA!";
    } else if (accuracy >= 80) {
      rating = "BAGUS!";
    } else if (accuracy >= 50) {
      rating = "CUKUP";
    } else {
      rating = "PERLU PERBAIKAN";
    }

    return (
      <div 
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4 pb-32 relative overflow-hidden" 
        style={{ 
          minHeight: '100vh',
          height: 'fit-content',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none'
        } as React.CSSProperties}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-500"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-center py-16">
          <div className="max-w-4xl w-full bg-black/50 backdrop-blur-lg border-2 border-cyan-500/70 rounded-lg p-8 space-y-6 relative overflow-hidden" style={{
          boxShadow: '0 0 50px rgba(6,182,212,0.3), inset 0 0 50px rgba(6,182,212,0.1)'
        }}>
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-purple-400 opacity-70" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-purple-400 opacity-70" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-pink-400 opacity-70" />
          
          <div className="text-center space-y-2 relative z-10">
            <Typography variant="h1" className="text-cyan-400 font-mono text-4xl tracking-wider animate-pulse" style={{
              textShadow: '0 0 30px rgba(6,182,212,0.8)'
            }}>
              {message}
            </Typography>
            <Typography variant="p" className="text-green-400 font-mono">
              {subMessage}
            </Typography>
          </div>

          {/* Statistik Performa */}
          <div className="bg-black/40 border border-cyan-500/50 rounded-lg p-6 relative overflow-hidden" style={{
            boxShadow: '0 0 20px rgba(6,182,212,0.2), inset 0 0 20px rgba(6,182,212,0.05)'
          }}>
            <Typography variant="h3" className="text-center text-cyan-300 mb-4 font-mono tracking-wider" style={{
              textShadow: '0 0 15px rgba(6,182,212,0.8)'
            }}>
              STATISTIK PERFORMA
            </Typography>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Benar */}
              <div className="bg-green-500/10 border border-green-500/70 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden" style={{
                boxShadow: '0 0 15px rgba(34,197,94,0.3), inset 0 0 10px rgba(34,197,94,0.1)'
              }}>
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center animate-pulse" style={{
                  boxShadow: '0 0 20px rgba(34,197,94,0.6)'
                }}>
                  <div className="text-white text-2xl font-bold">✓</div>
                </div>
                <div className="flex-1">
                  <Typography variant="h2" className="text-green-400 text-2xl font-bold font-mono" style={{
                    textShadow: '0 0 10px rgba(34,197,94,0.8)'
                  }}>
                    {correctItems}
                  </Typography>
                  <Typography variant="small" className="text-green-300 block font-mono">
                    BENAR
                  </Typography>
                </div>
              </div>

              {/* Salah */}
              <div className="bg-red-500/10 border border-red-500/70 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden" style={{
                boxShadow: '0 0 15px rgba(239,68,68,0.3), inset 0 0 10px rgba(239,68,68,0.1)'
              }}>
                <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center animate-pulse" style={{
                  boxShadow: '0 0 20px rgba(239,68,68,0.6)'
                }}>
                  <div className="text-white text-2xl font-bold">✗</div>
                </div>
                <div className="flex-1">
                  <Typography variant="h2" className="text-red-400 text-2xl font-bold font-mono" style={{
                    textShadow: '0 0 10px rgba(239,68,68,0.8)'
                  }}>
                    {totalItems > 0 ? totalItems - correctItems : 0}
                  </Typography>
                  <Typography variant="small" className="text-red-300 block font-mono">
                    SALAH
                  </Typography>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="small" className="text-cyan-400 font-mono">
                  NILAI
                </Typography>
                <Typography variant="small" className="text-white font-bold font-mono" style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.8)'
                }}>
                  {accuracy}%
                </Typography>
              </div>
              <div className="h-3 bg-gray-700/50 border border-cyan-500/30 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500 relative"
                  style={{ width: `${accuracy}%` }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Performa Score */}
            <div className="bg-black/50 border border-yellow-500/50 rounded-lg p-4 flex items-center justify-between" style={{
              boxShadow: '0 0 20px rgba(234,179,8,0.3), inset 0 0 10px rgba(234,179,8,0.1)'
            }}>
              <div className="flex items-center gap-3">
                <div className="text-yellow-400 text-3xl animate-pulse" style={{
                  filter: 'drop-shadow(0 0 10px rgba(234,179,8,0.8))'
                }}>★</div>
                <div>
                  <Typography variant="small" className="text-yellow-300 block font-mono">
                    PERFORMA
                  </Typography>
                  <Typography variant="h3" className="text-yellow-400 font-bold font-mono" style={{
                    textShadow: '0 0 15px rgba(234,179,8,0.8)'
                  }}>
                    {result.score}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-blue-500/50 rounded-lg p-4 text-center" style={{
              boxShadow: '0 0 15px rgba(59,130,246,0.3), inset 0 0 10px rgba(59,130,246,0.1)'
            }}>
              <Typography variant="small" className="text-blue-300 block mb-1 font-mono">
                TOTAL ITEM
              </Typography>
              <Typography variant="h3" className="text-blue-400 text-xl font-bold font-mono" style={{
                textShadow: '0 0 15px rgba(59,130,246,0.8)'
              }}>
                {totalItems || 0}
              </Typography>
            </div>
            <div className="bg-black/40 border border-purple-500/50 rounded-lg p-4 text-center" style={{
              boxShadow: '0 0 15px rgba(168,85,247,0.3), inset 0 0 10px rgba(168,85,247,0.1)'
            }}>
              <Typography variant="small" className="text-purple-300 block mb-1 font-mono">
                TOTAL SKOR
              </Typography>
              <Typography variant="h3" className="text-purple-400 text-xl font-bold font-mono" style={{
                textShadow: '0 0 15px rgba(168,85,247,0.8)'
              }}>
                {result.score || 0}
              </Typography>
            </div>
          </div>

          {/* Rating */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/70 rounded-lg relative overflow-hidden mb-8" style={{
            boxShadow: '0 0 30px rgba(168,85,247,0.4), inset 0 0 20px rgba(168,85,247,0.1)'
          }}>
            <Typography variant="h2" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono text-2xl tracking-wider animate-pulse" style={{
              textShadow: '0 0 20px rgba(168,85,247,0.8)'
            }}>
              {rating}
            </Typography>
          </div>

          <div className="flex gap-4 mt-8 mb-16">
            <Button
              variant="outline"
              className="flex-1 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-mono tracking-wider transition-all duration-300"
              onClick={() => window.location.reload()}
              style={{
                boxShadow: '0 0 15px rgba(6,182,212,0.3)'
              }}
            >
              <Play className="mr-2" />
              MAIN LAGI
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-2 border-purple-500/50 hover:border-purple-400 font-mono tracking-wider transition-all duration-300"
              onClick={handleExit}
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.8)',
                boxShadow: '0 0 20px rgba(168,85,247,0.5)'
              }}
            >
              <ArrowLeft className="mr-2" />
              KELUAR
            </Button>
          </div>
          </div>
        </div>
        
        {/* Audio Controls */}
        <AudioControls />
      </div>
    );
  }

  // Main game screen
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-16">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-cyan-500/40 z-50" style={{
        boxShadow: '0 2px 15px rgba(0,0,0,0.3), 0 0 20px rgba(6,182,212,0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleExit}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-mono transition-all duration-300 text-sm sm:text-base"
            style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
          >
            <ArrowLeft className="mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">EXIT</span>
            <span className="sm:hidden">‹</span>
          </Button>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-cyan-400 bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-cyan-500/30" style={{
              boxShadow: '0 0 15px rgba(6,182,212,0.3), inset 0 0 10px rgba(6,182,212,0.1)'
            }}>
              <Timer size={16} className="sm:size-5 animate-pulse" />
              <span className="font-mono text-sm sm:text-xl tracking-wider" style={{ textShadow: '0 0 10px rgba(6,182,212,0.8)' }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="border-purple-500/70 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 font-mono text-xs sm:text-sm px-2 sm:px-3"
              style={{
                boxShadow: '0 0 10px rgba(168,85,247,0.3)'
              }}
            >
              {isPaused ? <Play size={14} className="sm:size-4" /> : <Pause size={14} className="sm:size-4" />}
              <span className="ml-1 sm:ml-2 hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Typography variant="h2" className="text-cyan-400 font-mono text-3xl tracking-wider animate-pulse" style={{
            textShadow: '0 0 20px rgba(6,182,212,0.8)'
          }}>
            &gt; {game.name} &lt;
          </Typography>
          <Typography variant="p" className="text-cyan-300/80 font-mono tracking-wide">
            {game.description}
          </Typography>
        </div>

        {/* Items Pool */}
        <div
          className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/70 rounded-lg p-4 min-h-[120px] relative overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDropToPool}
          style={{
            boxShadow: '0 0 30px rgba(6,182,212,0.3), inset 0 0 30px rgba(6,182,212,0.1)'
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-70" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400 opacity-70" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-400 opacity-70" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-pink-400 opacity-70" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="group bg-yellow-500/20 border-2 border-yellow-500/70 rounded-lg p-3 cursor-move hover:scale-105 hover:border-yellow-400 transition-all duration-300 text-center relative overflow-hidden"
                style={{
                  boxShadow: '0 0 15px rgba(234,179,8,0.3), inset 0 0 10px rgba(234,179,8,0.1)'
                }}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/20 group-hover:to-orange-500/10 transition-all duration-300" />
                
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                    alt={item.text}
                    className="w-full h-20 object-cover rounded mb-2 group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <Typography variant="small" className="text-yellow-300 text-xs font-mono relative z-10">
                  {item.text}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-4">
          {game.game_data.categories.map((category) => (
            <div
              key={category.id}
              className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/70 rounded-lg p-4 min-h-[300px] relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(category.id)}
              style={{
                boxShadow: '0 0 30px rgba(168,85,247,0.3), inset 0 0 30px rgba(168,85,247,0.1)'
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-purple-400 opacity-70" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-pink-400 opacity-70" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-70" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400 opacity-70" />
              
              <Typography variant="h4" className="text-purple-400 mb-4 font-mono tracking-wider text-center" style={{
                textShadow: '0 0 15px rgba(168,85,247,0.8)'
              }}>
                {category.name}
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {placedItems[category.id]?.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="group bg-green-500/20 border-2 border-green-500/70 rounded-lg p-3 cursor-move hover:scale-105 hover:border-green-400 transition-all duration-300 text-center relative overflow-hidden"
                    style={{
                      boxShadow: '0 0 15px rgba(34,197,94,0.3), inset 0 0 10px rgba(34,197,94,0.1)'
                    }}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/10 transition-all duration-300" />
                    
                    {item.image && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                        alt={item.text}
                        className="w-full h-20 object-cover rounded mb-2 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <Typography variant="small" className="text-green-300 text-xs font-mono relative z-10">
                      {item.text}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={() => handleSubmit()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-mono tracking-wider border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 relative overflow-hidden group"
            style={{
              textShadow: '0 0 10px rgba(255,255,255,0.8)',
              boxShadow: '0 0 30px rgba(168,85,247,0.6), inset 0 0 20px rgba(168,85,247,0.1)'
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
            SUBMIT ANSWERS
          </Button>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && !gameFinished && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border-2 border-purple-500 rounded-lg px-12 py-10 text-center relative overflow-hidden min-w-[320px]" style={{
            boxShadow: '0 0 50px rgba(168,85,247,0.5), inset 0 0 30px rgba(168,85,247,0.1)'
          }}>
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-purple-400 opacity-70" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-70" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-70" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400 opacity-70" />
            
            {/* Content dengan spacing yang konsisten */}
            <div className="flex flex-col items-center justify-center space-y-5">
              <Pause size={48} className="text-purple-400 animate-pulse" style={{
                filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.8))'
              }} />
              <Typography variant="h2" className="text-purple-400 font-mono tracking-wider" style={{
                textShadow: '0 0 20px rgba(168,85,247,0.8)'
              }}>
                GAME PAUSED
              </Typography>
              <Button
                onClick={() => setIsPaused(false)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-mono tracking-wider border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 px-6 py-3"
                style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.8)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.5)'
                }}
              >
                <Play className="mr-2" size={18} />
                RESUME
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Time Up Popup */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-black/95 border-2 border-amber-500 rounded-lg px-12 py-10 text-center relative overflow-hidden min-w-[320px]" style={{
            boxShadow: '0 0 50px rgba(245, 158, 11, 0.5), inset 0 0 30px rgba(245, 158, 11, 0.1)'
          }}>
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 opacity-70" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-orange-400 opacity-70" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-orange-400 opacity-70" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 opacity-70" />
            
            {/* Content */}
            <div className="flex flex-col items-center justify-center space-y-5">
              <Timer size={48} className="text-amber-400 animate-pulse" style={{
                filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))'
              }} />
              <Typography variant="h2" className="text-amber-400 font-mono tracking-wider" style={{
                textShadow: '0 0 20px rgba(245, 158, 11, 0.8)'
              }}>
                TIME'S UP!
              </Typography>
              <div className="text-amber-300/80 font-mono text-center max-w-xs space-y-2" style={{
                textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
              }}>
                <Typography variant="p">Game finished with current placement. Ready to see your results?</Typography>
              </div>
              <Button
                onClick={handleViewScore}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-mono tracking-wider border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 px-6 py-3"
                style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.8)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
                }}
              >
                VIEW SCORE
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio Controls */}
      <AudioControls />
    </div>
  );
}

export default GroupSort;
