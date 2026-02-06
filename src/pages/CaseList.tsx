import { Search, Filter, User, Phone, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../services/caseService';
import type { Case } from '../types/case';

const CaseList = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCases, setFilteredCases] = useState<Case[]>([]);

    // 載入個案資料
    useEffect(() => {
        loadCases();
    }, []);

    // 搜尋過濾
    useEffect(() => {
        if (searchTerm) {
            const filtered = cases.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone.includes(searchTerm) ||
                c.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCases(filtered);
        } else {
            setFilteredCases(cases);
        }
    }, [searchTerm, cases]);

    const loadCases = async () => {
        try {
            setLoading(true);
            const data = await caseService.getAll();
            setCases(data);
            setFilteredCases(data);
        } catch (error) {
            console.error('載入個案資料失敗:', error);
            // 如果 Firebase 未設定，使用 mock 資料
            const mockCases: Case[] = [
                {
                    id: '1',
                    name: '林阿嬤',
                    age: 82,
                    address: '台北市士林區中正路123號',
                    phone: '0912-345-678',
                    status: 'active',
                    lastVisit: '2025/12/15',
                    careLevel: 'CMS 4級',
                    caregiver: '張大美',
                    caseNumber: 'C2025001',
                    gender: '女',
                    birthDate: '1943/05/20',
                    personalId: 'A200000001',
                    city: '台北市',
                    district: '士林區',
                    village: '中正里',
                    pricingCategory: '一般戶',
                    welfareStatus: '無',
                    disabilityLevel: '中度'
                },
                {
                    id: '2',
                    name: '王伯伯',
                    age: 78,
                    address: '台北市北投區大業路456號',
                    phone: '0922-333-444',
                    status: 'active',
                    lastVisit: '2025/12/10',
                    careLevel: 'CMS 6級',
                    caregiver: '李小明',
                    caseNumber: 'C2025002',
                    gender: '男',
                    birthDate: '1947/08/15',
                    personalId: 'A100000002',
                    city: '台北市',
                    district: '北投區',
                    village: '大業里',
                    pricingCategory: '長照低收',
                    welfareStatus: '低收入戶',
                    disabilityLevel: '重度'
                },
                {
                    id: '3',
                    name: '陳張女士',
                    age: 88,
                    address: '台北市中山區北安路789號',
                    phone: '0933-555-666',
                    status: 'pending',
                    lastVisit: '2025/12/01',
                    careLevel: 'CMS 5級',
                    caregiver: '王美麗'
                },
            ];
            setCases(mockCases);
            setFilteredCases(mockCases);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return '服務中';
            case 'pending':
                return '暫停';
            case 'archived':
                return '已存檔';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            case 'archived':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    篩選
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">載入中...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredCases.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">
                        {searchTerm ? '找不到符合的個案' : '尚無個案資料'}
                    </p>
                    {!searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                            請先執行資料匯入或手動新增個案
                        </p>
                    )}
                </div>
            )}

            {/* List */}
            {!loading && filteredCases.length > 0 && (
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
                            {filteredCases.map((client) => (
                                <tr
                                    key={client.id}
                                    onClick={() => navigate(`/cases/${client.id}`)}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                {client.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{client.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {client.age} 歲
                                                    {client.careLevel && ` • ${client.careLevel}`}
                                                </p>
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
                                            {client.caregiver && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="w-3.5 h-3.5" />
                                                    居服員：{client.caregiver}
                                                </div>
                                            )}
                                            {client.lastVisit && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    上次訪視：{client.lastVisit}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                            {getStatusLabel(client.status)}
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
            )}

            {/* Stats */}
            {!loading && filteredCases.length > 0 && (
                <div className="text-sm text-gray-500 text-center">
                    顯示 {filteredCases.length} 筆個案
                    {searchTerm && ` (從 ${cases.length} 筆中篩選)`}
                </div>
            )}
        </div>
    );
};

export default CaseList;
