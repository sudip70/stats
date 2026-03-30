import { motion } from 'framer-motion';
import { FiX, FiGithub, FiLinkedin, FiGlobe, FiMail } from 'react-icons/fi';

interface Developer {
  name: string;
  role: string;
  bio: string;
  accentColor: string;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    email?: string;
  };
}

const DEVELOPERS: Developer[] = [
  {
    name: 'Animesh Basnet',
    role: 'AI & ML Researcher',
    bio: 'I am a programmer specializing in building (and occasionally designing). Currently, I\'m focused on researching and developing Machine Learning and Large Language Models.',
    accentColor: '#22c55e',
    links: {
      github: 'https://github.com/crypticsy',
      linkedin: 'https://linkedin.com/in/animeshbasnet/',
      portfolio: 'https://animeshbasnet.com.np',
      email: 'contact@animeshbasnet.com.np',
    },
  },
  {
    name: 'Sudip Shrestha',
    role: 'Data Analyst & AI Engineer',
    bio: 'I am a data enthusiast with a background in engineering and a passion for transforming complex datasets into compelling visual stories. I am learning and building ML models.',
    accentColor: '#38bdf8',
    links: {
      github: 'https://github.com/sudip70',
      linkedin: 'https://linkedin.com/in/sudipshrestha-58/',
      portfolio: 'https://sudip70.github.io',
      email: 'sudipshrestha.ca@gmail.com',
    },
  },
];

const LINK_META = [
  { key: 'github',    Icon: FiGithub,   label: 'GitHub' },
  { key: 'linkedin',  Icon: FiLinkedin, label: 'LinkedIn' },
  { key: 'portfolio', Icon: FiGlobe,    label: 'Portfolio' },
  { key: 'email',     Icon: FiMail,     label: 'Mail' },
] as const;

interface Props {
  onClose: () => void;
}

export function AboutModal({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="relative z-10 w-full max-w-[520px] rounded-2xl border border-white/[0.1] overflow-hidden"
        style={{ background: 'rgba(6,12,20,0.97)', backdropFilter: 'blur(24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="font-mono text-[9px] tracking-[3px] text-slate-100/40 uppercase mb-1">
              The Team
            </div>
            <div className="font-display text-[17px] font-bold text-slate-100">
              About the Developers
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-100/50 hover:bg-white/[0.07] hover:text-slate-100/80 transition-colors cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Developer cards */}
        <div className="grid grid-cols-2 divide-x divide-white/[0.07]">
          {DEVELOPERS.map((dev) => (
            <div key={dev.name} className="px-5 py-6 flex flex-col gap-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <img
                  src={`${dev.links.github}.png?size=112`}
                  alt={dev.name}
                  className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
                  style={{
                    border: `1.5px solid ${dev.accentColor}33`,
                    boxShadow: `0 0 16px ${dev.accentColor}18`,
                  }}
                />
                <div>
                  <div
                    className="font-display text-[15px] font-bold leading-tight"
                    style={{ color: dev.accentColor }}
                  >
                    {dev.name}
                  </div>
                  <div className="font-mono text-[9px] tracking-[1px] text-slate-100/45 mt-[3px]">
                    {dev.role}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="font-display text-[12px] text-slate-100/60 leading-relaxed flex-1">
                {dev.bio}
              </p>

              {/* Links */}
              <div className="grid grid-cols-2 gap-1.5">
                {LINK_META.map(({ key, Icon, label }) => {
                  const href = key === 'email'
                    ? `mailto:${dev.links[key]}`
                    : dev.links[key as keyof typeof dev.links];
                  if (!href) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target={key === 'email' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="flex items-center gap-[6px] px-2.5 py-2 rounded-lg border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.13] transition-all duration-150 group"
                    >
                      <Icon
                        size={11}
                        className="flex-shrink-0 transition-colors"
                        style={{ color: dev.accentColor }}
                      />
                      <span className="font-mono text-[9px] tracking-[0.5px] text-slate-100/55 group-hover:text-slate-100/80 transition-colors">
                        {label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.07] flex items-center gap-2">
          <span className="font-mono text-[9px] tracking-[1.5px] text-slate-100/35">
            Built with React, Three.js & Our World in Data.
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
