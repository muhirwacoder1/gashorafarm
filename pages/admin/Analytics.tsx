import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Analytics: React.FC = () => {
    // Mock data for the chart
    const weeklyData = [
        { day: 'Mon', value: 400 },
        { day: 'Tue', value: 650 },
        { day: 'Wed', value: 300 },
        { day: 'Thu', value: 890 },
        { day: 'Fri', value: 1200 },
        { day: 'Sat', value: 950 },
        { day: 'Sun', value: 700 },
    ];

    const maxVal = Math.max(...weeklyData.map(d => d.value));

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link to="/farmer/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-black text-stone-900 uppercase mb-8">Performance</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Chart */}
                    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100 lg:col-span-2">
                        <h3 className="mb-8 text-xl font-bold text-stone-900">Weekly Revenue</h3>

                        <div className="flex h-64 items-end gap-4 sm:gap-8">
                            {weeklyData.map((d, i) => (
                                <div key={i} className="group relative flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full relative flex flex-col justify-end h-full">
                                        <div
                                            className="w-full rounded-t-xl bg-lime-400 transition-all duration-500 ease-out group-hover:bg-lime-500"
                                            style={{ height: `${(d.value / maxVal) * 100}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <div className="rounded-lg bg-stone-900 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                    ${d.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-stone-400">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Stats */}
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-stone-900 p-8 text-white shadow-xl">
                            <p className="text-sm font-medium text-stone-400">Total Sales (This Month)</p>
                            <h2 className="mt-2 text-4xl font-black">$12,450.00</h2>
                            <div className="mt-6 h-1 w-full rounded-full bg-stone-800">
                                <div className="h-full w-3/4 rounded-full bg-lime-400"></div>
                            </div>
                            <p className="mt-2 text-xs text-stone-500">75% of goal reached</p>
                        </div>

                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
                            <h4 className="font-bold text-stone-900">Top Products</h4>
                            <ul className="mt-4 space-y-4">
                                <li className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-stone-600">Heirloom Carrots</span>
                                    <span className="text-sm font-bold text-stone-900">124 sold</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-stone-600">Free Range Eggs</span>
                                    <span className="text-sm font-bold text-stone-900">98 sold</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-stone-600">Wildflower Honey</span>
                                    <span className="text-sm font-bold text-stone-900">65 sold</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};