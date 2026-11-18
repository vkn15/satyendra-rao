'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { NewsBrief } from '@/types';
import { 
  Sparkles, 
  X, 
  Share2, 
  BookOpen, 
  Languages, 
  FileText, 
  Copy, 
  Check, 
  Loader2, 
  Send 
} from 'lucide-react';

interface AIAssistantModalProps {
  newsItem: NewsBrief | null;
  onClose: () => void;
  onApplySummary?: (summary_en: string, summary_hi: string, points_en?: string[], points_hi?: string[]) => void;
}

export default function AIAssistantModal({ newsItem, onClose, onApplySummary }: AIAssistantModalProps) {
  const { showToast } = useToast();
  const [activeAction, setActiveAction] = useState<'summarize' | 'social' | 'blog_topics' | 'translate'>('summarize');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Results
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [socialResult, setSocialResult] = useState<any>(null);
  const [blogTopicsResult, setBlogTopicsResult] = useState<any[]>([]);
  const [translationResult, setTranslationResult] = useState<string>('');
  const [translateTarget, setTranslateTarget] = useState<'hi' | 'en'>('hi');

  const headline = newsItem ? newsItem.headline_en : '';
  const summary = newsItem ? newsItem.summary_en : '';

  // Trigger Summarize
  const handleSummarize = async () => {
    if (!newsItem) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: newsItem.headline_en,
          source: newsItem.source,
          description: newsItem.summary_en || newsItem.headline_en,
          publishedDate: newsItem.published_date,
          sourceUrl: newsItem.source_url
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummaryResult(data);
      showToast('AI Summarization complete', 'success');
    } catch (e: any) {
      showToast(e.message || 'Summarization error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Social Captions
  const handleGenerateSocial = async () => {
    if (!newsItem) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'social_captions',
          headline: newsItem.headline_hi || newsItem.headline_en,
          summary: newsItem.summary_hi || newsItem.summary_en,
          sourceUrl: newsItem.source_url
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSocialResult(data);
      showToast('Social captions generated', 'success');
    } catch (e: any) {
      showToast(e.message || 'Social generation error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Blog Topics
  const handleSuggestBlogTopics = async () => {
    if (!newsItem) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'blog_topics',
          headline: newsItem.headline_en,
          summary: newsItem.summary_en
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBlogTopicsResult(data);
      showToast('Blog topic suggestions ready', 'success');
    } catch (e: any) {
      showToast(e.message || 'Blog topics error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Translation
  const handleTranslate = async () => {
    if (!newsItem) return;
    setLoading(true);
    try {
      const sourceText = translateTarget === 'hi' ? newsItem.summary_en : newsItem.summary_hi;
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: translateTarget === 'hi' ? 'en' : 'hi',
          to: translateTarget
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTranslationResult(data.translated);
      showToast('Translation completed', 'success');
    } catch (e: any) {
      showToast(e.message || 'Translation error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-yellow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                AI Youth Policy & News Assistant
              </h3>
              <p className="text-xs text-purple-200 truncate max-w-md">
                {newsItem?.headline_en}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 p-3 bg-purple-50/70 border-b border-purple-100 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => {
              setActiveAction('summarize');
              if (!summaryResult) handleSummarize();
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAction === 'summarize'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent-yellow" />
            <span>Summarize News</span>
          </button>

          <button
            onClick={() => {
              setActiveAction('social');
              if (!socialResult) handleGenerateSocial();
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAction === 'social'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social Captions</span>
          </button>

          <button
            onClick={() => {
              setActiveAction('blog_topics');
              if (blogTopicsResult.length === 0) handleSuggestBlogTopics();
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAction === 'blog_topics'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Suggest Blog Topics</span>
          </button>

          <button
            onClick={() => {
              setActiveAction('translate');
              if (!translationResult) handleTranslate();
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAction === 'translate'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Translate Summary</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-purple-900">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI processing in progress...
              </p>
            </div>
          ) : (
            <>
              {/* ACTION 1: SUMMARIZE */}
              {activeAction === 'summarize' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      AI Generated Bilingual Summary
                    </span>
                    <button
                      onClick={handleSummarize}
                      className="text-xs font-bold text-purple-900 hover:underline"
                    >
                      Regenerate
                    </button>
                  </div>

                  {summaryResult && (
                    <div className="space-y-4">
                      {/* Hindi */}
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2 font-hindi">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-900">
                            हिन्दी सारांश (Hindi Summary):
                          </span>
                          <button
                            onClick={() => copyToClipboard(summaryResult.summary_hi, 'sum_hi')}
                            className="text-xs text-purple-900 hover:underline flex items-center gap-1"
                          >
                            {copiedKey === 'sum_hi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {summaryResult.summary_hi}
                        </p>
                      </div>

                      {/* English */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            English Summary:
                          </span>
                          <button
                            onClick={() => copyToClipboard(summaryResult.summary_en, 'sum_en')}
                            className="text-xs text-slate-700 hover:underline flex items-center gap-1"
                          >
                            {copiedKey === 'sum_en' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {summaryResult.summary_en}
                        </p>
                      </div>

                      {/* Apply button */}
                      {onApplySummary && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              onApplySummary(
                                summaryResult.summary_en,
                                summaryResult.summary_hi,
                                summaryResult.key_points_en,
                                summaryResult.key_points_hi
                              );
                              showToast('Applied AI summaries to article!', 'success');
                              onClose();
                            }}
                            className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-colors"
                          >
                            Apply Summaries to Article Form
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ACTION 2: SOCIAL CAPTIONS */}
              {activeAction === 'social' && socialResult && (
                <div className="space-y-4">
                  {/* Twitter / X */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">Twitter / X Post:</span>
                      <button
                        onClick={() => copyToClipboard(socialResult.twitter_x, 'soc_tw')}
                        className="text-xs text-purple-900 font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'soc_tw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Post</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-hindi">
                      {socialResult.twitter_x}
                    </p>
                  </div>

                  {/* WhatsApp Broadcast */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 font-hindi">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">WhatsApp Broadcast Message:</span>
                      <button
                        onClick={() => copyToClipboard(socialResult.whatsapp_broadcast, 'soc_wa')}
                        className="text-xs text-emerald-900 font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'soc_wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Broadcast</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {socialResult.whatsapp_broadcast}
                    </p>
                  </div>

                  {/* Facebook Post */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 font-hindi">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900">Facebook Public Statement:</span>
                      <button
                        onClick={() => copyToClipboard(socialResult.facebook_post, 'soc_fb')}
                        className="text-xs text-purple-900 font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'soc_fb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Statement</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {socialResult.facebook_post}
                    </p>
                  </div>
                </div>
              )}

              {/* ACTION 3: SUGGEST BLOG TOPICS */}
              {activeAction === 'blog_topics' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Recommended Policy Blog Angles
                    </span>
                    <button
                      onClick={handleSuggestBlogTopics}
                      className="text-xs font-bold text-purple-900 hover:underline"
                    >
                      Regenerate
                    </button>
                  </div>

                  {blogTopicsResult.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                            Idea {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-navy-900">
                            {topic.title}
                          </h4>
                          <h5 className="text-xs font-semibold text-purple-950 font-hindi">
                            {topic.title_hi}
                          </h5>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${topic.title}\n${topic.title_hi}\nAngle: ${topic.angle}`, `topic_${idx}`)}
                          className="text-xs text-purple-900 hover:underline flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === `topic_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        <strong>Angle:</strong> {topic.angle}
                      </p>

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block mb-1">
                          Key Arguments to Address:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                          {topic.key_arguments?.map((arg: string, aIdx: number) => (
                            <li key={aIdx}>{arg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ACTION 4: TRANSLATE */}
              {activeAction === 'translate' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Target Language:</span>
                    <button
                      onClick={() => {
                        setTranslateTarget('hi');
                        handleTranslate();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        translateTarget === 'hi' ? 'bg-purple-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Translate to हिन्दी
                    </button>
                    <button
                      onClick={() => {
                        setTranslateTarget('en');
                        handleTranslate();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        translateTarget === 'en' ? 'bg-purple-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Translate to English
                    </button>
                  </div>

                  {translationResult && (
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900">
                          Translated Output:
                        </span>
                        <button
                          onClick={() => copyToClipboard(translationResult, 'trans')}
                          className="text-xs text-purple-900 font-bold hover:underline flex items-center gap-1"
                        >
                          {copiedKey === 'trans' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-hindi">
                        {translationResult}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>AI outputs must always be reviewed by admin before publishing.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
