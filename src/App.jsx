import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, LabelList
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Layers, Calendar, Info,
  Search, Menu, X, Filter, ChevronRight, Globe, MapPin,
  Code, Server, Smartphone, Terminal, Database, ShieldCheck, BrainCircuit, Monitor, Languages
} from 'lucide-react';

// --- GENİŞLETİLMİŞ TEKNOLOJİ SÖZLÜĞÜ VE VERİ SETİ ---
import trendsData from './data/trends.json';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  tr: {
    sidebar: {
      title: "IT Trendleri",
      subtitle: "Piyasa Analizi",
      categories: "Kategoriler",
      all: "Genel Bakış",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobil Geliştirme",
      devops: "DevOps & Bulut",
      test: "Test / QA",
      data: "Veri & YZ",
      database: "Veritabanı",
      tools: "Araçlar & IDE",
      os: "İşletim Sistemleri"
    },
    header: {
      title: "Sektörel Trend Analizi",
      subtitle: "Yazılım dünyasında en çok talep edilen uzmanlıklar.",
      searchPlaceholder: "Yetenek ara..."
    },
    stats: {
      analyzedJobs: "Analiz Edilen İlan",
      fastestRising: "En Hızlı Yükselen",
      trendVelocity: "Trend İvmesi",
      region: "Bölge",
      analyzing: "Hesaplanıyor..."
    },
    charts: {
      growthTrends: "Büyüme Trendleri",
      yearlyAnalysis: "YILLIK ANALİZ",
      prediction: "TAHMİN v.1",
      topSkills: "İlk 8 Yetenek",
      jobs: "İlan"
    },
    regions: {
      global: "Global",
      tr: "Türkiye"
    }
  },
  en: {
    sidebar: {
      title: "IT Trends",
      subtitle: "Market Analyzer",
      categories: "Categories",
      all: "Overview",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile Dev",
      devops: "DevOps & Cloud",
      test: "Test / QA",
      data: "Data & AI",
      database: "Database",
      tools: "Tools & IDE",
      os: "Operating Systems"
    },
    header: {
      title: "Sector Trend Analysis",
      subtitle: "Most in-demand specializations in the software world.",
      searchPlaceholder: "Search skills..."
    },
    stats: {
      analyzedJobs: "Analyzed Jobs",
      fastestRising: "Fastest Rising",
      trendVelocity: "Trend Velocity",
      region: "Region",
      analyzing: "Calculating..."
    },
    charts: {
      growthTrends: "Growth Trends",
      yearlyAnalysis: "YEARLY ANALYSIS",
      prediction: "PREDICTION v.1",
      topSkills: "Top 8 Skills",
      jobs: "Jobs"
    },
    regions: {
      global: "Global",
      tr: "Turkey"
    }
  }
};

const CATEGORIES = [
  { id: "Hepsi", key: "all", icon: <LayoutDashboard size={18} /> },
  { id: "Frontend", key: "frontend", icon: <Layers size={18} /> },
  { id: "Backend", key: "backend", icon: <Server size={18} /> },
  { id: "Mobile", key: "mobile", icon: <Smartphone size={18} /> },
  { id: "DevOps", key: "devops", icon: <Terminal size={18} /> },
  { id: "Test", key: "test", icon: <ShieldCheck size={18} /> },
  { id: "Data", key: "data", icon: <BrainCircuit size={18} /> },
  { id: "Database", key: "database", icon: <Database size={18} /> },
  { id: "Tools", key: "tools", icon: <Code size={18} /> },
  { id: "OS", key: "os", icon: <Monitor size={18} /> }
];

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899',
  '#6366f1', '#14b8a6', '#f97316', '#d946ef', '#84cc16', '#a855f7', '#0ea5e9',
  '#2dd4bf', '#fb923c', '#e879f9', '#a3e635'
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [selectedRegion, setSelectedRegion] = useState("TR"); // Default to Turkey for realism context
  const [lang, setLang] = useState("tr"); // 'tr' or 'en'
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [searchTerm, setSearchTerm] = useState("");

  const t = TRANSLATIONS[lang]; // Current translation object
  // Use the imported data
  const data = trendsData;

  // Listen for screen size changes for mobile responsiveness
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    let filtered = data.filter(item => item.region === selectedRegion); // Region Filter

    if (selectedCategory !== "Hepsi") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => item.skill.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  }, [selectedCategory, searchTerm, selectedRegion, data]);

  // Find Top 10 Skills (For Overview)
  const top10Skills = useMemo(() => {
    if (selectedCategory !== "Hepsi") return null;

    const totals = {};
    filteredData.forEach(d => {
      // We can sort by the latest year's data or by total.
      // To avoid clutter, we pick the most popular ones in the latest year (2026).
      if (d.year === 2026) {
        totals[d.skill] = (totals[d.skill] || 0) + d.count;
      }
    });

    // If no 2026 data exists (due to filtering etc.), look at all data
    if (Object.keys(totals).length === 0) {
      filteredData.forEach(d => totals[d.skill] = (totals[d.skill] || 0) + d.count);
    }

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // TOP 10
      .map(entry => entry[0]);
  }, [filteredData, selectedCategory]);

  // Time Series Formatting
  const chartData = useMemo(() => {
    const years = [...new Set(data.map(d => d.year))].sort();
    return years.map(year => {
      const entry = { year };

      // Which skills to show?
      // If "All" is selected, ONLY show Top 10 skills.
      // If a category is selected, show filtered skills in that category.
      const skillsToShow = top10Skills ? top10Skills : null;

      filteredData.filter(d => d.year === year).forEach(d => {
        if (skillsToShow) {
          if (skillsToShow.includes(d.skill)) {
            entry[d.skill] = d.count;
          }
        } else {
          entry[d.skill] = d.count;
        }
      });
      return entry;
    });
  }, [filteredData, data, top10Skills]);

  // List of skills to display (for Lines and Legend)
  const skillsToDisplay = useMemo(() => {
    if (top10Skills) return top10Skills;
    const skills = new Set();
    filteredData.forEach(d => skills.add(d.skill));
    return Array.from(skills);
  }, [top10Skills, filteredData]);

  // Skill Distribution and Percentage Calculation (Bar Chart)
  const skillStats = useMemo(() => {
    // Only use the latest year (2026) to show current popularity
    // Aggregating all years might produce misleading data.
    // However, if the user selects "All", we look at the general total.
    // Generally, in "Trend" analysis, the latest data is important.
    // Here, for simplicity, we take the totals of the currently filtered data
    // (filteredData is already filtered)

    // For a more accurate "Snapshot", we could take only the last year or the average/total of all years.
    // User request: "No need to read tables".
    // We use totals from the filtered dataset.
    const totals = {};
    filteredData.forEach(d => {
      if (d.year === 2026) { // Priority on latest data (Optional)
        totals[d.skill] = (totals[d.skill] || 0) + d.count;
      }
    });

    // If filter result is empty (or 2026 is filtered out), use all data
    if (Object.keys(totals).length === 0) {
      filteredData.forEach(d => {
        totals[d.skill] = (totals[d.skill] || 0) + d.count;
      });
    }

    const totalCount = Object.values(totals).reduce((a, b) => a + b, 0);

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        percent: totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // Statistic Calculations (Dynamic)
  const stats = useMemo(() => {
    // 1. Total Analyzed Jobs (Sum of all years)
    const totalJobs = filteredData.reduce((acc, curr) => acc + curr.count, 0);

    // 2. Fastest Rising (Growth from 2025 -> 2026)
    // Only among skills in the current filter
    const growthRates = {};
    const data2025 = filteredData.filter(d => d.year === 2025);
    const data2026 = filteredData.filter(d => d.year === 2026);

    data2026.forEach(d26 => {
      const d25 = data2025.find(d => d.skill === d26.skill);
      if (d25 && d25.count > 0) {
        growthRates[d26.skill] = ((d26.count - d25.count) / d25.count) * 100;
      }
    });

    const bestGrowth = Object.entries(growthRates).sort((a, b) => b[1] - a[1])[0];
    const fastestRising = bestGrowth ? bestGrowth[0] : t.stats.analyzing;
    const fastestRate = bestGrowth ? `+${bestGrowth[1].toFixed(1)}%` : "-";

    // 3. Yearly Growth (Total Volume)
    const count2022 = filteredData.filter(d => d.year === 2022).reduce((a, b) => a + b.count, 0);
    const count2026 = filteredData.filter(d => d.year === 2026).reduce((a, b) => a + b.count, 0);
    const yearlyGrowth = count2022 > 0 ? (((count2026 - count2022) / count2022) * 100).toFixed(1) : 0;

    return [
      { label: t.stats.analyzedJobs, val: totalJobs.toLocaleString(), color: "from-blue-500/20 to-indigo-500/20", text: "text-blue-400" },
      { label: t.stats.fastestRising, val: fastestRising, color: "from-emerald-500/20 to-teal-500/20", text: "text-emerald-400" },
      { label: t.stats.trendVelocity, val: fastestRate, color: "from-amber-500/20 to-orange-500/20", text: "text-amber-400" }, // Instead of growth, the rate of the fastest one
      { label: t.stats.region, val: selectedRegion === "TR" ? t.regions.tr : t.regions.global, color: "from-purple-500/20 to-pink-500/20", text: "text-purple-400" }
    ];
  }, [filteredData, selectedRegion, t]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans overflow-hidden relative">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 lg:relative
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'} 
        bg-[#1e293b] border-r border-slate-700 transition-all duration-300 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 shrink-0">
              <TrendingUp size={24} className="text-white" />
            </div>
            {isSidebarOpen && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <span className="font-bold text-xl tracking-tight text-white block">{t.sidebar.title}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{t.sidebar.subtitle}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <p className={`text-[10px] font-bold text-slate-500 uppercase mb-4 px-2 transition-opacity duration-200 ${!isSidebarOpen && 'lg:text-center opacity-0 lg:opacity-100'}`}>
            {isSidebarOpen ? t.sidebar.categories : "•••"}
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${selectedCategory === cat.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <div className={`${selectedCategory === cat.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {cat.icon}
              </div>
              {isSidebarOpen && <span className="font-medium">{t.sidebar[cat.key]}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-[#0f172a] to-[#111827]">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 bg-slate-800 rounded-lg text-white"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3 flex-wrap">
                {t.header.title} <span className="text-xs lg:text-sm font-normal bg-blue-500/10 text-blue-400 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full border border-blue-500/20">v2.1</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm lg:text-lg">{t.header.subtitle}</p>
            </div>
          </div>

          <div className="flex w-full lg:w-auto gap-3 items-center">
            {/* Language Toggle */}
            <div className="bg-[#1e293b] p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                onClick={() => setLang("tr")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${lang === "tr" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${lang === "en" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
              >
                EN
              </button>
            </div>

            {/* Region Toggle */}
            <div className="bg-[#1e293b] p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                onClick={() => setSelectedRegion("Global")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${selectedRegion === "Global" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Globe size={16} /> {t.regions.global}
              </button>
              <button
                onClick={() => setSelectedRegion("TR")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${selectedRegion === "TR" ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <MapPin size={16} /> {t.regions.tr}
              </button>
            </div>

            <div className="relative flex-1 lg:w-60">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder={t.header.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-inner"
              />
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-2xl border border-slate-700 transition shadow-lg shrink-0">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden group`}>
              <div className="absolute -right-4 -bottom-4 bg-white/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <p className={`text-3xl font-black mt-3 ${stat.text}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

          {/* Zaman Serisi */}
          <div className="xl:col-span-2 bg-[#1e293b]/50 backdrop-blur-md p-4 lg:p-8 rounded-3xl border border-slate-700/50 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-blue-500" /> {t.charts.growthTrends}
              </h3>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{t.charts.yearlyAnalysis}</span>
                <span className="bg-slate-700 text-slate-400 px-2 py-1 rounded uppercase tracking-tighter">{t.charts.prediction}</span>
              </div>
            </div>
            <div className="h-[300px] lg:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="year" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  {skillsToDisplay.map((skill, idx) => (
                    <Line
                      key={skill}
                      type="monotone"
                      dataKey={skill}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={4}
                      dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart & Stats */}
          <div className="flex flex-col gap-8">
            <div className="bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl flex-1">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Layers className="text-emerald-500" /> {t.charts.topSkills}
              </h3>
              <div className="h-[300px] lg:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillStats.slice(0, 8)} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                      formatter={(value, name, props) => [`${value} ${t.charts.jobs} (%${props.payload.percent})`, name]}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      {skillStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <LabelList
                        dataKey="percent"
                        position="right"
                        fill="#94a3b8"
                        fontSize={12}
                        fontWeight="bold"
                        formatter={(val) => `%${val}`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Info */}
        <div className="bg-[#1e293b]/30 p-6 rounded-3xl border border-slate-700/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Info size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Veri Kaynağı Hakkında</p>
              <p className="text-xs text-slate-400">Analizler LinkedIn, GitHub Trends ve Stack Overflow anket verileri temel alınarak Node.js motorumuzla işlenmektedir.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition border border-slate-700">Raporu İndir</button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20">Paylaş</button>
          </div>
        </div>

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
