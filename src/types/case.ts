export interface Case {
    id?: string; // Firestore document ID

    // 基本資料
    caseNumber?: string; // 案號
    name: string; // 姓名
    gender?: string; // 性別
    birthDate?: string; // 出生年月日
    age: number; // 年齡
    personalId?: string; // 身分證字號
    phone: string; // 電話
    height?: number; // 身高
    weight?: number; // 體重
    isIndigenous?: string; // 原住民身份
    indigenousTribe?: string; // 原住民族別
    language?: string; // 常用語言
    education?: string; // 個案教育程度

    // 聯絡與居住
    city?: string; // 個案居住縣市
    district?: string; // 鄉鎮區
    village?: string; // 里別
    address: string; // 個案居住地址
    livingStatus?: string; // 居住狀況
    billingAddress?: string; // 帳單地址

    // 照顧與身心狀況
    careLevel: string; // CMS等級
    disabilityLevel?: string; // 障礙等級
    disabilityCategoryNew?: string; // 身障類別(新制)
    disabilityCategoryOld?: string; // 身障類別(舊制)
    disabilityItem?: string; // 身障項目別
    dementiaStatus?: string; // 是否具備身心障礙失智症手冊/證明或CDR1分以上
    diseases?: string; // 罹患疾病
    diseaseHistory?: string; // 疾病史
    behaviorEmotion?: string; // 行為與情緒

    // 福利與計價
    status: 'active' | 'pending' | 'archived'; // 目前狀態
    source?: string; // 個案來源
    welfareStatus?: string; // 福利身份別
    subsidyRatio?: string; // 補助比例(%)
    pricingCategory?: string; // 計價類別
    foreignCareOrSubsidy?: boolean; // 請外勞照護或領有特照津貼

    // 主要/次要照顧者
    primaryCaregiver?: string; // 主要照顧者
    primaryCaregiverRelation?: string; // 主要照顧者關係
    primaryCaregiverAge?: number; // 主要照顧者年齡
    secondaryCaregiver?: string; // 次要照顧者
    secondaryCaregiverRelation?: string; // 次要照顧者關係

    // 代理人
    proxy?: string; // 代理人
    proxyPhone?: string; // 代理人電話
    proxyMobile?: string; // 代理人手機號碼

    // 服務團隊
    supervisor?: string; // 主責督導
    viceSupervisor?: string; // 副督導
    caregiver: string; // 主責居服員

    // A單位資訊
    AUnitName?: string; // A單位名稱
    ACaseManager?: string; // A個管姓名
    AUnitPhone?: string; // A單位聯絡電話
    AUnitEmail?: string; // A單位電子郵件

    // 服務行政
    serviceTypeApplied?: string; // 申請服務種類
    serviceStartDate?: string; // 服務開始時間
    suspensionDate?: string; // 暫停日期
    suspensionNotes?: string; // 暫停備註
    closingDate?: string; // 結案日期
    closingReason?: string; // 結案原因
    closingNotes?: string; // 結案備註
    refusalCount?: number; // 拒絕次數

    // 統計與費用 (可能為計算值或快照)
    lastVisit: string; // ISO date string or "YYYY/MM/DD"
    category?: string; // e.g., "居家照顧"
    serviceItems?: string; // 服務項目
    serviceCount?: number; // 服務次數
    usageQuota?: number; // 使用額度
    subsidyAmount?: number; // 補助金額
    coPayment?: number; // 民眾負擔
    selfPayment?: number; // 自費
    totalCost?: number; // 民眾總花費

    notes?: string; // 備註
    createdAt?: string;
    updatedAt?: string;
}

export interface CaseFormData extends Omit<Case, 'id' | 'createdAt' | 'updatedAt'> { }
