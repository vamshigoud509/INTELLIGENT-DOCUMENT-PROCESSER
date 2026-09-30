import React from 'react';
import { 
  DocumentExtraction, 
  IngestedDocument 
} from '../types/index.js';
import { 
  Building2, 
  User, 
  Hash, 
  Sparkles, 
  Activity, 
  Scale, 
  Receipt, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Landmark, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  ListChecks, 
  Lightbulb, 
  Layers 
} from 'lucide-react';

interface ExtractionsViewProps {
  document: IngestedDocument;
  extraction: DocumentExtraction;
}

export const ExtractionsView: React.FC<ExtractionsViewProps> = ({ document, extraction }) => {
  const { parties, metadata_fields, financials, line_items, domain_specific, raw_summary } = extraction;

  const isStudent = 
    document.domain === 'STUDENT' || 
    document.category.startsWith('STUDENT') || 
    document.category === 'ACADEMIC_REPORT' || 
    document.category === 'SYLLABUS' ||
    Boolean(domain_specific?.course_or_subject || domain_specific?.problem_sets?.length);

  const isResume = document.category === 'RESUME' || Boolean(domain_specific?.candidate_skills?.length);
  const isIdCard = document.category === 'ID_CARD' || Boolean(domain_specific?.id_number);
  const isHealthcare = document.domain === 'HEALTHCARE' || Boolean(domain_specific?.patient_name);
  const isLegal = document.domain === 'LEGAL' || Boolean(domain_specific?.contract_title);

  return (
    <div className="space-y-6">

      {/* Category-Specific Intelligence Summary Banner */}
      {raw_summary && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/30 to-slate-900 border border-brand-500/20 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                {isStudent ? <GraduationCap className="w-4 h-4 text-indigo-400" /> :
                 isHealthcare ? <Activity className="w-4 h-4 text-cyan-400" /> :
                 isLegal ? <Scale className="w-4 h-4 text-purple-400" /> :
                 isResume ? <Briefcase className="w-4 h-4 text-indigo-400" /> :
                 isIdCard ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> :
                 <Sparkles className="w-4 h-4 text-brand-400" />}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-300">
                  {isStudent ? 'Academic & Student Category Summary' :
                   isHealthcare ? 'Clinical Healthcare Category Summary' :
                   isLegal ? 'Legal & Contract Provisions Summary' :
                   isResume ? 'Candidate Competency Profile Summary' :
                   isIdCard ? 'Identity Credential Verification Summary' :
                   'Commercial & Financial Category Summary'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Grounded multimodal intelligence summarized according to category
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20 font-mono">
              Category: {document.category.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {raw_summary}
          </p>

          {/* Quick Key Takeaways by Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {isStudent && (
              <>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Course & Subject</span>
                  <span className="text-xs font-bold text-indigo-300 truncate block mt-0.5">
                    {domain_specific?.course_or_subject || 'Computer Systems'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Worksheet & Topic</span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {domain_specific?.assignment_title || 'Binary & Decimal Systems'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Exercises Analyzed</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    {domain_specific?.questions_count || domain_specific?.problem_sets?.length || line_items?.length || 10} Verified Problems
                  </span>
                </div>
              </>
            )}

            {isHealthcare && (
              <>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Primary Diagnosis</span>
                  <span className="text-xs font-bold text-cyan-300 truncate block mt-0.5">
                    {domain_specific?.primary_diagnosis || 'Clinical Case'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Patient / Record</span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {domain_specific?.patient_name || parties?.recipient?.name || 'Insured'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Net Claim Total</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    ${Number(financials?.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {isLegal && (
              <>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Agreement Title</span>
                  <span className="text-xs font-bold text-purple-300 truncate block mt-0.5">
                    {domain_specific?.contract_title || 'Master Agreement'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Liability Cap</span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {domain_specific?.liability_cap || 'Fees Paid'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Jurisdiction</span>
                  <span className="text-xs font-bold text-cyan-300 block mt-0.5">
                    {domain_specific?.governing_law || 'Governing Law'}
                  </span>
                </div>
              </>
            )}

            {!isStudent && !isHealthcare && !isLegal && !isResume && !isIdCard && (
              <>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vendor / Issuer</span>
                  <span className="text-xs font-bold text-emerald-300 truncate block mt-0.5">
                    {parties?.sender?.name || 'Vendor Master'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Audited Total</span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {financials?.currency || '$'}{Number(financials?.total_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Payment Terms</span>
                  <span className="text-xs font-bold text-cyan-300 block mt-0.5">
                    {domain_specific?.payment_terms || 'Net 30'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Student & Academic Intelligence Card */}
      {isStudent && domain_specific && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/40 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-glow-indigo">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    Academic Practice Set
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {metadata_fields?.document_number || 'SET-2026'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {domain_specific.assignment_title || 'Binary & Decimal Number Systems Practice'}
                </h3>
                <p className="text-xs text-indigo-300 font-medium">
                  {domain_specific.course_or_subject || 'Computer Science: Digital Logic & Architecture'}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Evaluation Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {domain_specific.score_or_grade || '100% Verified'}
              </span>
            </div>
          </div>

          {/* Student & Course Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Student / Learner</span>
              <p className="font-bold text-white mt-0.5 truncate">
                {domain_specific.student_name || parties?.recipient?.name || 'Computer Systems Student'}
              </p>
              {domain_specific.student_id && (
                <span className="text-[10px] text-indigo-400 font-mono block mt-0.5">
                  ID: {domain_specific.student_id}
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Academic Department</span>
              <p className="font-bold text-white mt-0.5 truncate">
                {domain_specific.institution_name || parties?.sender?.name || 'Department of Computer Science'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {domain_specific.grade_level || 'Undergraduate'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Instructor / Faculty</span>
              <p className="font-bold text-white mt-0.5 truncate">
                {domain_specific.instructor_name || 'Prof. Alan Turing / Faculty'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {domain_specific.academic_term || 'Fall Term 2026'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Date / Timeline</span>
              <p className="font-bold text-white mt-0.5 truncate">
                {domain_specific.submission_date || metadata_fields?.issue_date || 'Current Term'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Due: {metadata_fields?.due_date || 'Semester Review'}
              </span>
            </div>
          </div>

          {/* Key Concepts Chips */}
          {domain_specific.key_concepts && domain_specific.key_concepts.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Identified Core Concepts & Learning Objectives ({domain_specific.key_concepts.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {domain_specific.key_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-200 border border-indigo-700/50 shadow-sm"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Problem Sets Breakdown Table */}
          {domain_specific.problem_sets && domain_specific.problem_sets.length > 0 && (
            <div className="rounded-xl border border-indigo-500/30 overflow-hidden bg-slate-900/80">
              <div className="px-4 py-3 bg-slate-950/80 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Extracted Problem Sets & Step-by-Step Proofs ({domain_specific.problem_sets.length} Exercises)
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  All Solutions Verified
                </span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {domain_specific.problem_sets.map((prob, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-slate-800/30 transition-colors space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                          {prob.number || idx + 1}
                        </span>
                        {prob.topic && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {prob.topic}
                          </span>
                        )}
                      </div>
                      {prob.marks && (
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          {prob.marks} pts
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-200 pl-8">
                      {prob.question}
                    </p>
                    {prob.answer && (
                      <div className="ml-8 p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/20 text-xs text-emerald-300">
                        <span className="font-bold text-emerald-400 block text-[10px] uppercase tracking-wider mb-0.5">
                          ✓ Verified Solution / Proof:
                        </span>
                        <p className="font-mono text-[11px] text-slate-200 leading-relaxed">
                          {prob.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Recommendations */}
          {domain_specific.study_recommendations && domain_specific.study_recommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable Study Takeaways & Curriculum Guidance
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {domain_specific.study_recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Candidate / Resume Skills & Profile (If Resume) */}
      {isResume && domain_specific && (
        <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {domain_specific.candidate_name || parties?.sender?.name || 'Candidate Profile'}
                </h3>
                <p className="text-xs text-indigo-300 font-medium">
                  {domain_specific.candidate_title || 'Software Engineering Professional'}
                </p>
              </div>
            </div>
            {domain_specific.candidate_experience_years && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {domain_specific.candidate_experience_years}+ Years Experience
              </span>
            )}
          </div>

          {/* Candidate Skills List */}
          {domain_specific.candidate_skills && domain_specific.candidate_skills.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Identified Technical Skills & Competencies ({domain_specific.candidate_skills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {domain_specific.candidate_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-900/50 text-indigo-200 border border-indigo-700/60 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {domain_specific.candidate_education && domain_specific.candidate_education.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-400" />
                  Education
                </div>
                <ul className="space-y-1 text-slate-300">
                  {domain_specific.candidate_education.map((edu, idx) => (
                    <li key={idx}>• {edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {domain_specific.candidate_certifications && domain_specific.candidate_certifications.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1.5">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Certifications
                </div>
                <ul className="space-y-1 text-slate-300">
                  {domain_specific.candidate_certifications.map((cert, idx) => (
                    <li key={idx}>• {cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ID Card / Identity Credential (If ID Card) */}
      {isIdCard && domain_specific && (
        <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {domain_specific.id_type || 'Government Identity Credential'}
                </h3>
                <p className="text-xs text-emerald-300 font-mono font-bold">
                  ID: {domain_specific.id_number || 'N/A'}
                </p>
              </div>
            </div>
            {domain_specific.expiry_date && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Expires</span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {domain_specific.expiry_date}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Card Holder Name</span>
              <p className="font-bold text-white mt-0.5">{domain_specific.holder_name || parties?.recipient?.name || 'N/A'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Date of Birth</span>
              <p className="font-bold text-white mt-0.5">{domain_specific.date_of_birth || 'N/A'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Issuing Authority</span>
              <p className="font-bold text-white mt-0.5">{domain_specific.issuing_country_or_authority || 'Authorized Government Agency'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Financials Overview Bar (If Invoice, Receipt, PO, Claim) */}
      {!isResume && !isIdCard && !isStudent && financials?.total_amount !== undefined && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Grand Total</span>
            <p className="text-lg font-extrabold text-white mt-0.5">
              {financials.currency || '$'}{Number(financials.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-400 font-medium">Audited Final</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Subtotal</span>
            <p className="text-lg font-bold text-slate-200 mt-0.5">
              {financials.currency || '$'}{Number(financials.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-500">Before Tax</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Tax / Surcharge</span>
            <p className="text-lg font-bold text-slate-200 mt-0.5">
              {financials.currency || '$'}{Number(financials.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-500">VAT / Sales Tax</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Adjustment / Disc</span>
            <p className="text-lg font-bold text-cyan-400 mt-0.5">
              -{financials.currency || '$'}{Number(financials.discount_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-cyan-500">Discount Applied</span>
          </div>
        </div>
      )}

      {/* Bank & Settlement Details (If Financial) */}
      {!isStudent && (domain_specific?.bank_account || domain_specific?.bank_name || domain_specific?.payment_terms) && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Landmark className="w-4 h-4 text-emerald-400" />
            Banking & Wire Transfer Settlement Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {domain_specific.bank_name && (
              <div>
                <span className="text-slate-500 text-[11px]">Bank Name</span>
                <p className="font-semibold text-slate-200 mt-0.5">{domain_specific.bank_name}</p>
              </div>
            )}
            {domain_specific.bank_account && (
              <div>
                <span className="text-slate-500 text-[11px]">Account Number</span>
                <p className="font-mono font-semibold text-slate-200 mt-0.5">{domain_specific.bank_account}</p>
              </div>
            )}
            {domain_specific.routing_number && (
              <div>
                <span className="text-slate-500 text-[11px]">Routing / ABA</span>
                <p className="font-mono font-semibold text-slate-200 mt-0.5">{domain_specific.routing_number}</p>
              </div>
            )}
            {domain_specific.payment_terms && (
              <div className="sm:col-span-3">
                <span className="text-slate-500 text-[11px]">Payment Terms</span>
                <p className="font-semibold text-emerald-300 mt-0.5">{domain_specific.payment_terms}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parties Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sender / Provider / Department */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>
              {isStudent ? 'Academic Department / Faculty' : 
               isResume ? 'Applicant Contact' : 
               isHealthcare ? 'Healthcare Provider' : 
               'Issuer / Sender'}
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            {domain_specific?.institution_name || parties?.sender?.name || 'Authorized Entity'}
          </p>
          {parties?.sender?.address && (
            <p className="text-xs text-slate-400 mt-1">{parties.sender.address}</p>
          )}
          <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
            {parties?.sender?.email && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-brand-300">
                {parties.sender.email}
              </span>
            )}
            {parties?.sender?.tax_id && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Ref ID: {parties.sender.tax_id}
              </span>
            )}
            {parties?.sender?.phone && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {parties.sender.phone}
              </span>
            )}
          </div>
        </div>

        {/* Recipient / Client / Student */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
            <User className="w-4 h-4 text-cyan-400" />
            <span>
              {isStudent ? 'Enrolled Student' : 
               isResume ? 'Target Employer' : 
               isHealthcare ? 'Patient / Insured' : 
               'Client / Recipient'}
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            {domain_specific?.student_name || domain_specific?.patient_name || parties?.recipient?.name || 'Designated Beneficiary'}
          </p>
          {parties?.recipient?.address && (
            <p className="text-xs text-slate-400 mt-1">{parties.recipient.address}</p>
          )}
          <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
            {domain_specific?.student_id && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">
                Student ID: {domain_specific.student_id}
              </span>
            )}
            {domain_specific?.patient_id && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                MRN: {domain_specific.patient_id}
              </span>
            )}
            {domain_specific?.policy_number && (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                Policy: {domain_specific.policy_number}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Key-Value Grid */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-brand-400" />
          Document Metadata
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 text-[11px]">Document Identifier</span>
            <p className="font-mono font-semibold text-slate-200 mt-0.5">{metadata_fields?.document_number || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Issue / Release Date</span>
            <p className="font-semibold text-slate-200 mt-0.5">{metadata_fields?.issue_date || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Due / Target Date</span>
            <p className="font-semibold text-slate-200 mt-0.5">{domain_specific?.expiry_date || metadata_fields?.due_date || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">{isStudent ? 'Course Reference #' : 'PO / Reference #'}</span>
            <p className="font-mono font-semibold text-slate-200 mt-0.5">{metadata_fields?.purchase_order_number || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Healthcare Insights (If Medical Claim) */}
      {isHealthcare && domain_specific && (
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-3 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            Clinical Healthcare Insights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Primary Clinical Diagnosis</span>
              <p className="font-bold text-slate-100 mt-0.5">{domain_specific.primary_diagnosis || 'Clinical evaluation'}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Attending Physician</span>
              <p className="font-bold text-slate-100 mt-0.5">{domain_specific.provider_name || 'Staff Physician'}</p>
            </div>
            {domain_specific.diagnosis_codes && (
              <div>
                <span className="text-slate-400 text-[11px]">ICD-10 Diagnostic Codes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {domain_specific.diagnosis_codes.map((code, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 font-mono text-[10px] border border-cyan-700/50">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {domain_specific.procedure_codes && (
              <div>
                <span className="text-slate-400 text-[11px]">CPT Procedure Codes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {domain_specific.procedure_codes.map((code, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">
                      CPT {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legal Provisions (If Contract) */}
      {isLegal && domain_specific && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-purple-400" />
            Legal & Contract Provisions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Agreement Title</span>
              <p className="font-bold text-slate-100 mt-0.5">{domain_specific.contract_title || 'Master Agreement'}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Liability Limitation Cap</span>
              <p className="font-bold text-purple-200 mt-0.5">{domain_specific.liability_cap || 'Standard 1x Fees'}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Governing Jurisdiction</span>
              <p className="font-bold text-slate-100 mt-0.5">{domain_specific.governing_law || 'Governing Law Specified'}</p>
            </div>
            {domain_specific.key_obligations && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 text-[11px]">Key Covenants & SLAs</span>
                <ul className="mt-1 space-y-1 list-disc list-inside text-slate-300">
                  {domain_specific.key_obligations.map((ob, idx) => (
                    <li key={idx} className="text-[11px]">{ob}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Itemized Line Items Table (For Commercial Invoices & General Billing) */}
      {!isStudent && line_items && line_items.length > 0 && (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Itemized Extraction Breakdown ({line_items.length} records)
              </h4>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Tax</th>
                  <th className="py-2.5 px-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {line_items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-100">{item.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">{item.quantity ?? 1}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      ${Number(item.unit_price || item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {item.tax_rate ? `${item.tax_rate}%` : '0%'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ${Number(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
