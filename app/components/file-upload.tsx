"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import Image from "next/image"

type FileUploadProps = {
    file: File | null
    setFile: (file: File | null) => void
}

export default function FileUpload({ file, setFile }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            if (validateFile(droppedFile)) {
                setFile(droppedFile)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (validateFile(selectedFile)) {
                setFile(selectedFile)
            }
        }
    }

    const validateFile = (file: File) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
        if (!validTypes.includes(file.type)) {
            alert("Please upload a PDF or image file")
            return false
        }
        return true
    }

    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const removeFile = () => {
        setFile(null)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const isPDF = file && file.type === "application/pdf"
    const isImage = file && file.type.startsWith("image/")

    return (
        <div className="w-full">
            <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={handleChange} className="hidden" />

            <AnimatePresence>
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-2 border-dashed rounded-lg p-6 ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300"
                            }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div onClick={onButtonClick} className="flex flex-col items-center justify-center cursor-pointer">
                            <Upload className="h-10 w-10 text-slate-400 mb-2" />
                            <p className="text-sm font-medium text-slate-700">Drag & drop a file here, or click to select</p>
                            <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG, GIF (max 10MB)</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border rounded-lg p-4 bg-slate-50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {isPDF ? (
                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-red-600" />
                                    </div>
                                ) : isImage ? (
                                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {file && URL.createObjectURL(file) && (
                                            <Image
                                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                                alt="Preview"
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-slate-600" />
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={removeFile}
                                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-200"
                            >
                                <X className="h-4 w-4 text-slate-500" />
                                <span className="sr-only">Remove file</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
