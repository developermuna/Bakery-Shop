import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

// Minimum 72 hours notice
const MIN_NOTICE_HOURS = 72;

const formSchema = z.object({
  // Section 1: Cake Specifications
  cakeType: z.string().optional(),
  cakeShape: z.string().min(1, 'Please select a cake shape'),
  cakeSize: z.string().min(1, 'Please select a cake size'),
  flavor: z.string().min(1, 'Please select a flavor'),
  eggless: z.boolean(),
  layers: z.string().optional(),
  budget: z.string().min(1, 'Please provide an estimated budget'),

  // Section 2: Design & Details
  cakeTheme: z.string().optional(),
  borderStyle: z.string().optional(),
  colorPreference: z.string().min(1, 'Please provide a color preference'),
  textOnCake: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CustomCakeForm: React.FC = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cakeTypeState, setCakeTypeState] = useState<'custom' | 'image'>('custom');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eggless: false,
      layers: '1',
    }
  });

  const watchedData = watch();

  const getEstimatedPrice = (budgetStr?: string) => {
    if (!budgetStr) return '0';
    if (budgetStr.includes('500') && !budgetStr.includes('1500')) return '499';
    if (budgetStr.includes('1500') && !budgetStr.includes('2500')) return '1,499';
    if (budgetStr.includes('2500')) return '2,499';
    if (budgetStr.includes('4000')) return '3,999';
    if (budgetStr.includes('1000') && !budgetStr.includes('1500')) return '999';
    return '1,499';
  };

  const estimatedPrice = getEstimatedPrice(watchedData.budget);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setUploadError(null);

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG).');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB.');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateR2Upload = async (_uploadFile: File): Promise<string> => {
    // Simulate Cloudflare R2 presigned URL upload flow with progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(progress);
          clearInterval(interval);
          setTimeout(() => resolve('https://example.com/mock-r2-url.jpg'), 500);
        } else {
          setUploadProgress(progress);
        }
      }, 200);
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      let imageUrl = preview || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80';
      if (file) {
        // Mocking the R2 upload process
        await simulateR2Upload(file);
      }

      // Calculate unit price from budget option
      const unitPrice = parseInt(getEstimatedPrice(data.budget).replace(/,/g, ''), 10) || 1499;

      // Add the custom designed cake directly to user's order
      addItem({
        productId: `CUSTOM-${Date.now()}`,
        slug: 'bespoke-custom-cake',
        name: cakeTypeState === 'image' ? 'Custom Photo / Edible Print Cake' : `${data.cakeType} Cake`,
        image: imageUrl,
        selectedSize: {
          label: `Custom Specs (${data.cakeSize})`,
          price: unitPrice,
          servings: 'Custom Order',
        },
        selectedFlavor: `${data.flavor}${data.eggless ? ' (Eggless)' : ''}`,
        cakeMessage: cakeTypeState === 'image'
          ? `Shape: ${data.cakeShape} | Layers: ${data.layers || '1'} | Border: ${data.borderStyle || 'None'} | Color: ${data.colorPreference} | Text: ${data.textOnCake || 'None'} | Notes: ${data.notes || 'None'}`
          : `Shape: ${data.cakeShape} | Layers: ${data.layers || '1'} | Theme: ${data.cakeTheme} | Color: ${data.colorPreference} | Text: ${data.textOnCake || 'None'} | Notes: ${data.notes || 'None'}`,
        quantity: 1,
        inStock: true,
        preparationLeadTimeHours: MIN_NOTICE_HOURS,
      });

      addToast({
        type: 'success',
        title: 'Custom Cake Added to Order!',
        description: 'Proceeding to buy to confirm pickup and payment...',
      });

      reset();
      clearFile();

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Submission failed', error);
      addToast({
        type: 'error',
        title: 'Order Error',
        description: 'Could not process custom cake specifications. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImageUpload = (label: string) => (
    <div>
      <label className="block text-xs font-semibold text-bento-text mb-1">
        {label}
      </label>
      
      <div className="relative">
        {!preview ? (
          <div 
            className={`border border-dashed ${uploadError ? 'border-red-300 bg-red-50/50' : 'border-black/15 hover:border-strawberry bg-black/[0.02]'} rounded-lg p-2.5 sm:p-3 flex items-center justify-between cursor-pointer transition-colors`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-md bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-bento-text">Click or drag image to upload</p>
                <p className="text-[10px] text-bento-text">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-strawberry bg-pink-50 px-2.5 py-1 rounded-md shrink-0">
              Browse File
            </span>
            {uploadError && <p className="text-[10px] text-red-500 absolute -bottom-4 left-0">{uploadError}</p>}
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-black/10 bg-black/5 p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded-md shadow-xs" />
              <div className="text-xs">
                <p className="font-semibold text-bento-text truncate max-w-[200px]">{file?.name || 'Uploaded image'}</p>
                <p className="text-[10px] text-bento-text">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Ready'}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={clearFile}
              className="p-1.5 rounded-md text-bento-text hover:text-red-500 hover:bg-black/5 transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Upload Progress Overlay */}
            <AnimatePresence>
              {isSubmitting && uploadProgress < 100 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/90 flex items-center justify-center p-2 backdrop-blur-xs"
                >
                  <Loader2 className="w-4 h-4 text-strawberry animate-spin mr-2" />
                  <span className="text-xs font-medium text-bento-text">Uploading {Math.round(uploadProgress)}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full mx-auto bg-white/85 backdrop-blur-md p-5 sm:p-7 rounded-2xl shadow-2xl border border-white/60 flex flex-col justify-between">
      {/* Header & Mode Switcher */}
      <div className="pb-3.5 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-bento-text font-serif leading-tight">
              Design Your Bespoke Cake
            </h2>
          </div>
          <p className="text-xs text-bento-text font-light mt-0.5">
            {cakeTypeState === 'custom' 
              ? 'Tell us your vision and our pastry chefs will craft your dream cake.' 
              : 'Upload a photo for custom edible print decorating on your cake.'}
          </p>
        </div>

        {/* Cake Type Toggle */}
        <div className="inline-flex bg-black/5 rounded-lg p-0.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCakeTypeState('custom')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              cakeTypeState === 'custom'
                ? 'bg-strawberry text-white shadow-xs'
                : 'text-bento-text hover:text-bento-text'
            }`}
          >
            Custom Cake
          </button>
          <button
            type="button"
            onClick={() => setCakeTypeState('image')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              cakeTypeState === 'image'
                ? 'bg-strawberry text-white shadow-xs'
                : 'text-bento-text hover:text-bento-text'
            }`}
          >
            Photo / Image Cake
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {cakeTypeState === 'custom' ? (
          <>
            {/* Section 1: Cake Specifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                <div className="w-6 h-6 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center text-xs font-bold">1</div>
                <h3 className="text-sm font-bold text-bento-text">Cake Specifications</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Cake Type *</label>
                  <select {...register('cakeType')} className={`w-full bg-white border ${errors.cakeType ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Type</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.cakeType && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeType.message as string}</span>}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Cake Shape *</label>
                  <select {...register('cakeShape')} className={`w-full bg-white border ${errors.cakeShape ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Shape</option>
                    <option value="Round">Round</option>
                    <option value="Square">Square</option>
                    <option value="Heart">Heart</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {errors.cakeShape && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeShape.message as string}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-bento-text mb-1">Cake Size *</label>
                    <select {...register('cakeSize')} className={`w-full bg-white border ${errors.cakeSize ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                      <option value="">Select Size</option>
                      <option value="0.5 kg">0.5 kg</option>
                      <option value="1 kg">1 kg</option>
                      <option value="1.5 kg">1.5 kg</option>
                      <option value="2 kg">2 kg</option>
                    </select>
                    {errors.cakeSize && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeSize.message as string}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bento-text mb-1">Budget Range (₹) *</label>
                    <select {...register('budget')} className={`w-full bg-white border ${errors.budget ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                      <option value="">Select Budget</option>
                      <option value="200-500">200 - 500</option>
                      <option value="500-1500">500 - 1500</option>
                      <option value="1500-2500">1500 - 2500</option>
                      <option value="2500-4000">2500 - 4000</option>
                      <option value="4000+">4000+</option>
                    </select>
                    {errors.budget && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.budget.message as string}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Flavor *</label>
                  <select {...register('flavor')} className={`w-full bg-white border ${errors.flavor ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Flavor</option>
                    <option value="Chocolate">Chocolate</option>
                    <option value="Vanilla">Vanilla</option>
                    <option value="Red Velvet">Red Velvet</option>
                    <option value="Butterscotch">Butterscotch</option>
                  </select>
                  {errors.flavor && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.flavor.message as string}</span>}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register('eggless')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-xs sm:text-sm font-semibold text-bento-text">Make it Eggless</span>
                  </label>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs sm:text-sm font-semibold text-bento-text">Layers:</span>
                    <div className="flex items-center gap-3">
                      {['1', '2', '3'].map((layer) => (
                        <label key={layer} className="flex items-center cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              value={layer}
                              {...register('layers')}
                              className="peer sr-only"
                            />
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm border border-black/20 peer-checked:border-strawberry peer-checked:bg-strawberry flex items-center justify-center transition-colors">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                          <span className="ml-2 text-xs sm:text-sm text-bento-text group-hover:text-strawberry transition-colors">
                            {layer}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Design & Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                <div className="w-6 h-6 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="text-sm font-bold text-bento-text">Design & Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Cake Theme *</label>
                  <select {...register('cakeTheme')} className={`w-full bg-white border ${errors.cakeTheme ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Theme</option>
                    <option value="Floral">Floral</option>
                    <option value="Cartoon">Cartoon</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Photo">Photo</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.cakeTheme && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeTheme.message as string}</span>}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Color Preference *</label>
                  <select {...register('colorPreference')} className={`w-full bg-white border ${errors.colorPreference ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Color</option>
                    <option value="Red">Red</option>
                    <option value="Pink">Pink</option>
                    <option value="Blue">Blue</option>
                    <option value="White/Gold">White & Gold</option>
                    <option value="Multi">Multi-color</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.colorPreference && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.colorPreference.message as string}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Text on Cake</label>
                <input 
                  {...register('textOnCake')}
                  className="w-full bg-white border border-black/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs"
                  placeholder="e.g. Happy Birthday Muna!"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Additional Instructions</label>
                <textarea 
                  {...register('notes')}
                  rows={2}
                  className="w-full bg-white border border-black/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs resize-none"
                  placeholder="e.g. Make it less sweet, specific design elements..."
                />
              </div>

              {renderImageUpload("Reference / Inspiration Image (Optional)")}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-2">
              <div className="w-6 h-6 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="text-sm font-bold text-bento-text">Image Cake Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:col-span-2">
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Cake Size *</label>
                  <select {...register('cakeSize')} className={`w-full bg-white border ${errors.cakeSize ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Size</option>
                    <option value="0.5 kg">0.5 kg</option>
                    <option value="1 kg">1 kg</option>
                    <option value="1.5 kg">1.5 kg</option>
                    <option value="2 kg">2 kg</option>
                  </select>
                  {errors.cakeSize && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeSize.message as string}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Price Range (₹) *</label>
                  <select {...register('budget')} className={`w-full bg-white border ${errors.budget ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                    <option value="">Select Budget</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000-1500">1000 - 1500</option>
                    <option value="1500-2500">1500 - 2500</option>
                    <option value="2500+">2500+</option>
                  </select>
                  {errors.budget && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.budget.message as string}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Flavor *</label>
                <select {...register('flavor')} className={`w-full bg-white border ${errors.flavor ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                  <option value="">Select Flavor</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Red Velvet">Red Velvet</option>
                  <option value="Butterscotch">Butterscotch</option>
                </select>
                {errors.flavor && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.flavor.message as string}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Cake Shape *</label>
                <select {...register('cakeShape')} className={`w-full bg-white border ${errors.cakeShape ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                  <option value="">Select Shape</option>
                  <option value="Round">Round</option>
                  <option value="Square">Square</option>
                </select>
                {errors.cakeShape && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.cakeShape.message as string}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Border / Decorative Style</label>
                <select {...register('borderStyle')} className={`w-full bg-white border ${errors.borderStyle ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                  <option value="">Select Style</option>
                  <option value="Rose Frame">Rose Frame</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Star Pipe">Star Pipe</option>
                  <option value="None">None</option>
                </select>
                {errors.borderStyle && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.borderStyle.message as string}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Color / Theme *</label>
                <select {...register('colorPreference')} className={`w-full bg-white border ${errors.colorPreference ? 'border-red-500' : 'border-black/10'} rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs`}>
                  <option value="">Select Color</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Red">Red</option>
                  <option value="Pink">Pink</option>
                  <option value="Blue">Blue</option>
                  <option value="White">White</option>
                </select>
                {errors.colorPreference && <span className="text-red-500 text-[10px] mt-0.5 block">{errors.colorPreference.message as string}</span>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('eggless')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-3 text-xs sm:text-sm font-semibold text-bento-text">Make it Eggless</span>
                </label>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs sm:text-sm font-semibold text-bento-text">Layers:</span>
                  <div className="flex items-center gap-3">
                    {['1', '2', '3'].map((layer) => (
                      <label key={layer} className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            value={layer}
                            {...register('layers')}
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm border border-black/20 peer-checked:border-strawberry peer-checked:bg-strawberry flex items-center justify-center transition-colors">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        <span className="ml-2 text-xs sm:text-sm text-bento-text group-hover:text-strawberry transition-colors">
                          {layer}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bento-text mb-1">Cake Message</label>
              <input 
                {...register('textOnCake')}
                className="w-full bg-white border border-black/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs"
                placeholder="e.g. Happy Birthday!"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-bento-text mb-1">Special Instructions</label>
              <textarea 
                {...register('notes')}
                rows={2}
                className="w-full bg-white border border-black/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-strawberry transition-colors shadow-xs resize-none"
                placeholder="Optional"
              />
            </div>

            {renderImageUpload("Cake Image (Photo / Edible Print) *")}
          </div>
        )}

        {/* Live Order Preview */}
        <div className="mt-8 p-4 border border-black/10 rounded-xl bg-black/[0.02]">
          <h3 className="text-sm font-bold text-bento-text mb-3">Live Order Preview</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white overflow-hidden shadow-sm border border-black/5 shrink-0 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Cake Preview" className="w-full h-full object-cover" />
              ) : (
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80" alt="Placeholder" className="w-full h-full object-cover opacity-70" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-bento-text text-sm sm:text-base">
                {cakeTypeState === 'image' ? 'Photo / Edible Print Cake' : `${watchedData.cakeType || 'Custom'} Cake`}
              </span>
              <span className="text-xs text-bento-text/70 mt-0.5 line-clamp-1">
                {watchedData.cakeSize ? `${watchedData.cakeSize} • ` : ''} {watchedData.flavor || 'Flavor'} {watchedData.layers && watchedData.layers !== '1' ? `• ${watchedData.layers} Layers ` : ''}{watchedData.eggless ? '(Eggless)' : ''}
              </span>
              <div className="mt-2 text-strawberry font-bold text-sm sm:text-base">
                {watchedData.budget ? `₹${estimatedPrice} (Est.)` : 'Select budget for estimate'}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex justify-center items-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] px-8 py-3.5 bg-strawberry text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bento-yellow hover:text-bento-text transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              'Proceed to Buy'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
