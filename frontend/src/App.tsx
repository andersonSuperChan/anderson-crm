import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import type { Opportunity, OpportunityStats, OpportunityStage, OpportunityCreate } from './types';
import { STAGE_LABELS, STAGE_COLORS } from './types';
import { getOpportunities, getOpportunityStats, createOpportunity, updateOpportunity, deleteOpportunity } from './api';
import OpportunityCard from './components/OpportunityCard';
import OpportunityForm from './components/OpportunityForm';
import StatsCard from './components/StatsCard';

function App() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<OpportunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<OpportunityStage | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [opps, statsData] = await Promise.all([
        getOpportunities(stageFilter || undefined, searchQuery || undefined),
        getOpportunityStats(),
      ]);
      setOpportunities(opps);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [stageFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (data: OpportunityCreate) => {
    try {
      await createOpportunity(data);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
    }
  };

  const handleUpdate = async (id: number, data: Partial<OpportunityCreate>) => {
    try {
      await updateOpportunity(id, data);
      setEditingOpportunity(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await deleteOpportunity(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
    }
  };

  const handleStageChange = async (id: number, stage: OpportunityStage) => {
    try {
      await updateOpportunity(id, { stage });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stage');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Business Opportunities</h1>
          <p className="text-white/80">Manage and track your sales pipeline</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Opportunities"
              value={stats.total_count.toString()}
              icon={<Users className="w-6 h-6" />}
              color="bg-blue-500"
            />
            <StatsCard
              title="Total Pipeline Value"
              value={formatCurrency(stats.total_value)}
              icon={<DollarSign className="w-6 h-6" />}
              color="bg-green-500"
            />
            <StatsCard
              title="Won Deals"
              value={stats.by_stage.closed_won.toString()}
              icon={<Target className="w-6 h-6" />}
              color="bg-emerald-500"
            />
            <StatsCard
              title="Won Value"
              value={formatCurrency(stats.by_stage_value.closed_won)}
              icon={<TrendingUp className="w-6 h-6" />}
              color="bg-purple-500"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as OpportunityStage | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Stages</option>
              {Object.entries(STAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Opportunity
            </button>
          </div>

          {stats && (
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(STAGE_LABELS).map(([stage, label]) => (
                <span
                  key={stage}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${STAGE_COLORS[stage as OpportunityStage]}`}
                >
                  {label}: {stats.by_stage[stage as OpportunityStage]}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No opportunities found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                Create your first opportunity
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onEdit={() => setEditingOpportunity(opp)}
                  onDelete={() => handleDelete(opp.id)}
                  onStageChange={(stage) => handleStageChange(opp.id, stage)}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>

        {(showForm || editingOpportunity) && (
          <OpportunityForm
            opportunity={editingOpportunity}
            onSubmit={editingOpportunity 
              ? (data) => handleUpdate(editingOpportunity.id, data)
              : handleCreate
            }
            onClose={() => {
              setShowForm(false);
              setEditingOpportunity(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
