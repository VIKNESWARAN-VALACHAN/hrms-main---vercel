'use client'
import React from 'react';

interface LeaveType {
    leave_type_name: string;
    code: string;
    description?: string;
    max_days: number;
    requires_approval: 0 | 1;
    requires_documentation: 0 | 1;
    is_active: 0 | 1;
    company_id?: number | string;
    is_total:0 | 1;
    total_type: string;
    is_divident: 0 | 1;
    carry_forward_days: number;
    increment_days: number;
    max_increment_days: number;
  }

const defaultLeaveTypes: LeaveType[] = [
    {
      leave_type_name: "Annual Leave",
      code: "ANNUAL",
      description: "Regular annual leave for employee updated",
      max_days: 20,
      requires_approval: 1,
      requires_documentation: 0,
      is_active: 1,
      // company_id is added dynamically
      is_total: 1,
      total_type: "ONCE CONFIRMED",
      is_divident: 0,
      carry_forward_days: 6,
      increment_days: 3,
      max_increment_days: 30
    },
    {
      leave_type_name: "Sick Leave",
      code: "SICK",
      description: "Medical leave",
      max_days: 15,
      requires_approval: 1,
      requires_documentation: 0,
      is_active: 1,
      is_total: 1,
      total_type: "ONCE CONFIRMED",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 15
    },
    {
      leave_type_name: "Maternity Leave",
      code: "MATERNITY",
      description: "Leave for childbirth updated",
      max_days: 90,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 10,
      increment_days: 1,
      max_increment_days: 90
    },
    {
      leave_type_name: "Paternity Leave",
      code: "PATERNITY",
      description: "Leave for new fathers",
      max_days: 14,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 14
    },
    {
      leave_type_name: "Marriage Leave",
      code: "MARRIAGE",
      description: "Leave for marriage",
      max_days: 3,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 3
    },
    {
      leave_type_name: "Hospitalization Leave",
      code: "HOSPITALIZATION",
      description: "Leave for hospitalization",
      max_days: 30,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 30
    },
    {
      leave_type_name: "Emergency Leave",
      code: "EMERGENCY",
      description: "Leave for emergencies",
      max_days: 5,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 5
    },
    {
      leave_type_name: "Compassionate Leave",
      code: "COMPASSIONATE",
      description: "Leave for paid time off that employees can take due to a death or serious illness of a family member",
      max_days: 5,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "ONCE CONFIRMED",
      is_divident: 0,
      carry_forward_days: 1,
      increment_days: 1,
      max_increment_days: 5
    },
    {
      leave_type_name: "Compulsory Leave",
      code: "COMPULSORY",
      description: "Mandatory public holidays that employers must grant to employees",
      max_days: 3,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 0, // is_active is 0 in CSV
      is_total: 1,
      total_type: "IMMEDIATE",
      is_divident: 0,
      carry_forward_days: 0, // NULL in CSV, defaulting to 0
      increment_days: 1,
      max_increment_days: 3
    },
    {
      leave_type_name: "Unpaid Leave",
      code: "UNPAID",
      description: "Unpaid leave",
      max_days: 0,
      requires_approval: 1,
      requires_documentation: 1,
      is_active: 1,
      is_total: 1,
      total_type: "ONCE CONFIRMED",
      is_divident: 0,
      carry_forward_days: 0,  
      increment_days: 0,
      max_increment_days: 0
    }

  ];

  export default defaultLeaveTypes;


