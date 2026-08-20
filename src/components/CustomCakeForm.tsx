import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addHours, isBefore, format } from 'date-fns';
import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Minimum 72 hours notice
const MIN_NOTICE_HOURS = 72;

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  eventDate: z.string().refine((dateStr) => {
    const selectedDate = new Date(dateStr);
    const minDate = addHours(new Date(), MIN_NOTICE_HOURS);
    return !isBefore(selectedDate, minDate);
  }, {
    message: `We require at least ${MIN_NOTICE_HOURS} hours notice for custom cakes.`,
  }),
  pickupPreference: z.enum(['Morning (9am-12pm)', 'Afternoon (12pm-3pm)', 'Late Afternoon (3pm-6pm)']),
  servings: z.string().min(1, 'Please estimate number of servings'),
  flavor: z.string().min(1, 'Please suggest a flavor profile'),
  budget: z.string().min(1, 'Please provide an estimated budget'),
  dietary: z.string().optional(),
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
        className="bg-cream p-12 rounded-3xl shadow-soft text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-serif text-espresso mb-4">Inquiry Received</h3>
        <p className="text-brown text-lg mb-8 leading-relaxed">
          Thank you for trusting us with your special event! We’ll confirm availability and send your quote within <span className="font-semibold">24-48 business hours</span>.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 border border-espresso text-espresso rounded-full hover:bg-espresso hover:text-cream transition-colors font-medium"
        >
          Submit Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-cream p-8 md:p-12 rounded-3xl shadow-soft">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-espresso mb-4">Custom Cake Inquiry</h2>
        <p className="text-brown font-light">
          Let's create something beautiful together. Please provide as much detail as possible.
        </p>
        <p className="text-gold text-sm font-medium mt-2">
          Note: We require a minimum of {MIN_NOTICE_HOURS} hours notice for all custom orders.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Full Name *</label>
            <input 
              {...register('name')}
              className={`w-full bg-off-white border ${errors.name ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
              placeholder="Jane Doe"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Email Address *</label>
            <input 
              {...register('email')}
              type="email"
              className={`w-full bg-off-white border ${errors.email ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
              placeholder="jane@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Phone Number *</label>
            <input 
              {...register('phone')}
              className={`w-full bg-off-white border ${errors.phone ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Event Date *</label>
            <input 
              {...register('eventDate')}
              type="date"
              min={minDate}
              className={`w-full bg-off-white border ${errors.eventDate ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
            />
            {errors.eventDate && <span className="text-red-500 text-xs mt-1 block">{errors.eventDate.message}</span>}
          </div>
        </div>

        {/* Cake Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-beige">
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Estimated Servings *</label>
            <select 
              {...register('servings')}
              className={`w-full bg-off-white border ${errors.servings ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
            >
              <option value="">Select servings</option>
              <option value="10-15">10 - 15 people</option>
              <option value="20-30">20 - 30 people</option>
              <option value="40-50">40 - 50 people</option>
              <option value="50+">50+ people</option>
            </select>
            {errors.servings && <span className="text-red-500 text-xs mt-1 block">{errors.servings.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Budget Range *</label>
            <select 
              {...register('budget')}
              className={`w-full bg-off-white border ${errors.budget ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
            >
              <option value="">Select budget range</option>
              <option value="$100-$150">$100 - $150</option>
              <option value="$150-$250">$150 - $250</option>
              <option value="$250-$400">$250 - $400</option>
              <option value="$400+">$400+</option>
            </select>
            {errors.budget && <span className="text-red-500 text-xs mt-1 block">{errors.budget.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Flavor Profile *</label>
            <input 
              {...register('flavor')}
              className={`w-full bg-off-white border ${errors.flavor ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
              placeholder="e.g. Vanilla with raspberry, Chocolate truffle"
            />
            {errors.flavor && <span className="text-red-500 text-xs mt-1 block">{errors.flavor.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Pickup Preference *</label>
            <select 
              {...register('pickupPreference')}
              className={`w-full bg-off-white border ${errors.pickupPreference ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
            >
              <option value="">Select time</option>
              <option value="Morning (9am-12pm)">Morning (9am-12pm)</option>
              <option value="Afternoon (12pm-3pm)">Afternoon (12pm-3pm)</option>
              <option value="Late Afternoon (3pm-6pm)">Late Afternoon (3pm-6pm)</option>
            </select>
            {errors.pickupPreference && <span className="text-red-500 text-xs mt-1 block">{errors.pickupPreference.message}</span>}
          </div>
        </div>

        {/* Dietary & Details */}
        <div className="pt-6 border-t border-beige">
          <label className="block text-sm font-medium text-espresso mb-2">Dietary Requirements (Optional)</label>
          <input 
            {...register('dietary')}
            className="w-full bg-off-white border border-beige rounded-xl px-4 py-3 focus:outline-none focus:border-gold mb-6"
            placeholder="e.g. Gluten-free, Nut allergy"
          />

          <label className="block text-sm font-medium text-espresso mb-2">Design Notes & Message *</label>
          <textarea 
            {...register('notes')}
            rows={4}
            className={`w-full bg-off-white border ${errors.notes ? 'border-red-500' : 'border-beige'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold`}
            placeholder="Describe the occasion, colors, theme, and any text you want written on the cake."
          />
          {errors.notes && <span className="text-red-500 text-xs mt-1 block">{errors.notes.message}</span>}
        </div>

        {/* Image Upload (R2 Simulation) */}
        <div className="pt-6 border-t border-beige">
          <label className="block text-sm font-medium text-espresso mb-2">Inspiration Image (Optional)</label>
          <p className="text-xs text-brown mb-4">Upload a photo to help us understand your vision (Max 5MB)</p>
          
          <div className="relative">
            {!preview ? (
              <div 
                className={`border-2 border-dashed ${uploadError ? 'border-red-300 bg-red-50' : 'border-beige hover:border-gold bg-off-white'} rounded-xl p-8 text-center cursor-pointer transition-colors`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gold mx-auto mb-3" />
                <p className="text-sm text-espresso font-medium">Click to upload an image</p>
                <p className="text-xs text-brown mt-1">JPEG, PNG</p>
                {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-beige bg-off-white inline-block">
                <img src={preview} alt="Preview" className="h-48 object-cover" />
                <button 
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-cream rounded-full text-espresso shadow-sm hover:text-red-500 transition-colors"
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
                      className="absolute inset-0 bg-espresso/50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                    >
                      <Loader2 className="w-8 h-8 text-cream animate-spin mb-3" />
                      <div className="w-full bg-cream/30 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gold h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-cream mt-2">{Math.round(uploadProgress)}% uploaded</span>
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
            className="w-full md:w-auto px-10 py-4 bg-espresso text-cream rounded-full font-medium hover:bg-espresso/90 transition-colors shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
      </form>
    </div>
  );
};
