import React from "react";

function StatSection() {
  return (
    <section className="w-full py-16 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-5xl font-bold">19.5km</h3>
            <p className="text-sm md:text-base opacity-90">Line 1 Length</p>
          </div>
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-5xl font-bold">14</h3>
            <p className="text-sm md:text-base opacity-90">Stations</p>
          </div>
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-5xl font-bold">2000+</h3>
            <p className="text-sm md:text-base opacity-90">Daily Passengers</p>
          </div>
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-5xl font-bold">600+</h3>
            <p className="text-sm md:text-base opacity-90">Ratings</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatSection;
