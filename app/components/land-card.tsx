"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

type Submission = {
    id: string
    plotNumber: string
    landSize: string
    status: string
    submissionDate: string
}

type LandCardProps = {
    submission: Submission
}

export default function LandCard({ submission }: LandCardProps) {
    // Define status badge colors
    const statusColors = {
        pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
        approved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
        rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    }

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-slate-800">{submission.plotNumber}</h3>
                    <Badge className={statusColors[submission.status as keyof typeof statusColors]}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </Badge>
                </div>

                <div className="flex items-center text-slate-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{submission.landSize}</span>
                </div>

                <div className="flex items-center text-slate-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-xs">Submitted on {formatDate(submission.submissionDate)}</span>
                </div>
            </div>
        </motion.div>
    )
}
