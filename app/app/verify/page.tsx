"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, MapPin, User, FileText, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LandRecordType, ProofUsedLog } from "@/types"
import { normalizeAcreAmount, parseDDAndConvertToDMS } from "@/utils/conversions"
import { useReadContract, useWatchContractEvent, useWriteContract } from "wagmi"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type SearchFormData = {
    proof: string
}


export default function VerifyProofPage() {
    const [formData, setFormData] = useState<SearchFormData>({
        proof: "",
    })
    const [searchResult, setSearchResult] = useState<LandRecordType | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false);
    const [landID, setLandID] = useState<number | bigint | null>(null);
    const { data: hash, error: writeContractError, isPending, writeContract } = useWriteContract();

    const { data: landRecord, refetch: refetchLandDetails } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getLandById",
        args: [landID],
        query: {
            enabled: !!landID,
        }
    })

    useEffect(() => {
        if (landRecord) {
            setHasSearched(true);
            setIsSearching(false);
            setSearchResult(landRecord as LandRecordType);

            // scroll to the results
            setTimeout(() => {
                scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                });
            }, 1000);
        }
    }, [landRecord]);

    // watch write contract error
    useEffect(() => {
        if (writeContractError) {
            console.error("Write contract error:", writeContractError);
            setError("An error occurred while verifying the proof. Please try again.");
            setIsSearching(false);
        }
    }, [writeContractError]);

    // watch blockchain for proofUsed event to get the landID
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "ProofUsed",
        onError: (error) => {
            console.error("Error watching proofUsed event:", error);
        },
        onLogs: (logs) => {
            console.log("proofUsed event logs:", logs)
            for (let i = 0; i < logs.length; i++) {
                const log = logs[i] as unknown as ProofUsedLog;

                if (log.args.proofHash !== formData.proof) {
                    console.log("Proof hash does not match, skipping this log.")
                    continue;
                }

                const landID = log.args.id;
                setLandID(landID);
                refetchLandDetails();
                break;
            }
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        // Reset states
        setError(null)
        setIsSearching(true);

        setHasSearched(false);

        // Validate that at least one field has input
        if (!formData.proof) {
            setError("Please enter ownership proof.")
            setIsSearching(false)
            setSearchResult(null)
            return;
        }

        if (formData.proof.length !== 66) {
            setError("Invalid proof length. Proof should be 32 characters long." + formData.proof.length);
            setIsSearching(false)
            setSearchResult(null)
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "verifyProof",
            args: [formData.proof],
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const resultsVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Land Ownership Verification</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Enter proof sent to you by the owner of the land to verify ownership.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8"
                >
                    <form onSubmit={handleSearch} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="proof" className="text-slate-700">
                                Enter Proof
                            </Label>
                            <div className="relative">
                                <Input
                                    id="proof"
                                    name="proof"
                                    placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXX"
                                    value={formData.proof}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className="pl-10"
                                />
                                <FileText className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="pt-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                disabled={isSearching}
                                onClick={handleSearch}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 h-auto rounded-lg shadow-sm transition-all"
                            >
                                {isSearching ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Searching...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <SearchIcon className="mr-2 h-5 w-5" />
                                        Verify Ownership
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start"
                        >
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hasSearched && !error && (
                        <motion.div variants={resultsVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
                            {searchResult ? (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Search Results</h2>
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                                <h3 className="text-lg font-medium text-slate-800">Plot {searchResult.plotNumber}</h3>
                                                <div className="mt-2 md:mt-0">
                                                    {searchResult.status === 1 ? (
                                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                            ✅ Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">❌ Not Verified</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div>
                                                    <p className="text-sm text-slate-500">Owner</p>
                                                    <p className="font-medium text-slate-700">{searchResult.ownerFullName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Land Size</p>
                                                    <p className="font-medium text-slate-700">{(normalizeAcreAmount(searchResult.landSize))} acres</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-slate-500">GPS Coordinates</p>
                                                    <p className="font-medium text-slate-700">{parseDDAndConvertToDMS(searchResult.gpsCoordinates)}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200">
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-slate-200"
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
                                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>

                                        <h3 className="mt-4 text-lg font-medium text-slate-900">No records found</h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            We couldn't find any land records matching your search criteria. Please try different search
                                            terms.
                                        </p>

                                        <div className="mt-6">
                                            <Link href="/register">
                                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Register New Land</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Toaster />
        </div>
    )
}
