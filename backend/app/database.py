from datetime import datetime
from typing import Optional
from app.models import Opportunity, OpportunityCreate, OpportunityUpdate, OpportunityStage, OpportunityStats


class InMemoryDatabase:
    def __init__(self):
        self._opportunities: dict[int, dict] = {}
        self._next_id = 1
        self._seed_data()

    def _seed_data(self):
        seed_opportunities = [
            {
                "name": "Enterprise Software Deal",
                "company": "Acme Corporation",
                "value": 150000.0,
                "stage": OpportunityStage.PROPOSAL,
                "contact_person": "John Smith",
                "email": "john.smith@acme.com",
                "phone": "+1-555-0101",
                "notes": "Large enterprise deal, decision expected Q1"
            },
            {
                "name": "Cloud Migration Project",
                "company": "TechStart Inc",
                "value": 75000.0,
                "stage": OpportunityStage.QUALIFIED,
                "contact_person": "Sarah Johnson",
                "email": "sarah@techstart.io",
                "phone": "+1-555-0102",
                "notes": "Mid-size company looking to migrate to cloud"
            },
            {
                "name": "CRM Implementation",
                "company": "Global Retail Co",
                "value": 200000.0,
                "stage": OpportunityStage.NEGOTIATION,
                "contact_person": "Mike Chen",
                "email": "m.chen@globalretail.com",
                "phone": "+1-555-0103",
                "notes": "Final negotiations, contract review in progress"
            },
            {
                "name": "Security Audit Services",
                "company": "FinanceFirst Bank",
                "value": 50000.0,
                "stage": OpportunityStage.LEAD,
                "contact_person": "Emily Davis",
                "email": "emily.davis@financefirst.com",
                "phone": "+1-555-0104",
                "notes": "Initial contact, needs follow-up"
            },
            {
                "name": "Data Analytics Platform",
                "company": "HealthCare Plus",
                "value": 120000.0,
                "stage": OpportunityStage.CLOSED_WON,
                "contact_person": "Dr. Robert Wilson",
                "email": "rwilson@healthcareplus.org",
                "phone": "+1-555-0105",
                "notes": "Deal closed successfully, implementation starting"
            },
        ]
        
        for opp_data in seed_opportunities:
            self.create(OpportunityCreate(**opp_data))

    def create(self, opportunity: OpportunityCreate) -> Opportunity:
        now = datetime.utcnow()
        opp_dict = {
            "id": self._next_id,
            "name": opportunity.name,
            "company": opportunity.company,
            "value": opportunity.value,
            "stage": opportunity.stage,
            "contact_person": opportunity.contact_person,
            "email": opportunity.email,
            "phone": opportunity.phone,
            "notes": opportunity.notes,
            "created_at": now,
            "updated_at": now,
        }
        self._opportunities[self._next_id] = opp_dict
        self._next_id += 1
        return Opportunity(**opp_dict)

    def get(self, opportunity_id: int) -> Optional[Opportunity]:
        opp_dict = self._opportunities.get(opportunity_id)
        if opp_dict:
            return Opportunity(**opp_dict)
        return None

    def get_all(self, stage: Optional[OpportunityStage] = None, search: Optional[str] = None) -> list[Opportunity]:
        results = []
        for opp_dict in self._opportunities.values():
            if stage and opp_dict["stage"] != stage:
                continue
            if search:
                search_lower = search.lower()
                if not (
                    search_lower in opp_dict["name"].lower() or
                    search_lower in opp_dict["company"].lower() or
                    (opp_dict["contact_person"] and search_lower in opp_dict["contact_person"].lower())
                ):
                    continue
            results.append(Opportunity(**opp_dict))
        return sorted(results, key=lambda x: x.updated_at, reverse=True)

    def update(self, opportunity_id: int, opportunity: OpportunityUpdate) -> Optional[Opportunity]:
        if opportunity_id not in self._opportunities:
            return None
        
        opp_dict = self._opportunities[opportunity_id]
        update_data = opportunity.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            if value is not None:
                opp_dict[key] = value
        
        opp_dict["updated_at"] = datetime.utcnow()
        self._opportunities[opportunity_id] = opp_dict
        return Opportunity(**opp_dict)

    def delete(self, opportunity_id: int) -> bool:
        if opportunity_id in self._opportunities:
            del self._opportunities[opportunity_id]
            return True
        return False

    def get_stats(self) -> OpportunityStats:
        total_count = len(self._opportunities)
        total_value = sum(opp["value"] for opp in self._opportunities.values())
        
        by_stage: dict[str, int] = {}
        by_stage_value: dict[str, float] = {}
        
        for stage in OpportunityStage:
            by_stage[stage.value] = 0
            by_stage_value[stage.value] = 0.0
        
        for opp in self._opportunities.values():
            stage_value = opp["stage"].value
            by_stage[stage_value] += 1
            by_stage_value[stage_value] += opp["value"]
        
        return OpportunityStats(
            total_count=total_count,
            total_value=total_value,
            by_stage=by_stage,
            by_stage_value=by_stage_value,
        )


db = InMemoryDatabase()
