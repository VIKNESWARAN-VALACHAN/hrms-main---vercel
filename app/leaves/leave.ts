// app/types/leave.ts
export interface YearOfServiceBracket {
  min_years: number;
  max_years?: number | null;
  days: number;
  renewal_period?: string;
  carryover_max_days?: number;
  expire_unused_at_period_end?: boolean;
}

export interface LeaveEntitlementGroup {
  id: number;
  group_name: string;
  description: string;
  is_active: boolean;
  employee_count?: number;
  leave_types?: LeaveGroupEntitlement[];
  created_at?: string;
  updated_at?: string;
}

export interface LeaveGroupEntitlement {
  id: number;
  group_id: number;
  leave_type_id: number;
  leave_type_name: string;
  yos_brackets: YearOfServiceBracket[];
}

export interface LeaveType {
  id: number;
  leave_type_name: string;
  code: string;
  description: string;
  max_days: number;
  requires_approval: boolean;
  requires_documentation: boolean;
  is_active: boolean;
  company_id?: string;
  allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
  eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF' | 'UPON_JOIN';
  accrual_frequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  accrual_rate?: number;
  earn_prorate_join_month?: boolean;
  renewal_period?: 'NONE' | 'YEARLY' | 'QUARTERLY' | 'MONTHLY';
  expire_unused_at_period_end?: boolean;
  carryover_max_days?: number;
  is_unlimited?: boolean;
  yos_brackets?: YearOfServiceBracket[];
  created_at?: string;
  updated_at?: string;
}
