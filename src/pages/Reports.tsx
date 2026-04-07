import { RISK_COLORS } from '@/lib/types';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

// ✅ BEAUTIFUL PDF
async function generatePDF(provinces: any[] = [], provinceId?: string) {
  try {
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF();

    const filtered = provinceId
      ? provinces.filter((p) => p.id === provinceId)
      : provinces;

    doc.setFontSize(18);
    doc.setTextColor(26, 82, 118);
    doc.text('Pakistan Flood Risk Report', 14, 20);

    let y = 30;

    filtered.forEach((p) => {
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text(p.name, 14, y);

      doc.setFontSize(10);
      doc.text(`Risk: ${p.riskScore}%`, 14, y + 6);
      doc.text(`Rainfall: ${p.rainfall7Day}mm`, 14, y + 12);
      doc.text(`Population: ${(p.population / 1e6).toFixed(1)}M`, 14, y + 18);

      y += 26;
    });

    doc.save('Flood-Report.pdf');

    toast({
      title: 'Report Downloaded',
      description: 'Professional PDF generated',
    });
  } catch (err) {
    console.error(err);
  }
}

// ✅ MAIN COMPONENT
const Reports = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:5000/api/all');
      const result = await res.json();

      setData(result.provinces || []);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Reports</h1>
          <p className="text-sm text-muted-foreground">
            Provincial Risk Assessment Summaries
          </p>
          <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
        </div>

        <button
          onClick={() => generatePDF(data)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-sm"
        >
          <Download className="w-4 h-4" /> Export All PDF
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {data.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No data available
          </div>
        ) : (
          data.map((province, i) => (
            <motion.div
              key={province.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-card border border-border hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-xl">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{province.name}</h3>
                    <p className="text-xs text-muted-foreground">Live Data</p>
                  </div>
                </div>

                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                  style={{
                    color: RISK_COLORS[province.riskLevel],
                    borderColor: RISK_COLORS[province.riskLevel] + '30',
                    backgroundColor: RISK_COLORS[province.riskLevel] + '10',
                  }}
                >
                  {province.riskScore}%
                </span>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-xl bg-muted">
                  <div className="text-[10px] text-muted-foreground">7d Rain</div>
                  <div className="font-mono text-xs font-bold">
                    {province.rainfall7Day}mm
                  </div>
                </div>

                <div className="text-center p-2 rounded-xl bg-muted">
                  <div className="text-[10px] text-muted-foreground">Discharge</div>
                  <div className="font-mono text-xs font-bold">
                    {(province.riverDischarge / 1000).toFixed(1)}k
                  </div>
                </div>

                <div className="text-center p-2 rounded-xl bg-muted">
                  <div className="text-[10px] text-muted-foreground">Population</div>
                  <div className="font-mono text-xs font-bold">
                    {(province.population / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${province.riskScore}%`,
                    backgroundColor: RISK_COLORS[province.riskLevel],
                  }}
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={() => generatePDF(data, province.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </motion.div>
          ))
        )}

      </div>
    </div>
  );
};

export default Reports;