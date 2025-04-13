"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X, FileText, MapPin, User, Calendar, Ruler } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract"
import { useReadContract, useWriteContract } from "wagmi"
import { LandRecordType } from "@/types"
import { formatDate, normalizeAcreAmount, parseDDAndConvertToDMS } from "@/utils/conversions"
import { VerificationStatusToLabel } from "@/constants/abstract"


export default function ViewRequest({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    let [request, setRequest] = useState<LandRecordType>();
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingProof, setIsGeneratingProof] = useState(false);
    const [landProof, setLandProof] = useState("");
    const landRequest = useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "getLandById",
        args: [use(params).id],
        query: {
            enabled: !!use(params).id,
        }
    }).data as unknown as LandRecordType;
    const { writeContract } = useWriteContract();
    const { toast } = useToast();

    useEffect(() => {
        if (landRequest) {
            console.log("land request", landRequest);
            setRequest(landRequest)
            setIsLoading(false);
        }
    }, [landRequest])

    function handleGenerateProof() {
        setIsGeneratingProof(true);

        writeContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "generateProof",
            args: [request?.id],
        }, {
            onSettled(data, error, variables, context) {
                if (error) {
                    setIsGeneratingProof(false);
                    console.error("Error generating proof", error);
                    toast({
                        description: "An error occurred while generating the proof. Please try again.",
                        variant: "destructive",
                    })
                    return;
                }

                setIsGeneratingProof(false);
                setLandProof(data as unknown as string);
                console.log("land proof", data);
                toast({
                    title: "Land Proof Generated",
                    description: "Land proof successfully generated",
                    variant: "default",
                })
                // scroll to the bottom
                setTimeout(() => {
                    scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                    })
                }, 1000);
            },
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-slate-50 py-8 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>

                    <Card>
                        <CardContent className="pt-6 text-center py-10">
                            <p className="text-slate-500">Request not found or has been removed.</p>
                            <Button onClick={() => router.push("/admin/dashboard")} className="mt-4">
                                Return to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Button variant="ghost" onClick={() => router.push("/land-owner/dashboard")} className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl">Land Ownership Verification</CardTitle>
                                    <CardDescription>Review and verify the land ownership request</CardDescription>
                                </div>
                                <Badge
                                    className={
                                        VerificationStatusToLabel[request.status] === "pending"
                                            ? "bg-amber-100 text-amber-800"
                                            : VerificationStatusToLabel[request.status] === "approved"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-red-100 text-red-800"
                                    }
                                >
                                    {VerificationStatusToLabel[request.status].charAt(0).toUpperCase() + VerificationStatusToLabel[request.status].slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <Tabs defaultValue="details">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="details">Request Details</TabsTrigger>
                                    {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
                                </TabsList>

                                <TabsContent value="details" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <User className="h-4 w-4 mr-1" /> Owner Name
                                                </h3>
                                                <p className="text-lg font-medium">{request.ownerFullName}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <FileText className="h-4 w-4 mr-1" /> Plot Number
                                                </h3>
                                                <p className="text-lg font-medium">{request.plotNumber}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <Ruler className="h-4 w-4 mr-1" /> Land Size (acres)
                                                </h3>
                                                <p className="text-lg font-medium">{normalizeAcreAmount(request.landSize)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" /> GPS Coordinates
                                                </h3>
                                                <p className="text-lg font-medium">{parseDDAndConvertToDMS(request.gpsCoordinates)}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" /> Submission Date
                                                </h3>
                                                <p className="text-lg font-medium">{formatDate(request.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {request.rejectionReason && (
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-500 mb-2">Additional Notes</h3>
                                            <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200">
                                                {request.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>

                        <CardFooter className="flex md:flex-col text-left sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            {/* Generate Proof Button */}
                            {VerificationStatusToLabel[request.status] === "approved" && (
                                <Button
                                    variant="outline"
                                    className="w-full bg-green-800 text-white sm:w-auto"
                                    onClick={handleGenerateProof}
                                    disabled={isGeneratingProof}
                                >
                                    Generate Proof
                                </Button>
                            )}

                            <br />
                            {/* show generated Proof */}
                            {landProof && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: landProof ? 1 : 0, y: landProof ? 0 : 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full sm:w-auto">
                                    <h3 className="text-sm font-medium text-slate-500 mb-2">Generated Proof</h3>
                                    <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 overflow-hidden overflow-x-scroll">
                                        {landProof}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-2"
                                        onClick={() => {
                                            navigator.clipboard.writeText(landProof);
                                            toast({
                                                title: "Copied to Clipboard",
                                                description: "The generated proof has been copied to your clipboard.",
                                                variant: "default",
                                            });
                                        }}
                                    >
                                        Copy to Clipboard
                                    </Button>
                                </motion.div>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
            <Toaster />
        </div>
    )
}

