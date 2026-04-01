'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, DollarSign, Tag, ArrowLeft, ArrowRight, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTrips } from '@/hooks/useTrips';
import { CURRENCIES } from '@/lib/utils';

const COVER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop', label: '東京' },
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop', label: '峇里島' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop', label: '巴黎' },
  { url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=400&fit=crop', label: '首爾' },
  { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop', label: '新加坡' },
  { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=400&fit=crop', label: '自然' },
];

const STEPS = ['基本資訊', '旅行日期', '封面與預算', '確認建立'];

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip } = useTrips();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    currency: 'TWD',
    coverImage: COVER_IMAGES[0].url,
    tags: [] as string[],
    notes: '',
  });

  const updateForm = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const canAdvance = () => {
    if (step === 0) return form.title.trim() && form.destination.trim();
    if (step === 1) return form.startDate && form.endDate;
    if (step === 2) return form.coverImage;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createTrip({
        title: form.title,
        destination: form.destination,
        country: form.country || form.destination,
        coverImage: form.coverImage,
        startDate: form.startDate,
        endDate: form.endDate,
        totalBudget: parseFloat(form.totalBudget) || 0,
        currency: form.currency,
        status: 'planning',
        tags: form.tags,
        notes: form.notes,
      });
      router.push('/trips');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const TAGS = ['文化', '美食', '購物', '自然', '沙灘', '冒險', '家庭', '蜜月', '商務', '背包客'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">建立新行程</h1>
          <p className="text-slate-500 text-sm">{STEPS[step]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-sky-500' : 'bg-slate-200'}`} />
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <Card className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1.5 text-sky-500" />
                  行程名稱
                </label>
                <Input
                  placeholder="例如：東京春季賞花之旅"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">目的地城市</label>
                <Input
                  placeholder="例如：東京, 大阪"
                  value={form.destination}
                  onChange={(e) => updateForm('destination', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">國家</label>
                <Input
                  placeholder="例如：日本"
                  value={form.country}
                  onChange={(e) => updateForm('country', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1.5 text-sky-500" />
                  旅行標籤
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        form.tags.includes(tag)
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1.5 text-sky-500" />
                  出發日期
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateForm('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">返回日期</label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateForm('endDate', e.target.value)}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              {form.startDate && form.endDate && (
                <div className="p-4 rounded-xl bg-sky-50 text-sky-700 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                  行程共 {Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1} 天
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">備註</label>
                <textarea
                  placeholder="任何需要記錄的想法..."
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <ImageIcon className="inline w-4 h-4 mr-1.5 text-sky-500" />
                  封面圖片
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COVER_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => updateForm('coverImage', img.url)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                        form.coverImage === img.url
                          ? 'border-sky-500 ring-2 ring-sky-200'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      {form.coverImage === img.url && (
                        <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-sky-600" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-0 right-0 text-center text-white text-xs font-medium drop-shadow">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1.5 text-sky-500" />
                    旅遊預算
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.totalBudget}
                    onChange={(e) => updateForm('totalBudget', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">幣別</label>
                  <select
                    value={form.currency}
                    onChange={(e) => updateForm('currency', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                確認行程資訊
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: '行程名稱', value: form.title },
                  { label: '目的地', value: `${form.destination}${form.country ? `, ${form.country}` : ''}` },
                  { label: '出發日期', value: form.startDate },
                  { label: '返回日期', value: form.endDate },
                  { label: '預算', value: `${form.totalBudget || '未設定'} ${form.currency}` },
                  { label: '標籤', value: form.tags.join('、') || '未設定' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900 max-w-[200px] text-right">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 0 ? '取消' : '上一步'}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            variant="gradient"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            下一步
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="gradient" onClick={handleSubmit} disabled={loading}>
            {loading ? '建立中...' : '確認建立行程'}
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
