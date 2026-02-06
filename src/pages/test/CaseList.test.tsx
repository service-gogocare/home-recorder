import { render, screen, within } from '@testing-library/react';
import CaseList from './CaseList';
import { describe, it, expect } from 'vitest';

describe('CaseList Page Tests', () => {

    // 【前端元素】檢查頁面標題與功能按鈕
    it('should display page title and "Add Case" button correctly', () => {
        render(<CaseList />);

        // 1. 頁面標題顯示「個案管理」
        expect(
            screen.getByRole('heading', { name: /個案管理/i })
        ).toBeInTheDocument();

        // 2. 右上角顯示「新增個案」按鈕，樣式為藍色背景
        const addButton = screen.getByRole('button', { name: /新增個案/i });
        expect(addButton).toBeInTheDocument();
        expect(addButton).toHaveClass('bg-blue-600');
    });

    // 【前端元素】檢查搜尋與篩選區塊
    it('should display search input and filter button', () => {
        render(<CaseList />);

        // 1. 顯示搜尋輸入框，Placeholder 為「搜尋姓名、電話或地址...」
        const searchInput = screen.getByPlaceholderText('搜尋姓名、電話或地址...');
        expect(searchInput).toBeInTheDocument();

        // 2. 顯示「篩選」按鈕，帶有篩選圖示
        // Note: Check for button text "篩選"
        const filterButton = screen.getByRole('button', { name: /篩選/i });
        expect(filterButton).toBeInTheDocument();
    });

    // 【前端元素】檢查列表表頭欄位
    it('should display correct table headers', () => {
        render(<CaseList />);

        // 1. 表格 Head 包含：案主資料、聯絡方式、照顧概況、狀態、操作
        const headers = ['案主資料', '聯絡方式', '照顧概況', '狀態', '操作'];
        headers.forEach(headerText => {
            expect(
                screen.getByRole('columnheader', { name: headerText })
            ).toBeInTheDocument();
        });
    });

    // 【資料渲染】檢查個案列表資料呈現
    it('should render case list data correctly', () => {
        render(<CaseList />);

        // 1. 正確顯示案主姓名、年齡、CMS 等級 (例如：林阿嬤, 82 歲 • CMS 4級)
        expect(screen.getByText('林阿嬤')).toBeInTheDocument();
        expect(screen.getByText('82 歲 • CMS 4級')).toBeInTheDocument();

        // 2. 正確顯示聯絡電話與地址
        expect(screen.getByText('0912-345-678')).toBeInTheDocument();
        expect(screen.getByText('台北市士林區中正路123號')).toBeInTheDocument();

        // 3. 正確顯示居服員與上次訪視日期
        expect(screen.getByText('居服員：張大美')).toBeInTheDocument();
        expect(screen.getByText('上次訪視：2025/12/15')).toBeInTheDocument();
    });

    // 【樣式邏輯】檢查狀態標籤樣式 (Active/Pending)
    it('should apply correct styles for status labels', () => {
        render(<CaseList />);

        // 1. 'Active' 狀態顯示文字「服務中」，樣式為綠色
        const activeLabels = screen.getAllByText('服務中');
        expect(activeLabels.length).toBeGreaterThan(0);
        activeLabels.forEach(label => {
            expect(label).toHaveClass('bg-green-100', 'text-green-700');
        });

        // 2. 'Pending' 狀態顯示文字「待評估」，樣式為黃色
        const pendingLabels = screen.getAllByText('待評估');
        expect(pendingLabels.length).toBeGreaterThan(0);
        pendingLabels.forEach(label => {
            expect(label).toHaveClass('bg-amber-100', 'text-amber-700');
        });
    });

    // 【互動元素】檢查操作按鈕存在
    it('should display action buttons for each row', () => {
        render(<CaseList />);

        // 1. 每一行資料最右側顯示操作按鈕 (ChevronRight icon)
        // Find all rows in the table body
        const rows = screen.getAllByRole('row');
        // Subtract header row if necessary, but simpler to check for specific buttons associated with rows
        // Or check if there are 3 action buttons (since we have 3 mocked cases)
        // Assuming the button contains the ChevronRight icon, which might not have accessible text.
        // But since the button wraps the icon and has no text, searching by role might find 3 + 2 (header buttons) = 5 buttons?
        // Let's look at the implementation:
        // <button className="text-gray-400 ..."> <ChevronRight /> </button> inside the last td.

        // A robust way: get all cells in the last column
        // But given simple structure, let's just assert existence of buttons in the document generally.
        // A better query relies on data-testid or structure.
        // Or we can count rows.
        const dataRows = screen.getAllByRole('row').slice(1); // Skip header
        expect(dataRows).toHaveLength(3);

        dataRows.forEach(row => {
            const actionCell = within(row).getAllByRole('cell')[4]; // 5th column
            const button = within(actionCell).getByRole('button');
            expect(button).toBeInTheDocument();
        });
    });
});
