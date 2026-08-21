const fs = require('fs');

let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

// Replace formSchema
const newSchema = `const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  pickupDate: z.string().min(1, 'Please select a pickup date'),
  pickupTime: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
  budget: z.string().min(1, 'Please provide an estimated budget'),
  flavor: z.string().min(1, 'Please suggest a flavor profile'),
  notes: z.string().min(10, 'Please provide some details about your vision'),
});`;

content = content.replace(/const formSchema = z\.object\(\{[\s\S]*?\}\);/, newSchema);

// Add Cake Type State
content = content.replace(
  "const fileInputRef = useRef<HTMLInputElement>(null);",
  "const fileInputRef = useRef<HTMLInputElement>(null);\n  const [cakeType, setCakeType] = useState<'custom' | 'image'>('custom');"
);

// Add Toggle Button
content = content.replace(
  /<div className="text-center mb-10">\s*<h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Custom Cake Inquiry<\/h2>\s*<p className="text-bento-grey font-light">\s*Please fill out the form below to request a custom cake\. We will get back to you within 24-48 hours\.\s*<\/p>\s*<\/div>/,
  `<div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Design Your Cake</h2>
        <div className="inline-flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 mt-2 mb-4">
          <button
            type="button"
            onClick={() => setCakeType('custom')}
            className={\`px-6 py-2 rounded-full text-sm font-medium transition-all \${cakeType === 'custom' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}\`}
          >
            Custom Cake
          </button>
          <button
            type="button"
            onClick={() => setCakeType('image')}
            className={\`px-6 py-2 rounded-full text-sm font-medium transition-all \${cakeType === 'image' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}\`}
          >
            Image Cake
          </button>
        </div>
      </div>`
);

// Replace form fields
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?{!\* Image Upload \(R2 Simulation\) \*}/,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name *</label>
            <input 
              {...register('name')}
              className={\`w-full bg-white/5 border \${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
              placeholder="John Doe"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
            <input 
              {...register('phone')}
              type="tel"
              className={\`w-full bg-white/5 border \${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Pickup Date *</label>
            <input 
              {...register('pickupDate')}
              type="date"
              className={\`w-full bg-white/5 border \${errors.pickupDate ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors [color-scheme:dark]\`}
            />
            {errors.pickupDate && <span className="text-red-500 text-xs mt-1 block">{errors.pickupDate.message as string}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Pickup Time *</label>
            <select 
              {...register('pickupTime')}
              className={\`w-full bg-black border \${errors.pickupTime ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
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
              className={\`w-full bg-black border \${errors.budget ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
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
              className={\`w-full bg-white/5 border \${errors.flavor ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
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
            className={\`w-full bg-white/5 border \${errors.notes ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors\`}
            placeholder={cakeType === 'image' ? "Any specific instructions for the printed image cake? Plus any custom text." : "Describe the occasion, colors, theme, and any text you want written on the cake."}
          />
          {errors.notes && <span className="text-red-500 text-xs mt-1 block">{errors.notes.message as string}</span>}
        </div>

        {/* Image Upload (R2 Simulation) */}`
);

// Fix the image upload area's background styles
content = content.replace(
  /bg-bento-black border border-bento-grey/g,
  "bg-white/5 border border-white/10"
);
content = content.replace(
  /bg-bento-black border-2/g,
  "bg-white/5 border-2"
);

// Fix imports to add ChevronLeft, ChevronRight for recommendations
content = content.replace(
  "import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';",
  "import { Upload, X, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';"
);

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
