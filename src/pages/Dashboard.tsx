import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchHistory, downloadReport, isAuthenticated, clearToken, type HistoryRecord } from "@/lib/api";
import { FileDown, LogOut, HeartPulse, ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchHistory()
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const handleDownload = async (id: number) => {
    try {
      await downloadReport(id);
    } catch (err: any) {
      if (err.message.includes("expired")) navigate("/login");
      else alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-primary-foreground" />
            <h1 className="text-xl font-bold font-display text-primary-foreground">
              Doctor Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Prediction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {error && <p className="text-destructive">{error}</p>}

            {!loading && !error && records.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No predictions recorded yet. Use the prediction form on the home page first.
              </p>
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
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.patient_name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                            r.result === "Diabetic" ? "text-destructive" : "text-success"
                          }`}>
                            {r.result === "Diabetic" ? (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            {r.result}
                          </span>
                        </TableCell>
                        <TableCell>{r.confidence}%</TableCell>
                        <TableCell>{r.glucose}</TableCell>
                        <TableCell>{r.bmi}</TableCell>
                        <TableCell>{r.age}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(r.id)}
                          >
                            <FileDown className="w-4 h-4 mr-1" />
                            PDF
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
      </main>
    </div>
  );
};

export default Dashboard;
