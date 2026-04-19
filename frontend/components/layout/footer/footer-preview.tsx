/**
 * Footer Preview - Standalone Demo Component
 * 
 * Use this to preview the footer independently:
 * 
 * ```tsx
 * import FooterPreview from '@/components/layout/footer/footer-preview';
 * 
 * export default function DemoPage() {
 *   return <FooterPreview />;
 * }
 * ```
 */

'use client';

import Footer from '../footer';

export default function FooterPreview() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-black">
      {/* Demo content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            NextStepZ Footer Preview
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A premium, modern footer component built with React, Tailwind CSS, and Framer Motion.
            Scroll down to see the footer in action.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Demo section info */}
        <div className="text-center text-white/60 mb-10">
          <p className="text-sm">Scroll down to see the footer component below...</p>
        </div>
      </div>

      {/* Footer - The actual component */}
      <Footer />
    </div>
  );
}

const features = [
  {
    icon: '🎨',
    title: 'Premium Design',
    description: 'Modern dark theme with glass morphism effects and smooth gradients.',
  },
  {
    icon: '⚡',
    title: 'Smooth Animations',
    description: 'GPU-accelerated animations using Framer Motion with spring physics.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    description: 'Optimized layouts for mobile, tablet, and desktop screens.',
  },
  {
    icon: '🔗',
    title: 'Social Integration',
    description: 'Built-in social media icons with hover effects and tooltips.',
  },
  {
    icon: '📧',
    title: 'Newsletter Ready',
    description: 'Email subscription form with validation and state management.',
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'WCAG compliant with ARIA labels and keyboard navigation support.',
  },
];

const stats = [
  { value: '6', label: 'Components' },
  { value: '12', label: 'Links' },
  { value: '4', label: 'Social Platforms' },
  { value: '60fps', label: 'Animation FPS' },
];
