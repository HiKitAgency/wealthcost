"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Users, 
  Building2, 
  Zap, 
  BarChart3, 
  Globe, 
  Lock, 
  Target,
  ChevronDown 
} from 'lucide-react';
import WealthCoreCanvas from '@/components/3d/WealthCore';
import NeuralNetworkCanvas from '@/components/3d/NeuralNetwork';
import GrowthSphereCanvas from '@/components/3d/GrowthSphere';
import { toast } from 'sonner';

// Types
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "WealthCost has fundamentally changed how our family office allocates capital. The AI's risk-adjusted decisions have delivered 2.8x the benchmark with dramatically lower drawdowns.",
    name: "Elena Vasquez",
    role: "Chief Investment Officer",
    company: "Meridian Capital",
    result: "+187% net return"
  },
  {
    quote: "We deployed WealthCost across our private equity portfolio. The autonomous trading layer alone has generated alpha that our previous quant team couldn't match in five years.",
    name: "Marcus Chen",
    role: "Head of Alternatives",
    company: "Aether Partners",
    result: "4.1x alpha"
  },
  {
    quote: "As a high-net-worth individual, I finally have institutional-grade intelligence working for me 24/7. The transparency and control are unmatched.",
    name: "Sofia Patel",
    role: "Founder & Principal",
    company: "Patel Ventures",
    result: "31% CAGR"
  }
];

const stats = [
  { value: "$4.2B", label: "Assets Under Intelligence" },
  { value: "41.7%", label: "Average Annualized Alpha" },
  { value: "0.31", label: "Maximum Drawdown (2024)" },
  { value: "2,847", label: "Active Decision Nodes" },
];

export default function WealthCostLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);

  // Smooth scroll with Lenis-like behavior via native + framer
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // Premium smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 * (-Math.pow(2, -10 * t) + 1)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = (type: 'individual' | 'business') => {
    toast.success(
      type === 'individual' 
        ? "Welcome. Your personal AI wealth engine is ready." 
        : "Our enterprise team will contact you within 4 hours.",
      { description: "This is a high-fidelity prototype. In production this would initiate onboarding." }
    );
  };

  return (
    <div className="min-h-screen bg-[#05070F] text-[#F5F5F7] overflow-x-hidden selection:bg-[#C5A46E] selection:text-[#05070F]">
      {/* Scroll Progress */}
      <div 
        className="fixed top-0 left-0 h-[1px] bg-gradient-to-r from-[#C5A46E] via-[#00C9B1] to-[#C5A46E] z-[100] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Premium Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A46E] to-[#00C9B1] flex items-center justify-center">
              <span className="text-[#05070F] text-[13px] font-semibold tracking-[-1.2px]">WC</span>
            </div>
            <div className="font-semibold text-xl tracking-[-1.5px] text-white group-hover:text-[#C5A46E] transition-colors">WEALTHCOST</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <button onClick={() => scrollTo('solutions')} className="nav-link text-[#C8CBD4] hover:text-white transition-colors">Solutions</button>
            <button onClick={() => scrollTo('individuals')} className="nav-link text-[#C8CBD4] hover:text-white transition-colors">For Individuals</button>
            <button onClick={() => scrollTo('businesses')} className="nav-link text-[#C8CBD4] hover:text-white transition-colors">For Business</button>
            <button onClick={() => scrollTo('technology')} className="nav-link text-[#C8CBD4] hover:text-white transition-colors">Technology</button>
            <button onClick={() => scrollTo('insights')} className="nav-link text-[#C8CBD4] hover:text-white transition-colors">Insights</button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scrollTo('pricing')}
              className="hidden md:block btn btn-ghost text-sm"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleGetStarted('individual')}
              className="btn btn-primary text-sm px-6"
            >
              Get Started
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                <div className={`w-5 h-px bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <div className={`w-5 h-px bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-5 h-px bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-strong border-t border-white/10 px-8 py-8 flex flex-col gap-6 text-lg">
            {['solutions', 'individuals', 'businesses', 'technology', 'insights', 'pricing'].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left capitalize text-[#C8CBD4]">
                {id}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1 text-xs tracking-[3px] text-[#C8CBD4] mb-8">
            INSTITUTIONAL INTELLIGENCE • NOW AVAILABLE FOR ALL
          </div>

          <h1 className="text-[72px] md:text-[92px] leading-[0.88] font-semibold tracking-[-5.2px] mb-6">
            Capital has<br />never been<br />this intelligent.
          </h1>

          <p className="max-w-[620px] mx-auto text-2xl md:text-[27px] tracking-[-0.6px] text-[#C8CBD4] font-light mb-12">
            Autonomous AI investment and trading for individuals<br className="hidden md:block" /> and enterprises who demand precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleGetStarted('individual')}
              className="btn btn-primary text-base px-10 py-4 group"
            >
              Begin Your Wealth Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
            <button 
              onClick={() => scrollTo('solutions')}
              className="btn btn-secondary text-base px-10 py-4"
            >
              Explore the Platform
            </button>
          </div>

          <div className="mt-16 flex justify-center">
            <button onClick={() => scrollTo('solutions')} className="flex flex-col items-center text-[#8A8F9E] text-xs tracking-[2px] hover:text-[#C5A46E] transition group">
              SCROLL TO DISCOVER
              <ChevronDown className="mt-1 w-4 h-4 animate-bounce group-hover:text-[#C5A46E]" />
            </button>
          </div>
        </div>

        {/* Hero 3D — The Signature WealthCore */}
        <div className="absolute inset-0 z-0 opacity-90">
          <WealthCoreCanvas />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#05070F] to-transparent z-10" />
      </section>

      {/* ========== TRUST BAR / STATS ========== */}
      <div className="border-y border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="text-4xl font-semibold tracking-[-1.5px] text-[#C5A46E]">{stat.value}</div>
              <div className="text-sm text-[#8A8F9E] tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SOLUTIONS / PROBLEM + VALUE ========== */}
      <section id="solutions" className="section max-w-6xl mx-auto px-8">
        <div className="max-w-3xl mb-16">
          <div className="uppercase tracking-[3px] text-xs text-[#C5A46E] mb-4">THE NEW STANDARD</div>
          <h2 className="text-6xl tracking-[-2.4px] leading-none font-semibold">Wealth management<br />was built for a different era.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="premium-card glass p-10 rounded-3xl space-y-6">
            <div className="text-[#C5A46E]"><Target className="w-6 h-6" /></div>
            <h3 className="text-3xl tracking-tight">Traditional wealth is slow, emotional, and expensive.</h3>
            <p className="text-[#C8CBD4] text-lg leading-tight">Human advisors suffer from bias. Legacy platforms are fragmented. High fees erode returns. The best opportunities remain invisible to most.</p>
          </div>
          <div className="premium-card glass p-10 rounded-3xl space-y-6 border-[#C5A46E]/30">
            <div className="text-[#00C9B1]"><Zap className="w-6 h-6" /></div>
            <h3 className="text-3xl tracking-tight">WealthCost replaces intuition with autonomous intelligence.</h3>
            <p className="text-[#C8CBD4] text-lg leading-tight">Our AI continuously scans global markets, models thousands of scenarios per second, and executes with institutional precision — 24 hours a day, 365 days a year.</p>
          </div>
        </div>
      </section>

      {/* ========== FOR INDIVIDUALS ========== */}
      <section id="individuals" className="section bg-[#0C0F1A] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline text-xs tracking-[3px] text-[#00C9B1] mb-3 block">PERSONAL WEALTH OS</div>
              <h3 className="text-6xl tracking-[-2.6px] font-semibold leading-none mb-8">Your personal<br />AI chief investment officer.</h3>
              
              <div className="space-y-8 text-lg text-[#C8CBD4]">
                <p>Every individual deserves the same intelligence that manages billions. WealthCost builds a living model of your goals, risk tolerance, tax situation, and time horizon — then acts with perfect discipline.</p>
                <ul className="space-y-4">
                  {[
                    "Autonomous multi-asset allocation across 38 markets",
                    "Real-time tax optimization & harvesting",
                    "Downside protection with dynamic hedging",
                    "Private market access & alternative strategies",
                    "Complete transparency — every decision explained"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3"><div className="mt-2 w-1 h-1 rounded-full bg-[#C5A46E] flex-shrink-0" /> {item}</li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleGetStarted('individual')}
                className="mt-10 btn btn-primary text-base px-9 py-4"
              >
                Open Your Personal Engine <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* 3D Growth Sphere for Individuals */}
            <div className="relative h-[520px] rounded-3xl overflow-hidden border border-white/10">
              <GrowthSphereCanvas />
              <div className="absolute bottom-8 left-8 right-8 glass px-6 py-4 rounded-2xl text-sm">
                <div className="flex justify-between items-center text-[#C8CBD4]">
                  <div>Personal Risk-Adjusted Growth</div>
                  <div className="text-[#C5A46E] font-medium">+31.4% YTD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOR BUSINESSES ========== */}
      <section id="businesses" className="section max-w-6xl mx-auto px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-[#C5A46E] text-xs tracking-[3px]">ENTERPRISE GRADE</div>
          <h3 className="text-6xl tracking-[-2.6px] font-semibold leading-none mt-3">The operating system<br />for institutional capital.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Building2 className="w-5 h-5" />, title: "Multi-Strategy Orchestration", desc: "Run dozens of autonomous strategies simultaneously across public markets, private credit, and alternatives with unified risk oversight." },
            { icon: <Users className="w-5 h-5" />, title: "Team & Governance", desc: "Role-based access, approval workflows, audit trails, and policy engines that satisfy the most rigorous compliance and fiduciary requirements." },
            { icon: <Globe className="w-5 h-5" />, title: "White-Label & API", desc: "Embed WealthCost intelligence inside your own platform. Full API + white-label portal options for wealth managers, family offices, and banks." }
          ].map((feature, index) => (
            <div key={index} className="premium-card glass p-9 rounded-3xl group">
              <div className="icon-container mb-8 text-[#C5A46E] group-hover:bg-[#C5A46E] group-hover:text-[#05070F]">{feature.icon}</div>
              <h4 className="text-2xl tracking-tight mb-4">{feature.title}</h4>
              <p className="text-[#C8CBD4] leading-snug">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={() => handleGetStarted('business')} className="btn btn-secondary text-base px-8 py-4">
            Schedule Enterprise Briefing <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>

      {/* ========== HOW IT WORKS + 3D NETWORK ========== */}
      <section id="technology" className="section bg-[#0C0F1A] border-y border-white/10 relative">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-x-20 gap-y-16 items-center">
            <div>
              <div className="text-xs tracking-[3px] text-[#00C9B1]">THE DECISION ENGINE</div>
              <h3 className="text-6xl tracking-[-2.8px] font-semibold leading-none mt-4 mb-10">Intelligence that thinks in milliseconds.<br />Acts with conviction.</h3>
              
              <div className="space-y-9">
                {[
                  { num: "01", title: "Continuous Perception", desc: "Ingests 14,000+ data streams in real time — prices, sentiment, macro indicators, on-chain flows, regulatory signals." },
                  { num: "02", title: "Multi-Scenario Modeling", desc: "Runs millions of forward simulations using proprietary reinforcement learning and causal inference models." },
                  { num: "03", title: "Autonomous Execution", desc: "Identifies and executes optimal trades across venues with microsecond precision while maintaining your exact risk mandate." },
                  { num: "04", title: "Explainable & Auditable", desc: "Every single decision is logged, explained in natural language, and available for compliance review." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="font-mono text-[#C5A46E] text-xl tracking-[1px] pt-1 w-9">{step.num}</div>
                    <div>
                      <div className="text-xl tracking-tight mb-1.5">{step.title}</div>
                      <p className="text-[#C8CBD4]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Network 3D Visual */}
            <div className="relative h-[560px] rounded-3xl overflow-hidden border border-white/10 -mx-2 lg:mx-0">
              <NeuralNetworkCanvas />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-xs uppercase tracking-[3px] text-[#C5A46E]">LIVE DECISION GRAPH</div>
                <div className="text-sm text-[#C8CBD4] mt-1">2,847 active nodes • 18,400 decisions today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PERFORMANCE / INSIGHTS ========== */}
      <section id="insights" className="section max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[#C5A46E] text-xs tracking-[3px]">PROVEN ACROSS CYCLES</div>
            <h3 className="text-6xl tracking-[-2.4px] font-semibold mt-2">Results that speak<br />for themselves.</h3>
          </div>
          <p className="max-w-md text-[#C8CBD4] text-lg">Live since 2022. Tested through volatility, rate shocks, and regime changes.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { metric: "41.7%", label: "Annualized Alpha", sub: "vs. MSCI ACWI" },
            { metric: "0.31", label: "Max Drawdown", sub: "2022–2025 period" },
            { metric: "2.84", label: "Sharpe Ratio", sub: "After all fees" },
            { metric: "99.4%", label: "Decision Uptime", sub: "Since launch" }
          ].map((item, index) => (
            <div key={index} className="premium-card glass p-9 rounded-3xl">
              <div className="text-6xl font-semibold tracking-[-2.2px] text-[#C5A46E] mb-3">{item.metric}</div>
              <div className="font-medium tracking-tight">{item.label}</div>
              <div className="text-sm text-[#8A8F9E] mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section bg-[#0C0F1A] border-y border-white/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="text-[#C5A46E] text-xs tracking-[3px] mb-6">REAL CAPITAL. REAL RESULTS.</div>
          
          <div className="relative min-h-[220px]">
            {testimonials.map((t, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center ${activeTestimonial === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <blockquote className="text-3xl md:text-[31px] leading-tight tracking-[-0.6px] max-w-3xl font-light">
                  “{t.quote}”
                </blockquote>
                <div className="mt-9 flex flex-col items-center">
                  <div className="font-medium tracking-tight">{t.name}</div>
                  <div className="text-sm text-[#8A8F9E]">{t.role}, {t.company}</div>
                  <div className="mt-1 text-[#C5A46E] text-sm font-medium tracking-widest">{t.result}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex gap-3 justify-center mt-10">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTestimonial(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${activeTestimonial === i ? 'bg-[#C5A46E] w-6' : 'bg-white/30'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="section max-w-6xl mx-auto px-8">
        <div className="text-center mb-14">
          <div className="text-[#C5A46E] text-xs tracking-[3px]">TRANSPARENT. PERFORMANCE-ALIGNED.</div>
          <h3 className="text-6xl tracking-[-2.4px] font-semibold mt-3">Simple pricing.<br />Extraordinary outcomes.</h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Individual */}
          <div className="premium-card glass rounded-3xl p-9 flex flex-col">
            <div>
              <div className="text-[#C5A46E] text-sm tracking-widest">FOR INDIVIDUALS</div>
              <div className="text-5xl tracking-[-1.8px] font-semibold mt-3 mb-1">1.25%</div>
              <div className="text-[#C8CBD4]">assets under management per year</div>
            </div>
            <ul className="my-9 space-y-3 text-sm flex-1 text-[#C8CBD4]">
              {["Unlimited AI strategies", "Tax optimization engine", "Private market access", "Dedicated relationship manager", "Real-time explainability"].map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button onClick={() => handleGetStarted('individual')} className="btn btn-primary w-full justify-center">Start Free 30-Day Trial</button>
          </div>

          {/* Professional */}
          <div className="premium-card glass rounded-3xl p-9 flex flex-col border-[#C5A46E]/40 relative">
            <div className="absolute -top-3 right-8 bg-[#C5A46E] text-[#05070F] text-xs tracking-[2px] px-4 py-px rounded">MOST POPULAR</div>
            <div>
              <div className="text-[#C5A46E] text-sm tracking-widest">PROFESSIONAL</div>
              <div className="text-5xl tracking-[-1.8px] font-semibold mt-3 mb-1">0.85%</div>
              <div className="text-[#C8CBD4]">AUM + performance fee on alpha</div>
            </div>
            <ul className="my-9 space-y-3 text-sm flex-1 text-[#C8CBD4]">
              {["Everything in Individual", "Advanced hedging suite", "Direct indexing & custom mandates", "Priority execution", "Quarterly strategy reviews"].map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button onClick={() => handleGetStarted('individual')} className="btn btn-primary w-full justify-center">Begin Professional Onboarding</button>
          </div>

          {/* Enterprise */}
          <div className="premium-card glass rounded-3xl p-9 flex flex-col">
            <div>
              <div className="text-[#C5A46E] text-sm tracking-widest">ENTERPRISE & INSTITUTIONS</div>
              <div className="text-5xl tracking-[-1.8px] font-semibold mt-3 mb-1">Custom</div>
              <div className="text-[#C8CBD4]">Tailored to your mandate</div>
            </div>
            <ul className="my-9 space-y-3 text-sm flex-1 text-[#C8CBD4]">
              {["Full white-label & API access", "Dedicated infrastructure", "Custom model training", "SLA & on-premise options", "Board-level reporting"].map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button onClick={() => handleGetStarted('business')} className="btn btn-secondary w-full justify-center">Request Private Briefing</button>
          </div>
        </div>
        <p className="text-center text-xs text-[#8A8F9E] mt-8 tracking-wide">All plans include full transparency, no lock-ups, and 30-day capital protection guarantee.</p>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-24 px-8 border-t border-white/10 bg-[#05070F]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#C5A46E] to-[#00C9B1] flex items-center justify-center mb-8">
            <TrendingUp className="w-7 h-7 text-[#05070F]" />
          </div>
          
          <h2 className="text-6xl md:text-7xl tracking-[-2.8px] font-semibold leading-none mb-6">
            Your capital deserves<br />better intelligence.
          </h2>
          <p className="text-2xl text-[#C8CBD4] mb-10">Join the investors and institutions already operating at the frontier of wealth.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handleGetStarted('individual')} className="btn btn-primary text-lg px-14 py-5">Start as an Individual</button>
            <button onClick={() => handleGetStarted('business')} className="btn btn-secondary text-lg px-10 py-5">Talk to Enterprise Sales</button>
          </div>

          <div className="mt-10 text-xs tracking-[2px] text-[#5C616E]">NEW YORK • LONDON • SINGAPORE • DUBAI</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-y-6 text-[#8A8F9E]">
          <div>© {new Date().getFullYear()} WealthCost Technologies. All rights reserved.</div>
          <div className="flex gap-x-8">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Risk Disclosure</a>
            <a href="#" className="hover:text-white transition">Regulatory</a>
            <a href="#" className="hover:text-white transition">Careers</a>
          </div>
          <div>WealthCost is a registered investment advisor in the United States and select jurisdictions.</div>
        </div>
      </footer>
    </div>
  );
}
