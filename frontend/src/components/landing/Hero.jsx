import React from 'react';
import { Layers, BarChart2, Shapes, Bell, Play } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Hero = ({ onOpenDemo }) => {
  const { navigateToAuth } = useInventory();

  return (
    <section className="relative overflow-hidden rounded-3xl mx-6 my-6 bg-slate-900 text-white min-h-[440px] flex items-center shadow-2xl">
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-blue-950/60"></div>

      <div className="relative z-10 max-w-3xl px-12 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Master Your Stock with Precision
        </h1>
        <p className="text-lg text-slate-300 mb-8 max-w-xl">
          Manage inventory with ease, efficiency, and clarity using our modern enterprise ERP platform.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigateToAuth('register')}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl shadow-lg transition-all"
          >
            Sign Up as Staff
          </button>
          <button
            onClick={onOpenDemo}
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-base rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-900" /> Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export const FeatureSection = () => {
  const features = [
    {
      icon: Layers,
      title: 'Inventory Tracking',
      description: 'Real-time updates to keep you informed of stock levels automatically.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BarChart2,
      title: 'Smart Reports',
      description: 'Data-driven insights for better decisions and forecasting.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Shapes,
      title: 'Categories',
      description: 'Organized classification for quick access and seamless browsing.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Bell,
      title: 'Stock Alerts',
      description: 'Never run out of essential items again with automated warnings.',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  return (
    <section id="features" className="py-16 px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          Powerful Features for Modern Inventory
        </h2>
        <p className="text-slate-500 font-medium">
          Everything you need to keep your stock organized, tracked, and optimized across all your locations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
