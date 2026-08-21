const fs = require('fs');

let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

const newForm = `      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
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

        {/* Image Upload (R2 Simulation) */}`;

const startIndex = content.indexOf('<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">');
const endIndex = content.indexOf('{/* Image Upload (R2 Simulation) */}');
content = content.slice(0, startIndex) + newForm + content.slice(endIndex + '{/* Image Upload (R2 Simulation) */}'.length);

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
