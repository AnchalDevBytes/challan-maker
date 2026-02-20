import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const FAQ = () => {
    const faqs = [
        { 
            value: "item-1",
            question: "Is it really free?", 
            answer: "Yes! You can generate unlimited invoices as a guest for free. However, they will include a watermark and won't be saved to the cloud." 
        },
        { 
            value: "item-2", 
            question: "Can I save my invoices?", 
            answer: "Yes, if you create an account (Pro plan), we save your last 5 invoices so you can edit or redownload them later." 
        },
        { 
            value: "item-3", 
            question: "Is my data secure?", 
            answer: "Absolutely. We use industry-standard encryption. Your data is stored securely and we never sell your information." 
        },
        {
            value: "item-4", 
            question: "Can I add my own logo?", 
            answer: "Yes, you can upload your company logo to make your invoices look professional." 
        },
    ];

  return (
    <section id="faq" className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-medium font-source-serif text-neutral-900 mb-10 md:mb-16 text-center">Frequently Asked Questions</h2>
            <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                className="max-w-4xl"
            >
                {faqs.map((item) => (
                    <AccordionItem key={item.value} value={item.value}>
                        <AccordionTrigger className="text-dark-blue">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-neutral-500">{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
  )
}

export default FAQ;
