import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
    metis,
    metisSepolia,
} from 'wagmi/chains';

const isProd = process.env.NODE_ENV === 'production';

export const config = getDefaultConfig({
    appName: 'Land Registry',
    projectId: 'YOUR_PROJECT_ID',
    chains: isProd ? [metis] : [metisSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

