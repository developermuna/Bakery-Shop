import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addHours, format } from 'date-fns';
import { Upload, X, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Minimum 72 hours notice
const MIN_NOTICE_HOURS = 72;

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  pickupDate: z.string().min(1, 'Please select a pickup date'),
  pickupTime: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
  budget: z.string().min(1, 'Please provide an estimated budget'),
  flavor: z.string().min(1, 'Please suggest a flavor profile'),
  notes: z.string().min(10, 'Please provide some details about your vision'),
});

type FormData = z.infer<typeof formSchema>;

export const CustomCakeForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cakeType, setCakeType] = useState<'custom' | 'image'>('custom');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

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
      let imageUrl = null;
      if (file) {
        // Mocking the R2 upload process
        imageUrl = await simulateR2Upload(file);
      }

      // Mock submitting the form data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', { ...data, imageUrl });
      
      setIsSuccess(true);
      reset();
      clearFile();
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate min date for the HTML date picker (72 hours from now)
  const minDate = format(addHours(new Date(), MIN_NOTICE_HOURS), 'yyyy-MM-dd');

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bento-black/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/5 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-bento-yellow/10 text-bento-yellow rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-4">Inquiry Received</h3>
        <p className="text-bento-grey text-lg mb-8 leading-relaxed">
          Thank you for trusting us with your special event! We’ll confirm availability and send your quote within <span className="font-semibold">24-48 business hours</span>.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 border border-bento-black text-white rounded-full hover:bg-bento-black hover:text-white transition-colors font-medium"
        >
          Submit Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    <div className="max-w-4xl mx-auto bg-bento-black/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/5">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Design Your Cake</h2>
        <div className="inline-flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 mt-2 mb-4">
          <button
            type="button"
            onClick={() => setCakeType('custom')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${cakeType === 'custom' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}`}
          >
            Custom Cake
          </button>
          <button
            type="button"
            onClick={() => setCakeType('image')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${cakeType === 'image' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}`}
          >
            Image Cake
          </button>
        </div>
        <p className="text-white/60 font-light text-sm max-w-md mx-auto">
          {cakeType === 'custom' 
            ? 'Fill out the form below to request a fully custom-designed cake.' 
            : 'Want a photo printed on your cake? Upload it below and tell us the details.'}
        </p>
      </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
            <input 
              {...register('name')}
              className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
              placeholder="John Doe"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
            <input 
              {...register('phone')}
              type="tel"
              className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Pickup Date *</label>
            <input 
              {...register('pickupDate')}
              type="date"
              min={minDate}
              className={`w-full bg-white/5 border ${errors.pickupDate ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors [color-scheme:dark]`}
            />
            {errors.pickupDate && <span className="text-red-500 text-xs mt-1 block">{errors.pickupDate.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Pickup Time *</label>
            <select 
              {...register('pickupTime')}
              className={`w-full bg-black border ${errors.pickupTime ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
            >
              <option value="">Select time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            {errors.pickupTime && <span className="text-red-500 text-xs mt-1 block">{errors.pickupTime.message as string}</span>}
          </div>
        </div>

        {/* Cake Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Budget Range *</label>
            <select 
              {...register('budget')}
              className={`w-full bg-black border ${errors.budget ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
            >
              <option value="">Select budget range</option>
              <option value="$100-₹1500">$100 - ₹1500</option>
              <option value="₹1500-₹2500">₹1500 - ₹2500</option>
              <option value="₹2500-₹4000">₹2500 - ₹4000</option>
              <option value="₹4000+">₹4000+</option>
            </select>
            {errors.budget && <span className="text-red-500 text-xs mt-1 block">{errors.budget.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Flavor Profile *</label>
            <input 
              {...register('flavor')}
              className={`w-full bg-white/5 border ${errors.flavor ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
              placeholder="e.g. Vanilla with raspberry, Chocolate truffle"
            />
            {errors.flavor && <span className="text-red-500 text-xs mt-1 block">{errors.flavor.message as string}</span>}
          </div>
        </div>

        {/* Details */}
        <div className="pt-6 border-t border-white/10">
          <label className="block text-sm font-medium text-white mb-2">Design Notes & Message *</label>
          <textarea 
            {...register('notes')}
            rows={4}
            className={`w-full bg-white/5 border ${errors.notes ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors`}
            placeholder={cakeType === 'image' ? "Any specific instructions for the printed image cake? Plus any custom text." : "Describe the occasion, colors, theme, and any text you want written on the cake."}
          />
          {errors.notes && <span className="text-red-500 text-xs mt-1 block">{errors.notes.message as string}</span>}
        </div>

        {/* Image Upload (R2 Simulation) */}
        <div className="pt-6 border-t border-bento-grey">
          <label className="block text-sm font-medium text-white mb-2">Inspiration Image (Optional)</label>
          <p className="text-xs text-bento-grey mb-4">Upload a photo to help us understand your vision (Max 5MB)</p>
          
          <div className="relative">
            {!preview ? (
              <div 
                className={`border-2 border-dashed ${uploadError ? 'border-red-300 bg-red-50' : 'border-bento-grey hover:border-bento-yellow bg-bento-black'} rounded-xl p-8 text-center cursor-pointer transition-colors`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-bento-yellow mx-auto mb-3" />
                <p className="text-sm text-white font-medium">Click to upload an image</p>
                <p className="text-xs text-bento-grey mt-1">JPEG, PNG</p>
                {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-bento-grey bg-bento-black inline-block">
                <img src={preview} alt="Preview" className="h-48 object-cover" />
                <button 
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-bento-black rounded-full text-white shadow-sm hover:text-red-500 transition-colors"
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
                      className="absolute inset-0 bg-bento-black/50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                    >
                      <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                      <div className="w-full bg-bento-black/30 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-bento-yellow h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-white mt-2">{Math.round(uploadProgress)}% uploaded</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-10 py-4 bg-bento-yellow text-black rounded-full font-medium hover:bg-yellow-400 transition-colors shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Submit Inquiry'
            )}
          </button>
        </div>
      
        {/* Recommendations Scroll Row */}
        <div className="pt-10 mt-10 border-t border-white/10 relative">
          <h3 className="text-xl font-serif text-white mb-6">Complete Your Celebration</h3>
          
          <button 
            type="button"
            onClick={() => document.getElementById('rec-scroll')?.scrollBy({ left: -200, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 hover:text-bento-yellow backdrop-blur-md hidden md:block opacity-0 group-hover/recs:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="group/recs relative">
            <div 
              id="rec-scroll"
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { name: 'Metallic Balloons', price: '₹200', img: 'https://images.unsplash.com/photo-1530103862676-de8892bc9522?auto=format&fit=crop&q=80&w=300' },
                { name: 'Sparkler Candles', price: '₹150', img: 'https://images.unsplash.com/photo-1550977274-a7407dfb44a2?auto=format&fit=crop&q=80&w=300' },
                { name: 'Party Poppers', price: '₹350', img: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=300' },
                { name: 'Cake Topper', price: '₹250', img: 'https://images.unsplash.com/photo-1559868725-7b5853b9f4e2?auto=format&fit=crop&q=80&w=300' },
                { name: 'Box of Chocolates', price: '₹500', img: 'https://images.unsplash.com/photo-1548842103-ce20c32728df?auto=format&fit=crop&q=80&w=300' },
                { name: 'Floral Bouquet', price: '₹800', img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=300' },
              ].map((item, i) => (
                <div key={i} className="min-w-[160px] md:min-w-[180px] snap-start bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-bento-yellow/50 transition-colors shrink-0 group/card cursor-pointer">
                  <div className="h-32 w-full overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-bento-yellow text-xs font-bold mt-1">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => document.getElementById('rec-scroll')?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 hover:text-bento-yellow backdrop-blur-md hidden md:block opacity-0 group-hover/recs:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

    </div>
    </>
  );
};
