import { Users, Calendar, MapPin } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">Why Choose CinemaVibe?</h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Experience cinema like never before with our premium facilities and services
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-10 h-10 text-white" />,
              title: 'Premium Comfort',
              desc: 'Enjoy our luxury recliner seats with extra legroom, personal side tables, and premium sound systems for the ultimate comfort experience.',
              gradient: 'from-emerald-500 to-cyan-500'
            },
            {
              icon: <Calendar className="w-10 h-10 text-white" />,
              title: 'Easy Booking',
              desc: 'Book your tickets instantly through our intuitive interface with secure payment options and real-time seat selection.',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: <MapPin className="w-10 h-10 text-white" />,
              title: 'Prime Locations',
              desc: 'Find us in convenient locations across the city with ample parking, easy public transport access, and nearby dining options.',
              gradient: 'from-orange-500 to-red-500'
            }
          ].map((card, index) => (
            <div
              key={index}
              className="text-center group bg-slate-700/30 border border-slate-600 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-[1.03]"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:rotate-6`}
              >
                {card.icon}
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">{card.title}</h4>
              <p className="text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
