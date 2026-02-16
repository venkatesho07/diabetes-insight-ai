import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { fetchHistory, downloadReport, isAuthenticated, clearToken, type HistoryRecord } from "@/lib/api";
import { FileDown, LogOut, HeartPulse, ArrowLeft, ShieldCheck, ShieldAlert, Users, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/login"); return; }
    fetchHistory()
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { clearToken(); navigate("/login"); };
  const handleDownload = async (id: number) => {
    try { await downloadReport(id); }
    catch (err: any) { if (err.message.includes("expired")) navigate("/login"); else alert(err.message); }
  };

  const stats = {
    total: records.length,
    diabetic: records.filter(r => r.result === "Diabetic").length,
    avgConfidence: records.length ? Math.round(records.reduce((s, r) => s + r.confidence, 0) / records.length) : 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-primary-foreground">Doctor Dashboard</h1>
              <p className="text-xs text-primary-foreground/60">Prediction Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Predictions", value: stats.total, icon: Users, color: "text-primary" },
            { label: "Diabetic Cases", value: stats.diabetic, icon: Activity, color: "text-destructive" },
            { label: "Avg Confidence", value: `${stats.avgConfidence}%`, icon: TrendingUp, color: "text-success" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-border rounded-2xl shadow-card hover:shadow-elevated transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-premium border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-foreground">Prediction History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-muted-foreground py-8 text-center">Loading…</p>}
              {error && <p className="text-destructive py-8 text-center">{error}</p>}
              {!loading && !error && records.length === 0 && (
                <div className="text-center py-16">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No predictions recorded yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Use the prediction form on the home page to get started.</p>
                </div>
              )}
              {!loading && records.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Glucose</TableHead>
                        <TableHead>BMI</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Report</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((r) => (
                        <TableRow key={r.id} className="hover:bg-accent/30">
                          <TableCell className="font-medium">{r.id}</TableCell>
                          <TableCell className="font-medium">{r.patient_name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-lg ${
                              r.result === "Diabetic" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                            }`}>
                              {r.result === "Diabetic" ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                              {r.result}
                            </span>
                          </TableCell>
                          <TableCell>{r.confidence}%</TableCell>
                          <TableCell>{r.glucose}</TableCell>
                          <TableCell>{r.bmi}</TableCell>
                          <TableCell>{r.age}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleDownload(r.id)}>
                              <FileDown className="w-4 h-4 mr-1" /> PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
