import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';

export default function Home() {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev || 'auto';
        };
    }, []);

    return (
        <>
            <Navbar />
            <Hero />
        </>
    );
}
