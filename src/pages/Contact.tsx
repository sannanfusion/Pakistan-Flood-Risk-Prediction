import { Github, Mail } from 'lucide-react';

const Contact = () => (
  <div className="space-y-4 max-w-[620px]">
    <div>
      <h1 className="text-[22px] font-extrabold text-foreground tracking-tight">Contact</h1>
      <p className="text-[12.5px] text-muted-foreground mt-0.5">
        Get in touch about the Pakistan Flood Risk Prediction system
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a
        href="https://github.com/pakistan-flood-risk-prediction"
        target="_blank"
        rel="noopener noreferrer"
        className="panel p-5 flex items-center gap-3 hover:border-primary/40 transition-colors"
      >
        <span className="p-2.5 rounded-xl bg-muted">
          <Github className="w-5 h-5 text-foreground" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-semibold text-foreground">GitHub</span>
          <span className="block text-[11.5px] font-mono text-muted-foreground truncate">
            github.com/pakistan-flood-risk-prediction
          </span>
        </span>
      </a>

      <a
        href="mailto:contact@floodrisk.pk"
        className="panel p-5 flex items-center gap-3 hover:border-primary/40 transition-colors"
      >
        <span className="p-2.5 rounded-xl bg-primary/12 border border-primary/25">
          <Mail className="w-5 h-5 text-primary" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-semibold text-foreground">Email</span>
          <span className="block text-[11.5px] font-mono text-muted-foreground truncate">contact@floodrisk.pk</span>
        </span>
      </a>
    </div>
  </div>
);

export default Contact;
