const fs = require('fs');

let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

content = content.replace("import { addHours, isBefore, format } from 'date-fns';", "import { addHours, format } from 'date-fns';");

content = content.replace(
  "<input \n              {...register('pickupDate')}\n              type=\"date\"\n              className={`w-full bg-white/5 border ${errors.pickupDate ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors [color-scheme:dark]`}\n            />",
  "<input \n              {...register('pickupDate')}\n              type=\"date\"\n              min={minDate}\n              className={`w-full bg-white/5 border ${errors.pickupDate ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-bento-yellow transition-colors [color-scheme:dark]`}\n            />"
);

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
