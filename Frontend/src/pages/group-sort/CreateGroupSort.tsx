import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Plus, SaveIcon, Trash2 } from "lucide-react";
import api from "@/api/axios";
import AudioControls from "@/components/ui/audio-controls";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Item {
  text: string;
  image: File | null;
}

interface Category {
  name: string;
  items: Item[];
}

function CreateGroupSort() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    { name: "", items: [{ text: "", image: null }] },
    { name: "", items: [{ text: "", image: null }] },
  ]);
  const [timeLimit, setTimeLimit] = useState<number>(60); // Default 60 seconds
  const [scorePerItem, setScorePerItem] = useState<number>(10); // Default 10 points
  const [isCategoryRandomized, setIsCategoryRandomized] = useState<boolean>(false);
  const [isItemRandomized, setIsItemRandomized] = useState<boolean>(false);
  const [isPublishImmediately, setIsPublishImmediately] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const addCategory = () => {
    setCategories([...categories, { name: "", items: [{ text: "", image: null }] }]);
  };

  const removeCategory = (categoryIndex: number) => {
    if (categories.length <= 2) {
      toast.error("Minimum 2 categories required");
      return;
    }
    setCategories(categories.filter((_, idx) => idx !== categoryIndex));
  };

  const updateCategoryName = (categoryIndex: number, name: string) => {
    const updated = [...categories];
    updated[categoryIndex].name = name;
    setCategories(updated);
  };

  const addItem = (categoryIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].items.push({ text: "", image: null });
    setCategories(updated);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const updated = [...categories];
    if (updated[categoryIndex].items.length <= 1) {
      toast.error("Each category must have at least 1 item");
      return;
    }
    updated[categoryIndex].items = updated[categoryIndex].items.filter(
      (_, idx) => idx !== itemIndex
    );
    setCategories(updated);
  };

  const updateItemText = (categoryIndex: number, itemIndex: number, text: string) => {
    const updated = [...categories];
    updated[categoryIndex].items[itemIndex].text = text;
    setCategories(updated);
  };

  const updateItemImage = (categoryIndex: number, itemIndex: number, file: File | null) => {
    const updated = [...categories];
    updated[categoryIndex].items[itemIndex].image = file;
    setCategories(updated);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (categories.length < 2) {
      toast.error("At least 2 categories are required");
      return false;
    }
    if (categories.length > 10) {
      toast.error("Maximum 10 categories allowed");
      return false;
    }
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (!category.name.trim()) {
        toast.error(`Category ${i + 1} must have a name`);
        return false;
      }
      if (category.items.length === 0) {
        toast.error(`Category "${category.name}" must have at least one item`);
        return false;
      }
      if (category.items.length > 20) {
        toast.error(`Category "${category.name}" can have maximum 20 items`);
        return false;
      }
      for (let j = 0; j < category.items.length; j++) {
        const item = category.items[j];
        if (!item.text.trim()) {
          toast.error(`Item ${j + 1} in category "${category.name}" must have text`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append("name", name);
      formData.append("description", description);
      formData.append("time_limit", timeLimit.toString());
      formData.append("score_per_item", scorePerItem.toString());
      formData.append("is_category_randomized", isCategoryRandomized.toString());
      formData.append("is_item_randomized", isItemRandomized.toString());
      formData.append("is_publish_immediately", isPublishImmediately.toString());
      
      if (thumbnail) {
        formData.append("thumbnail_image", thumbnail);
      }

      // Build files_to_upload array and track indices
      const filesArray: File[] = [];
      const categoriesData = categories.map((cat) => ({
        category_name: cat.name,
        items: cat.items.map((item) => {
          if (item.image) {
            const imageIndex = filesArray.length;
            filesArray.push(item.image);
            return {
              item_text: item.text,
              item_image_array_index: imageIndex,
            };
          }
          return {
            item_text: item.text,
          };
        }),
      }));

      formData.append("categories", JSON.stringify(categoriesData));

      // Append all files
      filesArray.forEach((file) => {
        formData.append("files_to_upload", file);
      });

      await api.post("/api/game/game-type/group-sort", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(() => {
        toast.success("Group Sort game created successfully!");
        navigate("/my-projects");
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Fixed full-screen background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />
      
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          willChange: 'transform'
        }} />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-500"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 95}%`,
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                willChange: 'transform'
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-800/20 backdrop-blur-md border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/create-projects")}
              className="flex items-center gap-2 text-cyan-400 hover:text-purple-400 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-purple-500/50 transition-all duration-300"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline font-mono">Back</span>
            </Button>
            <Typography 
              variant="h3" 
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-mono text-xl tracking-wider"
              style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}
            >
              Create Group Sort Game
            </Typography>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-20">
        {/* Pulsating Light Background */}
        <div 
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/20 via-purple-500/25 to-pink-500/20 pointer-events-none"
          style={{
            animation: 'pulsatingLight 4s ease-in-out infinite',
            filter: 'blur(25px)',
            zIndex: -1
          }}
        ></div>
        
        {/* Secondary pulsating layer for more depth */}
        <div 
          className="absolute inset-4 rounded-lg bg-gradient-to-tl from-purple-600/15 via-cyan-400/20 to-pink-400/15 pointer-events-none"
          style={{
            animation: 'pulsatingLight 4s ease-in-out infinite 1s',
            filter: 'blur(15px)',
            zIndex: -1
          }}
        ></div>
        
        <div className="bg-gray-800/50 backdrop-blur-lg border-2 border-purple-500/50 rounded-lg p-6 space-y-6 shadow-2xl relative" style={{
          boxShadow: '0 0 50px rgba(168, 85, 247, 0.3), inset 0 0 50px rgba(6, 182, 212, 0.1)'
        }}>
          {/* Basic Info */}
          <div className="space-y-4">
            <Typography 
              variant="h4" 
              className="text-cyan-400 font-mono text-lg tracking-wide border-b border-cyan-500/30 pb-2"
              style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
            >
              System Configuration
            </Typography>
            
            <div className="space-y-4">
              <div>
                <Label className="text-purple-300 font-mono text-sm tracking-wide">Name *</Label>
                <Input
                  placeholder="Enter game name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-900/50 border-cyan-500/50 text-cyan-300 placeholder-gray-500 font-mono focus:border-purple-500 focus:ring-purple-500/50 mt-1"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div>
                <Label className="text-purple-300 font-mono text-sm tracking-wide">Description *</Label>
                <Input
                  placeholder="Enter game description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-900/50 border-cyan-500/50 text-cyan-300 placeholder-gray-500 font-mono focus:border-purple-500 focus:ring-purple-500/50 mt-1"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-300 font-mono text-sm tracking-wide">Time Limit (seconds) *</Label>
                <Input
                  type="number"
                  min="30"
                  max="600"
                  placeholder="60"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                  className="bg-gray-900/50 border-cyan-500/50 text-cyan-300 placeholder-gray-500 font-mono focus:border-purple-500 focus:ring-purple-500/50 mt-1"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div>
                <Label className="text-purple-300 font-mono text-sm tracking-wide">Score Per Item *</Label>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="10"
                  value={scorePerItem}
                  onChange={(e) => setScorePerItem(parseInt(e.target.value) || 10)}
                  className="bg-gray-900/50 border-cyan-500/50 text-cyan-300 placeholder-gray-500 font-mono focus:border-purple-500 focus:ring-purple-500/50 mt-1"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Randomization & Publish Options */}
            <div className="space-y-3 pt-4 border-t border-purple-500/30">
              <Typography 
                variant="p" 
                className="text-cyan-400 font-mono text-sm tracking-wide"
                style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
              >
                System Options
              </Typography>
              
              <div className="space-y-3 pl-4">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isCategoryRandomized"
                      checked={isCategoryRandomized}
                      onChange={(e) => setIsCategoryRandomized(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-300 ${
                        isCategoryRandomized
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-purple-500/50 bg-gray-900/50'
                      }`}
                      style={{
                        boxShadow: isCategoryRandomized 
                          ? '0 0 15px rgba(6, 182, 212, 0.5)' 
                          : '0 0 10px rgba(168, 85, 247, 0.3)'
                      }}
                      onClick={() => setIsCategoryRandomized(!isCategoryRandomized)}
                    >
                      {isCategoryRandomized && (
                        <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs">✓</div>
                      )}
                    </div>
                  </div>
                  <Label 
                    htmlFor="isCategoryRandomized" 
                    className="cursor-pointer text-purple-300 font-mono text-sm tracking-wide hover:text-cyan-300 transition-colors"
                  >
                    Randomize Categories Order
                  </Label>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isItemRandomized"
                      checked={isItemRandomized}
                      onChange={(e) => setIsItemRandomized(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-300 ${
                        isItemRandomized
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-purple-500/50 bg-gray-900/50'
                      }`}
                      style={{
                        boxShadow: isItemRandomized 
                          ? '0 0 15px rgba(6, 182, 212, 0.5)' 
                          : '0 0 10px rgba(168, 85, 247, 0.3)'
                      }}
                      onClick={() => setIsItemRandomized(!isItemRandomized)}
                    >
                      {isItemRandomized && (
                        <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs">✓</div>
                      )}
                    </div>
                  </div>
                  <Label 
                    htmlFor="isItemRandomized" 
                    className="cursor-pointer text-purple-300 font-mono text-sm tracking-wide hover:text-cyan-300 transition-colors"
                  >
                    Randomize Items Order
                  </Label>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isPublishImmediately"
                      checked={isPublishImmediately}
                      onChange={(e) => setIsPublishImmediately(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-300 ${
                        isPublishImmediately
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-purple-500/50 bg-gray-900/50'
                      }`}
                      style={{
                        boxShadow: isPublishImmediately 
                          ? '0 0 15px rgba(6, 182, 212, 0.5)' 
                          : '0 0 10px rgba(168, 85, 247, 0.3)'
                      }}
                      onClick={() => setIsPublishImmediately(!isPublishImmediately)}
                    >
                      {isPublishImmediately && (
                        <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs">✓</div>
                      )}
                    </div>
                  </div>
                  <Label 
                    htmlFor="isPublishImmediately" 
                    className="cursor-pointer text-purple-300 font-mono text-sm tracking-wide hover:text-cyan-300 transition-colors"
                  >
                    Publish Immediately
                  </Label>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-purple-300 font-mono text-sm tracking-wide">Thumbnail Image (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-cyan-500/30 rounded-lg p-4 bg-gray-900/30 hover:border-purple-500/50 hover:bg-gray-900/50 transition-all duration-300">
                <Dropzone
                  onChange={(file) => setThumbnail(file)}
                />
                {thumbnail && (
                  <div className="mt-2 text-sm text-cyan-400 font-mono flex items-center gap-2">
                    <span className="text-purple-400"></span> Selected: {thumbnail.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4 pt-6 border-t border-purple-500/30">
            <div className="flex items-center justify-between">
              <Typography 
                variant="h4" 
                className="text-cyan-400 font-mono text-lg tracking-wide"
                style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
              >
                Categories & Items
              </Typography>
              <Button 
                onClick={addCategory} 
                size="sm" 
                className="bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 hover:text-cyan-300 font-mono transition-all duration-300"
                style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}
              >
                <Plus size={16} className="mr-1" />
                Add Category
              </Button>
            </div>

            {categories.map((category, catIdx) => (
              <div 
                key={catIdx} 
                className="border-2 border-cyan-500/30 rounded-lg p-4 space-y-4 bg-gray-900/30 backdrop-blur-sm relative overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)' }}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-300 font-mono text-sm tracking-wide">
                      Category {catIdx + 1}
                    </Label>
                    {categories.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(catIdx)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-400/50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>

                  <Input
                    placeholder="Category name (e.g., Animals)..."
                    value={category.name}
                    onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/50 text-cyan-300 placeholder-gray-500 font-mono focus:border-purple-500 focus:ring-purple-500/50 mt-2"
                    style={{
                      boxShadow: '0 0 15px rgba(6, 182, 212, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  />

                  <div className="space-y-3 pl-4 border-l-2 border-purple-500/30 mt-4 relative">
                    {/* Animated border accent */}
                    <div className="absolute -left-[2px] top-0 w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 opacity-60 animate-pulse"></div>
                    
                    <Label className="text-sm text-cyan-400 font-mono tracking-wide">Items</Label>
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2 items-start group">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder={`Item ${itemIdx + 1} text...`}
                            value={item.text}
                            onChange={(e) =>
                              updateItemText(catIdx, itemIdx, e.target.value)
                            }
                            className="bg-gray-900/70 border-purple-500/40 text-purple-300 placeholder-gray-600 font-mono text-sm focus:border-cyan-500 focus:ring-cyan-500/50 group-hover:border-cyan-500/60"
                            style={{
                              boxShadow: '0 0 10px rgba(168, 85, 247, 0.1)',
                              transition: 'all 0.3s ease'
                            }}
                          />
                          <div className="border-2 border-dashed border-purple-500/20 rounded p-2 bg-gray-900/20 hover:border-cyan-500/30 transition-all duration-300">
                            <Dropzone
                              onChange={(file) =>
                                updateItemImage(catIdx, itemIdx, file)
                              }
                            />
                            {item.image && (
                              <div className="text-xs text-cyan-400 font-mono mt-1 flex items-center gap-2">
                                <span className="text-purple-400"></span> 
                                {item.image.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(catIdx, itemIdx)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/40 mt-1"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(catIdx)}
                      className="w-full bg-purple-600/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-cyan-300 font-mono transition-all duration-300"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-purple-500/30">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-0 text-white font-mono tracking-wide text-lg py-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading}
                  style={{
                    boxShadow: loading 
                      ? '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)' 
                      : '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
                    animation: loading ? 'glow 2s ease-in-out infinite' : 'none'
                  }}
                >
                  <SaveIcon size={20} className="mr-3" />
                  {loading ? (
                    <span className="flex items-center gap-2">
                      Creating Game
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                  ) : (
                    "Create Game"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900/95 backdrop-blur-lg border-2 border-purple-500/50 text-cyan-300">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-mono text-xl">
                    Confirm Creation Protocol
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-purple-300 font-mono text-sm">
                    Initializing Group Sort game creation with {categories.length} categories...
                    <br />
                    <span className="text-cyan-400"></span> This process cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel className="bg-gray-800 border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200 font-mono">
                    [ESC] Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-0 text-white font-mono"
                    style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}
                  >
                    [ENTER] Execute
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      
      {/* Audio Controls - Bottom position */}
      <AudioControls />
    </div>
  );
}

export default CreateGroupSort;
