import { useEffect, useRef, useState } from 'react';
import { contactMailto, sendContact } from '@/lib/api';
import { profile } from '@/data/profile';

type Line =
  | { kind: 'out'; text: string }
  | { kind: 'in'; text: string }
  | { kind: 'sys'; text: string }
  | { kind: 'link'; text: string; href: string };

type Stage = 'idle' | 'name' | 'email' | 'message' | 'sending';

const ROCKET = [
  '          /\\',
  '         /  \\',
  '        |   |',
  '        |   |',
  '        | / \\',
  '        |/   \\',
  '       /|     |\\',
  '      / |_____| \\',
  '         /|\\',
  '        / | \\',
  '       *  |  *',
  '          *',
];

export function Contact() {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'sys', text: 'shreyas@visweshwaran, last login: just now' },
    { kind: 'sys', text: 'type "help" to see commands, or "hire" to send a message.' },
  ]);
  const [stage, setStage] = useState<Stage>('idle');
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState({ name: '', email: '', message: '' });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // autoFocus here would yank the page to the bottom on load, so take focus only
  // once the terminal is actually on screen — otherwise typed commands go nowhere.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // On a phone, taking focus pops the keyboard up mid-scroll. Let touch users tap in.
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const active = document.activeElement;
        if (active && active !== document.body) return;
        inputRef.current?.focus({ preventScroll: true });
      },
      { threshold: 0.5 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (kind: 'out' | 'in' | 'sys', text: string) =>
    setLines((l) => [...l, { kind, text }]);

  const printLink = (text: string, href: string) =>
    setLines((l) => [...l, { kind: 'link', text, href }]);

  const prompt = () => {
    switch (stage) {
      case 'name': return 'name >';
      case 'email': return 'email >';
      case 'message': return 'message >';
      default: return 'shreyas@visweshwaran:~$';
    }
  };

  // The full prompt eats the whole row on a phone, leaving no room to type.
  const shortPrompt = () => (stage === 'idle' || stage === 'sending' ? '~$' : prompt());

  const handleCommand = async (raw: string) => {
    const cmd = raw.trim();
    print('in', `${prompt()} ${raw}`);

    if (stage === 'name') {
      setDraft((d) => ({ ...d, name: cmd }));
      print('out', `noted: ${cmd}`);
      setStage('email');
      return;
    }
    if (stage === 'email') {
      if (!/.+@.+\..+/.test(cmd)) {
        print('out', 'that doesn’t look like an email. try again.');
        return;
      }
      setDraft((d) => ({ ...d, email: cmd }));
      print('out', 'good. now the message:');
      setStage('message');
      return;
    }
    if (stage === 'message') {
      const payload = { ...draft, message: cmd };
      setStage('sending');
      print('out', 'compiling payload…');
      print('out', 'launching rocket…');
      ROCKET.forEach((row, i) => setTimeout(() => print('out', row), 60 * i));

      const res = await sendContact(payload);
      setTimeout(() => {
        if (res.ok) {
          print('sys', '✓ message sent. shreyas will respond shortly.');
        } else {
          print('sys', `✗ send failed${res.detail ? ` (${res.detail})` : ''}.`);
          printLink('▸ click here to send it from your own mail app instead', contactMailto(payload));
        }
        setDraft({ name: '', email: '', message: '' });
        setStage('idle');
      }, 60 * ROCKET.length + 300);
      return;
    }

    // idle / generic commands
    if (cmd === 'help') {
      print('out', 'commands: hire, whoami, links, clear, sudo hire me');
      return;
    }
    if (cmd === 'whoami') {
      print('out', `${profile.name} // ${profile.tagline}`);
      print('out', `${profile.location} // ${profile.phone}`);
      print('out', `${profile.email}`);
      return;
    }
    if (cmd === 'links') {
      profile.socials.forEach((s) => print('out', `▸ ${s.label.padEnd(10)} ${s.href}`));
      return;
    }
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    if (cmd.toLowerCase() === 'sudo hire me') {
      print('sys', '🐺 elevated privileges granted.');
      print('out', '');
      print('out', ' ███████╗██╗  ██╗██████╗ ███████╗██╗   ██╗ █████╗ ███████╗');
      print('out', ' ██╔════╝██║  ██║██╔══██╗██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝');
      print('out', ' ███████╗███████║██████╔╝█████╗   ╚████╔╝ ███████║███████╗');
      print('out', ' ╚════██║██╔══██║██╔══██╗██╔══╝    ╚██╔╝  ██╔══██║╚════██║');
      print('out', ' ███████║██║  ██║██║  ██║███████╗   ██║   ██║  ██║███████║');
      print('out', ' ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝');
      print('out', '');
      print('out', 'now go on. type "hire" properly.');
      return;
    }
    if (cmd === 'hire' || cmd === 'contact') {
      print('out', 'opening contact channel. who are you?');
      setStage('name');
      return;
    }
    if (cmd === '') return;
    print('out', `command not found: ${cmd}. type "help".`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stage === 'sending') return;
    const val = input;
    setInput('');
    handleCommand(val);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section relative bg-[#050507] py-20 xs:py-24 sm:py-28 md:py-32 px-4 xs:px-6 md:px-12 flex items-center justify-center"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="max-w-3xl w-full">
        <div className="mb-6 xs:mb-8">
          <div className="font-mono text-[10px] xs:text-[11px] sm:text-[12px] tracking-[0.3em] xs:tracking-[0.4em] sm:tracking-[0.5em] text-bone/50 uppercase">
            05 / contact
          </div>
          <h2 className="font-display text-[clamp(1.5rem,12vw,3rem)] sm:text-6xl md:text-7xl font-extrabold text-bone mt-2 leading-none">
            terminal.
          </h2>
          <p className="font-mono text-[12px] xs:text-sm sm:text-sm text-bone/40 mt-3 max-w-md leading-relaxed">
            type <span className="text-wolf-red">hire</span> to send a message. <span className="text-gs-blue">sudo hire me</span> for easter egg.
          </p>
        </div>

        <div className="scanlines crt bg-black border border-bone/15 shadow-[0_0_80px_rgba(34,255,99,0.08)]">
          <div className="flex items-center gap-2 px-3 xs:px-4 py-2 border-b border-bone/10 bg-gs-slate/50">
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-wolf-red" />
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-gs-blue" />
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-bone/40" />
            <span className="ml-2 font-mono text-[10px] xs:text-[11px] sm:text-[12px] tracking-[0.2em] xs:tracking-[0.3em] uppercase text-bone/50">
              shreyas@visweshwaran // zsh
            </span>
          </div>
          <div
            ref={scrollRef}
            className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[420px] overflow-y-auto p-3 xs:p-4 sm:p-5 font-mono text-sm xs:text-sm leading-relaxed"
            style={{ color: '#9ef58c' }}
          >
            {lines.map((l, i) =>
              l.kind === 'link' ? (
                <a
                  key={i}
                  href={l.href}
                  className="block text-wolf-red underline underline-offset-4 hover:text-bone"
                  data-cursor="hover"
                >
                  {l.text}
                </a>
              ) : (
                <div
                  key={i}
                  className={
                    l.kind === 'sys'
                      ? 'text-gs-blue'
                      : l.kind === 'in'
                      ? 'text-bone/80'
                      : 'text-[#9ef58c]'
                  }
                >
                  {l.text || ' '}
                </div>
              )
            )}

            <form onSubmit={submit} className="flex items-center gap-2 mt-1">
              <span className="text-wolf-red shrink-0 sm:hidden">{shortPrompt()}</span>
              <span className="text-wolf-red shrink-0 hidden sm:inline">{prompt()}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={stage === 'sending'}
                className="flex-1 bg-transparent outline-none border-none text-bone caret-wolf-red font-mono text-[16px] sm:text-sm"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </div>

        <div className="mt-6 xs:mt-8 flex flex-wrap gap-4 xs:gap-6 font-mono text-[11px] xs:text-[12px] sm:text-[13px] tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] text-bone/60 uppercase">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-wolf-red transition-colors"
              data-cursor="hover"
            >
              ▸ {s.label}
            </a>
          ))}
          <a
            href={`tel:${profile.phone.replace(/\s|\(|\)|-/g, '')}`}
            className="hover:text-wolf-red transition-colors"
            data-cursor="hover"
          >
            ▸ {profile.phone}
          </a>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 border-t border-bone/10 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between font-mono text-[9px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] text-bone/40 uppercase">
          <span>© 2026 shreyas visweshwaran</span>
          <span>built with rage, react & three.js</span>
        </div>
      </div>
    </section>
  );
}
