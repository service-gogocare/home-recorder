import { Search, Filter, Phone, MapPin, Calendar, ChevronRight, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Caregiver } from '../types/caregiver';
import { caregiverService } from '../services/caregiverService';

const CaregiverList = () => {
    const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCaregivers, setFilteredCaregivers] = useState<Caregiver[]>([]);

    // Load data
    useEffect(() => {
        loadCaregivers();
    }, []);

    // Search and Filter logic
    useEffect(() => {
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = caregivers.filter(c =>
                c.name.toLowerCase().includes(lowerTerm) ||
                c.employeeId.toLowerCase().includes(lowerTerm) ||
                c.phone.includes(searchTerm)
            );
            setFilteredCaregivers(filtered);
        } else {
            setFilteredCaregivers(caregivers);
        }
    }, [searchTerm, caregivers]);

    const loadCaregivers = async () => {
        try {
            setLoading(true);

            // Try to fetch from Firebase first
            try {
                const data = await caregiverService.getAll();
                if (data.length > 0) {
                    setCaregivers(data);
                    setFilteredCaregivers(data);
                    return;
                }
            } catch (err) {
                console.error('Firebase fetch failed details:', err);
                console.warn('Firebase fetch failed, falling back to mock data', err);
            }

            // Fallback Mock Data if Firebase empty or failed
            const mockCaregivers: Caregiver[] = [
                {
                    id: '1',
                    employeeId: 'EMP001',
                    name: '張大美',
                    status: 'active',
                    gender: 'female',
                    nationality: 'Taiwan',
                    idNumber: 'A223456789',
                    phone: '0912-345-678',
                    role: '居服員',
                    primarySupervisor: '陳督導',
                    serviceArea: '士林區',
                    onboardDate: '2023-01-15'
                },
                {
                    id: '2',
                    employeeId: 'EMP002',
                    name: '李小明',
                    status: 'active',
                    gender: 'male',
                    nationality: 'Taiwan',
                    idNumber: 'A123456789',
                    phone: '0922-333-444',
                    role: '居服員',
                    primarySupervisor: '王督導',
                    serviceArea: '北投區',
                    onboardDate: '2023-03-20'
                },
                {
                    id: '3',
                    employeeId: 'EMP003',
                    name: '王美麗',
                    status: 'inactive',
                    gender: 'female',
                    nationality: 'Indonesia',
                    idNumber: 'XYZ123456',
                    phone: '0933-555-666',
                    role: '居服員',
                    primarySupervisor: '陳督導',
                    serviceArea: '中山區',
                    onboardDate: '2022-11-01'
                }
            ];

            setCaregivers(mockCaregivers);
            setFilteredCaregivers(mockCaregivers);
        } catch (error) {
            console.error('載入居服員資料失敗:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return '在職';
            case 'inactive': return '離職';
            case 'suspended': return '停權';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'suspended': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">居服員管理</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    新增居服員
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="搜尋姓名、編號或電話..."
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

            {/* List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">載入中...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">居服員資料</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">聯絡方式</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">職務資訊</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">狀態</th>
                                <th className="px-6 py-4 text-right font-semibold text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCaregivers.length > 0 ? (
                                filteredCaregivers.map((caregiver) => (
                                    <tr key={caregiver.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {caregiver.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{caregiver.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {caregiver.employeeId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {caregiver.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {caregiver.primarySupervisor} (主責)
                                                </div>
                                                {caregiver.serviceArea && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {caregiver.serviceArea}
                                                    </div>
                                                )}
                                                {caregiver.onboardDate && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {caregiver.onboardDate} 到職
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(caregiver.status)}`}>
                                                {getStatusLabel(caregiver.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                aria-label="查看詳情"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        找不到符合的居服員
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Stats */}
            {!loading && filteredCaregivers.length > 0 && (
                <div className="text-sm text-gray-500 text-center">
                    顯示 {filteredCaregivers.length} 筆資料
                    {searchTerm && ` (從 ${caregivers.length} 筆中篩選)`}
                </div>
            )}
        </div>
    );
};

export default CaregiverList;
