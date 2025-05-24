import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addDetailedVenue } from "@/services/venueService"; // Changed import
import { motion, AnimatePresence } from "framer-motion";

const AddVenue = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]); // For preview URLs
  const [imageFilesToUpload, setImageFilesToUpload] = useState<File[]>([]); // For actual File objects
  // const [imageLink, setImageLink] = useState(""); // Removed imageLink state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    capacity: "",
    amenities: [] as string[],
    availability: [] as string[],
  });

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      images.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]); // Rerun if images array changes, though unmount is key for final cleanup

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

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
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
        break;

      case 2:
        if (!formData.description.trim()) {
          errors.description = "Description is required";
        }
        if (!formData.capacity.trim()) {
          errors.capacity = "Capacity is required";
        } else if (!/^\d+-\d+$/.test(formData.capacity)) {
          errors.capacity = "Please enter capacity in format: min-max (e.g., 100-500)";
        }
        break;

      case 3:
        if (images.length === 0) {
          errors.images = "Please add at least one venue image";
        }
        break;

      case 4:
        if (formData.amenities.length === 0) {
          errors.amenities = "Please select at least one amenity";
        }
        if (formData.availability.length === 0) {
          errors.availability = "Please select at least one day of availability";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const currentTotalImages = images.length + imageFilesToUpload.length;

    if (currentTotalImages + files.length > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed in total.",
        variant: "destructive",
      });
      return;
    }

    const newFileObjects: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image.`,
          variant: "destructive",
        });
        return; // Skip this file
      }
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        return; // Skip this file
      }
      newFileObjects.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });
    
    if (images.length + newPreviewUrls.length <= 5) {
        setImages(prev => [...prev, ...newPreviewUrls]);
        setImageFilesToUpload(prev => [...prev, ...newFileObjects]);
        if (newPreviewUrls.length > 0) {
            setFormErrors(prev => ({ ...prev, images: "" }));
        }
    } else {
        // This case should ideally not be hit if initial check is correct, but as a safeguard:
        newPreviewUrls.forEach(url => URL.revokeObjectURL(url)); // Clean up URLs for files not added
        toast({
            title: "Could not add all images",
            description: "Maximum of 5 images allowed.",
            variant: "destructive",
        });
    }
  };

  // handleImageLinkAdd function removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const venueData = {
        venueName: formData.name,
        location: formData.location,
        capacity: formData.capacity,
        description: formData.description,
        price: Number(formData.price),
        amenities: formData.amenities,
        availability: formData.availability,
        imageFiles: imageFilesToUpload, // Pass File objects
        userId: user?.id, // Pass user ID if available
      };
      // @ts-ignore 
      const venueId = await addDetailedVenue(venueData);

      toast({
        title: "Venue Added Successfully",
        description: "Your venue has been listed on Super Events",
      });

      navigate("/venues"); // Navigate to general venues page
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

  // Removed the !user check to allow guest submissions
  // if (!user) { ... }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
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
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
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
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
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
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold mb-4">Venue Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    formErrors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
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
                />
                {formErrors.capacity && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.capacity}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold mb-4">Venue Images</h2>
            <div className="space-y-4">
              {/* Removed Image Link Input and Button */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((previewUrl, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={previewUrl} // This is a blob URL
                      alt={`Venue preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const urlToRemove = images[index];
                        if (urlToRemove.startsWith('blob:')) {
                          URL.revokeObjectURL(urlToRemove);
                        }
                        setImages(prev => prev.filter((_, i) => i !== index));
                        setImageFilesToUpload(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-blue/50 transition-colors cursor-pointer flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-600 mb-2">Add Image(s)</div> {/* Changed text slightly */}
                      <div className="text-xs text-gray-500">Click to upload (max 5)</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageAdd}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      multiple
                    />
                  </label>
                )}
              </div>
              {formErrors.images && (
                <p className="text-sm text-red-500">{formErrors.images}</p>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-8">
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
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
              {formErrors.amenities && (
                <p className="mt-2 text-sm text-red-500">{formErrors.amenities}</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
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
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
              {formErrors.availability && (
                <p className="mt-2 text-sm text-red-500">{formErrors.availability}</p>
              )}
            </div>
          </motion.div>
        );
    }
  };

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

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step < 4 ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === currentStep
                          ? "border-brand-blue bg-brand-blue text-white"
                          : step < currentStep
                          ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          step < currentStep
                            ? "bg-brand-blue"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <ButtonCustom
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                  >
                    Previous
                  </ButtonCustom>
                )}
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <ButtonCustom
                      type="button"
                      variant="primary"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                      Next
                    </ButtonCustom>
                  ) : (
                    <ButtonCustom
                      type="submit"
                      variant="gold"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding Venue..." : "Add Venue"}
                    </ButtonCustom>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddVenue;
