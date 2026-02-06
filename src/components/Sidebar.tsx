import { LayoutDashboard, Users, FileText, Calendar, Settings, LogOut, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: '儀表板', path: '/' },
        { icon: Users, label: '個案管理', path: '/cases' },
        { icon: Briefcase, label: '居服員管理', path: '/caregivers' },
        { icon: FileText, label: '訪視紀錄', path: '/visits' },
        { icon: Calendar, label: '工作排程', path: '/schedule' },
        { icon: Settings, label: '設定', path: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h1 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                    <FileText className="w-8 h-8" />
                    <span>居督家電訪輔助系統</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">居服督導版</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">登出</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
