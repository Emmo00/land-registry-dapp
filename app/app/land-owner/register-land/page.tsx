"use client";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import FileUpload from "@/components/file-upload"
import Link from "next/link";
import { CONTRACT_ADDRESS, CONTRACT_ABI, LAND_SIZE_DECIMALS } from "@/constants/contract";
import { useWriteContract, useReadContract, useAccount, useTransactionReceipt, useWaitForTransactionReceipt, BaseError } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseDDAndConvertToDMS, isValidDDLocation } from "@/utils/conversions";
import { processFileEncryptionAndUpload } from "@/utils/file-actions"

type FormData = {
    fullName: string
    nin: string
    plotNumber: string
    landSize: string
    gpsCoordinates: string
    witnessName: string
    witnessNin: string
}

export default function RegisterLand() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const { isConnected: isWalletConnected } = useAccount();
    const { openConnectModal: openWalletConnectModal } = useConnectModal();

    const ADMIN_PUBLIC_KEY = useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "adminPublicKey",
    }).data as string;

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    // Initialize useWriteContract.
    const { data: hash, writeContract, error: writeContractError, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmationError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    useEffect(() => {
        if (isConfirmed) {
            toast({
                title: "Transaction Confirmed",
                description: "Your land has been successfully registered on the blockchain.",
                variant: "default",
                duration: 2000,
                action: (
                    <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                ),
            })
            setIsSubmitting(false);
        }
        if (isConfirming) {
            toast({
                title: "Confirming Transaction...",
                description: "Your transaction is being confirmed on the blockchain.",
                variant: "default",
                duration: 2000,
            })
        }
    }, [isConfirming, isConfirmed])

    useEffect(() => {
        if (confirmationError) {
            console.error("Error confirming transaction:", confirmationError)
            toast({
                title: "Transaction Confirmation Failed",
                description: (confirmationError as BaseError).shortMessage || confirmationError.message || "Something went wrong while confirming your transaction",
                variant: "destructive",
            })
            setIsSubmitting(false);
        }
    }, [confirmationError])

    useEffect(() => {
        if (writeContractError) {
            console.error("Error writing to contract:", writeContractError)
            toast({
                title: "Transaction Failed",
                description: (writeContractError as BaseError).shortMessage || writeContractError.message || "Something went wrong while writing to the contract",
                variant: "destructive",
            })
            setIsSubmitting(false);
        }
    }, [writeContractError])

    const onSubmit = async (data: FormData) => {
        if (!file) {
            toast({
                title: "Error",
                description: "Please upload a title deed or certificate of occupancy",
                variant: "destructive",
            })
            return
        }
        setIsSubmitting(true)

        try {
            // check if wallet is connected
            if (!isWalletConnected) {
                openWalletConnectModal?.();
                setIsSubmitting(false);
                return;
            }


            // 2. Encrypt and upload the title deed/certificate file.
            const encryptedFileCID = await processFileEncryptionAndUpload(file, ADMIN_PUBLIC_KEY)

            // 3. Prepare contract call arguments.
            // The order of parameters in the contract:
            // _plotNumber, _landSize, _gpsCoordinates, _hashedNIN, _witnessHashedNIN, _encryptedTitleDeedHash, _ownerFullName, _witnessFullName
            const args = [
                data.plotNumber,
                Number(data.landSize) * (10 ** LAND_SIZE_DECIMALS),
                data.gpsCoordinates,
                encryptedFileCID, // IPFS CID of the encrypted file.
                data.fullName,
            ]

            console.log(args);

            // 4. Execute the contract write using useWriteContract's async function.
            writeContract({
                abi: CONTRACT_ABI,
                address: CONTRACT_ADDRESS,
                functionName: "registerLand",
                args: args,
            }, {
                onSuccess: () => {
                    toast({
                        title: "Submitted!",
                        description: "Waiting for transaction confirmation...",
                        variant: "default",
                        duration: 2000,
                        action: (
                            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Check className="h-5 w-5 text-emerald-600" />
                            </div>
                        ),
                    })
                },

                onError: (error) => {
                    console.error("Error registering land:", error)
                    toast({
                        title: "Registration Failed",
                        description: error?.message || "Something went wrong while registering your land",
                        variant: "destructive",
                    })
                    setIsSubmitting(false);
                }
            })
        } catch (error: any) {
            console.error("Error preparing registering land:", error)
            toast({
                title: "Submitting Registration Failed",
                description: error?.message || "Something went wrong while registering your land",
                variant: "destructive",
            })
            setIsSubmitting(false);
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
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="container max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <Link href="/land-owner/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </motion.div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <CardTitle className="text-2xl">Register Land Ownership</CardTitle>
                            <CardDescription className="text-slate-500 mt-2">
                                Fill in the details below to register your land on the blockchain
                            </CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent>
                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    {...register("fullName", { required: "Full name is required" })}
                                    className={errors.fullName ? "border-red-300" : ""}
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="plotNumber">Plot Number</Label>
                                    <Input
                                        id="plotNumber"
                                        placeholder="e.g., PLT-2023-001"
                                        {...register("plotNumber", { required: "Plot number is required" })}
                                        className={errors.plotNumber ? "border-red-300" : ""}
                                    />
                                    {errors.plotNumber && <p className="text-red-500 text-sm mt-1">{errors.plotNumber.message}</p>}
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-2">
                                    <Label htmlFor="landSize">Land Size (acres)</Label>
                                    <Input
                                        id="landSize"
                                        placeholder="e.g., 2.5"
                                        {...register("landSize", { required: "Land size is required" })}
                                        className={errors.landSize ? "border-red-300" : ""}
                                    />
                                    {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize.message}</p>}
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="gpsCoordinates">GPS Coordinates (Decimal Degrees)</Label>
                                <Input
                                    id="gpsCoordinates"
                                    placeholder="e.g., -1.2921, 36.8219"
                                    {...register("gpsCoordinates", { required: "GPS coordinates are required" })}
                                    className={errors.gpsCoordinates ? "border-red-300" : ""}
                                />
                                <p className="text-xs pl-2 text-slate-500">{isValidDDLocation(watch('gpsCoordinates')) && parseDDAndConvertToDMS(watch('gpsCoordinates'))}</p>
                                <p className="text-red-500 text-sm mt-1">{isValidDDLocation(watch('gpsCoordinates')) ? "" : "Invalid GPS Location"}</p>
                                {errors.gpsCoordinates && <p className="text-red-500 text-sm mt-1">{errors.gpsCoordinates.message}</p>}
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label>Upload Title Deed or Certificate of Occupancy</Label>
                                <FileUpload file={file} setFile={setFile} />
                                <p className="text-xs text-slate-500">Encrypted before being stored on the blockchain</p>
                            </motion.div>
                        </motion.form>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-6 h-auto rounded-lg shadow-sm transition-all"
                            >
                                {(isSubmitting || isPending) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Encrypting & uploading to Web3...
                                    </>
                                ) : (
                                    <>Submit to Blockchain</>
                                )}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </Card>
            </div>
            <Toaster />
        </div>
    )
}
