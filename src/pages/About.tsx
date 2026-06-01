export default function About() {
  const faqs = [
    {
      q: "Is ChefDoor certified for safety and quality compliance?",
      a: "Yes, fully! All culinary professionals pass national background screenings, verification of hospitality certifications, and adhere strictly to professional food safety regulations."
    },
    {
      q: "What ingredients do I need to prepare in advance?",
      a: "It is seamless! When a partner chef accepts your reservation, they will coordinate directly via the portal. You can supply basic pantry staples or request raw premium organic grocery lists."
    },
    {
      q: "Who manages the post-cooking workstation sanitation?",
      a: "The Chef handles it completely! Part of our high-quality workplace compliance is leaving your culinary station fully sanitized, swept, and sparkly clean."
    },
    {
      q: "How does Mock Payment work inside the system?",
      a: "ChefDoor is currently a high-fidelity demonstration sandbox. You can select Cash or simulated instant mobile UPI transfers (such as GPay/PhonePe) at checkout to practice."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-screen space-y-16">
      
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">About ChefDoor Platforms</h1>
        <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Connecting professional private culinary executives to your residence</p>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed pt-2">
          ChefDoor represents the premium standard in in-home dining integrations. We provide elite private chef partner matchmaking to guarantee strict hygiene, custom diet planning, and exquisite kitchen craft in major Indian metros.
        </p>
      </div>

      {/* Grid of values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-3.5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded w-max uppercase tracking-wider">
            Safety First
          </div>
          <h3 className="text-base font-bold text-slate-800">Compliance & Screening</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All registered partner chefs undergo comprehensive identity screenings and background verification, alongside regular double-sanitation training.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-3.5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded w-max uppercase tracking-wider">
            Sourcing
          </div>
          <h3 className="text-base font-bold text-slate-800">Elite Ingredients</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our culinary experts cook with client-approved organic, low-refined, and preservative-free ingredients to deliver exquisite dietary results.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-3.5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded w-max uppercase tracking-wider">
            Education
          </div>
          <h3 className="text-base font-bold text-slate-800">Collaborative Masterclasses</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Not just eating—interact! You are welcome to observe the chefs at your convenience to appreciate fine techniques or custom hand-crafted recipes.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-3.5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded w-max uppercase tracking-wider">
            Support
          </div>
          <h3 className="text-base font-bold text-slate-800">Concierge Assistance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our concierge agents are standing by to monitor safety feedback and coordinate priority scheduling 24/7.
          </p>
        </div>
      </div>

      {/* FAQs list accordion representation */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 text-center font-display">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl space-y-2.5 shadow-2xs">
              <h4 className="text-xs font-bold text-emerald-805">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Contact Callout */}
      <div className="bg-emerald-50 border border-emerald-100/50 rounded-4xl p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800 font-display">Need Immediate Helpline Support?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Our partner help desk is available for standard coordination at support@chefdoor.in at any time.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-white border border-slate-100 rounded-xl px-4.5 py-2.5 shadow-2xs">
          <span>Customer Support Hotline: team@chefdoor.in (MOCK)</span>
        </div>
      </div>
    </div>
  );
}
