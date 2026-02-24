import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CapabilityCards from '@/components/CapabilityCards';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Skills from '@/components/Skills';
import LiveInfra from '@/components/LiveInfra';
import InteractiveLab from '@/components/InteractiveLab';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ParticleNetwork from '@/components/ParticleNetwork';
import VoiceAgent from '@/components/VoiceAgent';
import { ScrollProgress } from '@/components/AnimatedElements';

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen relative">
      <ScrollProgress />
      <ParticleNetwork />
      <Navbar />
      <Hero />
      <CapabilityCards />
      <ExperienceTimeline />
      <Skills />
      <LiveInfra />
      <InteractiveLab />
      <Contact />
      <Footer />
      <VoiceAgent />
    </main>
  );
}
