"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Wallet, Key, ShieldCheck } from "lucide-react"

// Mock function to simulate wallet connection
const connectWallet = async (): Promise<{ address: string; success: boolean }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate successful connection 90% of the time
    if (Math.random() > 0.1) {
        // Generate a random Ethereum address
        const address = "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")
        return { address, success: true }
    }

    return { address: "", success: false }
}

// Mock function to check if wallet has admin privileges
const checkAdminPrivileges = async (address: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, let's say addresses starting with 0x0 are admins
    return address.startsWith("0x0")
}

// Mock function to validate private key
const validatePrivateKey = async (privateKey: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, let's say a private key is valid if it's 64 characters long
    // and contains only hexadecimal characters
    const isValidFormat = /^[0-9a-fA-F]{64}$/.test(privateKey)

    return isValidFormat
}

export default function LoginPage() {
    const router = useRouter()
    const [walletAddress, setWalletAddress] = useState<string>("")
    const [isConnecting, setIsConnecting] = useState<boolean>(false)
    const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [showPrivateKeyInput, setShowPrivateKeyInput] = useState<boolean>(false)
    const [privateKey, setPrivateKey] = useState<string>("")
    const [isValidatingKey, setIsValidatingKey] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [privateKeyError, setPrivateKeyError] = useState<boolean>(false)

    const handleWalletConnect = async () => {
        setError(null)
        setIsConnecting(true)

        try {
            const { address, success } = await connectWallet()

            if (success) {
                setWalletAddress(address)
                setIsConnecting(false)
                setIsCheckingAdmin(true)

                // Check if wallet has admin privileges
                const hasAdminPrivileges = await checkAdminPrivileges(address)
                setIsAdmin(hasAdminPrivileges)
                setIsCheckingAdmin(false)

                if (hasAdminPrivileges) {
                    // Redirect to dashboard if admin
                    setTimeout(() => router.push("/dashboard"), 1000)
                } else {
                    // Show private key input if not admin
                    setShowPrivateKeyInput(true)
                }
            } else {
                throw new Error("Failed to connect wallet")
            }
        } catch (err) {
            setError("Failed to connect wallet. Please try again.")
            setIsConnecting(false)
        }
    }

    const handlePrivateKeySubmit = async () => {
        setPrivateKeyError(false)
        setError(null)
        setIsValidatingKey(true)

        try {
            const isValid = await validatePrivateKey(privateKey)

            if (isValid) {
                // Redirect to dashboard if private key is valid
                setTimeout(() => router.push("/dashboard"), 1000)
            } else {
                setPrivateKeyError(true)
                setError("Invalid private key. Please try again.")
            }
        } catch (err) {
            setPrivateKeyError(true)
            setError("Failed to validate private key. Please try again.")
        } finally {
            setIsValidatingKey(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-slate-200 shadow-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Land Verification Login</CardTitle>
                        <CardDescription className="text-center">
                            Connect your wallet or use your private key to access the system
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Wallet Connection Section */}
                        <div className="space-y-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleWalletConnect}
                                    disabled={isConnecting || isCheckingAdmin || isAdmin === true}
                                    className="w-full py-6 h-auto text-lg bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-lg hover:shadow-emerald-200/50 transition-all"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Connecting Wallet...
                                        </>
                                    ) : isCheckingAdmin ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Verifying Access...
                                        </>
                                    ) : isAdmin === true ? (
                                        <>
                                            <ShieldCheck className="mr-2 h-5 w-5" />
                                            Access Granted! Redirecting...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="mr-2 h-5 w-5" />
                                            Login with Wallet
                                        </>
                                    )}
                                </Button>
                            </motion.div>

                            {walletAddress && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-center text-slate-500"
                                >
                                    Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                </motion.p>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant="destructive" className="border-red-300 bg-red-50">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </div>

                        {/* Private Key Section */}
                        <AnimatePresence>
                            {showPrivateKeyInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4 pt-4 border-t border-slate-200"
                                >
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">
                                            This wallet doesn't have admin privileges.
                                            <br />
                                            Please authenticate with your private key.
                                        </p>
                                    </div>

                                    <motion.div
                                        className="space-y-2"
                                        animate={privateKeyError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Label htmlFor="privateKey">Government Official Private Key</Label>
                                        <div className="relative">
                                            <Input
                                                id="privateKey"
                                                type="password"
                                                placeholder="Enter your private key"
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                className={`pl-10 ${privateKeyError ? "border-red-500" : ""}`}
                                            />
                                            <Key className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                        </div>
                                        {privateKeyError && <p className="text-sm text-red-500">Invalid private key format</p>}
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            onClick={handlePrivateKeySubmit}
                                            disabled={isValidatingKey || !privateKey}
                                            className="w-full py-5 h-auto bg-slate-800 hover:bg-slate-700 shadow-md"
                                        >
                                            {isValidatingKey ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Validating...
                                                </>
                                            ) : (
                                                <>
                                                    <Key className="mr-2 h-4 w-4" />
                                                    Login with Private Key
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-center w-full text-xs text-slate-500">
                            <p>Secure blockchain-based authentication</p>
                            <p className="mt-1">
                                Need help?{" "}
                                <a href="#" className="text-emerald-600 hover:underline">
                                    Contact support
                                </a>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
