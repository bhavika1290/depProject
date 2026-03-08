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
        totalApplications: 0,
        totalOfferings: 0,
        totalCycles: 0,
        categoryStats: [
            { name: 'GEN', Applications: 10 },
            { name: 'EWS', Applications: 5 },
            { name: 'OBC', Applications: 15 },
            { name: 'SC', Applications: 8 },
            { name: 'ST', Applications: 4 },
        ],
        genderStats: [
            { name: 'Male', Applications: 25 },
            { name: 'Female', Applications: 17 },
        ]
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
                        <span className="stat-value">Admission Cycles</span>
                        <span className="stat-label">for 2022-23</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--premium-purple)' }}>
                        <MdPeople />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalApplications}</span>
                        <span className="stat-label">Total Application</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-container">
                    <div className="chart-header">
                        <h4>Category-Wise Applications</h4>
                        <select className="chart-select">
                            <option>- Select -</option>
                            <option>All Offerings</option>
                        </select>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.categoryStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend />
                                <Bar dataKey="Applications" fill="#00a3c4" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <div className="chart-header">
                        <h4>Gender-Wise Applications</h4>
                        <select className="chart-select">
                            <option>- Select -</option>
                        </select>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.genderStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend />
                                <Bar dataKey="Applications" fill="#00a3c4" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
