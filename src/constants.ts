export const INDICATOR_DESCRIPTIONS: Record<string, string> = {
  "静态记忆": "考察模型对预训练知识或固定信息的存储与提取能力。",
  "动态记忆": "考察模型在对话过程中对新信息的实时编码、更新及遗忘能力。",
  "工作记忆加工": "考察模型在处理复杂任务时对信息的抗干扰能力及逻辑聚合能力。",
  "系统级开销": "考察模型在实际运行过程中的资源消耗与响应速度。",
  "容量": "模型能够存储的信息总量。",
  "准确性": "提取存储信息时的正确程度。",
  "持久性": "信息在不同位置或时间段的留存稳定性。",
  "写入与编码": "将新信息转化为模型可理解形式的能力。",
  "更新与抑制": "根据新信息修正旧认知并抑制错误干扰的能力。",
  "主动遗忘": "识别并舍弃无关或过时信息的能力。",
  "抗噪与过度": "在存在噪声干扰的情况下提取核心信息的能力。",
  "简单聚合与排序": "对多个信息点进行归纳、对比和排序的能力。",
  "响应延迟": "系统处理请求并返回结果的时间表现。",
  "容量分数": "衡量模型记忆容量的量化指标。",
  "召回准确率": "正确召回的事实数量占比。",
  "平衡分数": "综合考虑容量与召回率的平衡指标。",
  "位置准确率方差": "衡量不同位置信息提取准确性的波动程度。",
  "写入召回准确率": "针对新写入事实的召回正确率。",
  "历史信息召回能力": "对对话历史中提及信息的提取能力。",
  "更新准确率": "正确使用新信息修正回答的比例。",
  "幻觉率": "模型产生编造或错误信息的频率。",
  "Truth Ratio": "真实信息在输出中的占比。",
  "Omission Rate": "遗漏关键信息的比例。",
  "Signal-to-noise ratio": "信号与噪声的比例（SNR）。",
  "噪声注入准确率": "在加入噪声背景下的信息提取准确度。",
  "列表EM": "列表匹配的精确匹配得分（Exact Match）。",
  "Counting Accuracy": "计数任务的准确性。",
  "TTFT P95": "首字响应时间（Time to First Token）的95分位数。",
  "TPOT P99": "单位字符生成时间（Time Per Output Token）的99分位数。"
};

export interface Question {
  id: string;
  context: string;
  left: string;
  right: string;
}

export const QUESTIONS: Question[] = [
  // Level 1 Comparisons
  { id: "Q1", context: "测评总分 > 一级指标", left: "静态记忆", right: "动态记忆" },
  { id: "Q2", context: "测评总分 > 一级指标", left: "静态记忆", right: "工作记忆加工" },
  { id: "Q3", context: "测评总分 > 一级指标", left: "静态记忆", right: "系统级开销" },
  { id: "Q4", context: "测评总分 > 一级指标", left: "动态记忆", right: "工作记忆加工" },
  { id: "Q5", context: "测评总分 > 一级指标", left: "动态记忆", right: "系统级开销" },
  { id: "Q6", context: "测评总分 > 一级指标", left: "工作记忆加工", right: "系统级开销" },

  // Level 2 under 静态记忆
  { id: "Q7", context: "一级指标：静态记忆 > 二级能力", left: "容量", right: "准确性" },
  { id: "Q8", context: "一级指标：静态记忆 > 二级能力", left: "容量", right: "持久性" },
  { id: "Q9", context: "一级指标：静态记忆 > 二级能力", left: "准确性", right: "持久性" },

  // Level 2 under 动态记忆
  { id: "Q10", context: "一级指标：动态记忆 > 二级能力", left: "写入与编码", right: "更新与抑制" },
  { id: "Q11", context: "一级指标：动态记忆 > 二级能力", left: "写入与编码", right: "主动遗忘" },
  { id: "Q12", context: "一级指标：动态记忆 > 二级能力", left: "更新与抑制", right: "主动遗忘" },

  // Level 2 under 工作记忆加工
  { id: "Q13", context: "一级指标：工作记忆加工 > 二级能力", left: "抗噪与过度", right: "简单聚合与排序" },

  // Level 3 under 准确性
  { id: "Q14", context: "二级能力：准确性 > 测频参数", left: "召回准确率", right: "平衡分数" },

  // Level 3 under 写入与编码
  { id: "Q15", context: "二级能力：写入与编码 > 测频参数", left: "写入召回准确率", right: "历史信息召回能力" },

  // Level 3 under 更新与抑制
  { id: "Q16", context: "二级能力：更新与抑制 > 测频参数", left: "更新准确率", right: "幻觉率" },

  // Level 3 under 主动遗忘
  { id: "Q17", context: "二级能力：主动遗忘 > 测频参数", left: "Truth Ratio", right: "Omission Rate" },

  // Level 3 under 抗噪与过度
  { id: "Q18", context: "二级能力：抗噪与过度 > 测频参数", left: "Signal-to-noise ratio", right: "噪声注入准确率" },

  // Level 3 under 简单聚合与排序
  { id: "Q19", context: "二级能力：简单聚合与排序 > 测频参数", left: "列表EM", right: "Counting Accuracy" },

  // Level 3 under 响应延迟
  { id: "Q20", context: "二级能力：响应延迟 > 测频参数", left: "TTFT P95", right: "TPOT P99" }
];
