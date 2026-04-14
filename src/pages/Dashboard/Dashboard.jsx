import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const { state } = useContext(AppContext);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  const [candidatesChartData, setCandidatesChartData] = useState([]);
  
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [jobsTypeData, setJobsTypeData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const [candidatesResult, jobsResult] = await Promise.all([
          api.get('/candidates'),
          api.get('/jobs')
        ]);

        // --- Handle Candidates ---
        setCandidatesCount(candidatesResult.length);
        setHiredCount(candidatesResult.filter(c => c.status?.toLowerCase() === 'hired').length);

        const statusCounts = candidatesResult.reduce((acc, c) => {
          const status = c.status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const dynamicChartData = Object.keys(statusCounts).map(key => ({
          name: key,
          count: statusCounts[key],
        })).sort((a, b) => b.count - a.count); // sort highest first

        setCandidatesChartData(dynamicChartData);

        // --- Handle Jobs ---
        setActiveJobsCount(jobsResult.filter(j => j.status?.toLowerCase() === 'active').length);

        const typeDataAggregation = jobsResult.reduce((acc, job) => {
          const type = job.type || 'Unknown';
          acc[type] = (acc[type] || { name: type, count: 0 });
          acc[type].count += 1;
          return acc;
        }, {});
        setJobsTypeData(Object.values(typeDataAggregation));

        const departmentAggregation = jobsResult.reduce((acc, job) => {
          const dep = job.department || 'Unknown';
          acc[dep] = (acc[dep] || { name: dep, value: 0 });
          acc[dep].value += 1;
          return acc;
        }, {});
        setPieData(Object.values(departmentAggregation));

      } catch (error) {
        console.error("Failed to fetch dashboard metrics");
      }
    };
    fetchDashboardCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-transform hover:scale-105 duration-300">
          <h3 className="text-blue-600 font-semibold mb-2">Total Candidates</h3>
          <p className="text-4xl font-bold text-blue-900">{candidatesCount}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm transition-transform hover:scale-105 duration-300">
          <h3 className="text-emerald-600 font-semibold mb-2">Hired Candidates</h3>
          <p className="text-4xl font-bold text-emerald-900">{hiredCount}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm transition-transform hover:scale-105 duration-300">
          <h3 className="text-purple-600 font-semibold mb-2">Active Jobs</h3>
          <p className="text-4xl font-bold text-purple-900">{activeJobsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates Graph */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm h-[400px]">
          <h3 className="text-lg font-semibold mb-6 text-slate-800 border-b pb-2">Candidates Overview by Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={candidatesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} allowDecimals={false} />
              <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                {candidatesChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Jobs Graphs */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-rows-2 lg:h-[400px]">
          {/* Jobs by Type */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm min-h-[300px] lg:min-h-0">
            <h3 className="text-lg font-semibold mb-2 text-slate-800 border-b pb-2">Jobs by Employment Type</h3>
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie 
                  data={jobsTypeData} 
                  dataKey="count" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={65} 
                  innerRadius={30}
                  fill="#8884d8" 
                  label
                >
                  {jobsTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs by Department */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between min-h-[300px] lg:min-h-0 lg:h-full">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 border-b pb-2">Job Departments</h3>
            </div>
            <div className="w-full flex-grow pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: 'white' }} activeDot={{ r: 6 }} name="Jobs" />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
