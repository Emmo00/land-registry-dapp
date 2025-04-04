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
    },
    {
        id: "2",
        ownerName: "Jane Smith",
        plotNumber: "PLT-2023-002",
        landSize: "4.2 acres",
        gpsCoordinates: "0.3157° N, 32.6012° E",
        submissionDate: "2023-11-28",
        status: "approved",
    },
    {
        id: "3",
        ownerName: "Robert Johnson",
        plotNumber: "PLT-2023-003",
        landSize: "1.8 acres",
        gpsCoordinates: "0.3290° N, 32.5710° E",
        submissionDate: "2023-12-05",
        status: "rejected",
    },
    {
        id: "4",
        ownerName: "Sarah Williams",
        plotNumber: "PLT-2023-004",
        landSize: "3.0 acres",
        gpsCoordinates: "0.3412° N, 32.5901° E",
        submissionDate: "2023-12-18",
        status: "pending",
    },
    {
        id: "5",
        ownerName: "Michael Brown",
        plotNumber: "PLT-2023-005",
        landSize: "5.7 acres",
        gpsCoordinates: "0.3501° N, 32.5750° E",
        submissionDate: "2023-12-10",
        status: "pending",
    },
    {
        id: "6",
        ownerName: "Emily Davis",
        plotNumber: "PLT-2023-006",
        landSize: "2.2 acres",
        gpsCoordinates: "0.3320° N, 32.5880° E",
        submissionDate: "2023-12-07",
        status: "approved",
    },
]

type LandRequest = {
    id: string
    ownerName: string
    plotNumber: string
    landSize: string
    gpsCoordinates: string
    submissionDate: string
    status: "pending" | "approved" | "rejected"
}

export default function GovernmentDashboard() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<keyof LandRequest | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [filteredRequests, setFilteredRequests] = useState<LandRequest[]>(mockRequests)

    // Filter and sort requests based on search term and status filter
    useEffect(() => {
        let results = mockRequests

        // Apply status filter
        if (statusFilter !== "all") {
            results = results.filter((request) => request.status === statusFilter)
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            results = results.filter(
                (request) =>
                    request.ownerName.toLowerCase().includes(term) ||
                    request.plotNumber.toLowerCase().includes(term) ||
                    request.gpsCoordinates.toLowerCase().includes(term),
            )
        }

        // Apply sorting
        if (sortField) {
            results = [...results].sort((a, b) => {
                const aValue = a[sortField]
                const bValue = b[sortField]

                if (sortDirection === "asc") {
                    return aValue.localeCompare(bValue)
                } else {
                    return bValue.localeCompare(aValue)
                }
            })
        }

        setFilteredRequests(results)
    }, [searchTerm, statusFilter, sortField, sortDirection])

    const handleSort = (field: keyof LandRequest) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleViewRequest = (id: string) => {
        router.push(`/admin/verify/${id}`)
    }

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
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
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("ownerName")}>
                                    <div className="flex items-center">
                                        Owner Name
                                        {sortField === "ownerName" &&
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
                                <TableHead>Land Size</TableHead>
                                <TableHead>GPS Coordinates</TableHead>
                                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("submissionDate")}>
                                    <div className="flex items-center">
                                        Submission Date
                                        {sortField === "submissionDate" &&
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
                                        <TableCell className="font-medium">{request.ownerName}</TableCell>
                                        <TableCell>{request.plotNumber}</TableCell>
                                        <TableCell>{request.landSize}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={request.gpsCoordinates}>
                                            {request.gpsCoordinates}
                                        </TableCell>
                                        <TableCell>{formatDate(request.submissionDate)}</TableCell>
                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                        <TableCell>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewRequest(request.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View & Verify
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
                                                <h3 className="font-medium">{request.ownerName}</h3>
                                                <p className="text-sm text-slate-500">{request.plotNumber}</p>
                                            </div>
                                            {getStatusBadge(request.status)}
                                        </div>

                                        <div className="p-4 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs text-slate-500">Land Size</p>
                                                    <p className="text-sm">{request.landSize}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Submission Date</p>
                                                    <p className="text-sm">{formatDate(request.submissionDate)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">GPS Coordinates</p>
                                                <p className="text-sm truncate">{request.gpsCoordinates}</p>
                                            </div>

                                            <motion.div className="pt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    onClick={() => handleViewRequest(request.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View & Verify
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
