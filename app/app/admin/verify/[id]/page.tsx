"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X, FileText, MapPin, User, Calendar, Ruler } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract"
import { useReadContract, useWriteContract } from "wagmi"
import { FileDecrypted, LandRecordType } from "@/types"
import { formatDate, normalizeAcreAmount, parseDDAndConvertToDMS } from "@/utils/conversions"
import { VerificationStatusToLabel } from "@/constants/abstract"
import { decryptWithPrivateKey } from "@/utils/crypto"
import { getExtensionFromFileName } from "@/utils/misc"
import { Toaster } from "@/components/ui/toaster"
import { BaseError } from "viem"


export default function VerifyRequest({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    let [request, setRequest] = useState<LandRecordType>();
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState<string>("")
    const [isRejectionReasonVisible, setIsRejectionReasonVisible] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const landRequest = useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "getLandById",
        args: [use(params).id],
    }).data as unknown as LandRecordType
    const { writeContract, error: writeContractError } = useWriteContract();
    const { toast } = useToast()

    useEffect(() => {
        if (landRequest) {
            console.log("land request", landRequest);
            setRequest(landRequest)
            setIsLoading(false);
        }
    }, [landRequest])

    // handle write contract error
    useEffect(() => {
        if (writeContractError) {
            console.error("Error writing contract:", writeContractError);
            toast({
                title: "Error",
                description: "Failed to process the request. Please try again." + (writeContractError as BaseError).shortMessage || writeContractError.message || "Unknown error",
                variant: "destructive",
            })
            setIsSubmitting(false)
        }
    }, [writeContractError])

    const handleApprove = async () => {
        setIsSubmitting(true)

        // call contract to approve request
        writeContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "verifyLand",
            args: [request?.id],
        }, {
            onSettled: (data, error) => {
                if (error) {
                    setIsSubmitting(false)
                    console.error("Error verifying land:", error);
                    toast({
                        title: "Error",
                        description: "Failed to verify the request. Please try again." + error.message,
                        variant: "destructive",
                    })
                    setIsSubmitting(false)
                    return;
                }
                setIsSubmitting(false)
                toast({
                    title: "Success",
                    description: "Land verified successfully.",
                    variant: "default",
                })
                console.log("Land verified successfully:", data);
                // Redirect back to dashboard
                setTimeout(() => { router.push("/admin/dashboard") }, 2000)
            }
        })

    }

    const handleShowRejectReasonForm = () => {
        setIsRejectionReasonVisible(true);

        // smoothly scroll to bottom 
        setTimeout(() => {
            scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            })
        }, 100)
    }

    const handleReject = async () => {
        setIsSubmitting(true)


        // call contract to approve request
        writeContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "rejectLand",
            args: [request?.id, rejectionReason],
        }, {
            onSettled: (data, error) => {
                if (error) {
                    setIsSubmitting(false)
                    console.error("Error rejecting land:", error);
                    toast({
                        title: "Error",
                        description: "Failed to reject the request. Please try again." + error.message,
                        variant: "destructive",
                    })
                    setIsSubmitting(false)
                    return;
                }
                setIsSubmitting(false)
                toast({
                    title: "Success",
                    description: "Land rejected successfully.",
                    variant: "default",
                })
                console.log("Land rejected successfully:", data);
                // Redirect back to dashboard
                setTimeout(() => { router.push("/admin/dashboard") }, 2000)
            }
        })
    }

    const handleDocumentDownload = async () => {
        setIsProcessingImage(true);
        try {
            // Get encrypted file from IPFS
            const formData = new FormData();
            formData.set('cid', request?.encryptedTitleDeedHash!);
            const fetchResponse = await fetch("/api/files/url", {
                method: "POST",
                body: formData
            });

            if (!fetchResponse.ok) {
                setIsProcessingImage(false);
                throw new Error("Failed to fetch file URL");
            }

            const url = await fetchResponse.json();

            // Fetch the file from the URL
            const fileResponse = await fetch(url);
            if (!fileResponse.ok) {
                setIsProcessingImage(false);
                throw new Error("Failed to fetch file");
            }

            console.log(fileResponse);

            const encryptedFile = (await fileResponse.arrayBuffer());

            // convert encrypted file to string
            const encryptedFileString = new TextDecoder().decode(new Uint8Array(encryptedFile));

            console.log("encrypted file string", encryptedFileString);

            // Get private key from session storage
            const privateKey = sessionStorage.getItem("privateKey");
            if (!privateKey) {
                router.push("/admin/login");
            }

            console.log("private key", privateKey);

            // Decrypt the file (assuming a decryptFile utility function exists)
            const decryptedFile = JSON.parse(await decryptWithPrivateKey(encryptedFileString, privateKey!)) as unknown as FileDecrypted;
            const fileContentBase64 = decryptedFile.content

            // base64 to file
            const fileContent = atob(fileContentBase64);
            const byteArray = new Uint8Array(fileContent.length);
            for (let i = 0; i < fileContent.length; i++) {
                byteArray[i] = fileContent.charCodeAt(i);
            }

            console.log('decrypted file', decryptedFile)

            // Create a Blob and download the file
            const blob = new File([byteArray], decryptedFile.name, { type: decryptedFile.type });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${request?.plotNumber}_${request?.ownerFullName}.${getExtensionFromFileName(decryptedFile.name)}`;
            link.click();
            URL.revokeObjectURL(link.href);
            setIsProcessingImage(false);
        } catch (error) {
            setIsProcessingImage(false);
            // Handle error
            console.error("Error downloading document:", error);
            alert("Failed to download the document. Please try again.");
        }
    };

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
                    <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mb-6">
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
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
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

                                <TabsContent value="documents">
                                    <div className="space-y-4">
                                        <div className="border border-slate-200 rounded-lg p-4">
                                            <h3 className="font-medium mb-2" title={request.encryptedTitleDeedHash}>Title Deed / Certificate of Occupancy</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-slate-400 mr-2" />
                                                    {/* <span className="text-sm">land_title_document.pdf</span> */}
                                                </div>
                                                <Button onClick={handleDocumentDownload}
                                                    disabled={isProcessingImage}
                                                    variant="outline" size="sm">
                                                    {isProcessingImage ? "Processing Image" : "View Document"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleApprove}
                                    disabled={isSubmitting || VerificationStatusToLabel[request.status] !== "pending"}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Approve Request
                                        </>
                                    )}
                                </Button>
                            </motion.div>

                            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleShowRejectReasonForm}
                                    disabled={isSubmitting || VerificationStatusToLabel[request.status] !== "pending"}
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-4 w-4"
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
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <X className="mr-2 h-4 w-4" />
                                            Reject Request
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </Card>
                    {/* Rejection Reason Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isRejectionReasonVisible ? 1 : 0, y: isRejectionReasonVisible ? 0 : 20 }}
                        transition={{ duration: 0.5 }}
                        className={`transition-all duration-500 ${isRejectionReasonVisible ? "block" : "hidden"}`}
                    >
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Rejection Reason</CardTitle>
                                <CardDescription>Provide a reason for rejecting the request</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <textarea
                                    className="w-full border border-slate-200 rounded-md p-3"
                                    rows={4}
                                    placeholder="Enter reason for rejection"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                ></textarea>
                            </CardContent>

                            <CardFooter className="flex justify-end">
                                <Button
                                    onClick={handleReject}
                                    disabled={isSubmitting || VerificationStatusToLabel[request.status] !== "pending"}
                                    variant="destructive"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <X className="mr-2 h-4 w-4" />
                                            Reject Request
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
            <Toaster />
        </div>
    )
}

