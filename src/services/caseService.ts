import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    type DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Case } from '../types/case';

const COLLECTION_NAME = 'cases';

// Helper to map Firestore data (potentially Chinese keys) to English Case interface
const mapFirestoreDataToCase = (docId: string, data: DocumentData): Case => {
    return {
        id: docId,
        // Common fields (English)
        name: data.name || data['姓名'] || '',
        status: data.status || (data['目前狀態'] === '服務中' ? 'active' : data['目前狀態'] === '待評估' ? 'pending' : data['目前狀態'] === '已存檔' ? 'archived' : 'active'),
        phone: data.phone || data['電話'] || '',
        address: data.address || data['個案居住地址'] || '',
        caregiver: data.caregiver || data['主責居服員'] || '',
        careLevel: data.careLevel || data['CMS等級'] || '',
        lastVisit: data.lastVisit || data['服務開始時間'] || '', // Fallback

        // Basic Info
        caseNumber: data.caseNumber || data['案號'],
        gender: data.gender || data['性別'],
        birthDate: data.birthDate || data['出生年月日'],
        age: data.age || Number(data['年齡']) || 0,
        personalId: data.personalId || data['身分證字號'],
        source: data.source || data['個案來源'],
        language: data.language || data['常用語言'],
        education: data.education || data['個案教育程度'],
        height: data.height || Number(data['身高']),
        weight: data.weight || Number(data['體重']),

        // Contact & Living
        city: data.city || data['個案居住縣市'],
        district: data.district || data['鄉鎮區'],
        village: data.village || data['里別'],
        livingStatus: data.livingStatus || data['居住狀況'],
        billingAddress: data.billingAddress || data['帳單地址'],

        // Identity & Welfare
        isIndigenous: data.isIndigenous ?? (data['原住民身份'] === '是'),
        indigenousTribe: data.indigenousTribe || data['原住民族別'],
        welfareStatus: data.welfareStatus || data['福利身份別'],
        subsidyRatio: data.subsidyRatio || Number(data['補助比例(%)']),
        pricingCategory: data.pricingCategory || data['計價類別'],
        disabilityLevel: data.disabilityLevel || data['障礙等級'],
        disabilityCategoryNew: data.disabilityCategoryNew || data['身障類別(新制)'],
        disabilityCategoryOld: data.disabilityCategoryOld || data['身障類別(舊制)'],
        disabilityItem: data.disabilityItem || data['身障項目別'],
        dementiaStatus: data.dementiaStatus || data['是否具備身心障礙失智症手冊/證明或CDR1分以上'],
        foreignCareOrSubsidy: data.foreignCareOrSubsidy ?? (data['請外勞照護或領有特照津貼'] === '是'),

        // Health
        diseases: data.diseases || data['罹患疾病'],
        diseaseHistory: data.diseaseHistory || data['疾病史'],
        behaviorEmotion: data.behaviorEmotion || data['行為與情緒'],

        // Caregivers
        primaryCaregiver: data.primaryCaregiver || data['主要照顧者'],
        primaryCaregiverRelation: data.primaryCaregiverRelation || data['主要照顧者關係'],
        primaryCaregiverAge: data.primaryCaregiverAge || Number(data['主要照顧者年齡']),
        secondaryCaregiver: data.secondaryCaregiver || data['次要照顧者'],
        secondaryCaregiverRelation: data.secondaryCaregiverRelation || data['次要照顧者關係'],

        // Proxy
        proxy: data.proxy || data['代理人'],
        proxyPhone: data.proxyPhone || data['代理人電話'],
        proxyMobile: data.proxyMobile || data['代理人手機號碼'],

        // Service Team
        supervisor: data.supervisor || data['主責督導'],
        viceSupervisor: data.viceSupervisor || data['副督導'],

        // A Unit
        AUnitName: data.AUnitName || data['A單位名稱'],
        ACaseManager: data.ACaseManager || data['A個管姓名'],
        AUnitPhone: data.AUnitPhone || data['聯絡電話'] || data['A單位聯絡電話'],
        AUnitEmail: data.AUnitEmail || data['電子郵件'] || data['A單位電子郵件'],

        // Service Admin
        serviceTypeApplied: data.serviceTypeApplied || data['申請服務種類'],
        serviceStartDate: data.serviceStartDate || data['服務開始時間'],
        suspensionDate: data.suspensionDate || data['暫停日期'],
        suspensionNotes: data.suspensionNotes || data['暫停備註'],
        closingDate: data.closingDate || data['結案日期'],
        closingReason: data.closingReason || data['結案原因'],
        closingNotes: data.closingNotes || data['結案備註'],
        refusalCount: data.refusalCount || Number(data['拒絕次數']),

        // Billing
        serviceItems: data.serviceItems || data['服務項目'],
        serviceCount: data.serviceCount || Number(data['服務次數']),
        usageQuota: data.usageQuota || Number(data['使用額度']),
        subsidyAmount: data.subsidyAmount || Number(data['補助金額']),
        coPayment: data.coPayment || Number(data['民眾負擔']),
        selfPayment: data.selfPayment || Number(data['自費']),
        totalCost: data.totalCost || Number(data['民眾總花費']),

        notes: data.notes || data['備註'],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

export const caseService = {
    // 取得所有個案
    async getAll(): Promise<Case[]> {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            return querySnapshot.docs.map(doc => mapFirestoreDataToCase(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting cases:', error);
            throw error;
        }
    },

    // 依條件查詢個案
    async query(constraints: QueryConstraint[]): Promise<Case[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), ...constraints);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => mapFirestoreDataToCase(doc.id, doc.data()));
        } catch (error) {
            console.error('Error querying cases:', error);
            throw error;
        }
    },

    // 搜尋個案 (by name, phone, address)
    async search(searchTerm: string): Promise<Case[]> {
        try {
            const allCases = await this.getAll();
            const term = searchTerm.toLowerCase();
            return allCases.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.phone.includes(term) ||
                c.address.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error searching cases:', error);
            throw error;
        }
    },

    // 依狀態篩選
    async getByStatus(status: 'active' | 'pending' | 'archived'): Promise<Case[]> {
        try {
            return await this.query([where('status', '==', status)]);
        } catch (error) {
            console.error('Error getting cases by status:', error);
            throw error;
        }
    },

    // 取得單一個案
    async getById(id: string): Promise<Case | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return mapFirestoreDataToCase(docSnap.id, docSnap.data());
            }
            return null;
        } catch (error) {
            console.error('Error getting case:', error);
            throw error;
        }
    },

    // 新增個案
    async create(caseData: Omit<Case, 'id'>): Promise<string> {
        try {
            const data = {
                ...caseData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
            return docRef.id;
        } catch (error) {
            console.error('Error creating case:', error);
            throw error;
        }
    },

    // 更新個案
    async update(id: string, caseData: Partial<Case>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...caseData,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating case:', error);
            throw error;
        }
    },

    // 刪除個案
    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting case:', error);
            throw error;
        }
    },

    // 取得最近訪視的個案
    async getRecentVisits(limitCount: number = 5): Promise<Case[]> {
        try {
            return await this.query([
                orderBy('lastVisit', 'desc'),
                limit(limitCount)
            ]);
        } catch (error) {
            console.error('Error getting recent visits:', error);
            throw error;
        }
    }
};
