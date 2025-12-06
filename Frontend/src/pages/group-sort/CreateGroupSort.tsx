import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Plus, SaveIcon, Trash2 } from "lucide-react";
import api from "@/api/axios";
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/create-projects")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Typography variant="h3">Create Group Sort Game</Typography>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <Typography variant="h4">Game Information</Typography>
            
            <FormField
              label="Name"
              required
              placeholder="Enter game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormField
              label="Description"
              required
              placeholder="Enter game description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Time Limit (seconds)"
                required
                type="number"
                min="30"
                max="600"
                placeholder="60"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
              />

              <FormField
                label="Score Per Item"
                required
                type="number"
                min="1"
                max="1000"
                placeholder="10"
                value={scorePerItem}
                onChange={(e) => setScorePerItem(parseInt(e.target.value) || 10)}
              />
            </div>

            {/* Randomization & Publish Options */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCategoryRandomized"
                  checked={isCategoryRandomized}
                  onChange={(e) => setIsCategoryRandomized(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isCategoryRandomized" className="cursor-pointer">
                  Randomize Categories Order
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isItemRandomized"
                  checked={isItemRandomized}
                  onChange={(e) => setIsItemRandomized(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isItemRandomized" className="cursor-pointer">
                  Randomize Items Order
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublishImmediately"
                  checked={isPublishImmediately}
                  onChange={(e) => setIsPublishImmediately(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isPublishImmediately" className="cursor-pointer">
                  Publish Immediately
                </Label>
              </div>
            </div>

            <div>
              <Label>Thumbnail Image (Optional)</Label>
              <Dropzone
                onChange={(file) => setThumbnail(file)}
              />
              {thumbnail && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {thumbnail.name}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
              <Typography variant="h4">Categories & Items</Typography>
              <Button onClick={addCategory} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Category
              </Button>
            </div>

            {categories.map((category, catIdx) => (
              <div key={catIdx} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Category {catIdx + 1}</Label>
                  {categories.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(catIdx)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Category name (e.g., Animals)"
                  value={category.name}
                  onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                />

                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                  <Label className="text-sm text-gray-600">Items</Label>
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Item text"
                          value={item.text}
                          onChange={(e) =>
                            updateItemText(catIdx, itemIdx, e.target.value)
                          }
                        />
                        <Dropzone
                          onChange={(file) =>
                            updateItemImage(catIdx, itemIdx, file)
                          }
                        />
                        {item.image && (
                          <div className="text-xs text-gray-600">
                            {item.image.name}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(catIdx, itemIdx)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(catIdx)}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={loading}>
                  <SaveIcon size={16} className="mr-2" />
                  {loading ? "Creating..." : "Create Game"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create Group Sort Game?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create a new Group Sort game with {categories.length} categories.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Create
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupSort;
