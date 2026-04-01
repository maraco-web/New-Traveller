'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PiggyBank, Plus, Trash2, TrendingDown, TrendingUp, DollarSign, ShoppingBag, Plane, Building2, Utensils, Car, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MOCK_TRIPS } from '@/data/mockTrips';
import { formatCurrency, CURRENCIES, convertToTWD } from '@/lib/utils';
import { Expense, ExpenseCategory } from '@/types';

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; color: string; icon: React.ElementType }> = {
  flights: { label: '機票', color: '#0ea5e9', icon: Plane },
  accommodation: { label: '住宿', color: '#8b5cf6', icon: Building2 },
  food: { label: '餐飲', color: '#f97316', icon: Utensils },
  activities: { label: '活動', color: '#10b981', icon: Activity },
  transport: { label: '交通', color: '#3b82f6', icon: Car },
  shopping: { label: '購物', color: '#ec4899', icon: ShoppingBag },
  other: { label: '其他', color: '#6b7280', icon: DollarSign },
};

// Demo expenses
const DEMO_EXPENSES: Expense[] = [
  { id: 'e1', tripId: 'demo-trip-001', category: 'flights', amount: 8500, currency: 'TWD', amountInBase: 8500, description: '台北→東京 CI-100', date: '2026-04-10', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e2', tripId: 'demo-trip-001', category: 'accommodation', amount: 8500, currency: 'TWD', amountInBase: 8500, description: '東京灣萬豪 (3晚)', date: '2026-04-10', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e3', tripId: 'demo-trip-001', category: 'food', amount: 2500, currency: 'TWD', amountInBase: 2500, description: '築地市場壽司', date: '2026-04-11', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e4', tripId: 'demo-trip-001', category: 'activities', amount: 1800, currency: 'TWD', amountInBase: 1800, description: '東京鐵塔入場券', date: '2026-04-11', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e5', tripId: 'demo-trip-001', category: 'transport', amount: 800, currency: 'TWD', amountInBase: 800, description: '成田特快 NEX', date: '2026-04-10', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e6', tripId: 'demo-trip-001', category: 'shopping', amount: 5000, currency: 'TWD', amountInBase: 5000, description: '秋葉原、表參道購物', date: '2026-04-12', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'e7', tripId: 'demo-trip-001', category: 'food', amount: 1500, currency: 'TWD', amountInBase: 1500, description: '一蘭拉麵 x2', date: '2026-04-12', createdAt: '2026-01-15T00:00:00Z' },
];

export default function BudgetPage() {
  const [selectedTrip, setSelectedTrip] = useState(MOCK_TRIPS[0]);
  const [expenses, setExpenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'food' as ExpenseCategory,
    amount: '',
    currency: 'TWD',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totalBudget = selectedTrip.totalBudget;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amountInBase, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  // Chart data
  const categoryData = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
    const amount = expenses
      .filter((e) => e.category === key)
      .reduce((sum, e) => sum + e.amountInBase, 0);
    return {
      name: config.label,
      value: amount,
      color: config.color,
    };
  }).filter((d) => d.value > 0);

  const dailyData = expenses.reduce<Record<string, number>>((acc, e) => {
    const day = new Date(e.date).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
    acc[day] = (acc[day] || 0) + e.amountInBase;
    return acc;
  }, {});

  const barData = Object.entries(dailyData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;
    const amount = parseFloat(newExpense.amount);
    const amountInBase = convertToTWD(amount, newExpense.currency);
    const expense: Expense = {
      id: `e-${Date.now()}`,
      tripId: selectedTrip.id,
      category: newExpense.category,
      amount,
      currency: newExpense.currency,
      amountInBase,
      description: newExpense.description,
      date: newExpense.date,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
    setShowAddForm(false);
    setNewExpense({ category: 'food', amount: '', currency: 'TWD', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-orange-500" />
            旅遊預算追蹤
          </h1>
          <p className="text-slate-500 mt-1">管理旅遊花費，掌握每一分錢的去向</p>
        </div>
        <Button variant="gradient" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          新增花費
        </Button>
      </div>

      {/* Trip Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {MOCK_TRIPS.map((trip) => (
          <button
            key={trip.id}
            onClick={() => setSelectedTrip(trip)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTrip.id === trip.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {trip.title}
          </button>
        ))}
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card className="p-5 border-2 border-orange-100">
            <h3 className="font-semibold text-slate-900 mb-4">新增花費記錄</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">類別</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value as ExpenseCategory }))}
                  className="w-full h-10 px-3 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">金額</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">幣別</label>
                <select
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense((p) => ({ ...p, currency: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">說明</label>
                <Input
                  placeholder="花費說明..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">日期</label>
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-5 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>取消</Button>
                <Button variant="gradient" onClick={handleAddExpense}>確認新增</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: '旅遊預算',
            value: formatCurrency(totalBudget, selectedTrip.currency),
            icon: DollarSign,
            color: 'text-slate-600',
            bg: 'bg-slate-100',
          },
          {
            label: '已花費',
            value: formatCurrency(totalSpent, selectedTrip.currency),
            icon: TrendingDown,
            color: 'text-red-600',
            bg: 'bg-red-50',
            extra: `${spentPercent.toFixed(0)}%`,
          },
          {
            label: '剩餘預算',
            value: formatCurrency(remaining, selectedTrip.currency),
            icon: TrendingUp,
            color: remaining >= 0 ? 'text-green-600' : 'text-red-600',
            bg: remaining >= 0 ? 'bg-green-50' : 'bg-red-50',
          },
        ].map(({ label, value, icon: Icon, color, bg, extra }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{label}</p>
                <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {extra && <p className="text-xs text-slate-400 mt-1">已使用 {extra} 預算</p>}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Budget Progress */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-slate-800">預算使用進度</p>
          <span className={`text-sm font-medium ${spentPercent > 90 ? 'text-red-600' : 'text-slate-500'}`}>
            {spentPercent.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${spentPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-green-500'
            }`}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>NT$0</span>
          <span>{formatCurrency(totalBudget, selectedTrip.currency)}</span>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">花費類別分析</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value), 'TWD'), '金額']}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400">尚無花費記錄</div>
          )}
        </Card>

        {/* Bar Chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">每日花費趨勢</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value), 'TWD'), '花費']}
                />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400">尚無花費記錄</div>
          )}
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">花費明細</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {expenses.map((expense, i) => {
            const config = CATEGORY_CONFIG[expense.category];
            const Icon = config.icon;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 group transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="ghost" className="text-xs">{config.label}</Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(expense.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                  {expense.currency !== 'TWD' && (
                    <p className="text-xs text-slate-400">
                      ≈ {formatCurrency(expense.amountInBase, 'TWD')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
          {expenses.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>尚無花費記錄</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
