
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function CheckLandOwnershipButton() {
    const { openConnectModal } = useConnectModal();
    const { isConnected, } = useAccount();
    const router = useRouter();

    function handleOnClick() {
        if (!isConnected) {
            openConnectModal?.();
        }

        router.push('/search');
    }
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-500 transition-colors" onClick={handleOnClick}>
                Check Land Ownership
            </Button>
        </motion.div>
    )
}