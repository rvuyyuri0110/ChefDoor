import { ChefHat } from "lucide-react";

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer className="bg-emerald-900 text-white mt-auto py-12 px-6 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-emerald-50">ChefDoor</span>
          </div>
          <p className="text-emerald-100/70 text-sm leading-relaxed max-w-sm">
            Bringing elite professional culinary experiences right to your family's doorstep. Easy, safe, clean, and extremely tasty!
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-emerald-200 text-sm mb-4 uppercase tracking-wider">Useful Pages</h3>
          <ul className="space-y-2.5 text-sm text-emerald-100/80">
            <li>
              <button onClick={() => setPage("home")} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setPage("browse")} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                Browse Chefs
              </button>
            </li>
            <li>
              <button onClick={() => setPage("about")} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                About Us & FAQ
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-emerald-200 text-sm mb-4 uppercase tracking-wider">Designed For All</h3>
          <p className="text-emerald-100/70 text-sm mb-4">
            ChefDoor is formatted with ultra-clean wording, child-friendly colors, and accessible workflows designed for 4th graders and families.
          </p>
          <div className="text-[11px] text-emerald-300/60 font-mono">
            © 2026 ChefDoor Platforms Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
