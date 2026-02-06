import { render, screen, waitFor, act } from '@testing-library/react';
import VisitRecord from '../VisitRecord';
import { describe, it, expect, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('VisitRecord Page Tests', () => {

    afterEach(() => {
        vi.useRealTimers();
    });

    // 【前端元素】檢查頁面結構與初始狀態
    it('should display page structure and initial state correctly', () => {
        render(<VisitRecord />);

        // 1. 顯示標題「訪視紀錄輸入」與圖示
        expect(screen.getByText('訪視紀錄輸入')).toBeInTheDocument();

        // 2. 顯示「帶入範例」、「匯入逐字稿」、「匯入錄音」三個功能按鈕
        expect(screen.getByRole('button', { name: /帶入範例/i })).toBeInTheDocument();
        expect(screen.getByText(/匯入逐字稿/i)).toBeInTheDocument(); // Label text
        expect(screen.getByText(/匯入錄音/i)).toBeInTheDocument(); // Label text

        // 3. 顯示輸入框，Placeholder 為「請輸入訪視內容，或使用語音輸入...」
        expect(screen.getByPlaceholderText('請輸入訪視內容，或使用語音輸入...')).toBeInTheDocument();

        // 4. 右側顯示「AI 紀錄建議」區塊，初始狀態顯示提示訊息「請在左側輸入內容並點擊分析」
        expect(screen.getByText('AI 紀錄建議')).toBeInTheDocument();
        expect(screen.getByText('請在左側輸入內容並點擊分析')).toBeInTheDocument();
    });

    // 【互動元素】測試帶入範例功能
    it('should fill input when "Example Fill" button is clicked', async () => {
        const user = userEvent.setup();
        render(<VisitRecord />);

        // 1. 輸入框自動填入預設的訪視內容（包含林阿嬤、膝蓋痛等關鍵字）
        const fillButton = screen.getByRole('button', { name: /帶入範例/i });
        await user.click(fillButton);

        const textarea = screen.getByPlaceholderText('請輸入訪視內容，或使用語音輸入...');
        expect(textarea).toHaveValue(expect.stringContaining('林阿嬤'));
        expect(textarea).toHaveValue(expect.stringContaining('膝蓋很痛'));

        // 2. 「開始 AI 輔助撰寫」按鈕變為啟用狀態
        const analyzeButton = screen.getByRole('button', { name: /開始 AI 輔助撰寫/i });
        expect(analyzeButton).not.toBeDisabled();
    });

    // 【function 邏輯】測試 AI 分析功能
    it('should generate AI analysis results correctly', async () => {
        vi.useFakeTimers();
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<VisitRecord />);

        // 1. 在輸入框輸入：「案主感覺心情不好，一直哭，說藥物副作用很不舒服。」
        const textarea = screen.getByPlaceholderText('請輸入訪視內容，或使用語音輸入...');
        await user.type(textarea, '案主感覺心情不好，一直哭，說藥物副作用很不舒服。');

        // 2. 點擊「開始 AI 輔助撰寫」
        const analyzeButton = screen.getByRole('button', { name: /開始 AI 輔助撰寫/i });
        await user.click(analyzeButton);

        // 1. 按鈕顯示「AI 分析撰寫中...」並進入讀取狀態
        expect(screen.getByText('AI 分析撰寫中...')).toBeInTheDocument();

        // Fast-forward time for AI analysis simulation (1500ms)
        act(() => {
            vi.advanceTimersByTime(1500);
        });

        // 2. 分析完成後，右側顯示「分析完成」標籤
        await waitFor(() => {
            expect(screen.getByText('分析完成')).toBeInTheDocument();
        });

        // 3. 摘要區塊顯示包含「情緒較為低落」、「用藥狀況需關注」等內容
        expect(screen.getByText(/情緒較為低落/i)).toBeInTheDocument();
        expect(screen.getByText(/用藥狀況需關注/i)).toBeInTheDocument();

        // 4. 評估分析區塊顯示「心理狀態」、「服藥順從性」等項目
        expect(screen.getByText(/心理狀態/i)).toBeInTheDocument();
        expect(screen.getByText(/服藥順從性/i)).toBeInTheDocument();

        // 5. 建議處遇計畫區塊顯示「心理支持」、「用藥指導」等建議
        expect(screen.getByText(/心理支持/i)).toBeInTheDocument();
        expect(screen.getByText(/用藥指導/i)).toBeInTheDocument();
    });

    // 【互動元素】測試檔案匯入功能（逐字稿）
    it('should handle text file upload correctly', async () => {
        const user = userEvent.setup();
        render(<VisitRecord />);

        // 1. 模擬上傳一個 .txt 檔案，內容為「測試匯入內容」
        const file = new File(['測試匯入內容'], 'test.txt', { type: 'text/plain' });

        const fileInput = screen.getByLabelText(/匯入逐字稿/i);
        await user.upload(fileInput, file);

        // 1. 輸入框內容應包含「測試匯入內容」
        await waitFor(() => {
            const textarea = screen.getByPlaceholderText('請輸入訪視內容，或使用語音輸入...');
            expect(textarea).toHaveValue(expect.stringContaining('測試匯入內容'));
        });
    });

    // 【互動元素】測試音檔轉錄模擬
    it('should simulate audio transcription correctly', async () => {
        vi.useFakeTimers();
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<VisitRecord />);

        // 1. 模擬上傳一個音訊檔案
        const file = new File(['(binary)'], 'voice.mp3', { type: 'audio/mpeg' });
        const fileInput = screen.getByLabelText(/匯入錄音/i);
        await user.upload(fileInput, file);

        // 1. 「匯入錄音」按鈕顯示「轉錄中...」與讀取圖示
        expect(screen.getByText('轉錄中...')).toBeInTheDocument();

        // 2. 按鈕暫時無法點擊
        expect(fileInput).toBeDisabled();

        // Fast-forward time for transcription simulation (2000ms)
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // 3. 轉錄完成後（約 2 秒），輸入框自動附加「[語音轉文字模擬...]」開頭的文字內容
        await waitFor(() => {
            const textarea = screen.getByPlaceholderText('請輸入訪視內容，或使用語音輸入...');
            expect(textarea).toHaveValue(expect.stringContaining('[語音轉文字模擬'));
        });

        // Confirm button state reset
        expect(screen.getByText('匯入錄音')).toBeInTheDocument();
        expect(fileInput).not.toBeDisabled();
    });
});
