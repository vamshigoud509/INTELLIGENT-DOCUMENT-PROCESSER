import { z } from 'zod';

export const CIVIC_CATEGORIES = [
  'ROAD_DAMAGE',
  'SOLID_WASTE',
  'STREETLIGHT_ELECTRICAL',
  'DRAINAGE_WATER',
  'PUBLIC_INFRASTRUCTURE',
  'TRAFFIC_SIGNAGE',
  'HAZARD_OBSTRUCTION',
  'UNKNOWN_NON_CIVIC',
] as const;

export const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const COMPLAINT_STATUSES = [
  'PENDING_ANALYSIS',
  'TRIAGED',
  'DISPATCHED',
  'IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
] as const;

export const DEPARTMENTS = [
  'Road Maintenance Department',
  'Solid Waste Management (SWM)',
  'Electrical & Lighting Division',
  'Water Supply & Sewerage Board',
  'Public Works Department (PWD)',
  'Disaster & Emergency Response',
] as const;

export const complaintSubmissionSchema = z.object({
  citizenName: z.string().trim().max(100).optional().default('Anonymous Citizen'),
  citizenPhone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, 'Invalid contact number format').optional().or(z.literal('')),
  citizenEmail: z.string().email('Invalid email address format').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  landmark: z.string().max(255).optional(),
  address: z.string().min(3, 'Location address is required').max(255),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES),
  assignedDepartment: z.string().optional(),
  officerNotes: z.string().max(2000).optional(),
});

export const simulateResolutionSchema = z.object({
  resolutionNotes: z.string().min(5, 'Resolution notes must be at least 5 characters').max(1000),
  resolutionImageUrl: z.string().url().optional(),
});

export type ComplaintSubmissionInput = z.infer<typeof complaintSubmissionSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
export type SimulateResolutionInput = z.infer<typeof simulateResolutionSchema>;
