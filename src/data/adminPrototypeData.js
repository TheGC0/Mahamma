import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Tags,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'

export const DEMO_ACCOUNTS = [
  { email: 'client@kfupm.edu.sa', password: 'client123' },
  { email: 'provider@kfupm.edu.sa', password: 'provider123' },
  { email: 's202012345@kfupm.edu.sa', password: 'admin123' },
]

export const SUMMARY_METRICS = [
  { label: 'Total Users', value: '523', tone: 'blue', icon: Users },
  { label: 'Pending', value: '12', tone: 'amber', icon: Clock3 },
  { label: 'Active Jobs', value: '45', tone: 'green', icon: TrendingUp },
  { label: 'Completion', value: '94%', tone: 'emerald', icon: CheckCircle2 },
  { label: 'Disputes', value: '2%', tone: 'red', icon: AlertTriangle },
]

export const TAB_ITEMS = [
  { id: 'verification', label: 'User Verification', count: 12, icon: UserCheck },
  { id: 'reports', label: 'Reports & Disputes', count: 3, icon: ShieldCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'categories', label: 'Categories', icon: Tags },
]

export const INITIAL_VERIFICATIONS = [
  {
    id: 'verification-1',
    name: 'Mohammed Al-Salem',
    role: 'Provider',
    status: 'pending',
    email: 's202112345@kfupm.edu.sa',
    phone: '+966 50 123 4567',
    studentId: 'S202112345',
    date: '2026-02-20',
  },
  {
    id: 'verification-2',
    name: 'Fatima Al-Harbi',
    role: 'Client',
    status: 'pending',
    email: 's202112346@kfupm.edu.sa',
    phone: '+966 55 234 5678',
    studentId: 'S202112346',
    date: '2026-02-20',
  },
  {
    id: 'verification-3',
    name: 'Omar Al-Qahtani',
    role: 'Provider',
    status: 'pending',
    email: 's202112347@kfupm.edu.sa',
    phone: '+966 56 345 6789',
    studentId: 'S202112347',
    date: '2026-02-19',
  },
]

export const INITIAL_ISSUES = [
  {
    id: 'issue-1',
    tag: 'Dispute',
    priority: 'high priority',
    status: 'pending',
    title: 'Website Development',
    reporter: { name: 'Ali Al-Mutairi', role: 'Client' },
    respondent: { name: 'Khaled Al-Dosari', role: 'Provider' },
    description:
      'The freelancer did not deliver the agreed features. Missing responsive design and contact form functionality.',
    evidence: [{ name: 'screenshots.zip' }, { name: 'original-agreement.pdf' }],
    jobId: 'J123',
    reported: '2026-02-19',
  },
  {
    id: 'issue-2',
    tag: 'Quality Issue',
    priority: 'reviewing',
    status: 'reviewing',
    title: 'Logo Design',
    reporter: { name: 'Sara Mohammed', role: 'Client' },
    respondent: { name: 'Nasser Al-Zahrani', role: 'Provider' },
    description:
      'The delivered logo does not match the brief and the final files were incomplete.',
    evidence: [{ name: 'brief.pdf' }, { name: 'drafts.zip' }],
    jobId: 'J220',
    reported: '2026-02-18',
  },
  {
    id: 'issue-3',
    tag: 'Payment Issue',
    priority: 'pending',
    status: 'pending',
    title: 'Video Editing',
    reporter: { name: 'Nasser Al-Zahrani', role: 'Client' },
    respondent: { name: 'Layla Ibrahim', role: 'Provider' },
    description: 'Payment was released before the final export was delivered.',
    evidence: [{ name: 'invoice.pdf' }],
    jobId: 'J311',
    reported: '2026-02-17',
  },
  {
    id: 'issue-4',
    tag: 'Misconduct',
    priority: 'resolved',
    status: 'resolved',
    title: 'Content Writing',
    reporter: { name: 'Layla Ibrahim', role: 'Client' },
    respondent: { name: 'Huda Al-Asmari', role: 'Provider' },
    description:
      'The issue was resolved after a revised draft and refund were approved.',
    evidence: [{ name: 'chat-log.txt' }],
    jobId: 'J412',
    reported: '2026-02-15',
    resolutionNote: 'Refund issued and final content delivered.',
  },
]

export const INITIAL_CATEGORIES = [
  { id: 'design', name: 'Design', jobs: 45 },
  { id: 'programming', name: 'Programming', jobs: 123 },
  { id: 'video-editing', name: 'Video Editing', jobs: 67 },
  { id: 'device-fixing', name: 'Device Fixing', jobs: 65 },
  { id: 'translation', name: 'Translation', jobs: 54 },
  { id: 'other', name: 'Other', jobs: 49 },
]

export const NAV_LINKS = ['Browse Services', 'Find Tasks', 'Post a Task']

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 54 },
  { day: 'Wed', value: 62 },
  { day: 'Thu', value: 44 },
  { day: 'Fri', value: 73 },
  { day: 'Sat', value: 61 },
  { day: 'Sun', value: 80 },
]

export const RESOLUTION_BREAKDOWN = [
  { label: 'Resolved', value: 64, tone: 'green' },
  { label: 'In Review', value: 22, tone: 'blue' },
  { label: 'Escalated', value: 14, tone: 'orange' },
]

export function cloneVerifications() {
  return INITIAL_VERIFICATIONS.map((item) => ({ ...item }))
}

export function cloneIssues() {
  return INITIAL_ISSUES.map((item) => ({
    ...item,
    reporter: { ...item.reporter },
    respondent: { ...item.respondent },
    evidence: item.evidence.map((file) => ({ ...file })),
  }))
}

export function cloneCategories() {
  return INITIAL_CATEGORIES.map((item) => ({ ...item }))
}

export function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function pillClass(label) {
  const value = label.toLowerCase()

  if (value.includes('high')) return 'pill--high'
  if (value.includes('review')) return 'pill--reviewing'
  if (value.includes('resolved')) return 'pill--resolved'
  if (value.includes('pending')) return 'pill--pending'
  if (value.includes('client')) return 'pill--client'
  if (value.includes('provider')) return 'pill--provider'

  return 'pill--soft'
}
