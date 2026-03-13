'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

/** Net calculator URL: enter take-home (net) → estimated gross (goal seek). */
export default function NetSalaryCalculator() {
  const [netPay, setNetPay] = useState<string>('');
  const [nonCashBenefits, setNonCashBenefits] = useState<string>('');
  const [allowableDeductions, setAllowableDeductions] = useState<string>('');
  const [housingValue, setHousingValue] = useState<string>('');
  const [rentPaid, setRentPaid] = useState<string>('');
  const [ignoreFirst5000, setIgnoreFirst5000] = useState<boolean>(false);
  const [deductTierI, setDeductTierI] = useState<boolean>(true);
  const [deductTierII, setDeductTierII] = useState<boolean>(true);
  const [deductSHIF, setDeductSHIF] = useState<boolean>(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState<boolean>(true);

  const [results, setResults] = useState({
    grossPay: 0,
    taxablePay: 0,
    paye: 0,
    shif: 0,
    nssfTierI: 0,
    nssfTierII: 0,
    housingLevy: 0,
    netPayCalculated: 0,
  });

  const PAYE_BRACKETS = [
    { max: 24_000, rate: 0.1 },
    { max: 32_333, rate: 0.25 },
    { max: 500_000, rate: 0.3 },
    { max: 800_000, rate: 0.325 },
    { max: Infinity, rate: 0.35 },
  ];
  const PERSONAL_RELIEF = 2_400;

  const calcNSSF = (gross: number) => {
    const pensionable = Math.min(gross, 108_000);
    const tierI = deductTierI ? Math.min(pensionable, 9_000) * 0.06 : 0;
    const tierII = deductTierII ? Math.max(0, Math.min(pensionable - 9_000, 99_000)) * 0.06 : 0;
    return { tierI: Math.round(tierI), tierII: Math.round(tierII) };
  };

  const calcDeductions = (gross: number, taxableBenefits: number, allowable: number) => {
    const totalTaxable = Math.max(0, gross + taxableBenefits - allowable);
    const nssf = calcNSSF(gross);
    const shif = deductSHIF ? gross * 0.0275 : 0;
    const housingLevy = deductHousingLevy ? gross * 0.015 : 0;
    const taxablePay = Math.max(0, totalTaxable - nssf.tierI - nssf.tierII - shif - housingLevy);
    let paye = 0,
      r = taxablePay,
      prev = 0;
    for (const b of PAYE_BRACKETS) {
      const band = Math.min(r, b.max - prev);
      if (band > 0) paye += band * b.rate;
      r -= band;
      prev = b.max;
    }
    paye = Math.max(0, paye - PERSONAL_RELIEF);
    return { paye, shif, nssf, housingLevy, taxablePay };
  };

  const calculateGrossSalary = () => {
    const netPayValue = parseFloat(String(netPay).replace(/,/g, '')) || 0;
    let taxableBenefits = parseFloat(String(nonCashBenefits).replace(/,/g, '')) || 0;
    if (ignoreFirst5000 && taxableBenefits > 5000) taxableBenefits -= 5000;
    taxableBenefits += Math.max(
      0,
      (parseFloat(String(housingValue).replace(/,/g, '')) || 0) -
        (parseFloat(String(rentPaid).replace(/,/g, '')) || 0)
    );
    const rent = parseFloat(String(rentPaid).replace(/,/g, '')) || 0;
    const allowable = parseFloat(String(allowableDeductions).replace(/,/g, '')) || 0;

    let gross = netPayValue + rent + netPayValue * 0.4;
    for (let i = 0; i < 40; i++) {
      const d = calcDeductions(gross, taxableBenefits, allowable);
      const totalDed = d.paye + d.shif + d.nssf.tierI + d.nssf.tierII + d.housingLevy + rent;
      const netCalc = gross - totalDed;
      if (Math.abs(netCalc - netPayValue) < 0.02) break;
      gross = gross + (netPayValue - netCalc);
      if (gross < netPayValue) gross = netPayValue + 1000;
    }

    const d = calcDeductions(gross, taxableBenefits, allowable);
    const totalDed = d.paye + d.shif + d.nssf.tierI + d.nssf.tierII + d.housingLevy + rent;
    const netPayCalculated = gross - totalDed;

    setResults({
      grossPay: Math.round(gross * 100) / 100,
      taxablePay: Math.round(d.taxablePay * 100) / 100,
      paye: Math.round(d.paye * 100) / 100,
      shif: Math.round(d.shif * 100) / 100,
      nssfTierI: d.nssf.tierI,
      nssfTierII: d.nssf.tierII,
      housingLevy: Math.round(d.housingLevy * 100) / 100,
      netPayCalculated: Math.round(netPayCalculated * 100) / 100,
    });
  };

  useEffect(() => {
    if (netPay) calculateGrossSalary();
  }, [
    netPay,
    nonCashBenefits,
    allowableDeductions,
    housingValue,
    rentPaid,
    ignoreFirst5000,
    deductTierI,
    deductTierII,
    deductSHIF,
    deductHousingLevy,
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatPaye = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-br from-neutral-50 to-white">
      <Navbar />

      <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{ backgroundImage: 'url(/images/hero/Reception_comp.webp)' }}
          />
          <div className="absolute inset-0 bg-white/70" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-900 rounded-full text-sm font-medium mb-6"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Net Salary Calculator
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              From net pay to gross salary
              <span className="block text-secondary-500">Kenya 2026</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              Enter your take-home (net) pay to estimate the gross salary needed, including PAYE, NSSF
              (Tier I & optional Tier II), SHIF, and housing levy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg"
              >
                <h2 className="text-2xl font-heading font-bold text-primary-900 mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 text-secondary-500" />
                  Enter Your Details
                </h2>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Net Pay (Ksh)
                    </label>
                    <input
                      type="number"
                      value={netPay}
                      onChange={(e) => setNetPay(e.target.value)}
                      placeholder="Enter your net salary"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Non-Cash Benefits (Ksh)
                    </label>
                    <input
                      type="number"
                      value={nonCashBenefits}
                      onChange={(e) => setNonCashBenefits(e.target.value)}
                      placeholder="Enter non-cash benefits"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Other Allowable Deductions e.g. Mortgage (Ksh)
                    </label>
                    <input
                      type="number"
                      value={allowableDeductions}
                      onChange={(e) => setAllowableDeductions(e.target.value)}
                      placeholder="e.g. mortgage, loan repayments"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Housing Value Provided (Ksh)
                    </label>
                    <input
                      type="number"
                      value={housingValue}
                      onChange={(e) => setHousingValue(e.target.value)}
                      placeholder="Enter housing value"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Rent Paid to Employer (Ksh)
                    </label>
                    <input
                      type="number"
                      value={rentPaid}
                      onChange={(e) => setRentPaid(e.target.value)}
                      placeholder="Enter rent paid"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary-900">Calculation Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={ignoreFirst5000}
                          onChange={(e) => setIgnoreFirst5000(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Ignore first Ksh 5,000 of benefits</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deductTierI}
                          onChange={(e) => setDeductTierI(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">
                          Deduct Tier I NSSF (6% of first 9k) — uncheck if you pay Tier I elsewhere
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deductTierII}
                          onChange={(e) => setDeductTierII(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">
                          Deduct Tier II NSSF (6% of next 99k) — uncheck if you pay Tier II elsewhere
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deductSHIF}
                          onChange={(e) => setDeductSHIF(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Deduct SHIF (2.75%)</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deductHousingLevy}
                          onChange={(e) => setDeductHousingLevy(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Deduct Housing Levy (1.5%)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg"
              >
                <h2 className="text-2xl font-heading font-bold mb-6 flex items-center text-primary-900">
                  <TrendingUp className="w-6 h-6 mr-3 text-secondary-500" />
                  Estimated Gross Pay Breakdown
                </h2>

                <div className="space-y-4">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900 font-semibold">Gross Pay:</span>
                      <span className="text-2xl font-bold text-secondary-500">
                        {formatCurrency(results.grossPay)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Taxable Pay:</span>
                        <span>{formatCurrency(results.taxablePay)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">PAYE (2 d.p.):</span>
                        <span className="font-semibold text-neutral-900 tabular-nums">
                          {formatPaye(results.paye)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">SHIF:</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(results.shif)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">NSSF Tier I:</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(results.nssfTierI)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">NSSF Tier II:</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(results.nssfTierII)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Housing Levy:</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(results.housingLevy)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900 font-semibold">Net Pay (Calculated):</span>
                      <span className="text-xl font-bold text-secondary-500">
                        {formatCurrency(results.netPayCalculated)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Need Professional HR Support?
              </h2>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                Our HR experts can help you with comprehensive payroll management, tax compliance, and employee
                benefits administration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-primary-900 text-white rounded-lg font-semibold text-lg hover:bg-primary-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get HR Consultation
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center px-8 py-4 border-2 border-primary-900 text-primary-900 rounded-lg font-semibold text-lg hover:bg-primary-900 hover:text-white transition-all duration-300"
                >
                  View Our Services
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
