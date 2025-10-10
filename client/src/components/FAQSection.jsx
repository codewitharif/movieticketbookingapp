import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useMovieStore from "../store/useMovieStore";

export default function FAQSection() {
  const { theme } = useMovieStore();
  const isDark = theme === "dark";
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book tickets on IndieShows?",
      answer: "Simply browse through our 'Now Showing' section, select your preferred movie, choose a showtime, select your seats, and proceed to payment. You'll receive a confirmation email with your e-tickets instantly."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking up to 2 hours before the showtime. Go to 'My Bookings' section, select your booking, and choose the cancel or modify option. Refunds will be processed within 5-7 business days."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets. All transactions are secured with industry-standard encryption."
    },
    {
      question: "Do you offer any discounts or loyalty programs?",
      answer: "Yes! We offer special discounts for students, seniors, and groups. Our IndieShows Rewards program lets you earn points on every booking that can be redeemed for free tickets and concessions."
    },
    {
      question: "How early should I arrive at the cinema?",
      answer: "We recommend arriving at least 15-20 minutes before showtime to collect your tickets, grab snacks, and find your seats comfortably. Gates typically open 20 minutes before the show."
    },
    {
      question: "Are food and beverages allowed inside the theater?",
      answer: "Outside food and beverages are not permitted. However, we have a wide variety of snacks, meals, and drinks available at our concession stands that you can enjoy during the movie."
    },
    {
      question: "What is your refund policy?",
      answer: "Full refunds are available for cancellations made at least 2 hours before showtime. A nominal convenience fee may be deducted. No refunds are issued for no-shows or cancellations made within 2 hours of showtime."
    },
    {
      question: "Do you have wheelchair accessibility?",
      answer: "Yes, all our partner theaters are wheelchair accessible with designated seating areas, ramps, and accessible restrooms. Please contact our support team when booking for assistance with special seating arrangements."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-16 ${
      isDark 
        ? "bg-gradient-to-b from-slate-900 to-slate-800" 
        : "bg-gradient-to-b from-slate-100 to-white"
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className={`text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Frequently Asked Questions
          </h3>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Got questions? We've got answers to help make your movie experience seamless
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden transition-all duration-200 ${
                isDark
                  ? "bg-slate-800 border border-slate-700"
                  : "bg-white border border-slate-200"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "hover:bg-slate-700"
                    : "hover:bg-slate-50"
                }`}
              >
                <span className={`font-semibold text-lg pr-8 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className={`w-5 h-5 flex-shrink-0 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`} />
                )}
              </button>
              
              <div
                className={`transition-all duration-200 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className={`px-6 pb-4 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center p-6 rounded-lg ${
          isDark
            ? "bg-slate-800 border border-slate-700"
            : "bg-slate-50 border border-slate-200"
        }`}>
          <p className={`text-lg mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Still have questions?
          </p>
          <p className={`mb-4 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Our support team is here to help you
          </p>
          <button className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isDark
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}>
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
