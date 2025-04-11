"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import EmptyState from "@/components/empty-state"
import LandCard from "@/components/land-card"
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract"
import { LabelToVerificationStatus } from "@/constants/abstract"
import { type LandRecordType } from "../../../types"
import Link from "next/link"


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("all");
    const { openConnectModal } = useConnectModal();
    const { isConnected, } = useAccount();
    const router = useRouter();
    const { address, } = useAccount();

    // get land submissions from contract
    const submissions = useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'getLandsByOwner',
        args: [address],
    }).data as unknown as LandRecordType[];

    console.log(submissions);

    // Filter submissions based on active tab
    const filteredSubmissions =
        (activeTab === "all" ? submissions : submissions?.filter((submission) => submission.status === LabelToVerificationStatus[activeTab])) || [];

    function handleOnClick() {
        // if wallet not connected, open connect modal
        if (!isConnected) {
            openConnectModal?.()
        }
        // navigate to register land ownership page
        router.push('/land-owner/register-land');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.h1
                        className="text-2xl font-semibold text-slate-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Welcome back, Land Owner!
                    </motion.h1>

                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <ConnectButton showBalance={false} />
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Register New Land Button */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleOnClick}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-6 h-auto rounded-lg shadow-md transition-all hover:shadow-lg hover:shadow-emerald-200">
                            <Plus className="mr-2 h-5 w-5" />
                            Register New Land Ownership
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Submissions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-medium text-slate-800 mb-6">Your Land Submissions</h2>

                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} >
                            <TabsList className="mb-6">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="approved">Approved</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            </TabsList>

                            <TabsContent value={activeTab} className="mt-0">
                                {filteredSubmissions.length > 0 ? (
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.1,
                                                },
                                            },
                                        }}
                                    >
                                        {filteredSubmissions.map((submission) => (
                                            <Link href={`/land-owner/dashboard/lands/${submission.id}`} key={submission.id}>
                                                <LandCard key={submission.id} submission={submission} />
                                            </Link>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <EmptyState />
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
