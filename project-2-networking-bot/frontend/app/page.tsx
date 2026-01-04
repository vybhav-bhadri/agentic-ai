"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "./components/Typewriter";
import { ArrowRight, CheckCircle2, MessageSquare, Send, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">

        {/* Navbar Placeholder */}
        <div className="flex justify-between items-center mb-24 opacity-80">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            NetworkBot
          </div>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Sign In
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now powered by Claude 3.5 Sonnet
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Networking <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">on Autopilot.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Craft personalized outreach messages for LinkedIn, X, and Instagram.
              Let AI do the research before you type a single word.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/generate" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:scale-105 transition-all duration-200 group">
                Start Generating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                View Examples
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-8 text-sm text-slate-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No generic templates</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Researches for you</div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main App Preview Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Fake Browser Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 h-6 bg-slate-200/50 rounded-md max-w-[200px]" />
              </div>

              <div className="p-8 space-y-6">
                {/* Chat Bubble Incoming */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles size={20} />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                    <p className="text-sm font-medium text-slate-900 mb-1">Agent Strategy</p>
                    <p className="text-sm text-slate-600">
                      Based on Vybhav&apos;s recent tweet about autonomous agents, we should keep it casual but show technical interest.
                    </p>
                  </div>
                </div>

                {/* Chat Bubble Outgoing (Simulated Typing) */}
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
                    <span className="text-xs font-bold">ME</span>
                  </div>
                  <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-4 max-w-[85%] text-white shadow-lg shadow-indigo-500/20">
                    <p className="text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Draft Message</p>
                    <Typewriter
                      text="Hey Vybhav! Loved your thread on agentic workflows. The point about &apos;unpredictable steps&apos; strictly resonated with what I&apos;m building. Would love to swap notes if you&apos;re open to it?"
                      className="text-sm leading-relaxed"
                      speed={30}
                    />
                  </div>
                </div>
              </div>

              {/* Fake Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="text-xs text-slate-400">289 characters</div>
                <button className="bg-indigo-600 text-white rounded-lg p-2 hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="bg-[#0077b5] p-2 rounded-lg text-white">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">LinkedIn</p>
                <p className="text-[10px] text-slate-500">Connection Request</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
            >
              <div className="bg-black p-2 rounded-lg text-white">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">X (Twitter)</p>
                <p className="text-[10px] text-slate-500">Reply to Thread</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
