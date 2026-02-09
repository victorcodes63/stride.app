'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calculator, DollarSign, TrendingUp, Info, AlertCircle } from 'lucide-react';

export default function GrossSalaryCalculator() {
  const [netPay, setNetPay] = useState<string>('');
  const [nonCashBenefits, setNonCashBenefits] = useState<string>('');
  const [housingValue, setHousingValue] = useState<string>('');
  const [rentPaid, setRentPaid] = useState<string>('');
  const [ignoreFirst5000, setIgnoreFirst5000] = useState<boolean>(true);
  const [deductTierII, setDeductTierII] = useState<boolean>(true);
  const [deductSHIF, setDeductSHIF] = useState<boolean>(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState<boolean>(true);
  
  const [results, setResults] = useState({
    grossPay: 0,
    paye: 0,
    shif: 0,
    nssfTierI: 0,
    nssfTierII: 0,
    housingLevy: 0,
    netPayCalculated: 0
  });

  // Tax brackets for 2025 (Kenya)
  const taxBrackets = [
    { min: 0, max: 288000, rate: 0.1 },
    { min: 288000, max: 388000, rate: 0.25 },
    { min: 388000, max: 6000000, rate: 0.3 },
    { min: 6000000, max: Infinity, rate: 0.35 }
  ];

  const calculateGrossSalary = () => {
    const netPayValue = parseFloat(netPay) || 0;
    const nonCashBenefitsValue = parseFloat(nonCashBenefits) || 0;
    const housingValueAmount = parseFloat(housingValue) || 0;
    const rentPaidAmount = parseFloat(rentPaid) || 0;

    // Calculate taxable benefits
    let taxableBenefits = nonCashBenefitsValue;
    if (ignoreFirst5000 && taxableBenefits > 5000) {
      taxableBenefits = taxableBenefits - 5000;
    }

    // Calculate housing benefit
    const housingBenefit = Math.max(0, housingValueAmount - rentPaidAmount);
    taxableBenefits += housingBenefit;

    // Start with net pay and work backwards
    let grossPay = netPayValue;
    
    // Add back deductions in reverse order
    if (deductHousingLevy) {
      grossPay = grossPay / 0.985; // Housing levy is 1.5%
    }
    
    if (deductSHIF) {
      grossPay = grossPay / 0.9725; // SHIF is 2.75%
    }
    
    if (deductTierII) {
      grossPay = grossPay / 0.97; // NSSF Tier II is 3%
    }
    
    // Add NSSF Tier I (6% of gross pay)
    const nssfTierI = grossPay * 0.06;
    grossPay += nssfTierI;
    
    // Add taxable benefits
    grossPay += taxableBenefits;
    
    // Calculate PAYE
    let paye = 0;
    let remainingIncome = grossPay;
    
    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      if (taxableInThisBracket > 0) {
        paye += taxableInThisBracket * bracket.rate;
        remainingIncome -= taxableInThisBracket;
      }
    }

    // Calculate other deductions
    const shif = deductSHIF ? grossPay * 0.0275 : 0;
    const nssfTierII = deductTierII ? grossPay * 0.03 : 0;
    const housingLevy = deductHousingLevy ? grossPay * 0.015 : 0;
    const nssfTierIAmount = grossPay * 0.06;

    // Calculate final net pay
    const netPayCalculated = grossPay - paye - shif - nssfTierIAmount - nssfTierII - housingLevy;

    setResults({
      grossPay: Math.round(grossPay),
      paye: Math.round(paye),
      shif: Math.round(shif),
      nssfTierI: Math.round(nssfTierIAmount),
      nssfTierII: Math.round(nssfTierII),
      housingLevy: Math.round(housingLevy),
      netPayCalculated: Math.round(netPayCalculated)
    });
  };

  useEffect(() => {
    if (netPay) {
      calculateGrossSalary();
    }
  }, [netPay, nonCashBenefits, housingValue, rentPaid, ignoreFirst5000, deductTierII, deductSHIF, deductHousingLevy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage: 'url(/images/hero/Reception_comp.webp)'
            }}
          />
          <div className="absolute inset-0 bg-white/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
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
              Salary Calculator
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              Gross Salary Calculator
              <span className="block text-secondary-500">Kenya 2025</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              Calculate your gross salary from net pay with accurate tax deductions, 
              NSSF, SHIF, and housing levy calculations for Kenya.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Input Form */}
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
                  {/* Net Pay */}
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

                  {/* Non-Cash Benefits */}
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

                  {/* Housing Value */}
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

                  {/* Rent Paid */}
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

                  {/* Options */}
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
                          checked={deductTierII}
                          onChange={(e) => setDeductTierII(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Deduct Tier II NSSF (3%)</span>
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

              {/* Results */}
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
                      <div className="flex justify-between">
                        <span className="text-neutral-700">PAYE:</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(results.paye)}</span>
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

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-neutral-700">
                      <p className="font-semibold mb-1 text-primary-900">Calculation Note:</p>
                      <p>This calculator uses current Kenya tax rates for 2025. Results are estimates and may vary based on specific circumstances.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
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
                Our HR experts can help you with comprehensive payroll management, 
                tax compliance, and employee benefits administration.
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
