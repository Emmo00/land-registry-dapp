"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const faqs = [
  {
    question: "How does blockchain verify land ownership?",
    answer:
      "Blockchain creates an immutable record of land ownership by storing verified property data in a decentralized ledger. Each transaction is cryptographically secured and linked to previous records, creating a tamper-proof chain of ownership history.",
  },
  {
    question: "Is blockchain land verification legally binding?",
    answer:
      "While blockchain records provide strong evidence of ownership, their legal status varies by jurisdiction. Many regions are adopting legislation to recognize blockchain-verified records. We work with local authorities to ensure compliance with legal requirements.",
  },
  {
    question: "How long does the verification process take?",
    answer:
      "Initial verification typically takes 1-3 business days as we validate documents against official records. Once verified, all subsequent checks or transfers can be completed within minutes on the blockchain.",
  },
  {
    question: "What documents do I need to register my land?",
    answer:
      "You'll need your government-issued ID, current land title/deed, property survey, and proof of payment for any previous transactions. Additional documents may be required based on your local jurisdiction.",
  },
  {
    question: "How secure is the blockchain verification system?",
    answer:
      "Our system uses advanced cryptographic techniques and a distributed ledger that makes tampering virtually impossible. Multiple nodes must verify any change, and all historical records remain permanently accessible and unchanged.",
  },
]

export default function FaqSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="w-full py-20 px-4 bg-slate-50" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our blockchain land verification system.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-black">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-slate-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
