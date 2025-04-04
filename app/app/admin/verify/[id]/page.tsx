"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X, FileText, MapPin, User, Calendar, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const mockRequests = [
    {
        id: "1",
        ownerName: "John Doe",
        plotNumber: "PLT-2023-001",
        landSize: "2.5 acres",
        gpsCoordinates: "0.3476° N, 32.5825° E",
        submissionDate: "2023-12-15",
        status: "pending",
        documentUrl: "#",
        witnessName: "Sarah Johnson",
        witnessContact: "+256 701 234 567",
        additionalNotes: "Property borders a protected forest area on the eastern side.",
    },
    {
        id: "2",
        ownerName: "Jane Smith",
        plotNumber: "PLT-2023-002",
        landSize: "4.2 acres",
        gpsCoordinates: "0.3157° N, 32.6012° E",
        submissionDate: "2023-11-28",
        status: "approved",
        documentUrl: "#",
        witnessName: "Michael Brown",
        witnessContact: "+256 702 345 678",
        additionalNotes: "Land previously used for agricultural purposes.",
    },
]

export default function VerifyRequest({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [request, setRequest] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        // Simulate API call to fetch request details
        const fetchRequest = async () => {
            setIsLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const foundRequest = mockRequests.find((req) => req.id === params.id)
            setRequest(foundRequest || null)
            setIsLoading(false)
        }

        fetchRequest()
    }, [params.id])

    const handleApprove = async () => {
        setIsSubmitting(true)
        // Simulate API call to approve request
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSubmitting(false)

        // Redirect back to dashboard
        router.push("/admin/dashboard")
    }

    const handleReject = async () => {
        setIsSubmitting(true)
        // Simulate API call to reject request
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSubmitting(false)

        // Redirect back to dashboard
        router.push("/admin/dashboard")
    }

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
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
                                        request.status === "pending"
                                            ? "bg-amber-100 text-amber-800"
                                            : request.status === "approved"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-red-100 text-red-800"
                                    }
                                >
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
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
                                                <p className="text-lg font-medium">{request.ownerName}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <FileText className="h-4 w-4 mr-1" /> Plot Number
                                                </h3>
                                                <p className="text-lg font-medium">{request.plotNumber}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <Ruler className="h-4 w-4 mr-1" /> Land Size
                                                </h3>
                                                <p className="text-lg font-medium">{request.landSize}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" /> GPS Coordinates
                                                </h3>
                                                <p className="text-lg font-medium">{request.gpsCoordinates}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" /> Submission Date
                                                </h3>
                                                <p className="text-lg font-medium">{formatDate(request.submissionDate)}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 mb-1">Witness Information</h3>
                                                <p className="font-medium">{request.witnessName}</p>
                                                <p className="text-sm text-slate-500">{request.witnessContact}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {request.additionalNotes && (
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-500 mb-2">Additional Notes</h3>
                                            <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200">
                                                {request.additionalNotes}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="documents">
                                    <div className="space-y-4">
                                        <div className="border border-slate-200 rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Title Deed / Certificate of Occupancy</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-slate-400 mr-2" />
                                                    <span className="text-sm">land_title_document.pdf</span>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View Document
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="border border-slate-200 rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Land Survey Map</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-slate-400 mr-2" />
                                                    <span className="text-sm">survey_map.jpg</span>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View Document
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
                                    disabled={isSubmitting || request.status !== "pending"}
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
                                    onClick={handleReject}
                                    disabled={isSubmitting || request.status !== "pending"}
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
                </motion.div>
            </div>
        </div>
    )
}

