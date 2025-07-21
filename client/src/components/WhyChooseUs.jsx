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
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-semibold text-white mb-4">Premium Comfort</h4>
            <p className="text-slate-400 leading-relaxed">
              Enjoy our luxury recliner seats with extra legroom, personal side tables, and premium sound systems for the ultimate comfort experience.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-semibold text-white mb-4">Easy Booking</h4>
            <p className="text-slate-400 leading-relaxed">
              Book your tickets instantly through our intuitive interface with secure payment options and real-time seat selection.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-semibold text-white mb-4">Prime Locations</h4>
            <p className="text-slate-400 leading-relaxed">
              Find us in convenient locations across the city with ample parking, easy public transport access, and nearby dining options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}