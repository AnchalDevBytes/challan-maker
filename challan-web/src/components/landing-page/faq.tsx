"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { motion } from "motion/react";

const FAQ = () => {
  const faqs = [
    {
      value: "item-1",
      question: "Is it really free?",
      answer:
        "Yes! You can generate unlimited invoices as a guest for free. However, they will include a watermark and won't be saved to the cloud.",
    },
    {
      value: "item-2",
      question: "Can I save my invoices?",
      answer:
        "Yes, if you create an account (Pro plan), we save your last 5 invoices so you can edit or redownload them later.",
    },
    {
      value: "item-3",
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard encryption. Your data is stored securely and we never sell your information.",
    },
    {
      value: "item-4",
      question: "Can I add my own logo?",
      answer:
        "Yes, you can upload your company logo to make your invoices look professional.",
    },
  ];

  return (
    <section id="faq" className="py-28 md:py-40 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-bold uppercase tracking-widest text-blue mb-4 text-center"
        >
          ✦ Got Questions
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl md:text-4xl font-medium font-source-serif text-neutral-900 mb-4 text-center tracking-[-0.03em] leading-[1.15]"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm md:text-base text-neutral-500 text-center mb-12 md:mb-16 font-figtree"
        >
          Everything you need to know before getting started.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden"
        >
          <Accordion type="single" collapsible defaultValue="item-1">
            {faqs.map((item, i) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="px-7 border-neutral-100 last:border-0"
              >
                <AccordionTrigger className="text-neutral-900 font-medium text-base py-5 hover:text-blue hover:no-underline transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-500 text-sm leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
