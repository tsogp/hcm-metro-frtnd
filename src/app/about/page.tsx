'use client';

import { motion } from 'framer-motion';
import { MapPin, Users, Clock, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    {
      id: 1,
      title: 'Daily Passengers',
      value: '500,000+',
      icon: Users,
      description: 'Serving commuters every day',
    },
    {
      id: 2,
      title: 'Metro Stations',
      value: '100+',
      icon: MapPin,
      description: 'Covering the entire city',
    },
    {
      id: 3,
      title: 'Service Hours',
      value: '24/7',
      icon: Clock,
      description: 'Always available for you',
    },
    {
      id: 4,
      title: 'Years of Service',
      value: '15+',
      icon: Award,
      description: 'Trusted by the community',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 opacity-90" />
        <div className="absolute inset-0 bg-[url('/images/about/hero_image.jpg')] bg-cover bg-center mix-blend-overlay" />
        <motion.div 
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About Our Metro System
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Connecting communities, powering progress, and serving our city with pride
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {stat.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We are committed to providing safe, reliable, and efficient public transportation that connects our community and supports sustainable urban development.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our metro system is more than just transportation – it's a vital part of our city's infrastructure, bringing people together and driving economic growth.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="/images/about/mission.jpg"
                alt="Metro System"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Guiding principles that drive our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Safety First',
                description: 'We prioritize the safety and security of our passengers and staff above all else.',
              },
              {
                title: 'Customer Focus',
                description: 'We are dedicated to providing exceptional service and a positive experience for every passenger.',
              },
              {
                title: 'Innovation',
                description: 'We continuously seek new ways to improve our services and embrace technological advancements.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Meet the talented team behind HCMC Metro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Nguyen Son Tung",
                role: "Team Leader, Frontend Developer, Backend Developer",
                image: "/images/default-avatar.jpg"
              },
              {
                name: "Nguyen Tuan Dung",
                role: "Frontend Developer",
                image: "/images/default-avatar.jpg"
              },
              {
                name: "Pavel Potemkin",
                role: "Backend Developer",
                image: "/images/default-avatar.jpg"
              },
              {
                name: "Phan Trong Nguyen",
                role: "Backend Developer",
                image: "/images/default-avatar.jpg"
              }
            ].map((developer, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {developer.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {developer.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 