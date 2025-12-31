import { Search, Filter, User, Phone, MapPin, Calendar, ChevronRight } from 'lucide-react';

const cases = [
    {
        id: 1,
        name: '林阿嬤',
        age: 82,
        address: '台北市士林區中正路123號',
        phone: '0912-345-678',
        status: 'Active',
        lastVisit: '2025/12/15',
        careLevel: 'CMS 4級',
        caregiver: '張大美'
    },
    {
        id: 2,
        name: '王伯伯',
        age: 78,
        address: '台北市北投區大業路456號',
        phone: '0922-333-444',
        status: 'Active',
        lastVisit: '2025/12/10',
        careLevel: 'CMS 6級',
        caregiver: '李小明'
    },
    {
        id: 3,
        name: '陳張女士',
        age: 88,
        address: '台北市中山區北安路789號',
        phone: '0933-555-666',
        status: 'Pending',
        lastVisit: '2025/12/01',
        careLevel: 'CMS 5級',
        caregiver: '王美麗'
    },
];

const CaseList = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">個案管理</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    新增個案
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="搜尋姓名、電話或地址..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    篩選
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">案主資料</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">聯絡方式</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">照顧概況</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">狀態</th>
                            <th className="px-6 py-4 text-right font-semibold text-gray-600">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cases.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            {client.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{client.name}</p>
                                            <p className="text-xs text-gray-500">{client.age} 歲 • {client.careLevel}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-3.5 h-3.5" />
                                            {client.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {client.address}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-3.5 h-3.5" />
                                            居服員：{client.caregiver}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            上次訪視：{client.lastVisit}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${client.status === 'Active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {client.status === 'Active' ? '服務中' : '待評估'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CaseList;
