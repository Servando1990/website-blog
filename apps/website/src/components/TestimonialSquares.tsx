const testimonials = [
  {
    text: "Servando helped our team at Orange transform complex datasets into actionable business insights that directly informed our strategic decisions and enhanced operational efficiency. His proactive approach to identifying improvement areas and implementing AI solutions consistently delivered measurable value to stakeholders.",
    authorName: "Pedro San Inocencio",
    position: "Director",
    companyName: "Orange"
  },
  {
    text: "Servando developed from scratch a  AI-matching solution that formed the core of our data processing capabilities, demonstrating strong technical skills and a structured approach that directly contributed to project success. The solutions lead to 70%+ reduction in duplicates and +1 FTE worth of manual effort eliminated.",
    authorName: "Kamil Kapturkiewicz", 
    position: "Founder",
    companyName: "Databris"
  },
  {
    text: "Servando helped improved our lending algorithms and helped us find high impact issues in our fraud system. His contributions delivered high-impact results that made a real difference to our business outcomes.",
    authorName: "Francisco Llaneza",
    position: "Principal Data Scientist",
    companyName: "Fintonic"
  }
];

export default function TestimonialSquares() {
  return (
    <section className="py-16 px-6" id="testimonial-squares">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          {/* Aligned with Midday's section title pattern */}
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium mb-4 text-black dark:text-white">Testimonials</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                — {testimonial.authorName}, {testimonial.position} at {testimonial.companyName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 