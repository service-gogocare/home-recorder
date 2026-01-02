import React, { useState } from 'react';
import { Mic, Upload, FileText, Wand2, Save, Loader2, FileUp } from 'lucide-react';

const VisitRecord = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [content, setContent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<null | { summary: string; assessment: string; plan: string }>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const generateAnalysis = (text: string) => {
        let summary = "本日訪視摘要：\n";
        let assessment = "";
        let plan = "";

        const hasFallRisk = /跌倒|滑|不穩|摔|濕/.test(text);
        const hasPain = /痛|酸|痠|不舒服|難受/.test(text);
        const hasMedsIssue = /藥|吞|吃藥|副作用/.test(text);
        const hasMoodIssue = /心情|哭|難過|生氣|煩|孤單/.test(text);

        // Summary generation
        if (hasFallRisk) summary += "- 環境或生理狀況顯示有跌倒風險。\n";
        if (hasPain) summary += "- 案主主訴身體疼痛/不適。\n";
        if (hasMedsIssue) summary += "- 用藥狀況需關注。\n";
        if (hasMoodIssue) summary += "- 情緒較為低落或不穩定。\n";
        if (summary === "本日訪視摘要：\n") summary += "案主精神狀況良好，意識清楚，生活作息規律。\n";

        // Assessment generation
        let assessCount = 1;
        if (hasFallRisk) assessment += `${assessCount++}. 跌倒風險：環境濕滑或步態不穩，高跌倒風險。\n`;
        if (hasPain) assessment += `${assessCount++}. 舒適度：疼痛指數待評估，影響活動意願。\n`;
        if (hasMedsIssue) assessment += `${assessCount++}. 服藥順從性：可能因吞嚥困難或副作用自行停藥。\n`;
        if (hasMoodIssue) assessment += `${assessCount++}. 心理狀態：需關注情緒支持系統與社交互動。\n`;
        if (!assessment) assessment = "1. 整體評估：身心狀況維持穩定，無特殊異常。\n";

        // Plan generation
        let planCount = 1;
        if (hasFallRisk) plan += `${planCount++}. 環境安全：建議安裝扶手、止滑墊，保持地面乾燥。\n`;
        if (hasPain) plan += `${planCount++}. 疼痛緩解：建議熱敷/按摩，或協助就醫調整藥物。\n`;
        if (hasMedsIssue) plan += `${planCount++}. 用藥指導：與醫師討論劑型調整(磨粉/藥水)，建立按時服藥習慣。\n`;
        if (hasMoodIssue) plan += `${planCount++}. 心理支持：傾聽陪伴，鼓勵參與社區活動或轉介心理諮詢。\n`;
        if (!plan) plan += "1. 持續追蹤：依照 care plan 執行常規訪視與照護。\n";

        return { summary, assessment, plan };
    };

    const handleAnalyze = () => {
        if (!content.trim()) return;

        setIsAnalyzing(true);
        // Simulate AI delay and dynamic analysis
        setTimeout(() => {
            const analysisResult = generateAnalysis(content);
            setResult(analysisResult);
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleMockFill = () => {
        setContent("今天去看林阿嬤，她精神看起來不錯，但是一直在抱怨膝蓋很痛，都不太想走路。我看了一下家裡環境，客廳還好，但是浴室地板有點濕濕的，我覺得很危險。她藥都有在吃，但是跟我說藥丸太大顆了，很難吞。");
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setContent(prev => prev ? prev + '\n' + text : text);
            }
        };
        reader.readAsText(file);
    };

    const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsTranscribing(true);
        // Simulate audio upload and transcription delay
        setTimeout(() => {
            const mockTranscript = `[語音轉文字模擬 - 來源檔案: ${file.name}]\n訪視員：阿嬤，今天身體感覺怎麼樣？\n案主：哎唷，那個膝蓋還是很痛捏，尤其是早上下床的時候。\n訪視員：藥都有按時吃嗎？\n案主：有啦，但是那個藥丸好大顆，我吞不下去，都偷偷吐掉幾次...\n訪視員：這樣不行啦，我們下次去給醫生看，請他開小顆一點的或是藥粉好不好？\n案主：好啦好啦。啊對了，廁所地版有點滑，我昨天差點滑倒。\n`;
            setContent(prev => prev ? prev + '\n\n' + mockTranscript : mockTranscript);
            setIsTranscribing(false);
            // Reset input value to allow selecting same file again
            event.target.value = '';
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6">
            {/* Input Section */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        訪視紀錄輸入
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleMockFill}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            帶入範例
                        </button>
                        <label className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                            <FileUp className="w-3 h-3" />
                            匯入逐字稿
                            <input
                                type="file"
                                accept=".txt,.md"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                        <label className={`px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${isTranscribing ? 'opacity-50 cursor-wait' : ''}`}>
                            {isTranscribing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            {isTranscribing ? '轉錄中...' : '匯入錄音'}
                            <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={handleAudioUpload}
                                disabled={isTranscribing}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700"
                            placeholder="請輸入訪視內容，或使用語音輸入..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`absolute bottom-4 right-4 p-4 rounded-full shadow-lg transition-all ${isRecording
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                        >
                            <Mic className="w-6 h-6" />
                        </button>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!content || isAnalyzing}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                AI 分析撰寫中...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                開始 AI 輔助撰寫
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-purple-600" />
                        AI 紀錄建議
                    </h2>
                    {result && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            分析完成
                        </span>
                    )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Wand2 className="w-8 h-8 opacity-20" />
                            </div>
                            <p>請在左側輸入內容並點擊分析</p>
                            <p className="text-sm mt-2">AI 將自動為您整理摘要、評估與計畫</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                    個案摘要
                                </h3>
                                <div className="p-4 bg-blue-50/50 rounded-lg text-gray-800 leading-relaxed text-sm">
                                    {result.summary}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                                    評估分析
                                </h3>
                                <div className="p-4 bg-amber-50/50 rounded-lg text-gray-800 leading-relaxed text-sm whitespace-pre-line">
                                    {result.assessment}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                    建議處遇計畫
                                </h3>
                                <div className="p-4 bg-emerald-50/50 rounded-lg text-gray-800 leading-relaxed text-sm whitespace-pre-line">
                                    {result.plan}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        重新產生
                    </button>
                    <button className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        確認並存檔
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitRecord;
