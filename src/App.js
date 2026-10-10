import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import {
  LayoutDashboard, ClipboardList, Activity, AlertCircle, TrendingUp, CheckCircle2, Lightbulb, Info, Settings, X, Server
} from 'lucide-react';

// --- LIGHT BEIGE & PLUM PALETTE ---
const colors = {
  bgApp: '#EFE8E1',
  bgSidebar: '#E6D8CA', // The Hex code for the left sidebar!
  card: '#FFFFFF',
  textDark: '#320A28',
  textMuted: '#511730',
  accentRed: '#8E443D',
  accentOrange: '#E08E45',
  peach: '#FACFAD'
};

// --- MOCK DATA ---
const demandData = [
  { day: 'Mon', sales: 120, trueDemand: 120 },
  { day: 'Tue', sales: 135, trueDemand: 155 },
  { day: 'Wed', sales: 110, trueDemand: 110 },
  { day: 'Thu', sales: 140, trueDemand: 180 },
  { day: 'Fri', sales: 160, trueDemand: 160 },
  { day: 'Sat', sales: 180, trueDemand: 240 },
  { day: 'Sun', sales: 150, trueDemand: 150 },
];

const initialOrderData = [
  { id: '102', name: 'Fresh Strawberries', prevAvg: 25, rec: 35, insight: 'Sells out by 3 PM. Demand is 40% higher.', status: 'Increase Order', discount: 'None' },
  { id: '883', name: 'Artisan Sourdough', prevAvg: 40, rec: 30, insight: 'Consistent daily waste. Recommend cutting back.', status: 'Reduce Waste', discount: '5% Markdown' },
  { id: '211', name: 'Whole Milk (1L)', prevAvg: 120, rec: 125, insight: 'Steady seller. Added small buffer for traffic.', status: 'On Track', discount: 'None' },
  { id: '405', name: 'Organic Bananas', prevAvg: 80, rec: 85, insight: 'Trending up slightly. Very low risk of waste.', status: 'On Track', discount: 'None' },
  { id: '512', name: 'Croissants (4pk)', prevAvg: 15, rec: 25, insight: 'Highly volatile. Customers request when empty.', status: 'Increase Order', discount: 'None' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeSlider, setTimeSlider] = useState(14);
  const [costAssump, setCostAssump] = useState(60);
  const [wasteAssump, setWasteAssump] = useState(10);
  
  // Controls the collapsible right sidebar
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // State to hold data from your Python backend
  const [orderData, setOrderData] = useState(initialOrderData);

  // --- PYTHON BACKEND CONNECTION ---
  useEffect(() => {
    // Uncomment this when your Python Flask/FastAPI server is running.
    /*
    const fetchDataFromPython = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get-orders');
        const result = await response.json();
        setOrderData(result.data); // Updates the table with your live Python data
      } catch (error) {
        console.error("Make sure your Python backend is running!", error);
      }
    };
    fetchDataFromPython();
    */
  }, []);

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-[#E6D8CA] shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EFE8E1] text-[#320A28] font-sans flex text-sm selection:bg-[#FACFAD]">
      
      {/* LEFT SIDEBAR - #E6D8CA */}
      <div className="w-64 bg-[#E6D8CA] flex flex-col shrink-0 z-20 border-r border-[#DBCBBF]">
        
        {/* LOGO SECTION - Enlarged 3x and Two-Line Text */}
        <div className="py-8 flex items-center px-6 border-b border-[#DBCBBF]/50">
          <div className="flex items-center gap-4">
            {/* The Logo is now 96px x 96px (h-24 w-24) with inner padding so it doesn't touch the edges */}
            <img 
              src="/logo.png" 
              alt="Shelf Help Logo" 
              className="h-24 w-24 object-contain rounded-2xl shadow-md bg-white p-2" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <div className="flex flex-col">
              <span className="text-[#320A28] font-black text-2xl tracking-tight leading-none mb-1">Shelf</span>
              <span className="text-[#8E443D] font-black text-2xl tracking-tight leading-none">Help</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-b border-[#DBCBBF]/50">
          <div className="text-[11px] font-bold text-[#8E443D] uppercase tracking-wider mb-1">Active Profile</div>
          <div className="text-[#320A28] font-semibold text-base">Downtown Market</div>
          <div className="text-[12px] text-[#511730] mt-1 font-medium">5,117 SKUs Tracked</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'dashboard', name: 'Store Overview', icon: LayoutDashboard },
            { id: 'orders', name: 'Order Recommendations', icon: ClipboardList },
            { id: 'radar', name: 'Intraday Tracker', icon: Activity },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === item.id 
                ? 'bg-[#320A28] text-white shadow-md' 
                : 'text-[#511730] hover:bg-white/40 hover:text-[#320A28]'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} className={activeTab === item.id ? 'text-[#E08E45]' : 'text-[#8E443D]'} />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* CENTER WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 bg-[#EFE8E1] flex items-center justify-between px-8 shrink-0 z-10 border-b border-[#E6D8CA]">
          <h1 className="text-2xl font-bold text-[#320A28] tracking-tight">
            {activeTab === 'dashboard' && "Store Overview & Performance"}
            {activeTab === 'orders' && "Tomorrow's Orders & Markdown Pilot"}
            {activeTab === 'radar' && "Live Inventory Tracker"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#511730] bg-[#FACFAD]/50 border border-[#FACFAD] px-3 py-1.5 rounded-md">
              <Info size={14} className="text-[#E08E45]" /> Replay Data: June 12 - 25
            </div>
            {/* Settings Toggle Button */}
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-md transition-colors ${isSettingsOpen ? 'bg-[#320A28] text-white' : 'bg-white text-[#511730] border border-[#DBCBBF] hover:bg-[#E6D8CA]'}`}
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-hidden flex">
          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            
            {/* VIEW: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                {/* HERO INSIGHTS CARD */}
                <div className="bg-gradient-to-r from-[#320A28] to-[#511730] rounded-xl p-8 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <Lightbulb size={200} className="translate-x-1/4 -translate-y-1/4" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-[#FACFAD]">
                      <Lightbulb size={16} /> <span className="text-[11px] font-bold uppercase tracking-widest">Key Insight</span>
                    </div>
                    <h3 className="font-bold text-2xl leading-tight mb-3">You are ordering too safely.</h3>
                    <p className="text-[14px] font-medium leading-relaxed text-[#FACFAD] max-w-3xl mb-5">
                      In the last 14 days, shelves ran empty on 46% of product-days. Because sales data doesn't record what customers <i>wanted</i> to buy when shelves were empty, your past averages are artificially low.
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-white/20">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#E08E45]">Impact of New Plan:</span>
                      <div className="text-[13px] font-bold text-white flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={16} className="text-[#FACFAD]"/> 
                        Capture +5.4% more sales without increasing waste.
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="!p-5">
                    <div className="text-[11px] font-bold text-[#8E443D] mb-1 uppercase tracking-wider">Missed Sales</div>
                    <div className="text-2xl font-black text-[#320A28]">17.0%</div>
                    <div className="text-xs font-semibold text-[#E08E45] flex items-center gap-1 mt-2"><AlertCircle size={14}/> 46% of items ran empty</div>
                  </Card>
                  <Card className="!p-5">
                    <div className="text-[11px] font-bold text-[#8E443D] mb-1 uppercase tracking-wider">Current Fill Rate</div>
                    <div className="text-2xl font-black text-[#320A28]">72.6%</div>
                    <div className="text-xs font-semibold text-[#511730]/70 mt-2">Customer demand met</div>
                  </Card>
                  <Card className="!p-5">
                    <div className="text-[11px] font-bold text-[#8E443D] mb-1 uppercase tracking-wider">Est. Waste Reduction</div>
                    <div className="text-2xl font-black text-[#320A28]">-28.6%</div>
                    <div className="text-xs font-semibold text-[#511730]/70 mt-2">If new orders applied</div>
                  </Card>
                  <Card className="!p-5 bg-gradient-to-br from-[#8E443D] to-[#511730] border-transparent text-white">
                    <div className="text-[11px] font-bold mb-1 uppercase tracking-wider text-[#FACFAD]">Profit Opportunity</div>
                    <div className="text-2xl font-black">+12.5%</div>
                    <div className="text-xs font-medium text-[#FACFAD]/90 flex items-center gap-1 mt-2"><TrendingUp size={14}/> With optimized orders</div>
                  </Card>
                </div>

                {/* Invisible Demand Chart */}
                <Card>
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-[#320A28] text-lg">The Invisible Demand Gap</h3>
                      <p className="text-xs font-medium text-[#511730]/70 mt-1">Comparing logged sales (solid) vs. true customer demand (dashed).</p>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={demandData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FACFAD" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FACFAD" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6D8CA" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8E443D', fontSize: 11, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#8E443D', fontSize: 11, fontWeight: 600}} />
                        <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #E6D8CA', backgroundColor: '#FFFFFF', color: '#320A28' }} />
                        <Area type="monotone" dataKey="sales" name="Logged Sales" stroke="#8E443D" strokeWidth={2} fill="url(#colorSales)" />
                        <Line type="monotone" dataKey="trueDemand" name="True Demand" stroke="#E08E45" strokeWidth={2.5} strokeDasharray="5 5" dot={{r: 4, strokeWidth: 2, fill: '#FFFFFF', stroke: '#E08E45'}} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </>
            )}

            {/* VIEW: ORDER PLANNER */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <Card className="!p-0 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E6D8CA] bg-[#FAF4ED] text-[#511730] text-[11px] uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold w-1/4">Product</th>
                        <th className="px-6 py-4 font-bold text-center">Past Avg</th>
                        <th className="px-6 py-4 font-bold text-center text-[#8E443D]">New Order</th>
                        <th className="px-6 py-4 font-bold w-1/3">Insights</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6D8CA]/50 text-[13px]">
                      {orderData.map((row, i) => (
                        <tr key={i} className="hover:bg-[#FAF4ED]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#320A28] text-sm">{row.name}</div>
                            <div className="text-[11px] text-[#8E443D] font-medium mt-0.5">SKU {row.id}</div>
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-[#511730]">{row.prevAvg}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-block bg-[#E08E45]/10 text-[#E08E45] font-black px-3 py-1 rounded-md text-base border border-[#E08E45]/20">
                              {row.rec}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[12px] font-medium text-[#511730] leading-relaxed pr-8">
                            {row.insight}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              row.status === 'Increase Order' ? 'bg-[#320A28]/10 text-[#320A28] border-[#320A28]/20' : 
                              row.status === 'Reduce Waste' ? 'bg-[#E08E45]/10 text-[#E08E45] border-[#E08E45]/20' : 
                              'bg-[#EFE8E1] text-[#8E443D] border-[#DBCBBF]'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {/* VIEW: INTRADAY RADAR */}
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <Card className="!p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-bold text-xl text-[#320A28] mb-1">Time Travel Simulator</h3>
                      <p className="text-xs font-medium text-[#511730]/70">Slide to see how the system tracks your 5,117 products throughout the day.</p>
                    </div>
                    <div className="text-3xl font-black text-[#E08E45] font-mono bg-[#FACFAD]/30 px-5 py-2 rounded-xl border border-[#FACFAD]">
                      {timeSlider}:00
                    </div>
                  </div>
                  
                  <div className="relative w-full flex items-center">
                    <input 
                      type="range" min="8" max="22" step="1"
                      value={timeSlider} 
                      onChange={(e) => setTimeSlider(parseInt(e.target.value, 10))}
                      className="w-full h-2.5 bg-[#E6D8CA] rounded-full appearance-none cursor-pointer accent-[#8E443D] outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-[#8E443D] uppercase tracking-wider mt-4">
                    <span>08:00 (Store Opens)</span>
                    <span>22:00 (Store Closes)</span>
                  </div>
                </Card>

                {timeSlider > 12 ? (
                  <Card className="!p-0 overflow-hidden">
                    <div className="bg-[#E08E45]/10 px-6 py-4 flex items-center justify-between border-b border-[#E08E45]/20">
                      <div className="flex items-center gap-2 text-[#8E443D]">
                        <AlertCircle size={18} strokeWidth={2.5} />
                        <span className="font-bold text-[13px]">3 exceptions require your attention.</span> 
                      </div>
                      <span className="text-[11px] font-bold text-[#320A28] bg-white px-3 py-1 rounded-full border border-[#DBCBBF] shadow-sm">4,982 products on track</span>
                    </div>
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-[#E6D8CA]">
                        <tr className="hover:bg-[#FAF4ED] transition-colors">
                          <td className="p-6 w-1/3">
                            <div className="font-bold text-[#320A28] text-base mb-1">Organic Bananas</div>
                            <div className="text-[11px] text-[#E08E45] font-bold uppercase tracking-wider">Stockout in 45 mins</div>
                          </td>
                          <td className="p-6 text-[#511730] text-[13px] font-medium leading-relaxed">
                            Sales pace has doubled compared to typical Tuesdays. Only 12 units remain on shelf.
                          </td>
                        </tr>
                        <tr className="hover:bg-[#FAF4ED] transition-colors">
                          <td className="p-6 w-1/3">
                            <div className="font-bold text-[#320A28] text-base mb-1">Artisan Sourdough</div>
                            <div className="text-[11px] text-[#8E443D] font-bold uppercase tracking-wider">Slow movement (Waste)</div>
                          </td>
                          <td className="p-6 text-[#511730] text-[13px] font-medium leading-relaxed">
                            28 units remain. Unlikely to sell out by closing time based on current foot traffic.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Card>
                ) : (
                  <Card className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-[#FACFAD]/40 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={40} className="text-[#E08E45]" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-xl text-[#320A28] mb-2">All systems nominal</h3>
                    <p className="text-[14px] font-medium text-[#511730]/80 max-w-sm leading-relaxed">At {timeSlider}:00, sales are matching the forecasted run-rate.</p>
                  </Card>
                )}
              </div>
            )}
            
          </main>

          {/* COLLAPSIBLE RIGHT SIDEBAR - Configuration */}
          {isSettingsOpen && (
            <div className="w-80 bg-white border-l border-[#E6D8CA] shadow-xl p-6 overflow-y-auto z-20 transition-all duration-300 relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-lg text-[#320A28]">Configurations</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-[#8E443D] hover:bg-[#EFE8E1] p-1 rounded-md transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Python Backend Connection Status */}
              <div className="bg-[#FAF4ED] rounded-lg p-4 border border-[#E6D8CA] mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#320A28] text-xs flex items-center gap-1.5">
                    <Server size={14} className="text-[#8E443D]" /> Backend Status
                  </h3>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#511730]">Model: <span className="font-mono bg-white border border-[#DBCBBF] px-1 py-0.5 rounded">LightGBM_v2.py</span></p>
                <p className="text-[10px] text-[#511730]/70 mt-1">Last Sync: Today, 08:32 AM</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[12px] font-bold text-[#8E443D] uppercase tracking-wider mb-1">Financial Assumptions</h3>
                  <p className="text-[12px] font-medium text-[#511730]/70 mb-5 leading-relaxed">System logic depends on your cost margins. Adjust these to alter order aggressiveness.</p>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-[#320A28] mb-2">
                        <span>Base Item Cost</span>
                        <span className="bg-[#EFE8E1] px-2 py-0.5 rounded border border-[#DBCBBF]">{costAssump}% of price</span>
                      </div>
                      <input type="range" min="40" max="70" step="1" value={costAssump} onChange={(e) => setCostAssump(parseInt(e.target.value, 10))} className="w-full h-2 bg-[#E6D8CA] rounded-full appearance-none accent-[#8E443D] cursor-pointer outline-none" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-[#320A28] mb-2">
                        <span>Disposal / Waste Cost</span>
                        <span className="bg-[#EFE8E1] px-2 py-0.5 rounded border border-[#DBCBBF]">{wasteAssump}% per item</span>
                      </div>
                      <input type="range" min="0" max="20" step="1" value={wasteAssump} onChange={(e) => setWasteAssump(parseInt(e.target.value, 10))} className="w-full h-2 bg-[#E6D8CA] rounded-full appearance-none accent-[#8E443D] cursor-pointer outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}