import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Calendar, Activity, FileText, Briefcase, CreditCard, Users, Building2 } from 'lucide-react';
import { caseService } from '../services/caseService';
import type { Case } from '../types/case';

const CaseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCase = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await caseService.getById(id);
                setCaseData(data);
            } catch (error) {
                console.error('Error loading case:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCase();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">找不到個案資料 (ID: {id})</p>
                <button
                    onClick={() => navigate('/cases')}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                >
                    返回個案列表
                </button>
            </div>
        );
    }

    const DetailItem = ({ label, value, fullWidth = false }: { label: string; value?: string | number | boolean; fullWidth?: boolean }) => {
        let displayValue = value;
        if (typeof value === 'boolean') {
            displayValue = value ? '是' : '否';
        }
        return (
            <div className={`${fullWidth ? 'col-span-full' : ''} p-3 bg-gray-50 rounded-lg`}>
                <span className="block text-xs text-gray-500 mb-1">{label}</span>
                <span className="text-sm font-medium text-gray-900 break-words">{displayValue || '-'}</span>
            </div>
        );
    };

    const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-4 border-b border-gray-200 -mx-6 px-6 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/cases')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            {caseData.name}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                                {caseData.status === 'active' ? '服務中' : caseData.status === 'pending' ? '暫停' : '已存檔'}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500">案號: {caseData.caseNumber || '未編號'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                        列印資料
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                        編輯個案
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <Section title="基本資料" icon={User}>
                <DetailItem label="姓名" value={caseData.name} />
                <DetailItem label="性別" value={caseData.gender} />
                <DetailItem label="出生年月日" value={caseData.birthDate} />
                <DetailItem label="年齡" value={caseData.age ? `${caseData.age} 歲` : ''} />
                <DetailItem label="身分證字號" value={caseData.personalId} />
                <DetailItem label="個案來源" value={caseData.source} />
                <DetailItem label="常用語言" value={caseData.language} />
                <DetailItem label="教育程度" value={caseData.education} />
                <DetailItem label="身高" value={caseData.height ? `${caseData.height} cm` : ''} />
                <DetailItem label="體重" value={caseData.weight ? `${caseData.weight} kg` : ''} />
            </Section>

            {/* Identity & Welfare */}
            <Section title="身份與福利" icon={CreditCard}>
                <DetailItem label="原住民身份" value={caseData.isIndigenous} />
                <DetailItem label="原住民族別" value={caseData.indigenousTribe} />
                <DetailItem label="福利身份別" value={caseData.welfareStatus} />
                <DetailItem label="身障等級" value={caseData.disabilityLevel} />
                <DetailItem label="身障類別(新制)" value={caseData.disabilityCategoryNew} />
                <DetailItem label="身障類別(舊制)" value={caseData.disabilityCategoryOld} />
                <DetailItem label="身障項目別" value={caseData.disabilityItem} />
                <DetailItem label="失智症手冊/CDR" value={caseData.dementiaStatus} fullWidth />
                <DetailItem label="補助比例" value={caseData.subsidyRatio} />
                <DetailItem label="計價類別" value={caseData.pricingCategory} />
                <DetailItem label="外勞/特照津貼" value={caseData.foreignCareOrSubsidy} />
            </Section>

            {/* Contact & Living */}
            <Section title="聯絡與居住" icon={MapPin}>
                <DetailItem label="聯絡電話" value={caseData.phone} />
                <DetailItem label="居住縣市" value={caseData.city} />
                <DetailItem label="鄉鎮區" value={caseData.district} />
                <DetailItem label="里別" value={caseData.village} />
                <DetailItem label="居住地址" value={caseData.address} fullWidth />
                <DetailItem label="居住狀況" value={caseData.livingStatus} />
                <DetailItem label="帳單地址" value={caseData.billingAddress} fullWidth />
            </Section>

            {/* Caregivers & Proxy */}
            <Section title="照顧者與代理人" icon={Users}>
                <DetailItem label="主要照顧者" value={caseData.primaryCaregiver} />
                <DetailItem label="關係" value={caseData.primaryCaregiverRelation} />
                <DetailItem label="年齡" value={caseData.primaryCaregiverAge} />
                <div className="md:hidden lg:block lg:invisible"></div> {/* Spacing */}

                <DetailItem label="次要照顧者" value={caseData.secondaryCaregiver} />
                <DetailItem label="關係" value={caseData.secondaryCaregiverRelation} />
                <div className="col-span-2 md:hidden lg:block lg:invisible"></div>

                <DetailItem label="代理人" value={caseData.proxy} />
                <DetailItem label="代理人電話" value={caseData.proxyPhone} />
                <DetailItem label="代理人手機" value={caseData.proxyMobile} />
            </Section>

            {/* Health & Care */}
            <Section title="健康與照顧狀況" icon={Activity}>
                <DetailItem label="CMS等級" value={caseData.careLevel} />
                <DetailItem label="罹患疾病" value={caseData.diseases} fullWidth />
                <DetailItem label="疾病史" value={caseData.diseaseHistory} fullWidth />
                <DetailItem label="行為與情緒" value={caseData.behaviorEmotion} fullWidth />
            </Section>

            {/* Service & A-Unit */}
            <Section title="服務團隊與A單位" icon={Building2}>
                <DetailItem label="主責督導" value={caseData.supervisor} />
                <DetailItem label="副督導" value={caseData.viceSupervisor} />
                <DetailItem label="主責居服員" value={caseData.caregiver} />
                <div className="md:hidden lg:block lg:invisible"></div>

                <DetailItem label="A單位名稱" value={caseData.AUnitName} />
                <DetailItem label="A個管姓名" value={caseData.ACaseManager} />
                <DetailItem label="A單位電話" value={caseData.AUnitPhone} />
                <DetailItem label="A單位Email" value={caseData.AUnitEmail} />
            </Section>

            {/* Service Administration */}
            <Section title="服務行政" icon={Briefcase}>
                <DetailItem label="申請服務種類" value={caseData.serviceTypeApplied} />
                <DetailItem label="服務開始時間" value={caseData.serviceStartDate} />
                <DetailItem label="暫停日期" value={caseData.suspensionDate} />
                <DetailItem label="暫停備註" value={caseData.suspensionNotes} />

                <DetailItem label="結案日期" value={caseData.closingDate} />
                <DetailItem label="結案原因" value={caseData.closingReason} />
                <DetailItem label="結案備註" value={caseData.closingNotes} fullWidth />
                <DetailItem label="拒絕次數" value={caseData.refusalCount} />
            </Section>

            {/* Note */}
            {caseData.notes && (
                <Section title="備註" icon={FileText}>
                    <div className="col-span-full p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100 whitespace-pre-wrap">
                        {caseData.notes}
                    </div>
                </Section>
            )}

            {/* Stats Check */}
            <Section title="最近服務統計 (參考)" icon={Calendar}>
                <DetailItem label="上次訪視" value={caseData.lastVisit} />
                <DetailItem label="服務次數" value={caseData.serviceCount} />
                <DetailItem label="使用額度" value={caseData.usageQuota} />
                <DetailItem label="補助金額" value={caseData.subsidyAmount} />
                <DetailItem label="民眾負擔" value={caseData.coPayment} />
                <DetailItem label="自費金額" value={caseData.selfPayment} />
                <DetailItem label="總花費" value={caseData.totalCost} />
            </Section>
        </div>
    );
};

export default CaseDetail;
