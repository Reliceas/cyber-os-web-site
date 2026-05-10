"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clipboard,
  ExternalLink,
  Github,
  Mail,
  MessageCircle,
  Phone,
  Send,
  UserRoundCheck,
} from "lucide-react";

interface ContactLink {
  label: string;
  value: string;
  description: string;
  href?: string;
  copyValue?: string;
  icon: typeof Github;
  available: boolean;
}

const contacts: ContactLink[] = [
  {
    label: "GitHub",
    value: "@Reliceas",
    description: "Best place to see code and repositories.",
    href: "https://github.com/Reliceas",
    icon: Github,
    available: true,
  },
  {
    label: "Repository",
    value: "cyber-os-web-site",
    description: "Open this website repository on GitHub.",
    href: "https://github.com/Reliceas/cyber-os-web-site",
    icon: ExternalLink,
    available: true,
  },
  {
    label: "Telegram",
    value: "@baldikchmochi",
    description: "Fastest way to message Amir directly.",
    href: "https://t.me/baldikchmochi",
    copyValue: "https://t.me/baldikchmochi",
    icon: Send,
    available: true,
  },
  {
    label: "Phone",
    value: "+7 705 845 90 98",
    description: "Direct phone contact for urgent collaboration questions.",
    href: "tel:+77058459098",
    copyValue: "+77058459098",
    icon: Phone,
    available: true,
  },
  {
    label: "Email",
    value: "Add your email",
    description: "Optional placeholder ready for a future mailto link.",
    icon: Mail,
    available: false,
  },
];

const collaborationIdeas = [
  "Interactive websites and portfolios",
  "AI-assisted tools and experiments",
  "Cyberpunk UI concepts",
  "Automation and optimization scripts",
];

export function ContactApp() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyValue = async (value: string) => {
    if (!navigator.clipboard) return;

    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(null), 1600);
  };

  const openExternal = (href?: string) => {
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-full overflow-auto bg-background/50 p-5 backdrop-blur-sm">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-linear-to-br from-cyan-400/15 via-blue-500/10 to-purple-500/10 p-5 shadow-2xl shadow-cyan-500/10"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
              <UserRoundCheck className="h-3.5 w-3.5" />
              Available for cool projects
            </div>
            <h1 className="text-2xl font-bold text-foreground">Contact Amir</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Use this hub to open verified links, copy Telegram/phone details,
              or prepare future email handles without digging through the UI.
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400 text-3xl font-black text-black shadow-lg shadow-cyan-400/25">
            MA
          </div>
        </div>
      </motion.section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-3"
        >
          {contacts.map((contact) => {
            const Icon = contact.icon;
            const copyTarget =
              contact.copyValue ?? contact.href ?? contact.value;
            const isCopied = copiedValue === copyTarget;

            return (
              <motion.article
                key={contact.label}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
                className={`rounded-2xl border p-4 transition ${
                  contact.available
                    ? "border-border/60 bg-card/55 hover:border-cyan-400/30"
                    : "border-dashed border-border/50 bg-muted/20 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/40">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">
                        {contact.label}
                      </h2>
                      {!contact.available && (
                        <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[10px] text-yellow-300">
                          Setup needed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-cyan-300">
                      {contact.value}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {contact.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyValue(copyTarget)}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-green-300" />
                        ) : (
                          <Clipboard className="h-3.5 w-3.5" />
                        )}
                        {isCopied ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openExternal(contact.href)}
                        disabled={!contact.href}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border/60 bg-card/55 p-4"
        >
          <div className="mb-3 flex items-center gap-2 text-cyan-300">
            <MessageCircle className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Collaboration ideas</h2>
          </div>
          <div className="space-y-2">
            {collaborationIdeas.map((idea) => (
              <div
                key={idea}
                className="rounded-xl border border-border/40 bg-background/35 p-3 text-sm text-muted-foreground"
              >
                {idea}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-xs leading-relaxed text-cyan-100/80">
            Tip: Telegram and phone are ready. Add email later if you want a
            complete multi-channel contact card.
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
