import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
    metis,
    metisSepolia,
} from 'wagmi/chains';
import { http } from 'viem';

const isProd = process.env.IS_LIVE === 'yes';

export const config = getDefaultConfig({
    appName: 'Land Registry',
    projectId: 'YOUR_PROJECT_ID',
    chains: isProd ? [metis] : [metisSepolia],
    transports: { [metisSepolia.id]: http('https://metis-sepolia-rpc.publicnode.com') },
    ssr: true, // If your dApp uses server side rendering (SSR)
});

