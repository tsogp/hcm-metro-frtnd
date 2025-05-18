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
    loop: false,
    align: 'center',
    slidesToScroll: 1,
    duration: 20,
    dragFree: true,
    containScroll: 'trimSnaps',
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

  // Placeholder images - replace these with your actual images
  const slides = [
    {
      id: 1,
      title: 'Premium Service',
      description: 'Experience luxury travel with our premium service',
      image: '/images/carousel/slide1.jpg',
    },
    {
      id: 2,
      title: 'Comfort & Safety',
      description: 'Travel in comfort with our modern fleet',
      image: '/images/carousel/slide2.jpg',
    },
    {
      id: 3,
      title: '24/7 Support',
      description: 'Round the clock customer support',
      image: '/images/carousel/slide3.jpg',
    },
  ];

  return (
    <div className={cn('relative w-full overflow-hidden py-4', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;
            const isNext = index === (selectedIndex + 1) % slides.length;
            const isPrev = index === (selectedIndex - 1 + slides.length) % slides.length;
            

            return (
              <div
                key={slide.id}
                className="relative flex-[0_0_100%] min-w-0 px-32"
                style={{
                  perspective: '1500px',
                }}
              >
                <div
                  className={cn(
                    'relative h-[300px] md:h-[400px] rounded-xl overflow-hidden transition-all duration-700 ease-out',
                    'transform-gpu',
                    isActive && 'scale-100 z-20',
                    isNext && 'scale-75 -translate-x-[250px] -rotate-y-40 z-10',
                    isPrev && 'scale-75 translate-x-[250px] rotate-y-40 z-10',
                    !isActive && !isNext && !isPrev && 'scale-50 opacity-50'
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: isNext ? '0% 50%' : isPrev ? '100% 50%' : '50% 50%',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10" />
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                        {slide.description}
                      </p>
                      <Button
                        size="lg"
                        className="mt-6 px-6 py-4 text-base bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 md:px-8">
        <div className="w-12">
          {canScrollPrev && (
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
        </div>

        <div className="w-12">
          {canScrollNext && (
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
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