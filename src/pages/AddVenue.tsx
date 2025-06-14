import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addVenueEnhanced } from "@/services/enhancedVenueService";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, MapPin, Users, DollarSign, Calendar, Star, CheckCircle, AlertCircle, Camera, Plus, Trash2 } from "lucide-react";

const AddVenue = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    capacity: "",
    amenities: [] as string[],
    availability: [] as string[],
    contactEmail: "",
    contactPhone: "",
    website: "",
    specialFeatures: "",
    eventTypes: [] as string[],
    parkingSpaces: "",
    maxCapacity: "",
    minCapacity: "",
    setupTime: "",
    cleanupTime: "",
    cancellationPolicy: "",
    paymentTerms: "",
  });

  useEffect(() => {
    return () => {
      images.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

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
    "Photography Services",
    "Decoration Services",
    "Valet Parking",
    "Kitchen Facilities",
    "Dance Floor",
    "Sound System",
    "Lighting System",
    "Bridal Suite",
    "Garden Area",
    "Pool Access",
    "Elevator Access",
    "Wheelchair Accessible",
    "Generator Backup",
    "CCTV Surveillance",
    "Fire Safety Systems"
  ];

  const eventTypes = [
    "Wedding",
    "Corporate Event",
    "Birthday Party",
    "Anniversary",
    "Conference",
    "Workshop",
    "Product Launch",
    "Graduation",
    "Reunion",
    "Cultural Event",
    "Religious Ceremony",
    "Charity Event",
    "Fashion Show",
    "Art Exhibition",
    "Music Concert",
    "Dance Performance"
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
        } else if (formData.name.length < 3) {
          errors.name = "Venue name must be at least 3 characters";
        }
        
        if (!formData.location.trim()) {
          errors.location = "Location is required";
        } else if (formData.location.length < 5) {
          errors.location = "Please provide a more detailed location";
        }
        
        if (!formData.price) {
          errors.price = "Price is required";
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
          errors.price = "Please enter a valid price";
        } else if (Number(formData.price) < 1000) {
          errors.price = "Price should be at least ₹1,000";
        }

        if (!formData.minCapacity || !formData.maxCapacity) {
          errors.capacity = "Both minimum and maximum capacity are required";
        } else {
          const min = parseInt(formData.minCapacity);
          const max = parseInt(formData.maxCapacity);
          if (min >= max) {
            errors.capacity = "Maximum capacity must be greater than minimum";
          }
          if (min < 10) {
            errors.capacity = "Minimum capacity should be at least 10";
          }
        }
        break;

      case 2:
        if (!formData.description.trim()) {
          errors.description = "Description is required";
        } else if (formData.description.length < 50) {
          errors.description = "Description should be at least 50 characters";
        }

        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          errors.contactEmail = "Please enter a valid email address";
        }

        if (formData.contactPhone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.contactPhone)) {
          errors.contactPhone = "Please enter a valid phone number";
        }

        if (formData.eventTypes.length === 0) {
          errors.eventTypes = "Please select at least one event type";
        }
        break;

      case 3:
        if (images.length === 0) {
          errors.images = "Please add at least one venue image";
        } else if (images.length < 3) {
          errors.images = "Please add at least 3 images to showcase your venue properly";
        }
        break;

      case 4:
        if (formData.amenities.length === 0) {
          errors.amenities = "Please select at least one amenity";
        } else if (formData.amenities.length < 3) {
          errors.amenities = "Please select at least 3 amenities";
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (images.length + files.length > 10) {
      toast({
        title: "Too many images",
        description: "Maximum 10 images allowed.",
        variant: "destructive",
      });
      return;
    }

    const newFileObjects: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format. Please use JPEG, PNG, or WebP.`,
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        return;
      }
      
      newFileObjects.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });
    
    setImages(prev => [...prev, ...newPreviewUrls]);
    setImageFiles(prev => [...prev, ...newFileObjects]);
    
    if (newPreviewUrls.length > 0) {
      setFormErrors(prev => ({ ...prev, images: "" }));
      toast({
        title: "Images added successfully",
        description: `${newPreviewUrls.length} image(s) added to your venue listing.`,
      });
    }
  };

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    handleFiles(files);
  };

  const removeImage = (index: number) => {
    const urlToRemove = images[index];
    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedFile] = newImageFiles.splice(fromIndex, 1);
    
    newImages.splice(toIndex, 0, movedImage);
    newImageFiles.splice(toIndex, 0, movedFile);
    
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

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
        capacity: `${formData.minCapacity}-${formData.maxCapacity}`,
        description: formData.description,
        price: Number(formData.price),
        amenities: formData.amenities,
        availability: formData.availability,
        imageFiles: imageFiles,
        userId: user?.id,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        specialFeatures: formData.specialFeatures,
        eventTypes: formData.eventTypes,
        parkingSpaces: formData.parkingSpaces,
        setupTime: formData.setupTime,
        cleanupTime: formData.cleanupTime,
        cancellationPolicy: formData.cancellationPolicy,
        paymentTerms: formData.paymentTerms,
      };

      // Use enhanced venue service that handles JSON storage for super events user
      const venueId = await addVenueEnhanced(venueData, user?.email);

      // Show success animation
      setShowSuccessAnimation(true);

      // Show success toast with real-time notification
      toast({
        title: "Venue Added Successfully! 🎉",
        description: user?.email === 'superevents@gmail.com' 
          ? "Your venue has been saved locally and will appear immediately in the venues list."
          : "Your venue has been submitted for review and will appear in real-time once approved.",
        duration: 6000,
      });

      // Wait for animation then navigate
      setTimeout(() => {
        // Reset form
        setFormData({
          name: "",
          location: "",
          price: "",
          description: "",
          capacity: "",
          amenities: [],
          availability: [],
          contactEmail: "",
          contactPhone: "",
          website: "",
          specialFeatures: "",
          eventTypes: [],
          parkingSpaces: "",
          maxCapacity: "",
          minCapacity: "",
          setupTime: "",
          cleanupTime: "",
          cancellationPolicy: "",
          paymentTerms: "",
        });
        setImages([]);
        setImageFiles([]);
        setCurrentStep(1);
        setShowSuccessAnimation(false);

        // Navigate to venues page to see the new venue
        navigate("/venues");
      }, 3000);

    } catch (error) {
      toast({
        title: "Error Adding Venue",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setShowSuccessAnimation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setFormErrors(prev => ({ ...prev, amenities: "" }));
  };

  const toggleAvailability = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
    setFormErrors(prev => ({ ...prev, availability: "" }));
  };

  const toggleEventType = (eventType: string) => {
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(e => e !== eventType)
        : [...prev.eventTypes, eventType]
    }));
    setFormErrors(prev => ({ ...prev, eventTypes: "" }));
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <MapPin className="h-4 w-4" />;
      case 2: return <Users className="h-4 w-4" />;
      case 3: return <Upload className="h-4 w-4" />;
      case 4: return <Star className="h-4 w-4" />;
      default: return null;
    }
  };

  // Success Animation Overlay
  const SuccessAnimation = () => (
    <AnimatePresence>
      {showSuccessAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Venue Added Successfully!
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mb-4"
            >
              {user?.email === 'superevents@gmail.com' 
                ? "Your venue has been saved and will appear immediately in the venues list."
                : "Your venue is now being processed and will appear in real-time once approved."
              }
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="flex items-center justify-center gap-2 text-sm text-green-600"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>
                {user?.email === 'superevents@gmail.com' 
                  ? "Saved to local storage..."
                  : "Processing in real-time..."
                }
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
            <div className="text-center mb-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with the essential details about your venue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Royal Palace Banquet Hall"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street, New Delhi, India - 110001"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="50000"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Capacity *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="minCapacity"
                      type="number"
                      min="10"
                      value={formData.minCapacity}
                      onChange={handleInputChange}
                      placeholder="Min (e.g., 100)"
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                        formErrors.capacity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      name="maxCapacity"
                      type="number"
                      min="10"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      placeholder="Max (e.g., 500)"
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                        formErrors.capacity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
                {formErrors.capacity && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.capacity}</p>
                )}
              </div>

              <div>
                <label htmlFor="parkingSpaces" className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spaces (Optional)
                </label>
                <input
                  id="parkingSpaces"
                  name="parkingSpaces"
                  type="number"
                  min="0"
                  value={formData.parkingSpaces}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                />
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
            <div className="text-center mb-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Venue Details</h2>
              <p className="text-gray-600">Tell us more about your venue and how to contact you</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your venue in detail. Include information about the ambiance, architecture, unique features, and what makes it special for events..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors resize-none ${
                    formErrors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.description ? (
                    <p className="text-sm text-red-500">{formErrors.description}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 50 characters</p>
                  )}
                  <p className="text-xs text-gray-500">{formData.description.length} characters</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Types Suitable For *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {eventTypes.map((eventType) => (
                    <label 
                      key={eventType} 
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        formData.eventTypes.includes(eventType) 
                          ? 'border-brand-blue bg-brand-blue/5' 
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.eventTypes.includes(eventType)}
                        onChange={() => toggleEventType(eventType)}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="text-sm font-medium">{eventType}</span>
                    </label>
                  ))}
                </div>
                {formErrors.eventTypes && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.eventTypes}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="setupTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Setup Time Required (Hours)
                  </label>
                  <input
                    id="setupTime"
                    name="setupTime"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.setupTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="cleanupTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanup Time Required (Hours)
                  </label>
                  <input
                    id="cleanupTime"
                    name="cleanupTime"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.cleanupTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="specialFeatures" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Features (Optional)
                </label>
                <textarea
                  id="specialFeatures"
                  name="specialFeatures"
                  value={formData.specialFeatures}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any unique features, recent renovations, awards, or special services you offer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email (Optional)
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="venue@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                      formErrors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.contactEmail && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone (Optional)
                  </label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors ${
                      formErrors.contactPhone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.contactPhone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.contactPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL (Optional)
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.yourvenue.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <select
                    id="cancellationPolicy"
                    name="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                  >
                    <option value="">Select policy</option>
                    <option value="flexible">Flexible (24 hours notice)</option>
                    <option value="moderate">Moderate (7 days notice)</option>
                    <option value="strict">Strict (30 days notice)</option>
                    <option value="non-refundable">Non-refundable</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                  >
                    <option value="">Select terms</option>
                    <option value="full-advance">Full payment in advance</option>
                    <option value="50-50">50% advance, 50% on event day</option>
                    <option value="30-70">30% advance, 70% on event day</option>
                    <option value="installments">Multiple installments</option>
                  </select>
                </div>
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
            <div className="text-center mb-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Venue Images</h2>
              <p className="text-gray-600">Upload high-quality images to showcase your venue</p>
            </div>

            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-brand-blue bg-brand-blue/5" 
                    : "border-gray-300 hover:border-brand-blue/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageAdd}
                  multiple
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <ButtonCustom variant="outline" type="button">
                    Choose Images
                  </ButtonCustom>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: JPEG, PNG, WebP • Max size: 5MB per image • Max 10 images
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Uploaded Images ({images.length}/10)</h3>
                    <p className="text-sm text-gray-500">Drag to reorder • First image will be the main photo</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((previewUrl, index) => (
                      <div 
                        key={index} 
                        className="relative group aspect-square rounded-lg overflow-hidden border cursor-move"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                          reorderImages(fromIndex, index);
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt={`Venue preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-brand-gold text-brand-blue px-2 py-1 rounded text-xs font-medium">
                            Main Image
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formErrors.images && (
                <p className="text-sm text-red-500">{formErrors.images}</p>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📸 Image Tips for Better Bookings</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Include exterior and interior shots</li>
                  <li>• Show the venue set up for events</li>
                  <li>• Capture different angles and lighting</li>
                  <li>• Highlight unique features and amenities</li>
                  <li>• Use high-resolution, well-lit photos</li>
                  <li>• Show capacity with people if possible</li>
                  <li>• Include photos of parking and entrance</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Amenities & Availability</h2>
              <p className="text-gray-600">Select the amenities you offer and your availability</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Available Amenities *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label 
                    key={amenity} 
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      formData.amenities.includes(amenity) 
                        ? 'border-brand-blue bg-brand-blue/5' 
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="text-sm font-medium">{amenity}</span>
                  </label>
                ))}
              </div>
              {formErrors.amenities && (
                <p className="mt-2 text-sm text-red-500">{formErrors.amenities}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Selected: {formData.amenities.length} amenities
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Availability *</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {daysOfWeek.map((day) => (
                  <label 
                    key={day} 
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      formData.availability.includes(day) 
                        ? 'border-brand-blue bg-brand-blue/5' 
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={() => toggleAvailability(day)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-sm font-medium">{day.slice(0, 3)}</div>
                      <div className="text-xs text-gray-500">{day.slice(3)}</div>
                    </div>
                  </label>
                ))}
              </div>
              {formErrors.availability && (
                <p className="mt-2 text-sm text-red-500">{formErrors.availability}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Available: {formData.availability.length} days per week
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Ready to Submit!</h4>
                  <p className="text-sm text-green-800">
                    {user?.email === 'superevents@gmail.com' 
                      ? "Your venue listing is complete. After submission, it will be saved locally and appear immediately in the venues list."
                      : "Your venue listing is complete. After submission, our team will review your venue and approve it within 24-48 hours. You'll receive real-time notifications once it's live and start appearing in search results immediately."
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">List Your Venue</h1>
            <p className="text-gray-600 text-lg">
              Join thousands of venue owners on Super Events and reach more customers with real-time visibility
            </p>
            {user?.email === 'superevents@gmail.com' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  🔒 <strong>Super Events User:</strong> Your venues will be saved locally and appear immediately in the venues list.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          step === currentStep
                            ? "border-brand-blue bg-brand-blue text-white"
                            : step < currentStep
                            ? "border-brand-blue bg-brand-blue text-white"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {step < currentStep ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          getStepIcon(step)
                        )}
                      </div>
                      <div className="ml-3 hidden md:block">
                        <div className={`text-sm font-medium ${
                          step <= currentStep ? 'text-brand-blue' : 'text-gray-500'
                        }`}>
                          Step {step}
                        </div>
                        <div className="text-xs text-gray-500">
                          {step === 1 && "Basic Info"}
                          {step === 2 && "Details"}
                          {step === 3 && "Images"}
                          {step === 4 && "Amenities"}
                        </div>
                      </div>
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-all ${
                          step < currentStep ? "bg-brand-blue" : "bg-gray-300"
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

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                {currentStep > 1 ? (
                  <ButtonCustom
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    Previous
                  </ButtonCustom>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  {currentStep < 4 ? (
                    <ButtonCustom
                      type="button"
                      variant="gold"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      Next Step
                    </ButtonCustom>
                  ) : (
                    <ButtonCustom
                      type="submit"
                      variant="gold"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Venue"}
                    </ButtonCustom>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm mb-3">
              Our team is here to help you create the perfect venue listing with real-time visibility.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact Support
              </a>
              <a href="/help" className="text-blue-600 hover:underline">
                Listing Guidelines
              </a>
              <a href="/faq" className="text-blue-600 hover:underline">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Success Animation */}
      <SuccessAnimation />
    </div>
  );
};

export default AddVenue;
