import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { describe, it, expect } from 'vitest';

describe('Dashboard Page Tests', () => {

    // 【前端元素】檢查頁面標題與歡迎語
    it('should display page title and welcome message', () => {
        render(<Dashboard />);

        // 1. 顯示標題「早安，陳督導」
        expect(screen.getByRole('heading', { name: /早安，陳督導/i })).toBeInTheDocument();

        // 2. 顯示副標題「這是一個美好的工作日，以下是您的工作概況。」
        expect(screen.getByText(/這是一個美好的工作日，以下是您的工作概況。/i)).toBeInTheDocument();
    });

    // 【資料渲染】檢查統計卡片數值
    it('should render statistic cards correctly', () => {
        render(<Dashboard />);

        // 1. 顯示 4 個統計卡片 (負責個案數、本月訪視完成、待審核紀錄、本月完成率)
        // 2. 檢查數值是否正確顯示
        expect(screen.getByText('負責個案數')).toBeInTheDocument();
        expect(screen.getByText('48')).toBeInTheDocument();

        expect(screen.getByText('本月訪視完成')).toBeInTheDocument();
        expect(screen.getByText('32')).toBeInTheDocument();

        expect(screen.getByText('待審核紀錄')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();

        expect(screen.getByText('本月完成率')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    // 【資料渲染】檢查待辦事項列表
    it('should render todo list correctly', () => {
        render(<Dashboard />);

        // 1. 顯示「今日待辦事項」區塊標題
        expect(screen.getByRole('heading', { name: /今日待辦事項/i })).toBeInTheDocument();

        // 2. 列表應顯示 3 筆待辦事項
        // The mock data maps [1, 2, 3], so we expect 3 items with specific text.
        const todoItems = screen.getAllByText(/案主林阿嬤 - 定期訪視/i);
        expect(todoItems).toHaveLength(3);

        // 3. 每一筆顯示案主名稱「案主林阿嬤 - 定期訪視」與時間地點
        const timeLocations = screen.getAllByText(/下午 2:00 • 台北市士林區/i);
        expect(timeLocations).toHaveLength(3);

        // 4. 每一筆顯示「查看詳情」按鈕
        const detailsButtons = screen.getAllByRole('button', { name: /查看詳情/i });
        expect(detailsButtons).toHaveLength(3);
    });

    // 【資料渲染】檢查通知中心列表
    it('should render notifications correctly', () => {
        render(<Dashboard />);

        // 1. 顯示「最近通知」區塊標題
        expect(screen.getByRole('heading', { name: /最近通知/i })).toBeInTheDocument();

        // 2. 顯示第一則通知「張居服員提交了新的訪視紀錄」
        expect(screen.getByText(/張居服員提交了新的訪視紀錄/i)).toBeInTheDocument();

        // 3. 顯示第二則通知「李爺爺的照顧計畫下週即將到期」
        expect(screen.getByText(/李爺爺的照顧計畫下週即將到期/i)).toBeInTheDocument();
    });
});
