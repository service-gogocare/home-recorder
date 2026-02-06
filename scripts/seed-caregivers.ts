import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import 'dotenv/config';

// Firebase config
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const caregivers = [
    {
        employeeId: 'EMP001',
        status: 'active',
        name: '張大美',
        gender: 'female',
        nationality: 'Taiwan',
        idNumber: 'A223456789',
        phone: '0912-345-678',
        age: 45,
        birthday: '1979-05-20',
        account: 'emp001',
        role: '居服員',
        primarySupervisor: '陳督導',
        secondarySupervisor: '林督導',
        address: '台北市士林區中正路123號',
        education: '大學',
        disabilityStatus: '無',
        isIndigenous: false,
        preferredLanguage: '國語',
        onboardDate: '2023-01-15',
        emergencyContactName: '張先生',
        emergencyContactPhone: '0911-111-111',
        emergencyContactRelationship: '配偶',
        serviceArea: '士林區',
        notes: '資深績優員工'
    },
    {
        employeeId: 'EMP002',
        status: 'active',
        name: '李小明',
        gender: 'male',
        nationality: 'Taiwan',
        idNumber: 'A123456789',
        phone: '0922-333-444',
        age: 32,
        birthday: '1992-08-10',
        account: 'emp002',
        role: '居服員',
        primarySupervisor: '王督導',
        address: '台北市北投區大業路456號',
        education: '高中',
        disabilityStatus: '無',
        isIndigenous: false,
        preferredLanguage: '台語',
        onboardDate: '2023-03-20',
        emergencyContactName: '李太太',
        emergencyContactPhone: '0922-222-222',
        emergencyContactRelationship: '母親',
        serviceArea: '北投區',
        notes: ''
    },
    {
        employeeId: 'EMP003',
        status: 'inactive',
        name: '王美麗',
        gender: 'female',
        nationality: 'Indonesia',
        idNumber: 'XYZ123456',
        phone: '0933-555-666',
        age: 28,
        birthday: '1996-12-05',
        account: 'emp003',
        role: '居服員',
        primarySupervisor: '陳督導',
        address: '台北市中山區北安路789號',
        education: '高中',
        disabilityStatus: '無',
        isIndigenous: false,
        preferredLanguage: '英語',
        onboardDate: '2022-11-01',
        resignationDate: '2023-12-31',
        emergencyContactName: '陳先生',
        emergencyContactPhone: '0933-333-333',
        emergencyContactRelationship: '朋友',
        serviceArea: '中山區',
        notes: '已離職返鄉'
    }
];

async function seedCaregivers() {
    try {
        console.log('🌱 開始建立居服員資料庫...');
        const batch = writeBatch(db);

        for (const data of caregivers) {
            const docRef = doc(collection(db, 'caregivers'));
            batch.set(docRef, {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        await batch.commit();
        console.log(`✅ 成功建立 ${caregivers.length} 筆居服員資料！`);
    } catch (error) {
        console.error('❌ 建立失敗:', error);
        process.exit(1);
    }
}

seedCaregivers();
