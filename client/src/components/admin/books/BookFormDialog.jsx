import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";

const initialFormData = {
  title: "",
  image: "",
  originalPrice: "",
  discountPrice: "",
  description: "",
  category: "General",
  rating: 4.5,
  isFeatured: false,
  isNewBook: true,
};

export function BookFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingBook,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        image: editingBook.image,
        originalPrice: editingBook.originalPrice.toString(),
        discountPrice: editingBook.discountPrice.toString(),
        description: editingBook.description,
        category: editingBook.category,
        rating: editingBook.rating,
        isFeatured: editingBook.isFeatured,
        isNewBook: editingBook.isNewBook,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingBook, open]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] w-full sm:w-[95vw] max-h-dvh sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-2xl p-0 border-none shadow-2xl bg-background">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b sticky top-0 z-20 backdrop-blur-lg bg-background/90">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {editingBook ? "Edit Book" : "Create New Book"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6"
        >
          <div className="space-y-5 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-2">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g. The Great Gatsby"
                  className="rounded-xl border-border/60 h-10 text-sm shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label
                  htmlFor="category"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                >
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="rounded-xl border-border/60 h-10 text-sm shadow-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60">
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-[1fr_auto] items-end">
              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                >
                  Cover Image URL
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="Enter image URL or upload"
                    className="rounded-xl border-border/60 h-10 text-sm shadow-sm flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-20 w-14 object-cover rounded-xl border-2 border-background shadow-md bg-muted shrink-0"
                />
              )}
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6 pt-2">
            <div className="grid gap-4 sm:gap-6 grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="originalPrice"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center sm:text-left block"
                >
                  Price ($)
                </Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      originalPrice: e.target.value,
                    }))
                  }
                  className="rounded-xl border-border/60 h-10 text-sm text-center sm:text-left font-semibold shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="discountPrice"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center sm:text-left block"
                >
                  Sale ($)
                </Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountPrice: e.target.value,
                    }))
                  }
                  className="rounded-xl border-border/60 h-10 text-sm font-bold text-primary text-center sm:text-left shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="rating"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center sm:text-left block"
                >
                  Rating
                </Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                  className="rounded-xl border-border/60 h-10 text-sm text-center sm:text-left shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief summary and key highlights..."
                className="rounded-xl border-border/60 min-h-[80px] sm:min-h-[100px] resize-none text-sm p-3 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-1">
              <div className="flex items-center space-x-3">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label
                  htmlFor="isFeatured"
                  className="text-sm font-semibold text-foreground"
                >
                  Featured Title
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  id="isNewBook"
                  checked={formData.isNewBook}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isNewBook: checked }))
                  }
                />
                <Label
                  htmlFor="isNewBook"
                  className="text-sm font-semibold text-foreground"
                >
                  New Arrival
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="py-5 sm:py-6 gap-3 flex-row border-t -mx-5 sm:-mx-8 px-5 sm:px-8 sticky bottom-0 bg-background/95 backdrop-blur-lg z-20">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl h-11 font-bold text-sm bg-muted/20 hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl h-11 font-bold text-sm bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
            >
              {isSubmitting
                ? "Saving..."
                : editingBook
                  ? "Save Changes"
                  : "Create Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
