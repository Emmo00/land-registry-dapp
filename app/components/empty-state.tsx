"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function EmptyState() {
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const router = useRouter();

    function handleOnClick() {
        // if wallet not connected, open connect modal
        if (!isConnected) {
            openConnectModal?.()
        }
        // navigate to register land ownership page
        router.push('/land-owner/register-land');
    }

    return (
        <motion.div
            className="text-center py-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mx-auto max-w-md">
                <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>

                <h3 className="mt-4 text-lg font-medium text-slate-900">You haven't submitted any land records yet.</h3>
                <p className="mt-2 text-sm text-slate-500">Get started by registering your first land ownership record.</p>

                <motion.div className="mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleOnClick} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-6 h-auto rounded-lg shadow-md transition-all hover:shadow-lg hover:shadow-emerald-200">
                        <Plus className="mr-2 h-5 w-5" />
                        Register New Land Ownership
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
