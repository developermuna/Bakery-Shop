import React from 'react';
import { CustomCakeForm } from './CustomCakeForm';

export const CustomCakes: React.FC = () => {
  return (
    <div className="pt-20 sm:pt-22 pb-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden bg-[#181112]">
      {/* Background Image with Atmospheric Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
          alt="Bespoke custom cake"
          className="w-full h-full object-cover opacity-35 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#140e0c]/90 via-black/85 to-[#181112]/90 backdrop-blur-[1px]"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 relative z-10 my-auto">
        <div className="max-w-3xl mx-auto">
          {/* Main Custom Cake Form */}
          <CustomCakeForm />
        </div>
      </div>
    </div>
  );
};



