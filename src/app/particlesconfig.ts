// src/particlesConfig.ts

import type { ISourceOptions } from "tsparticles-engine";

export const particlesConfig: ISourceOptions = {
    background: {
        color: {
            value: '#000000',
        },
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: 'grab', // Draws lines from cursor to nearby particles
            },
            resize: true,
        },
        modes: {
            grab: {
                distance: 150,
                links: {
                    opacity: 1,
                    color: '#f43fff' // A hint of fuchsia for the grab lines
                },
            },
        },
    },
    particles: {
        color: {
            value: '#ffffff',
        },
        links: {
            color: '#334155', // Subtle slate color for the main network
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce',
            },
            random: false,
            speed: 0.5, // Slower, more ambient movement
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.3,
        },
        shape: {
            type: 'circle',
        },
        size: {
            value: { min: 1, max: 2 },
        },
    },
    detectRetina: true,
};
