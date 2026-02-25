import { provinces } from '@/lib/floodData';
import { RISK_COLORS, RISK_LABELS } from '@/lib/types';
import { FileText, Download, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { toast } from '@/hooks/use-toast';

function generatePDF(provinceId?: string) {
  Promise.all([import('jspdf'), import('jspdf-autotable')]).then(([{ jsPDF }]) => {
    // jspdf-autotable auto-registers as side effect
    const doc = new jsPDF();
      const filtered = provinceId ? provinces.filter(p => p.id === provinceId) : provinces;
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 95);
      doc.text('Pakistan Flood Risk Report', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()} · Data: NASA IMERG + NDMA + WAPDA`, 14, 30);

      doc.setDrawColor(200);
      doc.line(14, 34, 196, 34);

      let y = 42;

      filtered.forEach((province) => {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 95);
        doc.text(province.name, 14, y);

        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(`Risk: ${RISK_LABELS[province.riskLevel]} (${province.riskScore}/100)`, 14, y + 7);
        doc.text(`7-Day Rainfall: ${province.rainfall7Day}mm | 30-Day: ${province.rainfall30Day}mm`, 14, y + 14);
        doc.text(`River Discharge: ${province.riverDischarge} cumecs (Threshold: ${province.riverDischargeThreshold})`, 14, y + 21);
        doc.text(`Population: ${(province.population / 1e6).toFixed(1)}M | Historical Floods: ${province.historicalFloods}`, 14, y + 28);

        // Districts table
        const tableData = province.districts.map(d => [d.name, `${d.riskScore}%`, RISK_LABELS[d.riskLevel]]);
        
        (doc as any).autoTable({
          startY: y + 33,
          head: [['District', 'Risk Score', 'Level']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [30, 58, 95], textColor: 255, fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        y = (doc as any).lastAutoTable.finalY + 15;
      });

      const filename = provinceId
        ? `flood-risk-${provinceId}-${new Date().toISOString().split('T')[0]}.pdf`
        : `flood-risk-all-provinces-${new Date().toISOString().split('T')[0]}.pdf`;

      doc.save(filename);
      toast({ title: 'Report Downloaded', description: `${filename} saved successfully.` });
  });
}

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Reports</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              Provincial risk assessment summaries
            </p>
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
        </div>
        <button
          onClick={() => generatePDF()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20"
        >
          <Download className="w-4 h-4" /> Export All PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provinces.map((province, i) => (
          <motion.div
            key={province.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 hover:border-primary/20 transition-all group shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/60">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{province.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Last updated: Feb 22, 2026
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border"
                  style={{
                    color: RISK_COLORS[province.riskLevel],
                    borderColor: RISK_COLORS[province.riskLevel] + '40',
                    backgroundColor: RISK_COLORS[province.riskLevel] + '15',
                  }}
                >
                  {province.riskScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">7d Rain</div>
                <div className="font-mono text-xs font-bold text-foreground">{province.rainfall7Day}mm</div>
              </div>
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">Discharge</div>
                <div className="font-mono text-xs font-bold text-foreground">{(province.riverDischarge / 1000).toFixed(1)}k</div>
              </div>
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">Population</div>
                <div className="font-mono text-xs font-bold text-foreground">{(province.population / 1e6).toFixed(1)}M</div>
              </div>
            </div>

            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${province.riskScore}%`,
                  backgroundColor: RISK_COLORS[province.riskLevel],
                }}
              />
            </div>

            <button
              onClick={() => generatePDF(province.id)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary/50 text-muted-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
