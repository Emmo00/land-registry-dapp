"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Database, FileCheck, Lock, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const benefits = [
    {
        title: "Immutable Records",
        description: "Once verified, land ownership records cannot be altered or tampered with.",
        icon: <Lock className="h-10 w-10 text-emerald-500" />,
    },
    {
        title: "Transparent History",
        description: "View the complete history of ownership transfers with full transparency.",
        icon: <Database className="h-10 w-10 text-emerald-500" />,
    },
    {
        title: "Instant Verification",
        description: "Verify land ownership status in seconds rather than days or weeks.",
        icon: <CheckCircle className="h-10 w-10 text-emerald-500" />,
    },
    {
        title: "Fraud Prevention",
        description: "Eliminate fraudulent claims with cryptographic proof of ownership.",
        icon: <Shield className="h-10 w-10 text-emerald-500" />,
    },
    {
        title: "Legal Compliance",
        description: "All records comply with legal requirements and can be used in court.",
        icon: <FileCheck className="h-10 w-10 text-emerald-500" />,
    },
]

export default function BenefitsSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    }

    return (
        <section className="w-full py-20 px-4 bg-white" ref={ref}>
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Blockchain-Based Verification Benefits</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Our platform leverages blockchain technology to provide secure, transparent, and efficient land ownership
                        verification.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                >
                    {benefits.map((benefit, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mb-2">{benefit.icon}</div>
                                    <CardTitle>{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
