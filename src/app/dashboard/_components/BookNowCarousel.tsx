'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BookNowCarouselProps {
  className?: string;
}

export function BookNowCarousel({ className }: BookNowCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    duration: 20,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
    setCanScrollPrev(currentIndex > 0);
    setCanScrollNext(currentIndex < slides.length - 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Metro system themed slides
  const slides = [
    {
      id: 1,
      title: 'Modern Metro Network',
      description: 'Experience seamless travel with our state-of-the-art metro system, connecting you to every corner of the city',
      image: '/images/carousel/metro_system.jpg',
    },
    {
      id: 2,
      title: 'Smart Ticketing',
      description: 'Quick and easy travel with our contactless smart cards and mobile ticketing solutions',
      image: '/images/carousel/metro_payment.jpg',
    },
    {
      id: 3,
      title: '24/7 Metro Service',
      description: 'Round-the-clock service ensuring you reach your destination safely and on time, any time of day',
      image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <div className={cn('relative w-screen overflow-hidden', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0"
            >
              <div className="relative h-[60vh] w-screen">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    imageRendering: 'crisp-edges',
                    backgroundSize: 'center',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                />
                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>
                    <Button
                      size="lg"
                      className="mt-6 px-8 py-6 text-lg bg-white text-black hover:bg-white/90 transition-all duration-300"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 md:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
} 