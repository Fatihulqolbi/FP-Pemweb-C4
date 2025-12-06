import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Pause, Play, Timer, Lock } from "lucide-react";
import thumbnailPlaceholder from "../../assets/images/thumbnail-placeholder.png";

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
      "Loading Neural Grid...",
      "Accessing Host Databanks...",
      "Decrypting Protocol...",
      "Syncing Matrix...",
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
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Typography 
            variant="h1" 
            className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-600 font-mono text-4xl tracking-wider"
          >
            PILIH LEVEL
          </Typography>
          <Typography variant="p" className="text-blue-300">
            Pilih tantangan yang sesuai dengan kemampuanmu. Setiap level menawarkan
            pengalaman unik dengan item dan kategori yang berbeda.
          </Typography>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
              <Lock size={48} className="text-gray-600" />
            </div>
            <Typography variant="h3" className="text-gray-500 mb-2">
              Belum Ada Game
            </Typography>
            <Typography variant="p" className="text-gray-600">
              Belum ada Group Sort game yang tersedia saat ini.
            </Typography>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="relative rounded-lg overflow-hidden border-2 border-cyan-500 hover:border-purple-500 cursor-pointer hover:scale-105 transition-all bg-gray-900/50 backdrop-blur-sm"
                onClick={() => onSelectLevel(game.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      game.thumbnail_image
                        ? `${import.meta.env.VITE_API_URL}/${game.thumbnail_image}`
                        : thumbnailPlaceholder
                    }
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-6 space-y-3">
                  <Typography 
                    variant="h3" 
                    className="text-cyan-300 font-mono text-lg tracking-wide"
                  >
                    {game.name}
                  </Typography>
                  <Typography variant="p" className="text-gray-400 text-sm line-clamp-2">
                    {game.description}
                  </Typography>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-purple-400 font-mono">
                      BY: {game.creator_name || "Unknown"}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500">
                      PLAY
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GroupSort() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (gameStarted && !isPaused && !gameFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameStarted, isPaused, gameFinished]);

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

  const handleSubmit = async () => {
    if (gameFinished) return;

    setGameFinished(true);
    setIsPaused(true);

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

      toast.success(`Score: ${score} points (${percentage}% correct)`);
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
    let subMessage = "Analisis Neural Grid Selesai";
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
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-lg border-2 border-purple-500 rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <Typography variant="h1" className="text-purple-400 font-mono text-4xl">
              {message}
            </Typography>
            <Typography variant="p" className="text-green-400">
              &gt; {subMessage}
            </Typography>
          </div>

          {/* Statistik Performa */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <Typography variant="h3" className="text-center text-gray-300 mb-4">
              Statistik Performa
            </Typography>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Benar */}
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center">
                  <div className="text-white text-2xl">✓</div>
                </div>
                <div className="flex-1">
                  <Typography variant="h2" className="text-green-400 text-2xl font-bold">
                    {correctItems}
                  </Typography>
                  <Typography variant="small" className="text-green-300 block">
                    Benar
                  </Typography>
                </div>
              </div>

              {/* Salah */}
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center">
                  <div className="text-white text-2xl">✗</div>
                </div>
                <div className="flex-1">
                  <Typography variant="h2" className="text-red-400 text-2xl font-bold">
                    {totalItems > 0 ? totalItems - correctItems : 0}
                  </Typography>
                  <Typography variant="small" className="text-red-300 block">
                    Salah
                  </Typography>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="small" className="text-gray-400">
                  Nilai
                </Typography>
                <Typography variant="small" className="text-white font-bold">
                  {accuracy}%
                </Typography>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* Performa Score */}
            <div className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-yellow-400 text-3xl">★</div>
                <div>
                  <Typography variant="small" className="text-gray-400 block">
                    Performa
                  </Typography>
                  <Typography variant="h3" className="text-yellow-400 font-bold">
                    {result.score}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
              <Typography variant="small" className="text-gray-400 block mb-1">
                Total Item
              </Typography>
              <Typography variant="h3" className="text-blue-400 text-xl font-bold">
                {totalItems || 0}
              </Typography>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
              <Typography variant="small" className="text-gray-400 block mb-1">
                Total Skor
              </Typography>
              <Typography variant="h3" className="text-yellow-400 text-xl font-bold">
                {result.score || 0}
              </Typography>
            </div>
          </div>

          {/* Rating */}
          <div className="text-center p-6 bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500 rounded-lg">
            <Typography variant="h2" className="text-purple-400 font-mono text-2xl">
              {rating}
            </Typography>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-blue-500 text-blue-400"
              onClick={() => window.location.reload()}
            >
              <Play className="mr-2" />
              Main Lagi
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleExit}
            >
              <ArrowLeft className="mr-2" />
              Keluar
            </Button>
          </div>
        </div>
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleExit}
            className="text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="mr-2" />
            Exit
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <Timer size={20} />
              <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="border-purple-500 text-purple-400"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Typography variant="h2" className="text-purple-400 font-mono">
            {game.name}
          </Typography>
          <Typography variant="p" className="text-blue-300">
            {game.description}
          </Typography>
        </div>

        {/* Items Pool */}
        <div
          className="bg-black/30 backdrop-blur-sm border-2 border-blue-500 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={handleDropToPool}
        >
          <Typography variant="small" className="text-blue-400 mb-3 uppercase font-mono">
            Available Items ({allItems.length})
          </Typography>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-3 cursor-move hover:scale-105 transition-transform text-center"
              >
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                    alt={item.text}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <Typography variant="small" className="text-yellow-300 text-xs">
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
              className="bg-black/30 backdrop-blur-sm border-2 border-purple-500 rounded-lg p-4 min-h-[300px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(category.id)}
            >
              <Typography variant="h4" className="text-purple-400 mb-4 font-mono">
                {category.name}
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {placedItems[category.id]?.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="bg-green-500/20 border-2 border-green-500 rounded-lg p-3 cursor-move hover:scale-105 transition-transform text-center"
                  >
                    {item.image && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                        alt={item.text}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                    )}
                    <Typography variant="small" className="text-green-300 text-xs">
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
            onClick={handleSubmit}
            disabled={allItems.length > 0}
            className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
          >
            Submit Answers
          </Button>
          {allItems.length > 0 && (
            <Typography variant="small" className="text-yellow-400 mt-2">
              Place all items before submitting
            </Typography>
          )}
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && !gameFinished && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 border-2 border-purple-500 rounded-lg p-8 text-center space-y-4">
            <Pause size={64} className="mx-auto text-purple-400" />
            <Typography variant="h2" className="text-purple-400 font-mono">
              GAME PAUSED
            </Typography>
            <Button
              onClick={() => setIsPaused(false)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="mr-2" />
              Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupSort;
