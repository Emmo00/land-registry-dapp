"use client"

import { useState } from "react"
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
import Link from "next/link"

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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

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

        // Simulate blockchain submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
            title: "Success!",
            description: "Your land registration has been submitted to the blockchain",
            action: (
                <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-600" />
                </div>
            ),
        })

        setIsSubmitting(false)
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
                    <Link href="/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-900">
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

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                                <Input
                                    id="nin"
                                    placeholder="Enter your NIN"
                                    {...register("nin", { required: "NIN is required" })}
                                    className={errors.nin ? "border-red-300" : ""}
                                />
                                <p className="text-xs text-slate-500">Will be hashed before storing</p>
                                {errors.nin && <p className="text-red-500 text-sm">{errors.nin.message}</p>}
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
                                    <Label htmlFor="landSize">Land Size</Label>
                                    <Input
                                        id="landSize"
                                        placeholder="e.g., 2.5 acres"
                                        {...register("landSize", { required: "Land size is required" })}
                                        className={errors.landSize ? "border-red-300" : ""}
                                    />
                                    {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize.message}</p>}
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                                <Input
                                    id="gpsCoordinates"
                                    placeholder="e.g., 40.7128° N, 74.0060° W"
                                    {...register("gpsCoordinates", { required: "GPS coordinates are required" })}
                                    className={errors.gpsCoordinates ? "border-red-300" : ""}
                                />
                                {errors.gpsCoordinates && <p className="text-red-500 text-sm mt-1">{errors.gpsCoordinates.message}</p>}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <h3 className="text-lg font-medium mb-4">Witness Information (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="witnessName">Witness Name</Label>
                                        <Input id="witnessName" placeholder="Enter witness name" {...register("witnessName")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="witnessNin">Witness NIN</Label>
                                        <Input id="witnessNin" placeholder="Enter witness NIN" {...register("witnessNin")} />
                                        <p className="text-xs text-slate-500">Will be hashed before storing</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label>Upload Title Deed or Certificate of Occupancy</Label>
                                <FileUpload file={file} setFile={setFile} />
                                <p className="text-xs text-slate-500">Encrypted before being stored on Web3</p>
                            </motion.div>
                        </motion.form>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-6 h-auto rounded-lg shadow-sm transition-all"
                            >
                                {isSubmitting ? (
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
