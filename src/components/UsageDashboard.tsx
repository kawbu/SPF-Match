import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";
import { supabase, UsageStats } from "../utils/supabaseClient";
import { BarChart2, TrendingUp, Calendar, Sparkles, RefreshCw } from "lucide-react";

type ViewMode = "daily" | "weekly" | "monthly";

const DAILY_LABELS = [
  "6am", "7am", "8am", "9am", "10am", "11am",
  "12pm", "1pm", "2pm", "3pm", "4pm", "5pm",
];
const WEEKLY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHLY_LABELS = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

// Realistic sample data: peaks at midday, consistent weekdays, gradual monthly rise
const SAMPLE_DAILY: number[] = [1, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
const SAMPLE_WEEKLY: number[] = [4, 5, 6, 5, 4, 2, 2];
const SAMPLE_MONTHLY: number[] = [
  2, 3, 2, 4, 5, 3, 4, 6, 5, 4, 3, 5, 6, 7, 6,
  5, 4, 6, 7, 8, 7, 6, 5, 4, 5, 6, 5, 4, 3, 4,
];

function toChartData(values: number[], labels: string[]) {
  return values.map((value, i) => ({ label: labels[i] ?? `${i + 1}`, value }));
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-2">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-primary">{payload[0].value} uses</p>
    </div>
  );
}

export function UsageDashboard() {
  const [view, setView] = useState<ViewMode>("weekly");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seededId, setSeededId] = useState<string | null>(null);

  async function fetchById(id: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("usage_stats")
        .select("*")
        .eq("id", id)
        .single();
      if (supabaseError) throw supabaseError;
      setStats(data as UsageStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load record.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLatest() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("usage_stats")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      if (supabaseError) throw supabaseError;
      setStats(data as UsageStats);
      setSeededId((data as UsageStats).id);
    } catch (err) {
      // No rows yet — that's fine, show empty state
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatest();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from("usage_stats")
        .insert({
          daily_usage: SAMPLE_DAILY,
          weekly_usage: SAMPLE_WEEKLY,
          monthly_usage: SAMPLE_MONTHLY,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const newId = (data as { id: string }).id;
      setSeededId(newId);
      await fetchById(newId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed.");
    } finally {
      setSeeding(false);
    }
  }

  const chartData = (() => {
    if (!stats) return [];
    if (view === "daily") return toChartData(stats.daily_usage ?? [], DAILY_LABELS);
    if (view === "weekly") return toChartData(stats.weekly_usage ?? [], WEEKLY_LABELS);
    return toChartData(stats.monthly_usage ?? [], MONTHLY_LABELS);
  })();

  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);
  const peakValue = Math.max(...chartData.map((d) => d.value), 0);
  const avgValue = chartData.length ? Math.round(totalValue / chartData.length) : 0;

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: "daily", label: "Daily", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "weekly", label: "Weekly", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "monthly", label: "Monthly", icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Usage Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your sunscreen reapplication habits over time.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {seeding ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {seeding ? "Seeding…" : "Seed Sample Data"}
          </button>
        </div>

        {/* Record ID badge */}
        {seededId && (
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Record ID
            </span>
            <code className="text-xs text-foreground font-mono break-all">{seededId}</code>
          </div>
        )}

        {/* Stat cards */}
        {!loading && !error && stats && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: totalValue },
              { label: "Average", value: avgValue },
              { label: "Peak", value: peakValue },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-border p-4 shadow-sm text-center"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">uses</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  view === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
                Loading usage data…
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-56 gap-2">
                <p className="text-sm text-destructive font-medium">Could not load data</p>
                <p className="text-xs text-muted-foreground max-w-sm text-center">{error}</p>
              </div>
            )}

            {!loading && !error && !stats && (
              <div className="flex flex-col items-center justify-center h-56 gap-3 text-center">
                <p className="text-sm text-muted-foreground">No data yet.</p>
                <p className="text-xs text-muted-foreground">
                  Click <span className="font-medium text-foreground">Seed Sample Data</span> to insert a record and see the chart.
                </p>
              </div>
            )}

            {!loading && !error && stats && (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval={view === "monthly" ? 4 : 0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#usageGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Last updated */}
        {stats?.updated_at && (
          <p className="text-center text-xs text-muted-foreground">
            Last updated:{" "}
            {new Date(stats.updated_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
