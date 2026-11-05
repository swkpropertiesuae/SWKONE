import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Area, AreaChart, Bar as RBar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  Award, Banknote, Building2, Calculator, Check, Copy, DollarSign, FileSignature, Home, KeyRound, Percent, Printer, Scale, ShieldCheck, TrendingUp,
} from 'lucide-react'
import {
  AnimatedNumber, Bar, CHART, Card, Field, ModuleHeader, Pill, ProgressRing, Reveal, SWK, Segmented, aed, num, pct,
} from '../../swk/ui'
import {
  COMMUNITIES, RERA_BANDS, RENT_INDEX, UAE, commissionWaterfall, costToClose, leaseCosts, mortgagePlan, paymentPlan, reraIncrease, visaEligibility, yieldCalc,
  sellerNetProceeds, rentVsBuyCompare, offPlanFlipCalc, holidayHomeVsLongTerm, serviceChargeCoolingCalc, commercialVatTaxCalc, dcfFiveYearProjector, mortgageRefinanceCalc,
  type Residency,
} from '../../swk/uae'
import { OneUtilityStudio } from '../../components/OneUtilityStudio'

type ToolKey =
  | 'cost' | 'mortgage' | 'rera' | 'yield' | 'visa' | 'commission' | 'movein' | 'offplan'
  | 'seller' | 'rentvsbuy' | 'flip' | 'holiday' | 'servicecharge' | 'commercial' | 'caprate' | 'earlysettlement'
  | 'studio'

const TOOLS: { value: ToolKey; label: string }[] = [
  { value: 'cost', label: 'Buyer Cost-to-Close' },
  { value: 'seller', label: 'Seller Net Proceeds' },
  { value: 'mortgage', label: 'CBUAE Mortgage' },
  { value: 'earlysettlement', label: 'Mortgage Refinance' },
  { value: 'rera', label: 'RERA Rent Index' },
  { value: 'yield', label: 'Yield & ROI' },
  { value: 'caprate', label: '5-Yr DCF & IRR' },
  { value: 'rentvsbuy', label: 'Rent vs. Buy (10Y)' },
  { value: 'flip', label: 'Off-Plan Flip ROE' },
  { value: 'holiday', label: 'Holiday Home vs Ejari' },
  { value: 'servicecharge', label: 'Mollak & Chiller' },
  { value: 'commercial', label: 'Commercial & VAT' },
  { value: 'visa', label: 'Golden Visa' },
  { value: 'commission', label: 'Commission Split' },
  { value: 'movein', label: 'Tenant Move-In' },
  { value: 'offplan', label: 'Off-Plan Schedule' },
  { value: 'studio', label: 'AI & Utility Studio Pro' },
]

export default function ToolkitPage() {
  const [sp, setSp] = useSearchParams()
  const active = (TOOLS.some(t => t.value === sp.get('tool')) ? sp.get('tool') : 'cost') as ToolKey
  const setActive = (t: ToolKey) => setSp({ tool: t }, { replace: true })
  const [copied, setCopied] = useState(false)

  // 1) Cost to close state
  const [cPrice, setCPrice] = useState(3_200_000)
  const [cUseLoan, setCUseLoan] = useState(true)
  const [cDownPct, setCDownPct] = useState(20)
  const [cBrokerPct, setCBrokerPct] = useState(2)
  const [cNoc, setCNoc] = useState(1500)

  // 2) Mortgage state
  const [mPrice, setMPrice] = useState(3_500_000)
  const [mResidency, setMResidency] = useState<Residency>('expat')
  const [mFirstHome, setMFirstHome] = useState(true)
  const [mOffPlan, setMOffPlan] = useState(false)
  const [mRate, setMRate] = useState(4.49)
  const [mYears, setMYears] = useState(25)
  const [mIncome, setMIncome] = useState(55_000)
  const [mDebts, setMDebts] = useState(3_500)
  const [mDownPct, setMDownPct] = useState(20)

  // 3) RERA rent increase state
  const [rComm, setRComm] = useState(COMMUNITIES[2]!.name)
  const [rBeds, setRBeds] = useState<'Studio' | '1 BR' | '2 BR' | '3 BR'>('2 BR')
  const [rCurrent, setRCurrent] = useState(125_000)
  const [rIndexOverride, setRIndexOverride] = useState<number | null>(null)

  // 4) Yield state
  const [yComm, setYComm] = useState(COMMUNITIES[2]!.name)
  const [yPrice, setYPrice] = useState(2_400_000)
  const [yRent, setYRent] = useState(165_000)
  const [yArea, setYArea] = useState(1280)
  const [ySc, setYSc] = useState(18)
  const [yVacancy, setYVacancy] = useState(2)
  const [yMaint, setYMaint] = useState(3)
  const [yMgmt, setYMgmt] = useState(5)

  // 5) Golden visa state
  const [vValue, setVValue] = useState(2_350_000)
  const [vOwners, setVOwners] = useState(1)
  const [vMortgaged, setVMortgaged] = useState(true)
  const [vOffPlan, setVOffPlan] = useState(false)

  // 6) Commission waterfall state
  const [wPrice, setWPrice] = useState(4_500_000)
  const [wPct, setWPct] = useState(2)
  const [wCoBroker, setWCoBroker] = useState(50)
  const [wReferral, setWReferral] = useState(5)
  const [wAgentSplit, setWAgentSplit] = useState(55)
  const [wLeader, setWLeader] = useState(5)

  // 7) Tenant move-in state
  const [tRent, setTRent] = useState(140_000)
  const [tFurnished, setTFurnished] = useState(false)
  const [tVilla, setTVilla] = useState(false)
  const [tCheques, setTCheques] = useState<'1' | '2' | '4' | '6' | '12'>('4')

  // 8) Off-plan payment plan state
  const [oPrice, setOPrice] = useState(2_800_000)
  const [oBooking, setOBooking] = useState(20)
  const [oConst, setOConst] = useState(40)
  const [oHandover, setOHandover] = useState(20)
  const [oPost, setOPost] = useState(20)
  const [oConstInst, setOConstInst] = useState(6)
  const [oPostInst, setOPostInst] = useState(4)
  const [oMonthsToHandover, setOMonthsToHandover] = useState(24)

  // 9) Seller Net Proceeds state
  const [sSalePrice, setSSalePrice] = useState(4_200_000)
  const [sOrigPrice, setSOrigPrice] = useState(3_100_000)
  const [sMortgagePayoff, setSMortgagePayoff] = useState(1_450_000)
  const [sBrokerPct, setSBrokerPct] = useState(2)
  const [sNocFee, setSNocFee] = useState(2500)

  // 10) Rent vs Buy state
  const [rvbPrice, setRvbPrice] = useState(2_600_000)
  const [rvbRent, setRvbRent] = useState(165_000)
  const [rvbDownPct, setRvbDownPct] = useState(20)
  const [rvbRate, setRvbRate] = useState(4.39)
  const [rvbYears, setRvbYears] = useState(10)
  const [rvbApprec, setRvbApprec] = useState(5)
  const [rvbRentEsc, setRvbRentEsc] = useState(4)
  const [rvbScAnnual, setRvbScAnnual] = useState(22_000)

  // 11) Off-plan Flip ROE state
  const [fLaunchPrice, setFLaunchPrice] = useState(2_500_000)
  const [fResalePrice, setFResalePrice] = useState(3_150_000)
  const [fPaidPct, setFPaidPct] = useState(40)
  const [fMinNocPct, setFMinNocPct] = useState(40)
  const [fNocFee, setFNocFee] = useState(5000)
  const [fBrokerPct, setFBrokerPct] = useState(2)

  // 12) Holiday Home vs Long-Term Ejari state
  const [hhPrice, setHhPrice] = useState(2_200_000)
  const [hhArea, setHhArea] = useState(1150)
  const [hhBeds, setHhBeds] = useState(2)
  const [hhLongRent, setHhLongRent] = useState(150_000)
  const [hhAdr, setHhAdr] = useState(850)
  const [hhOcc, setHhOcc] = useState(76)
  const [hhMgmtPct, setHhMgmtPct] = useState(18)
  const [hhUtilities, setHhUtilities] = useState(18_000)
  const [hhFurnish, setHhFurnish] = useState(85_000)
  const [hhScPsf, setHhScPsf] = useState(18)

  // 13) Mollak & District Cooling state
  const [scArea, setScArea] = useState(1480)
  const [scGenPsf, setScGenPsf] = useState(15.5)
  const [scSinkPsf, setScSinkPsf] = useState(2.5)
  const [scCoolingTr, setScCoolingTr] = useState(3.5)
  const [scCoolingMonthly, setScCoolingMonthly] = useState(420)
  const [scChillerFree, setScChillerFree] = useState(false)

  // 14) Commercial & FTA VAT state
  const [cmPrice, setCmPrice] = useState(5_500_000)
  const [cmRent, setCmRent] = useState(480_000)
  const [cmArea, setCmArea] = useState(2400)
  const [cmScPsf, setCmScPsf] = useState(21)
  const [cmAgencyPct, setCmAgencyPct] = useState(2)

  // 15) 5-Yr DCF & IRR state
  const [dcfPrice, setDcfPrice] = useState(3_400_000)
  const [dcfRent, setDcfRent] = useState(240_000)
  const [dcfRentGrowth, setDcfRentGrowth] = useState(5)
  const [dcfApprec, setDcfApprec] = useState(6)
  const [dcfExpRatio, setDcfExpRatio] = useState(18)
  const [dcfDiscount, setDcfDiscount] = useState(8)

  // 16) Mortgage Refinance state
  const [refBalance, setRefBalance] = useState(2_100_000)
  const [refCurRate, setRefCurRate] = useState(5.49)
  const [refNewRate, setRefNewRate] = useState(4.19)
  const [refYears, setRefYears] = useState(18)

  // Calculations
  const cLoan = cUseLoan ? Math.max(0, cPrice * (1 - cDownPct / 100)) : 0
  const costRes = useMemo(() => costToClose({ price: cPrice, loan: cLoan, brokerPct: cBrokerPct / 100, nocFee: cNoc, includeBroker: true }), [cPrice, cLoan, cBrokerPct, cNoc])
  const mortRes = useMemo(() => mortgagePlan({ price: mPrice, residency: mResidency, firstHome: mFirstHome, offPlan: mOffPlan, ratePct: mRate, years: mYears, income: mIncome, debts: mDebts, downPct: mDownPct }), [mPrice, mResidency, mFirstHome, mOffPlan, mRate, mYears, mIncome, mDebts, mDownPct])
  const indexAvg = rIndexOverride ?? (RENT_INDEX[rComm]?.[rBeds] ?? 150_000)
  const reraRes = useMemo(() => reraIncrease(rCurrent, indexAvg), [rCurrent, indexAvg])
  const yieldRes = useMemo(() => yieldCalc({ price: yPrice, annualRent: yRent, areaSqft: yArea, serviceChargePerSqft: ySc, vacancyWeeks: yVacancy, maintenancePct: yMaint, mgmtFeePct: yMgmt }), [yPrice, yRent, yArea, ySc, yVacancy, yMaint, yMgmt])
  const visaRes = useMemo(() => visaEligibility({ value: vValue, jointOwners: vOwners, mortgaged: vMortgaged, offPlan: vOffPlan }), [vValue, vOwners, vMortgaged, vOffPlan])
  const commRes = useMemo(() => commissionWaterfall({ price: wPrice, pct: wPct, coBrokerShare: wCoBroker, referralPct: wReferral, agentSplit: wAgentSplit, leaderOverride: wLeader }), [wPrice, wPct, wCoBroker, wReferral, wAgentSplit, wLeader])
  const moveRes = useMemo(() => leaseCosts({ annualRent: tRent, furnished: tFurnished, villa: tVilla, cheques: Number(tCheques) }), [tRent, tFurnished, tVilla, tCheques])
  const offRes = useMemo(() => {
    const start = new Date()
    const ho = new Date()
    ho.setMonth(ho.getMonth() + oMonthsToHandover)
    return paymentPlan({ price: oPrice, bookingPct: oBooking, constructionPct: oConst, handoverPct: oHandover, postHandoverPct: oPost, constructionInstalments: oConstInst, postInstalments: oPostInst, start, handover: ho })
  }, [oPrice, oBooking, oConst, oHandover, oPost, oConstInst, oPostInst, oMonthsToHandover])
  const sellerRes = useMemo(() => sellerNetProceeds({ salePrice: sSalePrice, originalPurchasePrice: sOrigPrice, mortgagePayoff: sMortgagePayoff, brokerPct: sBrokerPct, nocFee: sNocFee }), [sSalePrice, sOrigPrice, sMortgagePayoff, sBrokerPct, sNocFee])
  const rvbRes = useMemo(() => rentVsBuyCompare({ price: rvbPrice, annualRent: rvbRent, downPct: rvbDownPct, ratePct: rvbRate, years: rvbYears, appreciationPct: rvbApprec, rentEscalationPct: rvbRentEsc, serviceChargeAnnual: rvbScAnnual }), [rvbPrice, rvbRent, rvbDownPct, rvbRate, rvbYears, rvbApprec, rvbRentEsc, rvbScAnnual])
  const flipRes = useMemo(() => offPlanFlipCalc({ launchPrice: fLaunchPrice, resalePrice: fResalePrice, paidToDeveloperPct: fPaidPct, minDeveloperNocThresholdPct: fMinNocPct, nocFee: fNocFee, brokerPct: fBrokerPct }), [fLaunchPrice, fResalePrice, fPaidPct, fMinNocPct, fNocFee, fBrokerPct])
  const hhRes = useMemo(() => holidayHomeVsLongTerm({ price: hhPrice, areaSqft: hhArea, bedrooms: hhBeds, longTermAnnualRent: hhLongRent, adrAed: hhAdr, occupancyPct: hhOcc, dtcmMgmtFeePct: hhMgmtPct, utilitiesAnnual: hhUtilities, furnishingCost: hhFurnish, serviceChargePerSqft: hhScPsf }), [hhPrice, hhArea, hhBeds, hhLongRent, hhAdr, hhOcc, hhMgmtPct, hhUtilities, hhFurnish, hhScPsf])
  const scRes = useMemo(() => serviceChargeCoolingCalc({ areaSqft: scArea, mollakGeneralPsf: scGenPsf, sinkingFundPsf: scSinkPsf, districtCoolingCapacityTr: scCoolingTr, coolingConsumptionMonthly: scCoolingMonthly, chillerFree: scChillerFree }), [scArea, scGenPsf, scSinkPsf, scCoolingTr, scCoolingMonthly, scChillerFree])
  const cmRes = useMemo(() => commercialVatTaxCalc({ price: cmPrice, annualRent: cmRent, areaSqft: cmArea, serviceChargePsf: cmScPsf, agencyPct: cmAgencyPct }), [cmPrice, cmRent, cmArea, cmScPsf, cmAgencyPct])
  const dcfRes = useMemo(() => dcfFiveYearProjector({ price: dcfPrice, initialRent: dcfRent, rentGrowthPct: dcfRentGrowth, appreciationPct: dcfApprec, expenseRatioPct: dcfExpRatio, discountRatePct: dcfDiscount }), [dcfPrice, dcfRent, dcfRentGrowth, dcfApprec, dcfExpRatio, dcfDiscount])
  const refRes = useMemo(() => mortgageRefinanceCalc({ currentLoanBalance: refBalance, currentRatePct: refCurRate, newRatePct: refNewRate, remainingYears: refYears }), [refBalance, refCurRate, refNewRate, refYears])

  const buildSummary = () => {
    switch (active) {
      case 'cost':
        return `*SWK Properties — Buyer Cost-to-Close*\nProperty Price: ${aed(cPrice)}\nDown Payment: ${aed(costRes.downPayment)}\nDLD + Trustee + Agency + Fees: ${aed(costRes.fees)} (${costRes.feesPct.toFixed(1)}%)\n*Total Cash Required:* ${aed(costRes.cashRequired)}`
      case 'mortgage':
        return `*SWK Properties — UAE Mortgage Estimate*\nProperty: ${aed(mPrice)} (${mResidency === 'national' ? 'UAE National' : 'Expat'})\nLoan Amount: ${aed(mortRes.loan)} (LTV ${(mortRes.appliedLtv * 100).toFixed(0)}%)\nMonthly EMI: ${aed(mortRes.emi)} @ ${mRate}% for ${mortRes.years} yrs\nDBR: ${(mortRes.dbr * 100).toFixed(1)}% (${mortRes.dbrOk ? 'Within CBUAE 50% cap' : 'Exceeds 50% cap'})`
      case 'rera':
        return `*SWK Properties — RERA Rental Index Check (Decree 43/2013)*\nCommunity: ${rComm} (${rBeds})\nCurrent Rent: ${aed(rCurrent)} | Index Avg: ${aed(indexAvg)}\nAllowed Increase: ${reraRes.maxIncreasePct}% (+${aed(reraRes.maxIncrease)})\n*Max Renewal Rent:* ${aed(reraRes.maxRent)} (90-day notice required)`
      case 'yield':
        return `*SWK Properties — Investment Yield Analysis*\nPrice: ${aed(yPrice)} | Annual Rent: ${aed(yRent)}\nGross Yield: ${yieldRes.gross.toFixed(2)}% | *Net Yield: ${yieldRes.net.toFixed(2)}%*\nNet Annual Income: ${aed(yieldRes.netIncome)} (after AED ${num(yieldRes.serviceCharge)} service charges)`
      case 'visa':
        return `*SWK Properties — UAE Residency Assessment*\nProperty Share Value: ${aed(visaRes.share)}\nStatus: *${visaRes.tier}*${visaRes.gap > 0 ? `\nGap to 10-Yr Golden Visa: ${aed(visaRes.gap)}` : ''}`
      case 'commission':
        return `*SWK Properties — Commission Split Statement*\nDeal Price: ${aed(wPrice)} @ ${wPct}%\nGross Commission: ${aed(commRes.gross)} (+5% VAT = ${aed(commRes.invoiceTotal)})\nCo-Broker (Form I): ${aed(commRes.coBroker)} | Agent Share: ${aed(commRes.agent)} | SWK Net: ${aed(commRes.company)}`
      case 'movein':
        return `*SWK Properties — Tenant Move-In Estimate*\nAnnual Rent: ${aed(tRent)} (${tCheques} cheques of ${aed(moveRes.chequeAmount)})\n*Total Upfront Move-In:* ${aed(moveRes.moveIn)}\nMonthly DM Housing Fee (5%): ${aed(moveRes.housingFeeMonthly)}`
      case 'offplan':
        return `*SWK Properties — Off-Plan Payment Schedule*\nUnit Price: ${aed(oPrice)}\nPlan: ${oBooking}% Booking / ${oConst}% Construction / ${oHandover}% Handover / ${oPost}% Post-Handover\nDLD Oqood (4%): ${aed(oPrice * 0.04)}`
      case 'seller':
        return `*SWK Properties — Seller Net Proceeds*\nSale Price: ${aed(sSalePrice)} | Mortgage Payoff: ${aed(sMortgagePayoff)}\n*Net Cash at Trustee Transfer:* ${aed(sellerRes.netCashAtTransfer)}\nNet Capital Profit: ${aed(sellerRes.netProfitAfterCosts)} (${sellerRes.roiOnOriginalPct.toFixed(1)}% ROI)`
      case 'rentvsbuy':
        return `*SWK Properties — Rent vs. Buy (${rvbYears}-Yr Analysis)*\nProperty: ${aed(rvbPrice)} vs Rent ${aed(rvbRent)}/yr\nBreak-Even Horizon: ${rvbRes.breakEvenYear ? `Year ${rvbRes.breakEvenYear}` : 'Long-term'}\n*Net Wealth Advantage of Buying:* ${aed(rvbRes.finalWealthAdvantage)}`
      case 'flip':
        return `*SWK Properties — Off-Plan Assignment / Flip ROE*\nOriginal Launch: ${aed(fLaunchPrice)} (${fPaidPct}% paid) → Resale: ${aed(fResalePrice)}\n*Net Flip Profit:* ${aed(flipRes.netProfit)} (*${flipRes.roePct.toFixed(1)}% ROE on cash invested*)`
      case 'holiday':
        return `*SWK Properties — DTCM Holiday Home vs. Long-Term Ejari*\nNet Short-Term Income: ${aed(hhRes.netShortTerm)} (${hhRes.shortTermYieldPct.toFixed(2)}% net)\nNet Long-Term Ejari: ${aed(hhRes.netLongTerm)} (${hhRes.longTermYieldPct.toFixed(2)}% net)\n*Annual Short-Term Alpha:* ${aed(hhRes.annualAlpha)}`
      case 'servicecharge':
        return `*SWK Properties — Mollak & District Cooling Estimate*\nArea: ${num(scArea)} sqft | Annual Mollak: ${aed(scRes.mollakTotalAnnual)}\nAnnual Cooling: ${aed(scRes.coolingTotalAnnual)} | *Total Annual: ${aed(scRes.grandTotalAnnual)}* (${aed(scRes.effectivePsf)}/sqft)`
      case 'commercial':
        return `*SWK Properties — Commercial Property & FTA VAT*\nCommercial Price: ${aed(cmPrice)} + 5% FTA VAT (${aed(cmRes.saleVat5Pct)})\nTotal Cash to Acquire: ${aed(cmRes.totalCommercialPurchaseCash)} | Net Yield: ${cmRes.netCommercialYieldPct.toFixed(2)}%`
      case 'caprate':
        return `*SWK Properties — 5-Year DCF & IRR Projection*\nEntry: ${aed(dcfPrice)} → Year 5 Exit Valuation: ${aed(dcfRes.exitValue)}\n5-Yr Total Profit: ${aed(dcfRes.totalProfit)} | *Equity Multiple: ${dcfRes.equityMultiple.toFixed(2)}x (~${dcfRes.approxIrrPct.toFixed(1)}% IRR)*`
      case 'earlysettlement':
        return `*SWK Properties — UAE Mortgage Refinance Savings*\nBalance: ${aed(refBalance)} (${refCurRate}% → ${refNewRate}%)\nMonthly EMI Savings: ${aed(refRes.monthlySavings)}/mo | Break-Even: ${refRes.breakEvenMonths.toFixed(1)} months\n*Lifetime Net Savings:* ${aed(refRes.lifetimeNetSavings)}`
      default:
        return `*SWK Properties — UAE Deal & AI Utility Suite*`
    }
  }

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div className="grid gap-5 max-w-[1640px] mx-auto">
      <ModuleHeader
        eyebrow="DLD · RERA · CBUAE · FTA"
        title="UAE Deal Toolkit"
        subtitle="Interactive calculators for Dubai real estate transfers, CBUAE mortgage pre-qualification, RERA Decree 43/2013 rental caps, net yields, Golden Visa thresholds, Form I commission splits and off-plan schedules."
        icon={<Calculator size={24} />}
        actions={
          <div className="flex items-center gap-2">
            <button type="button" className="swk-btn swk-btn-gold" onClick={copySummary}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied for WhatsApp' : 'Copy WhatsApp summary'}
            </button>
            <button type="button" className="swk-btn swk-btn-ghost" onClick={() => window.print()}>
              <Printer size={16} />Print sheet
            </button>
          </div>
        }
      />

      <div className="overflow-x-auto pb-1">
        <Segmented value={active} onChange={setActive} options={TOOLS} layoutId="toolkit-tabs" />
      </div>

      {/* ============================================================ 1. COST TO CLOSE */}
      {active === 'cost' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Transaction parameters" subtitle="DLD 4% transfer fee, trustee office & agency commission">
            <div className="grid gap-4">
              <Field label="Purchase price (AED)" value={cPrice} onChange={setCPrice} prefix="AED" step={50000} />
              <div className="flex items-center justify-between pt-1">
                <label className="swk-toggle">
                  <input type="checkbox" checked={cUseLoan} onChange={e => setCUseLoan(e.target.checked)} />
                  <span>Financed with UAE bank mortgage</span>
                </label>
                <Pill tone={cUseLoan ? 'navy' : 'champ'}>{cUseLoan ? 'Mortgage buyer' : 'Cash buyer'}</Pill>
              </div>
              {cUseLoan && (
                <Field label="Down payment (%)" value={cDownPct} onChange={v => setCDownPct(Math.min(90, Math.max(15, v)))} suffix="%" step={5} hint={`Loan amount: ${aed(cLoan)}`} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Agency commission (%)" value={cBrokerPct} onChange={setCBrokerPct} suffix="% + VAT" step={0.25} />
                <Field label="Developer NOC fee" value={cNoc} onChange={setCNoc} prefix="AED" step={250} hint="AED 500 – 5,000" />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Upfront cash required at transfer" subtitle="Breakdown of DLD, Registration Trustee, NOC, bank & agency fees" tone="champ">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#041615] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#E0C1A3]">Total cash to close</div>
                <div className="font-display text-[24px] font-semibold mt-1"><AnimatedNumber value={costRes.cashRequired} format={v => aed(v)} /></div>
                <div className="text-[11.5px] text-white/70 mt-1">Down payment + all closing costs</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Closing fees total</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={costRes.fees} format={v => aed(v)} /></div>
                <div className="text-[11.5px] text-muted mt-1">{costRes.feesPct.toFixed(2)}% of property price</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Down payment</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={costRes.downPayment} format={v => aed(v)} /></div>
                <div className="text-[11.5px] text-muted mt-1">{cUseLoan ? `${cDownPct}% equity` : '100% cash purchase'}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-[200px_1fr] gap-4 items-center">
              <div style={{ height: 190 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={costRes.lines} dataKey="amount" nameKey="label" innerRadius={48} outerRadius={78} paddingAngle={3} cornerRadius={4}>
                      {costRes.lines.map((_, i) => <Cell key={i} fill={CHART[i % CHART.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => aed(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#e7e1d4]">
                {costRes.lines.map((l, i) => (
                  <div key={l.key} className="swk-kv">
                    <span className="flex items-center gap-2">
                      <i className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: CHART[i % CHART.length] }} />
                      <span><strong className="text-ink font-medium">{l.label}</strong><small className="block text-[11px] text-muted">{l.note}</small></span>
                    </span>
                    <b>{aed(l.amount)}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 2. MORTGAGE */}
      {active === 'mortgage' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Borrower & property profile" subtitle="UAE Central Bank LTV & 50% DBR rules">
            <div className="grid gap-3.5">
              <Field label="Property price" value={mPrice} onChange={setMPrice} prefix="AED" step={100000} />
              <div>
                <div className="swk-field-label mb-1.5">Residency status</div>
                <Segmented value={mResidency} onChange={setMResidency} options={[{ value: 'expat', label: 'UAE Expat / Non-Resident' }, { value: 'national', label: 'UAE National' }]} layoutId="mort-res" />
              </div>
              <div className="flex flex-wrap gap-5 py-1">
                <label className="swk-toggle"><input type="checkbox" checked={mFirstHome} onChange={e => setMFirstHome(e.target.checked)} /><span>First property</span></label>
                <label className="swk-toggle"><input type="checkbox" checked={mOffPlan} onChange={e => setMOffPlan(e.target.checked)} /><span>Off-plan (50% LTV cap)</span></label>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Down payment" value={mDownPct} onChange={setMDownPct} suffix="%" step={5} />
                <Field label="Interest rate" value={mRate} onChange={setMRate} suffix="% p.a." step={0.1} />
                <Field label="Tenure (max 25y)" value={mYears} onChange={v => setMYears(Math.min(25, Math.max(1, v)))} suffix="yrs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly net income" value={mIncome} onChange={setMIncome} prefix="AED" step={2500} />
                <Field label="Existing monthly debts" value={mDebts} onChange={setMDebts} prefix="AED" step={500} hint="Cards, auto loans, etc." />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="CBUAE pre-qualification & amortisation" subtitle="Maximum LTV, monthly EMI & Debt-Burden Ratio check">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#041615] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#E0C1A3]">Monthly EMI</div>
                <div className="font-display text-[24px] font-semibold mt-1"><AnimatedNumber value={mortRes.emi} format={v => aed(v)} /></div>
                <div className="text-[11.5px] text-white/70 mt-1">Loan {aed(mortRes.loan, { compact: true })} ({(mortRes.appliedLtv * 100).toFixed(0)}% LTV)</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">CBUAE Max LTV</div>
                <div className="font-display text-[24px] font-semibold text-ink mt-1">{(mortRes.ltv * 100).toFixed(0)}%</div>
                <div className="text-[11.5px] text-muted mt-1">Min down {(100 - mortRes.ltv * 100).toFixed(0)}% required</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Max affordable price</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={mortRes.maxPriceByDbr} format={v => aed(v, { compact: true })} /></div>
                <div className="text-[11.5px] text-muted mt-1">At 50% DBR ceiling</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf7f1] border border-[#e7e1d4] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-ink">Debt-Burden Ratio (DBR): {(mortRes.dbr * 100).toFixed(1)}% of monthly income</span>
                <Pill tone={mortRes.dbrOk ? 'oasis' : 'dune'}>{mortRes.dbrOk ? 'Passes CBUAE ≤ 50% rule' : 'Exceeds 50% CBUAE limit'}</Pill>
              </div>
              <Bar value={mortRes.dbr * 100} max={100} color={mortRes.dbrOk ? SWK.oasis : SWK.dune} height={10} />
              <div className="flex justify-between text-[11px] text-muted mt-1.5">
                <span>0%</span><span>CBUAE statutory cap: 50%</span><span>100%</span>
              </div>
            </div>

            <div style={{ height: 210 }}>
              <ResponsiveContainer>
                <AreaChart data={mortRes.schedule} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mBal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SWK.navy} stopOpacity={0.35} /><stop offset="100%" stopColor={SWK.navy} stopOpacity={0} /></linearGradient>
                    <linearGradient id="mPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SWK.champ} stopOpacity={0.45} /><stop offset="100%" stopColor={SWK.champ} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ece6da" vertical={false} />
                  <XAxis dataKey="year" tickFormatter={y => `Yr ${y}`} />
                  <YAxis tickFormatter={v => aed(v, { compact: true }).replace('AED ', '')} width={54} />
                  <Tooltip formatter={(v: any) => aed(Number(v))} />
                  <Area type="monotone" dataKey="balance" name="Remaining balance" stroke={SWK.navy} strokeWidth={2} fill="url(#mBal)" />
                  <Area type="monotone" dataKey="paid" name="Equity paid" stroke={SWK.champDeep} strokeWidth={2} fill="url(#mPaid)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 3. RERA RENT INDEX */}
      {active === 'rera' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Tenancy & RERA index lookup" subtitle="Dubai Decree No. 43 of 2013 statutory rent slabs">
            <div className="grid gap-4">
              <label className="swk-field">
                <span className="swk-field-label">Dubai community</span>
                <span className="swk-field-box">
                  <select value={rComm} onChange={e => { setRComm(e.target.value); setRIndexOverride(null) }}>
                    {COMMUNITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </span>
              </label>
              <div>
                <div className="swk-field-label mb-1.5">Bedrooms</div>
                <Segmented value={rBeds} onChange={v => { setRBeds(v); setRIndexOverride(null) }} options={[{ value: 'Studio', label: 'Studio' }, { value: '1 BR', label: '1 BR' }, { value: '2 BR', label: '2 BR' }, { value: '3 BR', label: '3 BR' }]} layoutId="rera-beds" />
              </div>
              <Field label="Current annual contract rent" value={rCurrent} onChange={setRCurrent} prefix="AED" step={5000} />
              <Field label="RERA index average rent (editable)" value={indexAvg} onChange={v => setRIndexOverride(v)} prefix="AED" step={5000} hint="Auto-filled from community benchmark; override with live Dubai REST figure." />
            </div>
          </Card>

          <Card className="lg:col-span-7" title="RERA renewal calculation" subtitle="90-day written notice required prior to lease expiry (Law 26/2007)">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#041615] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#E0C1A3]">Maximum new rent</div>
                <div className="font-display text-[24px] font-semibold mt-1"><AnimatedNumber value={reraRes.maxRent} format={v => aed(v)} /></div>
                <div className="text-[11.5px] text-white/70 mt-1">+{aed(reraRes.maxIncrease)} / year</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Allowed increase</div>
                <div className="font-display text-[26px] font-semibold text-ink mt-1">{reraRes.maxIncreasePct}%</div>
                <div className="text-[11.5px] text-muted mt-1">{reraRes.band.label}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Gap vs RERA index</div>
                <div className="font-display text-[24px] font-semibold text-ink mt-1">{reraRes.below.toFixed(1)}%</div>
                <div className="text-[11.5px] text-muted mt-1">Below index average</div>
              </div>
            </div>

            <table className="swk-table">
              <thead>
                <tr><th>Decree 43/2013 slab</th><th>Max increase</th><th className="num">Resulting rent</th><th>Status</th></tr>
              </thead>
              <tbody>
                {RERA_BANDS.map(b => {
                  const match = b.increase === reraRes.maxIncreasePct
                  return (
                    <tr key={b.label} style={match ? { background: '#f4ead5', fontWeight: 600 } : undefined}>
                      <td>{b.label}</td>
                      <td>{b.increase}%</td>
                      <td className="num">{aed(rCurrent * (1 + b.increase / 100))}</td>
                      <td>{match ? <Pill tone="champ">Applies to this lease</Pill> : <span className="text-xs text-muted">—</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 4. YIELD & ROI */}
      {active === 'yield' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Property & operating assumptions" subtitle="Mollak / RERA service charge index & management deductions">
            <div className="grid gap-3.5">
              <label className="swk-field">
                <span className="swk-field-label">Community preset (auto-fills service charge)</span>
                <span className="swk-field-box">
                  <select value={yComm} onChange={e => {
                    const c = COMMUNITIES.find(x => x.name === e.target.value)
                    setYComm(e.target.value)
                    if (c) setYSc(c.serviceCharge)
                  }}>
                    {COMMUNITIES.map(c => <option key={c.id} value={c.name}>{c.name} (AED {c.serviceCharge}/sqft)</option>)}
                  </select>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Purchase price" value={yPrice} onChange={setYPrice} prefix="AED" step={50000} />
                <Field label="Annual gross rent" value={yRent} onChange={setYRent} prefix="AED" step={5000} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Built-up area" value={yArea} onChange={setYArea} suffix="sqft" step={50} />
                <Field label="Service charge" value={ySc} onChange={setYSc} suffix="AED/sqft" step={1} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Vacancy" value={yVacancy} onChange={setYVacancy} suffix="wks/yr" />
                <Field label="Maintenance" value={yMaint} onChange={setYMaint} suffix="%" step={0.5} />
                <Field label="Property mgmt" value={yMgmt} onChange={setYMgmt} suffix="%" step={0.5} />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Gross vs net yield after DLD costs & service charges" subtitle="Includes 4% DLD transfer & agency acquisition cost in denominator">
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-[#faf7f1] border border-[#e7e1d4] mb-4">
              <ProgressRing value={Math.min(100, yieldRes.gross * 10)} size={104} color={SWK.navy} label={pct(yieldRes.gross, 2)} sub="Gross" />
              <ProgressRing value={Math.min(100, yieldRes.net * 10)} size={104} color={SWK.oasis} label={pct(yieldRes.net, 2)} sub="Net ROI" />
              <div className="flex-1 min-w-[200px] grid gap-1.5">
                <div className="swk-kv"><span>Net annual cashflow</span><b>{aed(yieldRes.netIncome)}</b></div>
                <div className="swk-kv"><span>Monthly net income</span><b>{aed(yieldRes.netIncome / 12)}</b></div>
                <div className="swk-kv"><span>Payback horizon</span><b>{Number.isFinite(yieldRes.paybackYears) ? `${yieldRes.paybackYears.toFixed(1)} yrs` : '—'}</b></div>
              </div>
            </div>

            <div className="grid gap-2.5">
              {[
                { l: 'Gross annual rent', v: yRent, c: SWK.navy },
                { l: `Mollak service charges (${yArea} sqft × AED ${ySc})`, v: yieldRes.serviceCharge, c: SWK.champDeep },
                { l: `Property management (${yMgmt}%)`, v: yieldRes.mgmt, c: SWK.ocean },
                { l: `Maintenance reserve (${yMaint}%)`, v: yieldRes.maint, c: SWK.sky },
                { l: `Vacancy allowance (${yVacancy} weeks)`, v: yieldRes.vacancy, c: SWK.dune },
              ].map(r => (
                <div key={r.l}>
                  <div className="flex justify-between text-[12.5px] mb-1"><span className="text-body">{r.l}</span><b className="text-ink">{aed(r.v)}</b></div>
                  <Bar value={r.v} max={yRent} color={r.c} height={7} />
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 5. GOLDEN VISA */}
      {active === 'visa' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Property & ownership structure" subtitle="ICP / DLD Golden Visa (AED 2M) & Investor Visa (AED 750K)">
            <div className="grid gap-4">
              <Field label="Title deed / Oqood property value" value={vValue} onChange={setVValue} prefix="AED" step={50000} />
              <Field label="Number of joint owners on deed" value={vOwners} onChange={v => setVOwners(Math.max(1, v))} step={1} hint="Spouses may combine shares if marriage certificate is attested." />
              <div className="flex flex-wrap gap-5 pt-1">
                <label className="swk-toggle"><input type="checkbox" checked={vMortgaged} onChange={e => setVMortgaged(e.target.checked)} /><span>Mortgaged property</span></label>
                <label className="swk-toggle"><input type="checkbox" checked={vOffPlan} onChange={e => setVOffPlan(e.target.checked)} /><span>Off-plan (Oqood)</span></label>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Residency eligibility verdict" subtitle="Assessed per owner share against statutory DLD thresholds" tone={visaRes.golden ? 'navy' : 'light'}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl grid place-items-center bg-[#B68F70]/20 text-[#B68F70] flex-none">
                <Award size={28} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[.2em] text-[#B68F70]">Qualification result</div>
                <div className="font-display text-[26px] font-semibold">{visaRes.tier}</div>
                <div className="text-xs opacity-80 mt-0.5">Individual share: {aed(visaRes.share)} (threshold: {aed(UAE.goldenVisaMin)})</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span>Progress toward AED 2,000,000 Golden Visa</span>
                <b>{Math.min(100, (visaRes.share / UAE.goldenVisaMin) * 100).toFixed(0)}%</b>
              </div>
              <Bar value={visaRes.share} max={UAE.goldenVisaMin} color={SWK.champ} height={10} />
            </div>

            <div className="grid gap-2 text-[13px]">
              {visaRes.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/15">
                  <ShieldCheck size={16} className="text-[#B68F70] mt-0.5 flex-none" />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 6. COMMISSION WATERFALL */}
      {active === 'commission' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Deal & split structure" subtitle="Form I co-broking, referral, agent slab & 5% FTA VAT">
            <div className="grid gap-3.5">
              <Field label="Transaction value" value={wPrice} onChange={setWPrice} prefix="AED" step={100000} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gross commission %" value={wPct} onChange={setWPct} suffix="%" step={0.25} />
                <Field label="External co-broker (Form I)" value={wCoBroker} onChange={setWCoBroker} suffix="%" step={5} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Referral %" value={wReferral} onChange={setWReferral} suffix="%" step={1} />
                <Field label="Agent split %" value={wAgentSplit} onChange={setWAgentSplit} suffix="%" step={5} />
                <Field label="Team lead %" value={wLeader} onChange={setWLeader} suffix="%" step={1} />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Commission waterfall & FTA tax invoice" subtitle="Net brokerage retention and agent wallet payout">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#041615] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#E0C1A3]">Tax invoice (incl. 5% VAT)</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={commRes.invoiceTotal} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">VAT 5%: {aed(commRes.vat)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">SWK Agent payout</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={commRes.agent} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">{wAgentSplit}% of net pool</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">SWK House net</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={commRes.company} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Retained by brokerage</div>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Gross', amount: commRes.gross },
                  { name: 'Co-broker', amount: commRes.coBroker },
                  { name: 'Referral', amount: commRes.referral },
                  { name: 'Agent', amount: commRes.agent },
                  { name: 'Leader', amount: commRes.leader },
                  { name: 'SWK Net', amount: commRes.company },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ece6da" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={v => aed(v, { compact: true }).replace('AED ', '')} width={54} />
                  <Tooltip formatter={(v: any) => aed(Number(v))} />
                  <RBar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {CHART.slice(0, 6).map((c, i) => <Cell key={i} fill={c} />)}
                  </RBar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 7. TENANT MOVE-IN */}
      {active === 'movein' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Lease terms" subtitle="Ejari, DEWA deposit, security deposit & PDC cheques">
            <div className="grid gap-4">
              <Field label="Annual rent" value={tRent} onChange={setTRent} prefix="AED" step={5000} />
              <div>
                <div className="swk-field-label mb-1.5">Cheque frequency</div>
                <Segmented value={tCheques} onChange={setTCheques} options={[
                  { value: '1', label: '1 Cheque' }, { value: '2', label: '2 Cheques' }, { value: '4', label: '4 Cheques' }, { value: '6', label: '6 Cheques' }, { value: '12', label: '12 Cheques' },
                ]} layoutId="move-chq" />
              </div>
              <div className="flex flex-wrap gap-5 pt-1">
                <label className="swk-toggle"><input type="checkbox" checked={tFurnished} onChange={e => setTFurnished(e.target.checked)} /><span>Furnished (10% deposit)</span></label>
                <label className="swk-toggle"><input type="checkbox" checked={tVilla} onChange={e => setTVilla(e.target.checked)} /><span>Villa (AED 4,000 DEWA)</span></label>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Day-1 tenant cash summary" subtitle="Includes first rent cheque, deposits, Ejari & agency fee">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#041615] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#E0C1A3]">Upfront move-in total</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={moveRes.moveIn} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">Includes 1st cheque</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Each PDC cheque</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={moveRes.chequeAmount} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">{tCheques} cheques / year</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">DM housing fee (5%)</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={moveRes.housingFeeMonthly} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Billed monthly via DEWA</div>
              </div>
            </div>

            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              {moveRes.lines.map(l => (
                <div key={l.label} className="swk-kv">
                  <span className="flex items-center gap-2">
                    <span>{l.label}</span>
                    <Pill tone={l.refundable ? 'oasis' : 'grey'}>{l.refundable ? 'Refundable' : 'Fee / Rent'}</Pill>
                  </span>
                  <b>{aed(l.amount)}</b>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 8. OFF-PLAN SCHEDULE */}
      {active === 'offplan' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Developer payment plan" subtitle="Booking, construction, handover, post-handover & 4% Oqood">
            <div className="grid gap-3.5">
              <Field label="Launch unit price" value={oPrice} onChange={setOPrice} prefix="AED" step={50000} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Booking / down %" value={oBooking} onChange={setOBooking} suffix="%" step={5} />
                <Field label="During construction %" value={oConst} onChange={setOConst} suffix="%" step={5} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="On handover %" value={oHandover} onChange={setOHandover} suffix="%" step={5} />
                <Field label="Post-handover (24m) %" value={oPost} onChange={setOPost} suffix="%" step={5} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Const. milestones" value={oConstInst} onChange={v => setOConstInst(Math.max(1, Math.min(12, v)))} />
                <Field label="Post-HO cheques" value={oPostInst} onChange={v => setOPostInst(Math.max(0, Math.min(12, v)))} />
                <Field label="Months to HO" value={oMonthsToHandover} onChange={v => setOMonthsToHandover(Math.max(6, Math.min(60, v)))} suffix="m" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted">Plan total: <b>{offRes.planPct}%</b></span>
                <Pill tone={offRes.valid ? 'oasis' : 'dune'}>{offRes.valid ? 'Totals 100%' : 'Must equal 100%'}</Pill>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-7" title="Instalment schedule & Oqood registration" subtitle="Escrow-protected milestones per Dubai Law No. 8 of 2007">
            <div className="max-h-[380px] overflow-auto">
              <table className="swk-table">
                <thead>
                  <tr><th>Milestone</th><th>Phase</th><th>Target date</th><th className="num">Share</th><th className="num">Amount (AED)</th></tr>
                </thead>
                <tbody>
                  {offRes.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="font-medium">{r.label}</td>
                      <td><Pill tone={r.phase === 'DLD' ? 'champ' : r.phase === 'Handover' ? 'oasis' : 'navy'}>{r.phase}</Pill></td>
                      <td className="text-xs text-muted">{r.date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</td>
                      <td className="num">{r.pct.toFixed(1)}%</td>
                      <td className="num font-semibold">{aed(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 9. SELLER NET PROCEEDS */}
      {active === 'seller' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Seller & mortgage parameters" subtitle="CBUAE early settlement cap (1% max AED 10k), mortgage release, NOC & agency fee">
            <div className="grid gap-3.5">
              <Field label="Agreed sale price" value={sSalePrice} onChange={setSSalePrice} prefix="AED" step={50000} />
              <Field label="Original purchase price" value={sOrigPrice} onChange={setSOrigPrice} prefix="AED" step={50000} />
              <Field label="Outstanding mortgage payoff" value={sMortgagePayoff} onChange={setSMortgagePayoff} prefix="AED" step={50000} hint="Set to 0 if unencumbered Title Deed" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Seller agency fee %" value={sBrokerPct} onChange={setSBrokerPct} suffix="% + VAT" step={0.5} />
                <Field label="Developer NOC fee" value={sNocFee} onChange={setSNocFee} prefix="AED" step={500} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Seller net proceeds at DLD Trustee table" subtitle="Net manager cheque payable to Seller after liability clearance" tone="champ">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Net cash at transfer</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={sellerRes.netCashAtTransfer} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">After mortgage & closing fees</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Net capital gain</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={sellerRes.netProfitAfterCosts} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">{sellerRes.roiOnOriginalPct.toFixed(1)}% return on original price</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Total deductions</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={sellerRes.totalDeductions} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Payoff + NOC + release + agency</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>Gross sale price</span><b>{aed(sSalePrice)}</b></div>
              <div className="swk-kv"><span>Bank mortgage principal payoff</span><b>-{aed(sMortgagePayoff)}</b></div>
              <div className="swk-kv"><span>CBUAE early settlement penalty (1% capped at AED 10k + VAT)</span><b>-{aed(sellerRes.earlySettlementVat)}</b></div>
              <div className="swk-kv"><span>DLD mortgage release & de-registration</span><b>-{aed(sellerRes.mortgageReleaseFee)}</b></div>
              <div className="swk-kv"><span>Developer NOC fee</span><b>-{aed(sNocFee)}</b></div>
              <div className="swk-kv"><span>Seller agency fee (+5% VAT)</span><b>-{aed(sellerRes.sellerBrokerFee)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 10. RENT VS BUY */}
      {active === 'rentvsbuy' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Rent vs. Buy parameters" subtitle="Compare cumulative Ejari rent outflow against homeownership equity buildup">
            <div className="grid gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Purchase price" value={rvbPrice} onChange={setRvbPrice} prefix="AED" step={50000} />
                <Field label="Current annual rent" value={rvbRent} onChange={setRvbRent} prefix="AED" step={5000} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Down payment %" value={rvbDownPct} onChange={setRvbDownPct} suffix="%" step={5} />
                <Field label="Mortgage rate %" value={rvbRate} onChange={setRvbRate} suffix="%" step={0.1} />
                <Field label="Horizon (years)" value={rvbYears} onChange={v => setRvbYears(Math.min(15, Math.max(3, v)))} suffix="yrs" />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Annual appreciation" value={rvbApprec} onChange={setRvbApprec} suffix="%" step={0.5} />
                <Field label="Rent escalation" value={rvbRentEsc} onChange={setRvbRentEsc} suffix="%" step={0.5} />
                <Field label="Service charge / yr" value={rvbScAnnual} onChange={setRvbScAnnual} prefix="AED" step={1000} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Multi-year wealth & break-even comparison" subtitle="Includes DLD 4% entry cost, DM 5% housing fee, principal amortization & capital growth">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Buying wealth advantage</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={rvbRes.finalWealthAdvantage} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">After {rvbYears} years</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Break-even year</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1">{rvbRes.breakEvenYear ? `Year ${rvbRes.breakEvenYear}` : `> ${rvbYears} yrs`}</div>
                <div className="text-[11px] text-muted mt-1">When buying beats renting</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Accumulated equity</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={rvbRes.finalEquity} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Prop value: {aed(rvbRes.finalPropertyValue, { compact: true })}</div>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={rvbRes.schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ece6da" vertical={false} />
                  <XAxis dataKey="year" tickFormatter={y => `Yr ${y}`} />
                  <YAxis tickFormatter={v => aed(v, { compact: true }).replace('AED ', '')} width={58} />
                  <Tooltip formatter={(v: any) => aed(Number(v))} />
                  <Area type="monotone" dataKey="cumRent" name="Cumulative Rent Paid" stroke={SWK.dune} fill={SWK.dune} fillOpacity={0.2} />
                  <Area type="monotone" dataKey="netEquity" name="Homeowner Net Equity" stroke={SWK.oasis} fill={SWK.oasis} fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 11. OFF-PLAN FLIP ROE */}
      {active === 'flip' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Off-plan assignment / flip parameters" subtitle="Pre-handover Oqood resale ROE & developer minimum payment gate">
            <div className="grid gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Original launch price" value={fLaunchPrice} onChange={setFLaunchPrice} prefix="AED" step={50000} />
                <Field label="Target resale price" value={fResalePrice} onChange={setFResalePrice} prefix="AED" step={50000} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Paid to developer so far" value={fPaidPct} onChange={setFPaidPct} suffix="%" step={5} />
                <Field label="Developer NOC threshold" value={fMinNocPct} onChange={setFMinNocPct} suffix="%" step={5} hint="Usually 30%–40%" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Developer NOC fee" value={fNocFee} onChange={setFNocFee} prefix="AED" step={500} />
                <Field label="Broker commission %" value={fBrokerPct} onChange={setFBrokerPct} suffix="% + VAT" step={0.5} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Return on Equity (ROE) & Assignment Cash Waterfall" subtitle="Leveraged return on paid milestones + 4% Oqood">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Return on Equity (ROE)</div>
                <div className="font-display text-[24px] font-semibold mt-1">{flipRes.roePct.toFixed(1)}%</div>
                <div className="text-[11px] text-white/70 mt-1">Net profit: {aed(flipRes.netProfit)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Total cash invested</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={flipRes.totalCashInvested} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">{fPaidPct}% milestones + 4% Oqood</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Developer NOC gate</div>
                <div className="mt-1"><Pill tone={flipRes.eligibleForNoc ? 'oasis' : 'dune'}>{flipRes.eligibleForNoc ? 'Eligible for Assignment NOC' : `Top-up ${aed(flipRes.topUpNeeded)} needed`}</Pill></div>
                <div className="text-[11px] text-muted mt-1.5">New buyer assumes {aed(flipRes.buyerRemainingToDeveloper)}</div>
              </div>
            </div>
            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>Paid to developer ({fPaidPct}%)</span><b>{aed(flipRes.paidToDeveloper)}</b></div>
              <div className="swk-kv"><span>Original 4% Oqood + admin paid</span><b>{aed(flipRes.oqoodPaid)}</b></div>
              <div className="swk-kv"><span>Gross appreciation premium</span><b>+{aed(flipRes.grossPremium)}</b></div>
              <div className="swk-kv"><span>Cash collected by Seller at transfer (reimbursement + premium - fees)</span><b>{aed(flipRes.cashReturnedAtTransfer)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 12. HOLIDAY HOME VS LONG TERM */}
      {active === 'holiday' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Short-term (DTCM) vs. Long-term (Ejari)" subtitle="Compare Airbnb/Holiday Home ADR & occupancy against annual lease">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Property value" value={hhPrice} onChange={setHhPrice} prefix="AED" step={50000} />
                <Field label="Annual Ejari rent" value={hhLongRent} onChange={setHhLongRent} prefix="AED" step={5000} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Nightly ADR" value={hhAdr} onChange={setHhAdr} prefix="AED" step={50} />
                <Field label="Occupancy %" value={hhOcc} onChange={setHhOcc} suffix="%" step={2} />
                <Field label="DTCM operator %" value={hhMgmtPct} onChange={setHhMgmtPct} suffix="%" step={1} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="DEWA/Wi-Fi/Chiller" value={hhUtilities} onChange={setHhUtilities} prefix="AED/yr" step={1000} />
                <Field label="Furnishing capex" value={hhFurnish} onChange={setHhFurnish} prefix="AED" step={5000} />
                <Field label="Service charge" value={hhScPsf} onChange={setHhScPsf} suffix="AED/ft²" step={1} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Net cashflow & yield comparison" subtitle="Includes DTCM permit fee, operator commission (+VAT), utilities & Mollak">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Holiday Home Net Income</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={hhRes.netShortTerm} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">Net yield: {hhRes.shortTermYieldPct.toFixed(2)}% ({hhRes.bookedNights} nights)</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Long-Term Ejari Net</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={hhRes.netLongTerm} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Net yield: {hhRes.longTermYieldPct.toFixed(2)}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Short-Term Alpha</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1">{hhRes.annualAlpha >= 0 ? `+${aed(hhRes.annualAlpha)}` : aed(hhRes.annualAlpha)}</div>
                <div className="text-[11px] text-muted mt-1">{Number.isFinite(hhRes.furnishingPaybackMonths) ? `Payback furniture in ${hhRes.furnishingPaybackMonths.toFixed(1)} mo` : 'Long-term Ejari preferred'}</div>
              </div>
            </div>
            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>Gross short-term bookings ({hhRes.bookedNights} nights × {aed(hhAdr)})</span><b>{aed(hhRes.grossShortTerm)}</b></div>
              <div className="swk-kv"><span>DTCM Holiday Home operator fee ({hhMgmtPct}% + VAT)</span><b>-{aed(hhRes.operatorFee)}</b></div>
              <div className="swk-kv"><span>DEWA, Chiller, High-Speed Fiber & Guest Consumables</span><b>-{aed(hhUtilities)}</b></div>
              <div className="swk-kv"><span>DTCM annual unit permit & classification fee</span><b>-{aed(hhRes.dtcmPermitFee)}</b></div>
              <div className="swk-kv"><span>Mollak annual service charges</span><b>-{aed(hhRes.serviceCharges)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 13. MOLLAK & DISTRICT COOLING */}
      {active === 'servicecharge' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Mollak Service Charge & Chiller Estimator" subtitle="RERA Mollak General + Sinking Fund & Empower/Emicool District Cooling">
            <div className="grid gap-3.5">
              <Field label="Suite / Title Deed area" value={scArea} onChange={setScArea} suffix="sqft" step={50} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="General fund (AED/sqft)" value={scGenPsf} onChange={setScGenPsf} suffix="AED" step={0.5} />
                <Field label="Sinking fund (AED/sqft)" value={scSinkPsf} onChange={setScSinkPsf} suffix="AED" step={0.5} />
              </div>
              <label className="swk-toggle py-1">
                <input type="checkbox" checked={scChillerFree} onChange={e => setScChillerFree(e.target.checked)} />
                <span>Chiller-Free building (AC included in service charges)</span>
              </label>
              {!scChillerFree && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cooling capacity (TR)" value={scCoolingTr} onChange={setScCoolingTr} suffix="TR" step={0.5} />
                  <Field label="Avg monthly consumption" value={scCoolingMonthly} onChange={setScCoolingMonthly} prefix="AED" step={50} />
                </div>
              )}
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Annual & quarterly operating cost breakdown" subtitle="Billed via RERA Mollak portal & District Cooling provider">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Combined annual total</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={scRes.grandTotalAnnual} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">Effective: {aed(scRes.effectivePsf)} / sqft</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Quarterly Mollak invoice</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={scRes.quarterlyMollak} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Annual Mollak: {aed(scRes.mollakTotalAnnual)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Monthly budget equiv.</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={scRes.monthlyEquivalent} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Cooling/yr: {aed(scRes.coolingTotalAnnual)}</div>
              </div>
            </div>
            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>Mollak General Operations & Maintenance Fund</span><b>{aed(scRes.generalAnnual)}</b></div>
              <div className="swk-kv"><span>Mollak Capital Reserve / Sinking Fund</span><b>{aed(scRes.sinkingAnnual)}</b></div>
              <div className="swk-kv"><span>District Cooling (Capacity + Consumption + 5% VAT)</span><b>{aed(scRes.coolingTotalAnnual)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 14. COMMERCIAL & FTA VAT */}
      {active === 'commercial' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Commercial Office / Retail / Warehouse" subtitle="FTA 5% Commercial VAT, 4% DLD & 20% Dubai Municipality Commercial Tax">
            <div className="grid gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Commercial sale price" value={cmPrice} onChange={setCmPrice} prefix="AED" step={100000} />
                <Field label="Annual commercial rent" value={cmRent} onChange={setCmRent} prefix="AED" step={10000} />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Area (sqft)" value={cmArea} onChange={setCmArea} suffix="sqft" step={100} />
                <Field label="Service charge" value={cmScPsf} onChange={setCmScPsf} suffix="AED/ft²" step={1} />
                <Field label="Agency fee %" value={cmAgencyPct} onChange={setCmAgencyPct} suffix="%" step={0.5} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Commercial acquisition & leasing tax breakdown" subtitle="Commercial properties in UAE are subject to 5% FTA VAT (recoverable for VAT-registered entities)">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Total acquisition cash</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={cmRes.totalCommercialPurchaseCash} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">Includes 5% VAT + 4% DLD</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">5% FTA VAT on sale</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={cmRes.saleVat5Pct} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Tax invoice / Reverse charge</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Net commercial yield</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1">{cmRes.netCommercialYieldPct.toFixed(2)}%</div>
                <div className="text-[11px] text-muted mt-1">Net rent: {aed(cmRes.netOwnerRent)}</div>
              </div>
            </div>
            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>DLD 4% commercial transfer fee</span><b>{aed(cmRes.dldTransfer4Pct)}</b></div>
              <div className="swk-kv"><span>FTA 5% VAT on annual commercial rent (paid by tenant)</span><b>{aed(cmRes.rentVat5Pct)}</b></div>
              <div className="swk-kv"><span>Dubai Municipality 20% commercial sub-lease / municipal fee</span><b>{aed(cmRes.dmCommercialTax20Pct)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 15. 5-YR DCF & IRR */}
      {active === 'caprate' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="5-Year DCF & Capital Appreciation Model" subtitle="Project 5-year cashflows, exit valuation, MOIC & approximate IRR">
            <div className="grid gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Acquisition price" value={dcfPrice} onChange={setDcfPrice} prefix="AED" step={100000} />
                <Field label="Year-1 gross rent" value={dcfRent} onChange={setDcfRent} prefix="AED" step={10000} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Annual rent growth %" value={dcfRentGrowth} onChange={setDcfRentGrowth} suffix="%" step={0.5} />
                <Field label="Capital appreciation %" value={dcfApprec} onChange={setDcfApprec} suffix="%" step={0.5} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Operating expense ratio" value={dcfExpRatio} onChange={setDcfExpRatio} suffix="%" step={1} />
                <Field label="Discount rate (WACC)" value={dcfDiscount} onChange={setDcfDiscount} suffix="%" step={0.5} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="5-Year Institutional Return Summary" subtitle="Includes DLD entry costs and Year-5 exit at 2% disposal cost">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">5-Yr Total Net Profit</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={dcfRes.totalProfit} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">MOIC: {dcfRes.equityMultiple.toFixed(2)}x (~{dcfRes.approxIrrPct.toFixed(1)}% IRR)</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Year-5 Exit Valuation</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={dcfRes.exitValue} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">At {dcfApprec}%/yr growth</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Net Present Value (NPV)</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={dcfRes.npv} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Discounted @ {dcfDiscount}%</div>
              </div>
            </div>
            <table className="swk-table">
              <thead>
                <tr><th>Year</th><th className="num">Gross Rent</th><th className="num">Net Operating Income</th><th className="num">Projected Asset Value</th></tr>
              </thead>
              <tbody>
                {dcfRes.years.map(y => (
                  <tr key={y.year}>
                    <td className="font-semibold">Year {y.year}</td>
                    <td className="num">{aed(y.grossRent)}</td>
                    <td className="num font-medium">{aed(y.netRent)}</td>
                    <td className="num font-semibold">{aed(y.propertyValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 16. MORTGAGE REFINANCE */}
      {active === 'earlysettlement' && (
        <Reveal className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-5" title="Mortgage Buyout & Refinance Calculator" subtitle="CBUAE 1% (max AED 10k) early settlement rule & switch break-even">
            <div className="grid gap-3.5">
              <Field label="Current loan balance" value={refBalance} onChange={setRefBalance} prefix="AED" step={50000} />
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Current rate %" value={refCurRate} onChange={setRefCurRate} suffix="%" step={0.1} />
                <Field label="New bank rate %" value={refNewRate} onChange={setRefNewRate} suffix="%" step={0.1} />
                <Field label="Remaining tenure" value={refYears} onChange={setRefYears} suffix="yrs" step={1} />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-7" title="Refinance savings & break-even analysis" subtitle="Includes CBUAE early settlement penalty, DLD 0.25% re-registration & bank valuation">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#0b1a33] text-white">
                <div className="text-[11px] uppercase tracking-wider text-[#dcc8a2]">Monthly EMI savings</div>
                <div className="font-display text-[22px] font-semibold mt-1"><AnimatedNumber value={refRes.monthlySavings} format={v => aed(v)} /></div>
                <div className="text-[11px] text-white/70 mt-1">{aed(refRes.currentEmi)} → {aed(refRes.newEmi)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Break-even period</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1">{Number.isFinite(refRes.breakEvenMonths) ? `${refRes.breakEvenMonths.toFixed(1)} mos` : '—'}</div>
                <div className="text-[11px] text-muted mt-1">Switch cost: {aed(refRes.totalSwitchCost)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e7e1d4]">
                <div className="text-[11px] uppercase tracking-wider text-muted">Lifetime net savings</div>
                <div className="font-display text-[22px] font-semibold text-ink mt-1"><AnimatedNumber value={refRes.lifetimeNetSavings} format={v => aed(v)} /></div>
                <div className="text-[11px] text-muted mt-1">Over {refYears} remaining years</div>
              </div>
            </div>
            <div className="bg-[#faf7f1] rounded-2xl p-4 border border-[#e7e1d4]">
              <div className="swk-kv"><span>CBUAE Early Settlement Penalty (1% capped at AED 10,000 + 5% VAT)</span><b>{aed(refRes.earlySettlementPenalty)}</b></div>
              <div className="swk-kv"><span>DLD Mortgage Release + New Registration (0.25% + admin)</span><b>{aed(refRes.dldMortgageSwitchFee)}</b></div>
              <div className="swk-kv"><span>New Bank Valuation Fee (incl. VAT)</span><b>{aed(refRes.valuationFee)}</b></div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* ============================================================ 17. AI & UTILITY STUDIO PRO */}
      {active === 'studio' && (
        <Reveal>
          <Card title="SWK ONE Premium AI & Utility Studio (17 Suites · 33 AI Tasks)" subtitle="Cloud AI (33 tasks), Local Qwen 3.5 Ollama, Photo Resize & Watermark, PDF Suite Pro, OCR, Contract Review, QR & vCard 3.0, Area & 15-Currency FX, WhatsApp Formatter, Smart Legal Docs, UAE IBAN/EID/goAML Validator, CSV/JSON/vCard Studio, Voice Notes & UTM Builder">
            <OneUtilityStudio />
          </Card>
        </Reveal>
      )}

      <p className="text-xs text-muted text-center m-0">
        Indicative calculations based on DLD, RERA, CBUAE and FTA schedules. Verify final trustee, bank and developer NOC figures prior to issuing client quotes.
      </p>
    </div>
  )
}
