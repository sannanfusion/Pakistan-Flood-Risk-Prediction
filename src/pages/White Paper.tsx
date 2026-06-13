import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  ExternalLink,
  Brain,
  Satellite,
  ShieldAlert,
  Waves,
  LayoutDashboard,
  Rocket,
  Activity,
  BarChart3,
  Bell,
  Lightbulb,
  Cpu,
} from 'lucide-react';

const PDF_PATH = '/Pakistan_Flood_Risk_Prediction_Research_Paper.pdf';

const researchHighlights = [
  {
    icon: Brain,
    title: 'Machine Learning (Random Forest)',
    description:
      'Ensemble-based Random Forest classifier trained on historical flood events to predict district-level risk scores with high accuracy.',
    color: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
    borderColor: 'border-violet-500/20',
  },
  {
    icon: Satellite,
    title: 'NASA Satellite Rainfall Data',
    description:
      'Real-time precipitation data from NASA IMERG (Integrated Multi-satellite Retrievals for GPM) providing high-resolution rainfall estimates.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: ShieldAlert,
    title: 'NDMA Disaster Data',
    description:
      'Historical disaster records from the National Disaster Management Authority covering casualties, damage, and relief operations.',
    color: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-500',
    borderColor: 'border-red-500/20',
  },
  {
    icon: Waves,
    title: 'WAPDA River Data',
    description:
      'River discharge and water level measurements from WAPDA monitoring stations across Pakistan\'s major river systems.',
    color: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-teal-500',
    borderColor: 'border-teal-500/20',
  },
  {
    icon: LayoutDashboard,
    title: 'Interactive Flood Risk Dashboard',
    description:
      'Real-time web dashboard built with React and Leaflet, visualizing province and district-level flood risk on an interactive map.',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-500/20',
  },
  {
    icon: Rocket,
    title: 'Future AI & Database Roadmap',
    description:
      'Planned integration of deep learning models, PostgreSQL database migration, and automated early warning notification systems.',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-500',
    borderColor: 'border-pink-500/20',
  },
];

const projectImpact = [
  {
    icon: Activity,
    title: 'Flood Monitoring',
    description:
      'Continuous monitoring of rainfall, river discharge, and historical flood patterns across all provinces and districts of Pakistan.',
  },
  {
    icon: BarChart3,
    title: 'Risk Assessment',
    description:
      'ML-powered risk scoring that quantifies flood vulnerability at district level using multi-source environmental data.',
  },
  {
    icon: Bell,
    title: 'Early Warning Support',
    description:
      'Provides actionable risk intelligence to support early warning systems and enable timely evacuation and preparedness measures.',
  },
  {
    icon: Lightbulb,
    title: 'Data-Driven Decision Making',
    description:
      'Empowers disaster management authorities with evidence-based insights for resource allocation and response planning.',
  },
  {
    icon: Cpu,
    title: 'Future AI Integration',
    description:
      'Roadmap includes deep learning forecasting, real-time satellite imagery analysis, and automated alert pipelines.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Research = () => {
  return (
    <div className="space-y-10">
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-blue-50 border border-border p-8 sm:p-10"
      >
        {/* Decorative dots */}
        <div className="absolute top-4 right-4 grid grid-cols-5 gap-1.5 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
          ))}
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
              Research Publication
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-2">
            Pakistan Flood Risk Prediction System
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-primary/80 mb-4">
            Research Paper
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            This research paper presents the complete architecture, machine learning methodology,
            data sources, dashboard implementation, deployment strategy, and future roadmap of the
            Pakistan Flood Risk Prediction System.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a
              href={PDF_PATH}
              target="_blank"
              rel="noopener noreferrer"
              id="view-research-paper-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              View Research Paper
            </a>
            <a
              href={PDF_PATH}
              download="Pakistan_Flood_Risk_Prediction_Research_Paper.pdf"
              id="download-research-paper-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card text-foreground text-sm font-semibold border border-border hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              Download Research Paper
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Embedded PDF Viewer ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-muted">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">Read the Paper</h3>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
          <iframe
            src={PDF_PATH}
            title="Pakistan Flood Risk Prediction Research Paper"
            className="w-full border-0"
            style={{ height: '80vh', minHeight: '500px' }}
          />
        </div>
      </motion.section>

      {/* ── Research Highlights ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl bg-muted">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">Research Highlights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchHighlights.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              className={`group relative p-5 rounded-2xl bg-card border ${item.borderColor} hover:shadow-lg transition-all duration-300 overflow-hidden`}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className={`p-2.5 rounded-xl bg-muted inline-flex mb-3`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Project Impact ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl bg-muted">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">Project Impact</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectImpact.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              className="p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center py-8 px-4 rounded-2xl bg-gradient-to-r from-primary/5 via-card to-primary/5 border border-border"
      >
        <FileText className="w-8 h-8 text-primary mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-1">
          Access the Full Research Paper
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mb-5">
          Download or view the complete research paper to explore the methodology, results, and
          future roadmap in detail.
        </p>
        <div className="flex gap-3">
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Paper
          </a>
          <a
            href={PDF_PATH}
            download="Pakistan_Flood_Risk_Prediction_Research_Paper.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Research;
