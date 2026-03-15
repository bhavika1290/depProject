import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/apiCore';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { MdLibraryBooks, MdCalendarToday, MdPeople } from 'react-icons/md';

export default function AdminDashboard() {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        genderStats: [
            { name: 'Male', Applications: 0 },
            { name: 'Female', Applications: 0 },
        ],
        departmentStats: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            // Assuming the API might not have all chart data yet, we merge with defaults
            setStats(prev => ({
                ...prev,
                ...res.data.data
            }));
        } catch (error) {
            console.error('Failed to load admin dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading admin dashboard...</div>;

    return (
        <div className="animate-fade-in">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--premium-red)' }}>
                        <MdLibraryBooks />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalOfferings}</span>
                        <span className="stat-label">Total Offerings</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--premium-orange)' }}>
                        <MdCalendarToday />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalCycles}</span>
                        <span className="stat-label">Cycles ({stats.activeCycle?.name || 'None Active'})</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--premium-purple)' }}>
                        <MdPeople />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalApplications}</span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-container" style={{ gridColumn: 'span 2' }}>
                    <div className="chart-header">
                        <h4>Department-Wise Distribution</h4>
                        <div className="chart-subtitle">Applications across different engineering/science departments</div>
                    </div>
                    <div className="chart-body" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.departmentStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="Applications" fill="var(--premium-red)" radius={[6, 6, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <div className="chart-header">
                        <h4>Category Breakdown</h4>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.categoryStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="Applications" fill="var(--premium-orange)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <div className="chart-header">
                        <h4>Gender Diversity</h4>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.genderStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="Applications" fill="var(--premium-purple)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
