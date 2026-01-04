"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Typewriter } from "../components/Typewriter";

// --- Types ---
type UserInput = {
  platform: "twitter" | "instagram" | "linkedin";
  interaction_stage:
  | "first_contact" | "follow_up_1" | "follow_up_2" | "warm_nudge"
  | "post_meeting_thanks" | "ask_for_intro" | "close_breakup"
  | "social_reply" | "social_comment";
  tone: "casual" | "professional" | "busy";
  char_limit?: number | null;
  input: string;
};

type NextStep = {
  condition: "positive" | "neutral" | "negative";
  instruction: string;
};

type OutreachResponse = {
  platform: string;
  interaction_stage: string;
  tone: string;
  message: string;
  length_chars: number;
  personalization_clues: string[];
  next_steps: NextStep[];
  reasons_for_denial?: string[] | null;
};

// --- Constants ---
const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
  { id: "twitter", label: "X (Twitter)", color: "bg-black" },
  { id: "instagram", label: "Instagram", color: "bg-pink-600" },
];

const TONES = [
  { id: "professional", label: "Professional", desc: "Formal, respectful, direct." },
  { id: "casual", label: "Casual", desc: "Friendly, relaxed, conversational." },
  { id: "busy", label: "Busy / Brief", desc: "Short, to the point, efficient." },
];

const STAGES = [
  { id: "first_contact", label: "First Contact" },
  { id: "social_reply", label: "Social Reply" },
  { id: "social_comment", label: "Social Comment" },
  { id: "follow_up_1", label: "Follow Up #1" },
  { id: "follow_up_2", label: "Follow Up #2" },
  { id: "warm_nudge", label: "Warm Nudge" },
  { id: "post_meeting_thanks", label: "Post Meeting" },
  { id: "ask_for_intro", label: "Ask for Intro" },
];

const ENDPOINT = "/api/outreach";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function GenerateWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<UserInput>({
    platform: "linkedin",
    interaction_stage: "first_contact",
    tone: "professional",
    input: "",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OutreachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateForm = (key: keyof UserInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const handlePlatformSelect = (p: any) => {
    updateForm("platform", p);
    nextStep();
  };

  const handleToneSelect = (t: any) => {
    updateForm("tone", t);
    nextStep();
  };

  const handleStageSelect = (s: any) => {
    updateForm("interaction_stage", s);
    nextStep();
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    nextStep(); // Go to loading/result step

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col min-h-screen">

        {/* Header / Nav */}
        <header className="mb-12 flex items-center justify-between">
          {step > 0 && step < 4 ? (
            <button onClick={prevStep} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-1" /> Back
            </button>
          ) : (
            <Link href="/" className="text-slate-500 hover:text-indigo-600">Cancel</Link>
          )}

          <div className="flex gap-2">
            {/* Progress Dots */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === step ? "bg-indigo-600" : i < step ? "bg-indigo-300" : "bg-slate-200")} />
            ))}
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* STEP 0: PLATFORM */}
            {step === 0 && (
              <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Where are you reaching out?</h1>
                  <p className="text-slate-500 mt-2 text-lg">Select the platform to optimize the message format.</p>
                </div>
                <div className="grid gap-4">
                  {PLATFORMS.map((p) => (
                    <button key={p.id} onClick={() => handlePlatformSelect(p.id)}
                      className="group flex items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all text-left">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white mr-4", p.color)}>
                        {/* Simple Icon placeholder */}
                        <span className="font-bold text-xl">{p.label[0]}</span>
                      </div>
                      <div>
                        <span className="block text-xl font-semibold text-slate-800 group-hover:text-indigo-700">{p.label}</span>
                      </div>
                      <ChevronRight className="ml-auto w-6 h-6 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: TONE */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">What&apos;s the vibe?</h1>
                  <p className="text-slate-500 mt-2 text-lg">Choose a tone that fits your relationship.</p>
                </div>
                <div className="grid gap-4">
                  {TONES.map((t) => (
                    <button key={t.id} onClick={() => handleToneSelect(t.id)}
                      className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all text-left">
                      <span className="block text-xl font-semibold text-slate-800 group-hover:text-indigo-700 mb-1">{t.label}</span>
                      <span className="block text-slate-500">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: STAGE */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Current status?</h1>
                  <p className="text-slate-500 mt-2 text-lg">Select the stage of your interaction.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {STAGES.map((s) => (
                    <button key={s.id} onClick={() => handleStageSelect(s.id)}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:bg-slate-50 transition-all text-left">
                      <span className="font-medium text-slate-700">{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONTEXT INPUT */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add context</h1>
                  <p className="text-slate-500 mt-2 text-lg">Who is this for? Any specific topic or link? <br /><span className="text-sm text-indigo-600 font-medium">✨ We&apos;ll research them online for you.</span></p>
                </div>

                <div className="space-y-4">
                  <textarea
                    autoFocus
                    className="w-full h-48 p-4 text-lg bg-white border border-slate-200 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="e.g. Reaching out to Vybhav regarding his latest AI project. I want to ask for a 15 min coffee chat..."
                    value={form.input}
                    onChange={(e) => updateForm("input", e.target.value)}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={onSubmit}
                      disabled={!form.input.trim()}
                      className="bg-indigo-600 text-white text-lg font-medium px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      Generate Outreach <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: RESULT */}
            {step === 4 && (
              <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                {loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">Drafting your message...</h3>
                      <p className="text-slate-500 mt-2">Researching recipient • Analyzing tone • Writing</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong.</h3>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button onClick={prevStep} className="text-indigo-600 font-medium hover:underline">Try again</button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span className="ml-4 text-xs font-mono text-slate-400">draft.txt</span>
                      </div>
                      <div className="p-8 min-h-[200px]">
                        {/* Simulated Streaming Output */}
                        {data && <Typewriter text={data.message} className="text-xl leading-relaxed text-slate-800 whitespace-pre-wrap font-medium" speed={15} />}
                      </div>
                    </div>

                    {/* Metadata / Validation */}
                    {data && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="grid md:grid-cols-2 gap-4">
                        {data.personalization_clues?.length > 0 && (
                          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                            <h4 className="flex items-center text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Personalization
                            </h4>
                            <ul className="space-y-2">
                              {data.personalization_clues.map((clue, i) => (
                                <li key={i} className="text-sm text-indigo-800 leading-snug">• {clue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Details</h4>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>Platform: <span className="font-medium text-slate-900 capitalize">{data.platform}</span></p>
                            <p>Tone: <span className="font-medium text-slate-900 capitalize">{data.tone}</span></p>
                            <p>Length: <span className="font-medium text-slate-900">{data.length_chars} chars</span></p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-center pt-6">
                      <button onClick={() => { setStep(0); setForm(f => ({ ...f, input: "" })) }} className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Start Over</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
