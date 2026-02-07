import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, ArrowLeft } from "lucide-react";
import { booksApi, uploadApi } from "@/lib/api";
import { toast } from "sonner";
import { handleApiError } from "@/lib/errorHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminPageHeader } from "../shared/AdminPageHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SEO } from "../../SEO";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  image: z.string().min(1, "Image is required"),
  originalPrice: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().default(false),
  isNewBook: z.boolean().default(true),
});

export function BookFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(isEditing);

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      image: "",
      originalPrice: 0,
      discountPrice: 0,
      description: "",
      category: "General",
      rating: 4.5,
      stock: 10,
      isFeatured: false,
      isNewBook: true,
    },
  });

  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (isEditing) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const book = await booksApi.getById(id);
      reset({
        title: book.title,
        author: book.author || "",
        image: book.image,
        originalPrice: Number(book.originalPrice),
        discountPrice: Number(book.discountPrice),
        description: book.description,
        category: book.category,
        rating: Number(book.rating),
        stock: Number(book.stock),
        isFeatured: book.isFeatured,
        isNewBook: book.isNewBook,
      });
    } catch (error) {
      handleApiError(error, "Loading Book");
      navigate("/admin/books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadApi.uploadImage(file);
      setValue("image", url, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await booksApi.update(id, values);
        toast.success("Book updated successfully");
      } else {
        await booksApi.create(values);
        toast.success("Book created successfully");
      }
      navigate("/admin/books");
    } catch (error) {
      handleApiError(error, "Saving Book");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <SEO
        title={isEditing ? "Edit Book" : "Create New Book"}
        description="Add or update book information in the catalog."
        noindex={true}
      />
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/books")}
          className="h-10 w-10 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <AdminPageHeader
          title={isEditing ? "Edit Book" : "Create New Book"}
          description={
            isEditing
              ? "Update the details of your existing book."
              : "Add a new book to your catalog."
          }
          className="flex-1"
        />
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        <Card className="border shadow-sm">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">Book Information</CardTitle>
                <CardDescription className="text-xs">
                  Essential details about the book.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. The Great Gatsby"
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Author
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. F. Scott Fitzgerald"
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Fiction">Fiction</SelectItem>
                            <SelectItem value="Non-Fiction">
                              Non-Fiction
                            </SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Self-Help">Self-Help</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Cover Image</Label>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <FormField
                          control={control}
                          name="image"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Paste image URL..."
                                  className="h-9 font-mono text-xs"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="relative shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 border"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {form.watch("image") && (
                      <div className="shrink-0 rounded-md border bg-muted p-0.5 shadow-sm">
                        <img
                          src={form.watch("image")}
                          alt="Preview"
                          className="h-20 w-14 object-cover rounded-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className="px-6 py-2">
                <div className="h-px bg-border/50" />
              </div>

              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Original Price ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-9"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Sale Price ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-9 font-bold"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="text-xs font-medium">
                            Stock Level
                          </FormLabel>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${field.value > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
                          >
                            {field.value > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            className="h-9"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <div className="px-6 py-2">
                <div className="h-px bg-border/50" />
              </div>

              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6">
                <FormField
                  control={control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Rating (0-5)
                      </FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            className="h-9 max-w-[100px]"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the book..."
                          className="min-h-[100px] rounded-md resize-y text-sm p-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <FormField
                    control={control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors space-y-0">
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          Featured Title
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="scale-90"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="isNewBook"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors space-y-0">
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          New Arrival
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="scale-90"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4 border-t bg-muted/10 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/admin/books")}
                  className="h-9 px-4 text-sm"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-6 min-w-[100px] text-sm"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Book"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default BookFormPage;
