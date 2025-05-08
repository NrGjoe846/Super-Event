import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addVenue } from "@/services/venueService";

const AddVenue = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageLink, setImageLink] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    capacity: "",
    amenities: [] as string[],
    availability: [] as string[],
  });

  const availableAmenities = [
    "WiFi",
    "Parking",
    "Catering",
    "AV Equipment",
    "Bar Service",
    "Stage",
    "Dressing Rooms",
    "Outdoor Space",
    "Air Conditioning",
    "Security",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Venue name is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Please enter a valid price";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.capacity.trim()) {
      errors.capacity = "Capacity is required";
    } else if (!/^\d+-\d+$/.test(formData.capacity)) {
      errors.capacity = "Please enter capacity in format: min-max (e.g., 100-500)";
    }

    if (images.length === 0) {
      errors.images = "Please add at least one venue image";
    } else if (images.length > 5) {
      errors.images = "Maximum 5 images allowed";
    }

    if (formData.amenities.length === 0) {
      errors.amenities = "Please select at least one amenity";
    }

    if (formData.availability.length === 0) {
      errors.availability = "Please select at least one day of availability";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (images.length + files.length > 5) {
        toast({
          title: "Too many images",
          description: "Maximum 5 images allowed",
          variant: "destructive",
        });
        return;
      }

      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image`,
            variant: "destructive",
          });
          return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      const newImages = validFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
      setFormErrors(prev => ({ ...prev, images: "" }));
    }
  };

  const validateImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const handleImageLinkAdd = () => {
    if (!imageLink.trim()) {
      toast({
        title: "Invalid image link",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateImageUrl(imageLink)) {
      toast({
        title: "Invalid image format",
        description: "Please enter a valid image URL (jpeg, jpg, gif, or png)",
        variant: "destructive",
      });
      return;
    }

    if (images.length >= 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, imageLink]);
    setImageLink("");
    setFormErrors(prev => ({ ...prev, images: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addVenue(
        {
          ...formData,
          images,
        },
        user!.id
      );

      toast({
        title: "Venue Added Successfully",
        description: "Your venue has been listed on Super Events",
      });

      // Clean up image URLs
      images.forEach(URL.revokeObjectURL);

      navigate("/venues");
    } catch (error) {
      toast({
        title: "Error Adding Venue",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to add a venue
            </p>
            <ButtonCustom 
              variant="primary" 
              onClick={() => navigate("/auth")}
              aria-label="Sign in"
            >
              Sign In
            </ButtonCustom>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add Your Venue</h1>
            <p className="text-gray-600">
              List your venue on Super Events and reach thousands of potential customers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                      formErrors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={!!formErrors.location}
                    aria-describedby={formErrors.location ? "location-error" : undefined}
                  />
                  {formErrors.location && (
                    <p id="location-error" className="mt-1 text-sm text-red-500">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Day (₹) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={!!formErrors.price}
                    aria-describedby={formErrors.price ? "price-error" : undefined}
                  />
                  {formErrors.price && (
                    <p id="price-error" className="mt-1 text-sm text-red-500">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                      formErrors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    rows={4}
                    aria-invalid={!!formErrors.description}
                    aria-describedby={formErrors.description ? "description-error" : undefined}
                  />
                  {formErrors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity Range *
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="text"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 100-500"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                      formErrors.capacity ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={!!formErrors.capacity}
                    aria-describedby={formErrors.capacity ? "capacity-error" : undefined}
                  />
                  {formErrors.capacity && (
                    <p id="capacity-error" className="mt-1 text-sm text-red-500">
                      {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Venue Images</h2>
              <div className="space-y-4">
                {/* Image Link Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                  <ButtonCustom
                    type="button"
                    variant="primary"
                    onClick={handleImageLinkAdd}
                    disabled={!imageLink.trim()}
                  >
                    Add Link
                  </ButtonCustom>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Venue preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(image);
                          setImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-blue/50 transition-colors cursor-pointer flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-600 mb-2">Add Image</div>
                        <div className="text-xs text-gray-500">Click to upload</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageAdd}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        multiple
                        aria-label="Upload venue images"
                      />
                    </label>
                  )}
                </div>
                {formErrors.images && (
                  <p className="text-sm text-red-500">{formErrors.images}</p>
                )}
                <p className="text-sm text-gray-500">
                  Upload high-quality images of your venue. Maximum 5 images, each under 5MB.
                  You can either upload files or add image URLs.
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            amenities: [...prev.amenities, amenity]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            amenities: prev.amenities.filter(a => a !== amenity)
                          }));
                        }
                        setFormErrors(prev => ({ ...prev, amenities: "" }));
                      }}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                      aria-label={`Select ${amenity} amenity`}
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
              {formErrors.amenities && (
                <p className="mt-2 text-sm text-red-500">{formErrors.amenities}</p>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              availability: [...prev.availability, day]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              availability: prev.availability.filter(d => d !== day)
                            }));
                          }
                          setFormErrors(prev => ({ ...prev, availability: "" }));
                        }}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        aria-label={`Select ${day} availability`}
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
                {formErrors.availability && (
                  <p className="text-sm text-red-500">{formErrors.availability}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <ButtonCustom
                type="button"
                variant="outline"
                onClick={() => {
                  // Clean up image URLs before navigating away
                  images.forEach(URL.revokeObjectURL);
                  navigate(-1);
                }}
                disabled={isSubmitting}
                aria-label="Cancel adding venue"
              >
                Cancel
              </ButtonCustom>
              <ButtonCustom
                type="submit"
                variant="gold"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                aria-label="Add venue"
              >
                {isSubmitting ? "Adding Venue..." : "Add Venue"}
              </ButtonCustom>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddVenue;
