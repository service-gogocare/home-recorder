export interface Caregiver {
    id: string; // Document ID
    employeeId: string; // 員工編號
    status: 'active' | 'inactive' | 'suspended' | string; // 現在狀態
    name: string; // 姓名
    gender: 'male' | 'female' | 'other' | string; // 性別
    nationality: string; // 國籍
    idNumber: string; // 身分證字號
    phone: string; // 手機號碼
    age?: number; // 年齡
    birthday?: string; // 生日
    account?: string; // 帳號
    role: string; // 角色
    primarySupervisor?: string; // 主責督導
    secondarySupervisor?: string; // 副督導
    address?: string; // 居住地
    education?: string; // 教育程度
    disabilityStatus?: string; // 身心障礙者
    isIndigenous?: boolean; // 原住民
    indigenousTribe?: string; // 原住民族別
    preferredLanguage?: string; // 常用語言
    onboardDate?: string; // 到職日
    resignationDate?: string; // 離職日
    emergencyContactName?: string; // 緊急聯絡人姓名
    emergencyContactPhone?: string; // 緊急連絡人電話
    emergencyContactRelationship?: string; // 緊急連絡人關係
    serviceArea?: string; // 服務區域
    notes?: string; // 備註
}
