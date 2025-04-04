"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
    return (
        <motion.section
            className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container max-w-4xl mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Secure Land Ownership Verification
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl mb-12 text-slate-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Blockchain-powered verification system that ensures transparent, tamper-proof records of land ownership.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-500 transition-colors">
                            Check Land Ownership
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 border-2 text-white hover:bg-white/10 transition-colors"
                        >
                            Register Land Ownership
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}
