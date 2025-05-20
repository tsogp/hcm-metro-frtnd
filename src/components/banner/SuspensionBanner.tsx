'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocketStore } from '@/action/websocket';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface MetroLine {
    id: string;
    name: string;
}

interface Station {
    id: string;
    name: string;
}

export const SuspensionBanner = () => {
    const { suspension } = useWebSocketStore();
    const [metroLine, setMetroLine] = useState<MetroLine | null>(null);
    const [stations, setStations] = useState<Station[]>([]);

    useEffect(() => {
        if (suspension?.metroLineID) {
            // Fetch metro line details
            fetch(`http://localhost:8081/api/metro_line/${suspension.metroLineID}`)
                .then(res => res.json())
                .then(data => {
                    setMetroLine(data);
                    // Fetch stations for this metro line
                    return fetch(`http://localhost:8081/api/station?byMetroLine=${suspension.metroLineID}`);
                })
                .then(res => res.json())
                .then(data => setStations(data))
                .catch(error => console.error('Error fetching metro line or station data:', error));
        }
    }, [suspension?.metroLineID]);

    if (!suspension) return null;

    const isEmergency = suspension.suspensionType === 'EMERGENCY';
    const expectedTime = format(new Date(suspension.expectedRestoreTime), 'MMM dd, yyyy HH:mm');

    const BannerContent = () => (
        <>
            <h3 className="text-xl font-bold mb-2">{suspension.title}</h3>
            <p className="text-base mb-2">
                <span className="font-bold">Metro Line:</span> {metroLine?.name || 'Loading...'} |
                <span className="font-bold ml-2">Stations:</span> {stations.map(s => s.name).join(', ') || 'Loading...'}
            </p>
            <p className="text-base">
                <span className="font-bold">Expected Restore Time:</span> {expectedTime}
            </p>
            <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isEmergency
                    ? 'bg-red-800'
                    : 'bg-yellow-700'
                    }`}>
                    {suspension.suspensionType}
                </span>
            </div>
        </>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full py-4 text-white fixed top-[64px] left-0 right-0 z-40 ${isEmergency
                    ? 'bg-red-600 border-b-2 border-red-700'
                    : 'bg-yellow-600 border-b-2 border-yellow-700'
                    }`}
            >
                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex"
                        style={{
                            animation: 'scroll 15s linear infinite',
                            width: '300%'
                        }}
                    >
                        <div className="w-[80vw] px-6 text-center relative">
                            <BannerContent />
                        </div>
                        <div className="w-[80vw] px-6 text-center relative">
                            <BannerContent />
                        </div>
                        <div className="w-[80vw] px-6 text-center relative">
                            <BannerContent />
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-66.666667%);
                        }
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
};