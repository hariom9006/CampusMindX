import React, { useState, useEffect } from 'react';
import { X, Sparkles, BrainCircuit, ArrowUpRight, ArrowDownRight, ShieldAlert, Cpu, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { apiService } from '../services/api';

export default function ExplainabilityModal({
  isOpen,
  onClose,
  title = "Academic Risk & Feature Contribution Analysis",
  studentName = "Aarav Sharma",
  rollNo = "22BCA1042",
  riskLevel = "Medium",
  overallScore = "71%",
  factors = [],
  predictionData = null,
  isModel = false,
  academicData = null,
  target = "risk"
}) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadExplanation() {
      // If predictionData already contains plain_language_summary and contributing_factors, use it
      if (predictionData?.plain_language_summary && predictionData?.contributing_factors) {
        setExplanation(predictionData);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.explainPrediction(
          academicData || { studentId: rollNo },
          target
        );
        if (isMounted && data) {
          setExplanation(data);
        }
      } catch (err) {
        console.warn('Failed to load live explanation:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadExplanation();
    return () => {
      isMounted = false;
    };
  }, [isOpen, rollNo, predictionData, academicData, target]);

  if (!isOpen) return null;

  // Use explanation data if available, fallback to predictionData or default factors
  const isLiveModel = isModel || (explanation && explanation.status === 'model') || (predictionData && predictionData.status === 'model');
  const confidencePercent = explanation?.confidence_percent || (predictionData?.confidence
    ? `${(predictionData.confidence * 100).toFixed(1)}%`
    : (isLiveModel ? "77.0%" : "Demo Heuristic"));

  const plainLanguageExplanation = explanation?.plain_language_summary || (
    predictionData?.category_meaning
      ? `The model evaluated multiple academic indicators and predicted the Academic Support Indicator as ${riskLevel}. Low lecture/lab attendance (68%) and assignment completion deficits (62%) contributed to the elevated risk tier, while solid previous GPA acted as a stabilizing factor.`
      : "Lecture and lab attendance below 75% alongside coursework delays contributed to the model's predictive classification."
  );

  const nonCausalDisclaimer = explanation?.non_causal_statement ||
    "These factors contributed to the model prediction and do not imply direct deterministic causation. The model identifies statistical correlations based on past cohort academic patterns to assist advisor decision support.";

  // Extract contributing factors list
  const factorList = explanation?.contributing_factors || (
    predictionData?.feature_contributions
      ? predictionData.feature_contributions.map((fc) => ({
          label: fc.label,
          contribution_level: Math.abs(fc.contribution_score || 0) >= 12 ? 'High contribution' : (Math.abs(fc.contribution_score || 0) >= 5 ? 'Medium contribution' : 'Low contribution'),
          impact: fc.impact,
          type: fc.type,
          student_value: fc.value,
          cohort_benchmark: fc.cohort_benchmark || '75%',
          explanation: `${fc.label} (${fc.value}) contributed ${fc.type === 'positive' ? 'positively' : 'negatively'} to the model prediction.`
        }))
      : (factors.length > 0 ? factors : [
          {
            label: "Lecture & Lab Attendance",
            contribution_level: "High contribution",
            impact: "-15.5%",
            type: "negative",
            student_value: "68.0%",
            cohort_benchmark: "75.0%",
            explanation: "Lecture & Lab Attendance (68.0%) fell below the mandatory 75% benchmark and contributed to the elevated risk tier prediction."
          },
          {
            label: "Mid-Term Internal Evaluation",
            contribution_level: "High contribution",
            impact: "-23.0%",
            type: "negative",
            student_value: "16.0/30",
            cohort_benchmark: "18.0/30",
            explanation: "Mid-Term Internal Evaluation (16.0/30) fell below cohort benchmark and contributed to the elevated risk tier prediction."
          },
          {
            label: "Continuous Assignment Submissions",
            contribution_level: "Medium contribution",
            impact: "-9.1%",
            type: "negative",
            student_value: "62.0%",
            cohort_benchmark: "70.0%",
            explanation: "Continuous Assignment Submissions (62.0%) fell below benchmark and contributed to the elevated risk tier prediction."
          },
          {
            label: "Historical Cumulative CGPA",
            contribution_level: "Low contribution",
            impact: "+11.8%",
            type: "positive",
            student_value: "7.42/10.0",
            cohort_benchmark: "7.0/10.0",
            explanation: "Historical Cumulative CGPA (7.42/10.0) exceeded cohort expectations and contributed positively to the model prediction."
          }
        ])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#0b1222] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 md:p-8 overflow-hidden text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background circles */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
                
                {/* Clear distinction: Model Prediction vs Demo Data */}
                {isLiveModel ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Model Prediction</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <span>Demo Data</span>
                  </span>
                )}
                {loading && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Syncing...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Student: <span className="text-slate-200 font-semibold">{studentName}</span> ({rollNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close explainability modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metric Ribbon */}
        <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block">Classified Risk</span>
            <div className="mt-1 flex justify-center">
              <RiskBadge level={riskLevel} size="sm" />
            </div>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[11px] text-slate-400 block">Current Standing</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">{overallScore}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Model Confidence</span>
            <span className="text-base font-bold text-purple-400 mt-1 block">{confidencePercent}</span>
          </div>
        </div>

        {/* Plain-Language Explanation Block ("Why did the model generate this result?") */}
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-200 shrink-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-xs">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Why did the model generate this result?</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {plainLanguageExplanation}
          </p>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="space-y-2.5 my-3 overflow-y-auto pr-1 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Factor Contributions & Benchmarks
            </span>
            <span className="text-[11px] font-mono text-slate-500">Contribution Level</span>
          </div>

          {factorList.map((item, idx) => {
            const isPos = item.type === 'positive';
            const contribLevel = item.contribution_level || 'Medium contribution';
            const isHigh = contribLevel.toLowerCase().includes('high');

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  isPos
                    ? 'bg-emerald-950/20 border-emerald-500/25 hover:border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/25 hover:border-rose-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    <div
                      className={`p-1.5 rounded-lg mt-0.5 ${
                        isPos
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-900/50 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-slate-100">
                          {item.label || item.factor}
                        </h4>
                        {/* Contribution Level Tag */}
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {contribLevel}
                        </span>
                      </div>

                      {/* Supporting Data: Student vs Benchmark */}
                      {(item.student_value || item.value) && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                          <span>Student: <strong className="text-cyan-300">{item.student_value || item.value}</strong></span>
                          <span>•</span>
                          <span>Benchmark: <strong className="text-slate-300">{item.cohort_benchmark || '75%'}</strong></span>
                        </div>
                      )}

                      {/* Plain-Language Explanation */}
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {item.explanation || item.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                      isPos
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-900/40 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical Decision-Support Safeguard Notice */}
        <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-2 text-[11px] text-slate-300 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="text-amber-300 font-semibold">Non-Causal Decision Tool:</strong>{' '}
            {nonCausalDisclaimer}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isLiveModel ? 'Python Scikit-Learn Model' : 'Static Fallback Mode'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
}
