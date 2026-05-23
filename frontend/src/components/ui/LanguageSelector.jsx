import { Languages, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useRef, useEffect } from "react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLang(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' }
  ];

  const currentLabel = languages.find(l => l.code === language)?.label || 'Español';

  return (
    <div className="relative" ref={langRef}>
      <button 
        onClick={() => setShowLang(!showLang)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group min-w-[110px]"
      >
        <Languages size={14} className="text-[#14ff72] group-hover:scale-110 transition-transform"/>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
          {currentLabel}
        </span>
        <ChevronDown size={12} className={`text-white/40 ml-auto transition-transform ${showLang ? 'rotate-180' : ''}`}/>
      </button>

      {showLang && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-[#07090E] border border-white/10 py-1 z-50 animate-in fade-in slide-in-from-top-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden">
          {languages.map((lang) => (
            <button 
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setShowLang(false); }}
              className={`w-full px-4 py-2 text-left text-[10px] uppercase tracking-widest hover:bg-[#14ff72]/10 transition-colors ${language === lang.code ? 'text-[#14ff72] bg-[#14ff72]/5' : 'text-white/60'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
