/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ChevronRight, AlertCircle, Download, CheckCircle2, User, HelpCircle } from 'lucide-react';
import { INDICATOR_DESCRIPTIONS, QUESTIONS, Question } from './constants';

type Direction = 'left' | 'equal' | 'right';

interface RatingState {
  direction: Direction;
  l: string;
  m: string;
  u: string;
}

export default function App() {
  const [expertName, setExpertName] = useState('');
  const [ratings, setRatings] = useState<Record<string, RatingState>>(
    Object.fromEntries(QUESTIONS.map(q => [q.id, { direction: 'equal', l: '1', m: '1', u: '1' }]))
  );
  const [showError, setShowError] = useState(false);

  const handleDirectionChange = (qid: string, direction: Direction) => {
    setRatings(prev => ({
      ...prev,
      [qid]: {
        direction,
        l: direction === 'equal' ? '1' : '',
        m: direction === 'equal' ? '1' : '',
        u: direction === 'equal' ? '1' : ''
      }
    }));
  };

  const handleInputChange = (qid: string, type: 'l' | 'm' | 'u', value: string) => {
    setRatings(prev => ({
      ...prev,
      [qid]: { ...prev[qid], [type]: value }
    }));
  };

  const validateTriangular = (l: number, m: number, u: number) => {
    if (isNaN(l) || isNaN(m) || isNaN(u)) return false;
    if (l < 1 || m < 1 || u < 1) return false;
    if (l > 9 || m > 9 || u > 9) return false;
    return l <= m && m <= u;
  };

  const exportData = () => {
    if (!expertName.trim()) {
      alert("请先填写专家姓名或代号");
      return;
    }

    let hasError = false;
    const results = {
      title: "大模型评价指标重要性评价专家问卷",
      expert: expertName,
      date: new Date().toLocaleDateString(),
      exportRule: "若选择右侧更重要，则系统按 (1/u, 1/m, 1/l) 自动换算为倒数模糊数",
      ratings: QUESTIONS.map(q => {
        const rating = ratings[q.id];
        const l = parseFloat(rating.l);
        const m = parseFloat(rating.m);
        const u = parseFloat(rating.u);

        if (rating.direction !== 'equal' && !validateTriangular(l, m, u)) {
          hasError = true;
        }

        let exportLMU;
        if (rating.direction === 'equal') {
          exportLMU = { l: 1, m: 1, u: 1 };
        } else if (rating.direction === 'left') {
          exportLMU = { l, m, u };
        } else {
          exportLMU = { l: Number((1 / u).toFixed(6)), m: Number((1 / m).toFixed(6)), u: Number((1 / l).toFixed(6)) };
        }

        return {
          ...q,
          direction: rating.direction,
          display: { l, m, u },
          export: exportLMU
        };
      })
    };

    if (hasError) {
      setShowError(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    setShowError(false);
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AHP_LLM_Eval_${expertName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-100">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center tracking-tight"
          >
            大模型评价指标重要性评价专家问卷
          </motion.h1>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p className="text-center text-lg">
              您好！本问卷旨在采用三角模糊数层次分析法（Fuzzy AHP）评估大模型评价指标在不同维度下的相对重要程度。
            </p>
            
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-900">
                <Info size={20} />
                <strong className="text-lg">测评场景定义：</strong>
              </div>
              <p className="text-indigo-800">
                旨在评估大语言模型在处理长文本、多轮对话及复杂指令时的信息留存与逻辑加工能力。涵盖了从基础的静态知识检索到动态的信息更新、抗干扰处理及系统响应效率等全方位维度，是衡量大模型实用性与可靠性的核心指标。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-500" />
                  填写项定义
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><strong>l (下界):</strong> <span>保守估计值（可能最低值）</span></li>
                  <li className="flex gap-2"><strong>m (中值):</strong> <span>最可能估计值（最符合判断）</span></li>
                  <li className="flex gap-2"><strong>u (上界):</strong> <span>乐观估计值（可能最高值）</span></li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-indigo-500" />
                  填写逻辑
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>先选方向：</strong>判断左侧重要、右侧重要，或两者一样重要</li>
                  <li>• <strong>若一方更重要：</strong>仅填写 1–9 范围内的 l, m, u</li>
                  <li>• <strong>若两者一样重要：</strong>系统自动记为 (1, 1, 1)</li>
                </ul>
              </div>
            </div>

            {/* Scale Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-700">标度值</th>
                    <th className="px-4 py-3 font-bold text-slate-700">含义</th>
                    <th className="px-4 py-3 font-bold text-slate-700">解释</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { val: '1', label: '同等重要', desc: '两个指标对上一级目标的重要性相同' },
                    { val: '3', label: '略微重要', desc: '一个指标比另一个指标稍微重要' },
                    { val: '5', label: '比较重要', desc: '一个指标比另一个指标明显重要' },
                    { val: '7', label: '非常重要', desc: '一个指标比另一个指标强烈重要' },
                    { val: '9', label: '极端重要', desc: '一个指标比另一个指标绝对重要' },
                    { val: '2,4,6,8', label: '中间值', desc: '表示相邻判断之间的折中程度' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-mono text-indigo-600 font-bold">{row.val}</td>
                      <td className="px-4 py-2 font-medium">{row.label}</td>
                      <td className="px-4 py-2 text-slate-500">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </header>

        {/* Indicator Hierarchy Table */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Info size={24} className="text-indigo-500" />
            评价指标体系概览
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-4 py-3 text-center font-bold text-slate-700 w-1/4">一级指标</th>
                  <th className="border border-slate-200 px-4 py-3 text-center font-bold text-slate-700 w-1/4">二级能力</th>
                  <th className="border border-slate-200 px-4 py-3 text-center font-bold text-slate-700 w-1/2">测频参数</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {/* 静态记忆 */}
                <tr>
                  <td rowSpan={4} className="border border-slate-200 px-4 py-3 text-center font-semibold bg-slate-50/30">静态记忆</td>
                  <td className="border border-slate-200 px-4 py-3 text-center">容量</td>
                  <td className="border border-slate-200 px-4 py-3">容量分数</td>
                </tr>
                <tr>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">准确性</td>
                  <td className="border border-slate-200 px-4 py-3">召回准确率</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">平衡分数</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3 text-center">持久性</td>
                  <td className="border border-slate-200 px-4 py-3">位置准确率方差</td>
                </tr>

                {/* 动态记忆 */}
                <tr>
                  <td rowSpan={6} className="border border-slate-200 px-4 py-3 text-center font-semibold bg-slate-50/30">动态记忆</td>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">写入与编码</td>
                  <td className="border border-slate-200 px-4 py-3">写入召回准确率</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">历史信息召回能力</td>
                </tr>
                <tr>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">更新与抑制</td>
                  <td className="border border-slate-200 px-4 py-3">更新准确率</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">幻觉率</td>
                </tr>
                <tr>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">主动遗忘</td>
                  <td className="border border-slate-200 px-4 py-3">Truth Ratio</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">Omission Rate</td>
                </tr>

                {/* 工作记忆加工 */}
                <tr>
                  <td rowSpan={4} className="border border-slate-200 px-4 py-3 text-center font-semibold bg-slate-50/30">工作记忆加工</td>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">抗噪与过度</td>
                  <td className="border border-slate-200 px-4 py-3">Signal-to-noise ratio</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">噪声注入准确率</td>
                </tr>
                <tr>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">简单聚合与排序</td>
                  <td className="border border-slate-200 px-4 py-3">列表EM</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">Counting Accuracy</td>
                </tr>

                {/* 系统级开销 */}
                <tr>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center font-semibold bg-slate-50/30">系统级开销</td>
                  <td rowSpan={2} className="border border-slate-200 px-4 py-3 text-center">响应延迟</td>
                  <td className="border border-slate-200 px-4 py-3">TTFT P95</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-3">TPOT P99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expert Info Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <User size={24} />
            </div>
            <label className="text-xl font-bold text-slate-800">专家姓名/代号</label>
          </div>
          <input 
            type="text" 
            value={expertName}
            onChange={(e) => setExpertName(e.target.value)}
            placeholder="请输入您的姓名或代号以开始评价" 
            className="flex-1 w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none px-6 py-4 rounded-2xl transition-all text-lg"
          />
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          {QUESTIONS.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                    {q.id}
                  </span>
                  <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                    {q.context.split(' > ').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && <ChevronRight size={14} />}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">
                <IndicatorCard name={q.left} color="blue" />
                <div className="text-slate-200 font-black text-2xl select-none">VS</div>
                <IndicatorCard name={q.right} color="indigo" />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">选择比较关系</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DirectionButton 
                    active={ratings[q.id].direction === 'left'} 
                    onClick={() => handleDirectionChange(q.id, 'left')}
                    label={`${q.left} 比 ${q.right} 重要`}
                  />
                  <DirectionButton 
                    active={ratings[q.id].direction === 'equal'} 
                    onClick={() => handleDirectionChange(q.id, 'equal')}
                    label="两者一样重要"
                  />
                  <DirectionButton 
                    active={ratings[q.id].direction === 'right'} 
                    onClick={() => handleDirectionChange(q.id, 'right')}
                    label={`${q.right} 比 ${q.left} 重要`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['l', 'm', 'u'] as const).map((type) => (
                  <div key={type}>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">
                      {type === 'l' ? '下界 (l)' : type === 'm' ? '中值 (m)' : '上界 (u)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      step="1"
                      value={ratings[q.id][type]}
                      onChange={(e) => handleInputChange(q.id, type, e.target.value)}
                      disabled={ratings[q.id].direction === 'equal'}
                      className={`w-full text-center py-4 rounded-2xl border-2 transition-all text-xl font-bold outline-none
                        ${ratings[q.id].direction === 'equal' 
                          ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                          : 'bg-white border-slate-100 focus:border-indigo-500 text-slate-700'
                        }
                        ${showError && ratings[q.id].direction !== 'equal' && !validateTriangular(parseFloat(ratings[q.id].l), parseFloat(ratings[q.id].m), parseFloat(ratings[q.id].u))
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : ''
                        }
                      `}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer / Export */}
        <div className="mt-16 bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm">
          <AnimatePresence>
            {showError && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 font-bold mb-6 flex items-center justify-center gap-2 text-lg"
              >
                <AlertCircle size={24} />
                请检查并修正红框部分的逻辑错误（需满足 1 ≤ l ≤ m ≤ u ≤ 9）
              </motion.p>
            )}
          </AnimatePresence>
          
          <button 
            onClick={exportData}
            className="group relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-20 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 text-2xl flex items-center gap-3 mx-auto"
          >
            <Download size={28} className="group-hover:bounce" />
            完成并导出评价结果
          </button>
          <p className="mt-6 text-slate-400 text-sm">
            评价结果将以 JSON 格式导出，包含原始评分及自动换算的倒数模糊数。
          </p>
        </div>
      </div>
    </div>
  );
}

function IndicatorCard({ name, color }: { name: string, color: 'blue' | 'indigo' }) {
  const desc = INDICATOR_DESCRIPTIONS[name] || "暂无解释";
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          px-8 py-4 rounded-2xl font-bold text-xl cursor-help transition-all
          ${color === 'blue' ? 'bg-blue-50 text-blue-700 border-2 border-blue-100' : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-100'}
          hover:scale-105 hover:shadow-lg
        `}
      >
        {name}
      </div>
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-64 bg-slate-900 text-white text-sm p-4 rounded-2xl shadow-2xl z-50 pointer-events-none"
          >
            <div className="relative">
              {desc}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DirectionButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-6 py-4 rounded-2xl border-2 font-bold transition-all text-sm
        ${active 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-300 hover:bg-white'
        }
      `}
    >
      {label}
    </button>
  );
}
