import { Building2, User, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import type { Opportunity, OpportunityStage } from '../types';
import { STAGE_LABELS, STAGE_COLORS } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: () => void;
  onDelete: () => void;
  onStageChange: (stage: OpportunityStage) => void;
  formatCurrency: (value: number) => string;
}

function OpportunityCard({ opportunity, onEdit, onDelete, onStageChange, formatCurrency }: OpportunityCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{opportunity.name}</h3>
          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
            <Building2 className="w-4 h-4" />
            <span>{opportunity.company}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-2xl font-bold text-indigo-600">
          {formatCurrency(opportunity.value)}
        </span>
      </div>

      <div className="mb-3">
        <select
          value={opportunity.stage}
          onChange={(e) => onStageChange(e.target.value as OpportunityStage)}
          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${STAGE_COLORS[opportunity.stage]}`}
        >
          {Object.entries(STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {(opportunity.contact_person || opportunity.email || opportunity.phone) && (
        <div className="border-t pt-3 space-y-1">
          {opportunity.contact_person && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{opportunity.contact_person}</span>
            </div>
          )}
          {opportunity.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${opportunity.email}`} className="hover:text-indigo-600">
                {opportunity.email}
              </a>
            </div>
          )}
          {opportunity.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <a href={`tel:${opportunity.phone}`} className="hover:text-indigo-600">
                {opportunity.phone}
              </a>
            </div>
          )}
        </div>
      )}

      {opportunity.notes && (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm text-gray-600 line-clamp-2">{opportunity.notes}</p>
        </div>
      )}
    </div>
  );
}

export default OpportunityCard;
