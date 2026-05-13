import { useEffect, useRef, useState } from 'react';
import { sendContact } from '@/lib/api';
import { profile } from '@/data/profile';

type Line =
  | { kind: 'out'; text: string }
  | { kind: 'in'; text: string }
  | { kind: 'sys'; text: string };

type Stage = 'idle' | 'name' | 'email' | 'message' | 'sending' | 'sent';

const ROCKET = [
  '          /\\',
  '         /  \\',
  '        |srv|',
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
    { kind: 'sys', text: 'srv@portfolio — last login: just now' },
    { kind: 'sys', text: 'type "help" to see commands, or "hire" to send a message.' },
  ]);
  const [stage, setStage] = useState<Stage>('idle');
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState({ name: '', email: '', message: '' });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (kind: Line['kind'], text: string) =>
    setLines((l) => [...l, { kind, text }]);

  const prompt = () => {
    switch (stage) {
      case 'name': return 'name >';
      case 'email': return 'email >';
      case 'message': return 'message >';
      default: return 'srv@portfolio:~$';
    }
  };

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

      try {
        const res = await sendContact(payload);
        setTimeout(() => {
          if (res.ok) {
            print('sys', '✓ message received. shreyas will respond shortly.');
          } else {
            print('sys', '✗ send failed. email shreyasvisweshwaran@gmail.com directly.');
          }
          setStage('sent');
        }, 60 * ROCKET.length + 300);
      } catch {
        setTimeout(() => {
          print('sys', '✗ network error. email shreyasvisweshwaran@gmail.com directly.');
          setStage('sent');
        }, 60 * ROCKET.length + 300);
      }
      return;
    }

    // idle / generic commands
    if (cmd === 'help') {
      print('out', 'commands: hire, whoami, links, clear, sudo hire me');
      return;
    }
    if (cmd === 'whoami') {
      print('out', `${profile.name} — ${profile.tagline}`);
      print('out', `${profile.location} · ${profile.phone}`);
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
      print('out', '   ███████╗██████╗ ██╗   ██╗');
      print('out', '   ██╔════╝██╔══██╗██║   ██║');
      print('out', '   ███████╗██████╔╝██║   ██║');
      print('out', '   ╚════██║██╔══██╗╚██╗ ██╔╝');
      print('out', '   ███████║██║  ██║ ╚████╔╝ ');
      print('out', '   ╚══════╝╚═╝  ╚═╝  ╚═══╝  ');
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
      id="contact"
      className="section relative bg-[#050507] py-20 xs:py-24 sm:py-28 md:py-32 px-4 xs:px-6 md:px-12 flex items-center justify-center"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-3xl w-full">
        <div className="mb-6 xs:mb-8">
          <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.3em] xs:tracking-[0.4em] sm:tracking-[0.5em] text-bone/50 uppercase">
            05 / contact
          </div>
          <h2 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold text-bone mt-2 leading-none">
            terminal.
          </h2>
          <p className="font-mono text-[10px] xs:text-xs sm:text-xs text-bone/40 mt-3 max-w-md leading-relaxed">
            type <span className="text-wolf-red">hire</span> to send a message. <span className="text-gs-blue">sudo hire me</span> for easter egg.
          </p>
        </div>

        <div className="scanlines crt bg-black border border-bone/15 shadow-[0_0_80px_rgba(34,255,99,0.08)]">
          <div className="flex items-center gap-2 px-3 xs:px-4 py-2 border-b border-bone/10 bg-gs-slate/50">
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-wolf-red" />
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-gs-blue" />
            <span className="w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-bone/40" />
            <span className="ml-2 font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] xs:tracking-[0.3em] uppercase text-bone/50">
              srv@portfolio — zsh
            </span>
          </div>
          <div
            ref={scrollRef}
            className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[420px] overflow-y-auto p-3 xs:p-4 sm:p-5 font-mono text-xs xs:text-sm leading-relaxed"
            style={{ color: '#9ef58c' }}
          >
            {lines.map((l, i) => (
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
            ))}

            {stage !== 'sent' && (
              <form onSubmit={submit} className="flex items-center gap-2 mt-1">
                <span className="text-wolf-red shrink-0">{prompt()}</span>
                <input
                  ref={inputRef}
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={stage === 'sending'}
                  className="flex-1 bg-transparent outline-none border-none text-bone caret-wolf-red font-mono"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 xs:mt-8 flex flex-wrap gap-4 xs:gap-6 font-mono text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] text-bone/60 uppercase">
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

        <div className="mt-16 pt-6 border-t border-bone/10 flex items-baseline justify-between font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase">
          <span>© 2026 — shreyas visweshwaran</span>
          <span>built with rage, react & three.js</span>
        </div>
      </div>
    </section>
  );
}
