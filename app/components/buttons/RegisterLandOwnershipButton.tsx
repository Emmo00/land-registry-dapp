
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function RegisterLandOwnershipButton() {
    const { openConnectModal } = useConnectModal();
    const { isConnected, } = useAccount();
    const router = useRouter();

    function handleOnClick() {
        if (!isConnected) {
            openConnectModal?.();
        }

        router.push('/land-owner/dashboard');
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 bg- text-white hover:bg-white/10 transition-colors"
            >
                Register Land Ownership
            </Button>
        </motion.div>
    )
}