"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useReadContract } from "wagmi"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract"
import { LandRecordType } from "@/types"
import { VerificationStatusToLabel } from "@/constants/abstract"
import { formatDate, normalizeAcreAmount, parseDDAndConvertToDMS } from "@/utils/conversions"


export default function GovernmentDashboard() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<keyof LandRecordType | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    let results = (useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "getAllLands",
    }).data as unknown as LandRecordType[] || []).filter((request) => request.ownerFullName)
    const [filteredRequests, setFilteredRequests] = useState<LandRecordType[]>(results.filter((request) => request.ownerFullName))

    useEffect(() => {
        // Filter and sort requests when the component mounts
        setFilteredRequests(results.filter((request) => request.ownerFullName))
    }, [results]);


    // Filter and sort requests based on search term and status filter
    useEffect(() => {

        // Apply status filter
        if (statusFilter !== "all") {
            results = results.filter((request) => VerificationStatusToLabel[request.status] === statusFilter)
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            results = results
                .filter((request => request.ownerFullName)) // Ensure ownerFullName is not undefined
                .filter(
                    (request) =>
                        request.ownerFullName.toLowerCase().includes(term) ||
                        request.plotNumber.toLowerCase().includes(term) ||
                        request.gpsCoordinates.toLowerCase().includes(term),
                )
        }

        // Apply sorting
        if (sortField) {
            results = [...results]
                .filter(result => result.ownerFullName) // Ensure ownerFullName is not undefined
                .sort((a, b) => {
                    const aValue = a[sortField]
                    const bValue = b[sortField]

                    if (sortDirection === "asc") {
                        if (typeof aValue === "number" && typeof bValue === "number") {
                            return aValue - bValue
                        }

                        if (typeof aValue === "bigint" && typeof bValue === "bigint") {
                            return Number(aValue) - Number(bValue)
                        }

                        if (typeof aValue === "string" && typeof bValue === "string") {
                            return aValue.localeCompare(bValue)
                        }

                        return 0
                    } else {
                        if (typeof aValue === "number" && typeof bValue === "number") {
                            return bValue - aValue
                        }

                        if (typeof aValue === "bigint" && typeof bValue === "bigint") {
                            return Number(bValue) - Number(aValue)
                        }

                        if (typeof aValue === "string" && typeof bValue === "string") {
                            return bValue.localeCompare(aValue)
                        }

                        return 0
                    }
                })
        }

        setFilteredRequests(results)
    }, [searchTerm, statusFilter, sortField, sortDirection])

    const handleSort = (field: keyof LandRecordType) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleViewRequest = (id: bigint) => {
        router.push(`/admin/verify/${id}`)
    }

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
            case "approved":
                return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Approved</Badge>
            case "rejected":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
            default:
                return <Badge>Unknown</Badge>
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-800">Government Official Dashboard</h1>
                    <p className="text-slate-500 mt-2">Review and verify land ownership requests</p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-lg border border-slate-200 p-4 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Search by owner, plot number, or GPS coordinates"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex gap-2 items-center">
                                        <Filter className="h-4 w-4" />
                                        {statusFilter === "all"
                                            ? "All Status"
                                            : statusFilter === "pending"
                                                ? "Pending"
                                                : statusFilter === "approved"
                                                    ? "Approved"
                                                    : "Rejected"}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </motion.div>

                {/* Table for Desktop */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden"
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("ownerFullName")}>
                                    <div className="flex items-center">
                                        Owner Name
                                        {sortField === "ownerFullName" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("plotNumber")}>
                                    <div className="flex items-center">
                                        Plot Number
                                        {sortField === "plotNumber" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </TableHead>
                                <TableHead>Land Size(acres)</TableHead>
                                <TableHead>GPS Coordinates</TableHead>
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("timestamp")}>
                                    <div className="flex items-center">
                                        Submission Date
                                        {sortField === "timestamp" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("status")}>
                                    <div className="flex items-center">
                                        Status
                                        {sortField === "status" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <motion.tr key={request.id} variants={itemVariants} className="border-b hover:bg-slate-50">
                                        <TableCell className="font-medium">{request.ownerFullName}</TableCell>
                                        <TableCell>{request.plotNumber}</TableCell>
                                        <TableCell>{normalizeAcreAmount(request.landSize)}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={parseDDAndConvertToDMS(request.gpsCoordinates)!}>
                                            {request.gpsCoordinates}
                                        </TableCell>
                                        <TableCell>{formatDate(request.timestamp)}</TableCell>
                                        <TableCell>{getStatusBadge(VerificationStatusToLabel[request.status])}</TableCell>
                                        <TableCell>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewRequest(request.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    {request.status === 0 ? "View & Verify" : "View"}
                                                </Button>
                                            </motion.div>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No requests found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </motion.div>

                {/* Card View for Mobile */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:hidden space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <motion.div key={request.id} variants={itemVariants}>
                                <Card className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{request.ownerFullName}</h3>
                                                <p className="text-sm text-slate-500">{request.plotNumber}</p>
                                            </div>
                                            {getStatusBadge(VerificationStatusToLabel[request.status])}
                                        </div>

                                        <div className="p-4 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs text-slate-500">Land Size(acres)</p>
                                                    <p className="text-sm">{normalizeAcreAmount(request.landSize)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Submission Date</p>
                                                    <p className="text-sm">{formatDate(request.timestamp)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">GPS Coordinates</p>
                                                <p className="text-sm truncate">{parseDDAndConvertToDMS(request.gpsCoordinates)}</p>
                                            </div>

                                            <motion.div className="pt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    onClick={() => handleViewRequest(request.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    {request.status === 0 ? "View & Verify" : "View"}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-slate-500">No requests found matching your criteria.</p>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
