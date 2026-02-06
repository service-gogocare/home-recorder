import * as XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 建立範本資料
const templateData = [
    {
        '姓名': '林阿嬤',
        '性別': '女',
        '年齡': 82,
        '電話': '0912-345-678',
        '地址': '台北市士林區中正路123號',
        '狀態': '活躍',
        '照顧等級': 'CMS 4級',
        '居服員': '張大美',
        '上次訪視': '2025/12/15',
        '類別': '居家照顧'
    },
    {
        '姓名': '王伯伯',
        '性別': '男',
        '年齡': 78,
        '電話': '0922-333-444',
        '地址': '台北市北投區大業路456號',
        '狀態': '服務中',
        '照顧等級': 'CMS 6級',
        '居服員': '李小明',
        '上次訪視': '2025/12/10',
        '類別': '居家照顧'
    },
    {
        '姓名': '陳張女士',
        '性別': '女',
        '年齡': 88,
        '電話': '0933-555-666',
        '地址': '台北市中山區北安路789號',
        '狀態': '待評估',
        '照顧等級': 'CMS 5級',
        '居服員': '王美麗',
        '上次訪視': '2025/12/01',
        '類別': '居家照顧'
    }
];

// 建立工作簿
const wb = XLSX.utils.book_new();

// 建立工作表
const ws = XLSX.utils.json_to_sheet(templateData);

// 設定欄寬
ws['!cols'] = [
    { wch: 10 },  // 姓名
    { wch: 6 },   // 性別
    { wch: 6 },   // 年齡
    { wch: 15 },  // 電話
    { wch: 30 },  // 地址
    { wch: 10 },  // 狀態
    { wch: 12 },  // 照顧等級
    { wch: 10 },  // 居服員
    { wch: 15 },  // 上次訪視
    { wch: 12 }   // 類別
];

// 加入工作表到工作簿
XLSX.utils.book_append_sheet(wb, ws, '個案資料');

// 輸出檔案
const outputPath = path.join(__dirname, '../data/cases-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Excel 範本已建立：${outputPath}`);
console.log('');
console.log('使用方式：');
console.log('1. 開啟此檔案，填入你的個案資料');
console.log('2. 或從 Google Sheets 匯出為 Excel 格式');
console.log('3. 執行 npm run import:sheets -- path/to/your/file.xlsx');
