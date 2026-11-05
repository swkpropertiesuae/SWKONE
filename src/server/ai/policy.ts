/** Only reviewed tool capabilities may execute. New tools fail closed until reviewed here (tests/ai-controls.ts checks every tool is listed). */
const READ = new Set([
  'business_snapshot','search_deals','get_deal','search_parties','overdue_invoices','party_statement','bills_due','pipeline_summary','rent_roll','expiring_leases','mandate_health','list_leads','stale_opportunities','list_tasks','open_tickets','expiring_documents','lookup_listings','find_caller',
  'calculate_deal_economics','check_rera_rent_cap','check_golden_visa','market_pulse_benchmark','pdc_cheque_radar','aml_kyc_radar','agent_performance_leaderboard','match_leads_to_inventory','offplan_launch_radar','attendance_roll_call',
])
const INTERNAL = new Set([
  'create_task','add_note','create_lead','add_deal_event','alert_team','capture_lead','request_viewing','report_maintenance_issue','request_callback','transfer_call',
  'schedule_followup_call','log_compliance_flag',
])
const EXTERNAL = new Set(['send_email','send_whatsapp'])
export function toolPolicy(name: string, risk: string, autonomy: number): 'deny' | 'approve' | 'execute' {
  if (READ.has(name) && risk === 'read') return 'execute'
  if (INTERNAL.has(name) && risk === 'internal') return autonomy === 0 ? 'approve' : 'execute'
  if (EXTERNAL.has(name) && risk === 'external') return 'approve'
  return 'deny'
}
