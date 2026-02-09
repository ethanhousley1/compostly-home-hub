import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is composting?", a: "Composting is the natural process of recycling organic matter — like food scraps and leaves — into a rich soil amendment called compost." },
  { q: "Can I compost in an apartment?", a: "Absolutely! Vermicomposting (using worms) or bokashi composting are great options for small spaces. Compostly can help you find community drop-off sites too." },
  { q: "How long does composting take?", a: "Depending on the method, composting can take anywhere from 2 weeks (hot composting) to 6 months (cold composting). Turning your pile regularly speeds things up." },
  { q: "Does compost smell bad?", a: "A well-maintained compost pile should smell earthy, not foul. Bad smells usually mean the pile needs more browns (carbon) or better aeration." },
  { q: "What should I NOT compost?", a: "Avoid meat, dairy, oils, pet waste, and diseased plants. These can attract pests or introduce harmful pathogens." },
  { q: "Is Compostly free to use?", a: "Compostly is free for basic features including composting guides, scheduling, and finding community locations. Premium features are coming soon!" },
  { q: "How do I know my compost is ready?", a: "Finished compost is dark, crumbly, and smells like fresh earth. It should no longer resemble the original materials you added." },
];

const FAQ = () => (
  <div className="min-h-screen py-16">
    <div className="container mx-auto max-w-2xl px-4">
      <h1 className="font-display text-4xl font-bold text-center mb-4">Frequently Asked Questions</h1>
      <p className="text-center text-muted-foreground mb-10">Everything you need to know about composting with Compostly.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border bg-card px-4">
            <AccordionTrigger className="font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default FAQ;
