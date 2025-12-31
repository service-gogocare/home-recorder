import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
    </div>
);

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">早安，陳督導</h1>
                <p className="text-gray-500 mt-1">這是一個美好的工作日，以下是您的工作概況。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="負責個案數" value="48" color="bg-blue-500" />
                <StatCard icon={FileText} label="本月訪視完成" value="32" color="bg-emerald-500" />
                <StatCard icon={Clock} label="待審核紀錄" value="5" color="bg-amber-500" />
                <StatCard icon={CheckCircle} label="本月完成率" value="85%" color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">今日待辦事項</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <h3 className="font-medium text-gray-900">案主林阿嬤 - 定期訪視</h3>
                                    <p className="text-sm text-gray-500 mt-1">下午 2:00 • 台北市士林區</p>
                                </div>
                                <button className="ml-auto px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100">
                                    查看詳情
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">最近通知</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-900">張居服員提交了新的訪視紀錄</p>
                                <p className="text-xs text-gray-500 mt-1">10 分鐘前</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-900">李爺爺的照顧計畫下週即將到期</p>
                                <p className="text-xs text-gray-500 mt-1">2 小時前</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
