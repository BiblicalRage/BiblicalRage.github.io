import React from 'react';

const ChevronIcon = ({ expanded }) => (
  <svg
    className={`transition-transform duration-200 ml-2 ${expanded ? 'rotate-180' : ''}`}
    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ minWidth: 24 }}
  >
    <path d="M8 10l4 4 4-4" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinimalHeader = ({ title, expanded, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-t-lg focus:outline-none group border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
    style={{ border: 'none', boxShadow: 'none', fontWeight: 600, fontSize: '1.05rem', color: '#374151' }}
  >
    <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-200">{title}</span>
    <ChevronIcon expanded={expanded} />
  </button>
);

const MinimalCard = ({ title, expanded, onClick, children }) => (
  <div className="w-full max-w-2xl mx-auto mb-6 rounded-lg shadow-sm bg-white overflow-hidden border border-slate-200 hover:shadow-md transition-all duration-200">
    <MinimalHeader title={title} expanded={expanded} onClick={onClick} />
    <div
      className={`transition-all duration-300 ${expanded ? 'max-h-[4000px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}
      style={{ overflow: 'hidden' }}
    >
      {expanded && <div className="text-slate-700 text-base leading-relaxed">{children}</div>}
    </div>
  </div>
);

const SectionHeading = ({ children }) => (
  <div className="w-full max-w-2xl mx-auto mb-6">
    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-1">{children}</h2>
      <div className="w-12 h-0.5 bg-slate-300 rounded-full mx-auto"></div>
    </div>
  </div>
);

const SectionDivider = () => (
  <div className="w-full max-w-2xl mx-auto my-8">
    <div className="flex items-center">
      <div className="flex-1 h-px bg-slate-200"></div>
      <div className="mx-4 w-2 h-2 bg-slate-300 rounded-full"></div>
      <div className="flex-1 h-px bg-slate-200"></div>
    </div>
  </div>
);

const EconomicIndicatorItem = ({ title, source, link, update, description }) => (
  <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200">
    <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
    <div className="text-sm text-slate-600 space-y-1">
      <p><strong>Source:</strong> {source}</p>
      {link && (
        <p>
          <strong>Link:</strong> 
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline ml-1 transition-colors duration-200"
          >
            View Data
          </a>
        </p>
      )}
      <p><strong>Update Schedule:</strong> {update}</p>
      {description && <p className="mt-2 text-slate-700">{description}</p>}
    </div>
  </div>
);

const Mortgage101Screen = ({
  whatIsMortgageExpanded, setWhatIsMortgageExpanded,
  interestRatesExpanded, setInterestRatesExpanded,
  closingCostsExpanded, setClosingCostsExpanded,
  escrowExpanded, setEscrowExpanded,
  preApprovalExpanded, setPreApprovalExpanded,
  fixedVsAdjustableExpanded, setFixedVsAdjustableExpanded,
  creditExpanded, setCreditExpanded,
  downPaymentExpanded, setDownPaymentExpanded,
  debtReductionExpanded, setDebtReductionExpanded,
  incomeOptimizationExpanded, setIncomeOptimizationExpanded,
  financialFaqExpanded, setFinancialFaqExpanded,
  searchFaqExpanded, setSearchFaqExpanded,
  offerFaqExpanded, setOfferFaqExpanded,
  longTermFaqExpanded, setLongTermFaqExpanded,
  economicIndicatorsExpanded, setEconomicIndicatorsExpanded,
}) => (
  <div className="section flex flex-col items-center">
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-slate-800">
        Mortgage 101
      </h1>
      <div className="w-16 h-0.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
      <p className="max-w-2xl text-slate-600 text-base leading-relaxed">
        Learn the basics of mortgages and home buying.<br />
        <span className="text-slate-700 font-medium">Your journey to homeownership starts here.</span>
      </p>
    </div>

    {/* Key Economic Indicators & Market Data */}
    <SectionHeading>Factors That Affect Interest Rates</SectionHeading>
    <MinimalCard title="Economic Indicators & Where to Find Their Updates" expanded={economicIndicatorsExpanded} onClick={() => setEconomicIndicatorsExpanded(!economicIndicatorsExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700 mb-4">
          Understanding key economic indicators can help you make informed decisions about when to buy a home. Here are the most important indicators and where to find current data:
        </p>
        
        <h4 className="font-semibold text-slate-800 text-lg mb-3">Inflation Data</h4>
        <EconomicIndicatorItem
          title="Consumer Price Index (CPI)"
          source="U.S. Bureau of Labor Statistics (BLS)"
          link="https://www.bls.gov/cpi/"
          update="Typically released between the 10th and 13th of each month, at 8:30 AM ET, covering data for the previous month."
          description="Measures changes in the price level of a basket of consumer goods and services purchased by households."
        />
        <EconomicIndicatorItem
          title="Personal Consumption Expenditures (PCE) Price Index"
          source="U.S. Bureau of Economic Analysis (BEA)"
          link="https://www.bea.gov/data/personal-consumption-expenditures-price-index"
          update="Generally released towards the end of each month, at 8:30 AM ET, covering data from the previous month."
          description="The Federal Reserve's preferred measure of inflation, considered more comprehensive than CPI."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Federal Reserve Policy</h4>
        <EconomicIndicatorItem
          title="Federal Reserve Policy & Commentary"
          source="Board of Governors of the Federal Reserve System"
          link="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
          update="FOMC meetings occur 8 times per year (approximately every 6-8 weeks). Statements are released immediately after meetings, minutes are released ~3 weeks later."
          description="Federal Reserve decisions directly impact mortgage rates through changes in the federal funds rate."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Treasury Yields</h4>
        <EconomicIndicatorItem
          title="U.S. Treasury Yields (10-year Treasury Note)"
          source="U.S. Department of the Treasury"
          link="https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield"
          update="Daily on business days, typically updated by 3:30 PM ET."
          description="The 10-year Treasury yield is closely correlated with 30-year fixed mortgage rates."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Jobs & Labor Market</h4>
        <EconomicIndicatorItem
          title="Jobs & Labor Market Reports (Non-Farm Payrolls, Unemployment Rate, Wage Growth)"
          source="U.S. Bureau of Labor Statistics (BLS) - 'The Employment Situation'"
          link="https://www.bls.gov/news.release/empsit.nr0.htm"
          update="Released on the first Friday of each month, at 8:30 AM ET, detailing the jobs and unemployment situation for the prior month."
          description="Strong employment data can lead to higher mortgage rates as it suggests economic strength and potential inflation."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Consumer Confidence & Spending</h4>
        <EconomicIndicatorItem
          title="Consumer Confidence Index"
          source="The Conference Board"
          link="https://www.conference-board.org/topics/consumer-confidence"
          update="Typically released towards the end of each month, at 10:00 AM ET."
          description="Measures consumer sentiment about current and future economic conditions, which can influence housing demand."
        />
        <EconomicIndicatorItem
          title="Retail Sales"
          source="U.S. Census Bureau"
          link="https://www.census.gov/retail/index.html"
          update="Released around the middle of each month (around the 15th to the 18th), at 8:30 AM ET, reporting on sales from the previous month."
          description="Indicates consumer spending strength, which affects overall economic health and mortgage rates."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Manufacturing & Services</h4>
        <EconomicIndicatorItem
          title="ISM Manufacturing PMI & ISM Services PMI"
          source="Institute for Supply Management (ISM)"
          link="https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/"
          update="ISM Manufacturing PMI on the first business day of each month; ISM Services PMI on the third business day of each month. Both at 10:00 AM ET."
          description="Measures economic activity in manufacturing and services sectors, with readings above 50 indicating expansion."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Housing Market Data</h4>
        <EconomicIndicatorItem
          title="Housing Starts & Building Permits"
          source="U.S. Census Bureau (New Residential Construction)"
          link="https://www.census.gov/construction/nrc/"
          update="Released around the middle of each month (typically between the 16th and 19th), at 8:30 AM ET, for the prior month's activity."
          description="Indicates future housing supply and construction activity, which affects home prices and availability."
        />
        <EconomicIndicatorItem
          title="Existing Home Sales"
          source="National Association of Realtors (NAR)"
          link="https://www.nar.realtor/research-and-statistics/research-reports/existing-home-sales"
          update="Typically comes out around the 20th to 24th of each month, at 10:00 AM ET, covering sales from the previous month."
          description="Shows current housing market activity and can indicate market strength or weakness."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Commodity Prices</h4>
        <EconomicIndicatorItem
          title="Oil Prices & Energy Data"
          source="U.S. Energy Information Administration (EIA)"
          link="https://www.eia.gov/petroleum/"
          update="Daily during market trading hours. EIA reports often weekly or monthly depending on the specific data."
          description="Energy prices can influence inflation expectations and overall economic activity."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Yield Curve</h4>
        <EconomicIndicatorItem
          title="Yield Curve Shape"
          source="U.S. Department of the Treasury"
          link="https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield"
          update="Effectively daily, based on the underlying Treasury yield data."
          description="The relationship between short-term and long-term interest rates can indicate economic expectations and potential recession risks."
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h5>
          <p className="text-blue-700 text-sm">
            Set up calendar reminders for key economic releases, especially the jobs report (first Friday of each month) and Federal Reserve meetings. 
            These events often cause significant movements in mortgage rates.
          </p>
        </div>
      </div>
    </MinimalCard>

    <SectionDivider />

    {/* First-Time Homebuyer Questions (FAQ) */}
    <SectionHeading>First-Time Homebuyer Questions (FAQ): Your Comprehensive Guide to Homeownership</SectionHeading>
    <MinimalCard title="I. Financial Foundations & Loan Eligibility" expanded={financialFaqExpanded} onClick={() => setFinancialFaqExpanded(!financialFaqExpanded)}>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 mb-3">How much money do I really need to buy a home, beyond the down payment?</h4>
          <p className="text-slate-700 mb-3">
            Beyond your down payment, you'll need funds for closing costs and often for reserves.
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Closing Costs</h5>
              <p className="text-slate-700 text-sm">
                These are fees and expenses paid at the close of the transaction, typically ranging from 2% to 5% of the loan amount. They cover items like lender fees (origination, underwriting), third-party services (appraisal, title insurance, attorney fees), and prepaid expenses (initial property taxes, homeowner's insurance premiums, prepaid interest). These are distinct from your down payment.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Reserves</h5>
              <p className="text-slate-700 text-sm">
                Many loan programs and lenders require you to have a certain amount of liquid funds remaining in your bank account after closing, typically measured in months of your proposed Principal, Interest, Taxes, and Insurance (PITI) payment. This demonstrates your ability to cover housing expenses in case of unexpected financial challenges. The amount required varies based on credit score, DTI, loan-to-value (LTV), and property type (e.g., multi-family properties often require more reserves).
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Other Initial Expenses</h5>
              <p className="text-slate-700 text-sm">
                Budget for movers, initial home repairs or renovations, and new furnishings. While not loan-related, these are practical financial considerations for new homeowners.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-3">Can I use gift funds for my down payment or closing costs? If so, what are the rules?</h4>
          <p className="text-slate-700 mb-3">
            Yes, you can generally use gift funds for your down payment and, in some cases, for closing costs, but strict rules apply depending on the loan program:
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Source of Funds</h5>
              <p className="text-slate-700 text-sm">
                Gift funds must come from an eligible donor, typically a relative (e.g., spouse, child, parent, grandparent, sibling) or sometimes a domestic partner or fiancé. The donor cannot be someone with an interest in the transaction (like the seller, real estate agent, or builder).
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">No Repayment Required</h5>
              <p className="text-slate-700 text-sm">
                The gift must truly be a "gift" with no expectation of repayment. The donor will typically sign a gift letter stating this, along with their name, relationship to you, the amount of the gift, and the date of the transfer.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Documentation</h5>
              <p className="text-slate-700 text-sm">
                Lenders will require documentation from the donor, including their bank statements to show the source of the funds and proof of the transfer into your account. Large, undocumented deposits ("large deposits") into your bank account can raise red flags for underwriters if they appear within 60-90 days of your application, so it's always best to have gift funds documented and transferred well in advance.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Minimum Borrower Contribution</h5>
              <p className="text-slate-700 text-sm">
                Some loan programs may require a small minimum contribution from your own funds, even if gift funds are available. For example, for conventional loans with less than 20% down on a single-family home, all the down payment can be a gift. However, for a 2-4 unit conventional property, you might need 5% of the down payment to come from your own funds. FHA and VA loans are generally more flexible with gift funds.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-3">What's the difference between "pre-qualification" and "pre-approval," and which do I need?</h4>
          <p className="text-slate-700 mb-3">
            These terms are often used interchangeably, but there's a significant difference in their rigor and value:
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Pre-Qualification</h5>
              <p className="text-slate-700 text-sm">
                This is a preliminary, informal assessment of your borrowing power. It's typically based on basic financial information you provide verbally or via a simple online form, without verification. The lender estimates how much you might qualify for. It's a quick estimate but carries little weight in a competitive market.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Pre-Approval</h5>
              <p className="text-slate-700 text-sm">
                This is a much more robust and formal process. A lender actually reviews and verifies your financial documents (pay stubs, W-2s, bank statements, credit report) to determine your maximum loan amount. They issue a pre-approval letter, a conditional commitment to lend, specifying the loan amount.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Which You Need</h5>
              <p className="text-slate-700 text-sm">
                You need a pre-approval. In today's competitive housing market, a strong pre-approval letter is essential. It shows sellers you are a serious, qualified buyer whose financing is likely to go through, making your offer more appealing. It also clarifies your budget, preventing you from looking at homes outside your affordable range.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MinimalCard>

    <SectionDivider />

    {/* Mortgage Basics */}
    <SectionHeading>Mortgage Basics: Understanding Your Home Loan Foundation</SectionHeading>
    <MinimalCard title="What is a Mortgage? (The Anatomy of Your Home Loan)" expanded={whatIsMortgageExpanded} onClick={() => setWhatIsMortgageExpanded(!whatIsMortgageExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          A mortgage is fundamentally a loan secured by real estate – specifically, the home you are purchasing. It's comprised of two key legal documents:
        </p>
        
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">The Promissory Note</h5>
            <p className="text-slate-700 text-sm">
              This is your legally binding promise to repay the borrowed amount, detailing the terms of repayment, interest rate, and consequences of default.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">The Mortgage (or Deed of Trust)</h5>
            <p className="text-slate-700 text-sm">
              This document pledges the property itself as collateral for the loan. If you fail to meet your repayment obligations (default), this legal instrument grants the lender the right to take possession of the property (foreclosure) to recover their funds.
            </p>
          </div>
        </div>
        
        <p className="text-slate-700">
          Mortgages are typically structured with repayment terms ranging from 15 to 30 years, often referred to as the amortization period. The interest rate applied to the loan can be either fixed (unchanging throughout the loan term) or adjustable (periodically reset based on market conditions).
        </p>
        
        <p className="text-slate-700">
          It's crucial to understand that while "mortgage" is a general term, specific loan programs exist, such as Conventional (backed by Fannie Mae or Freddie Mac), FHA (Federal Housing Administration), VA (Department of Veterans Affairs), and USDA loans, each with unique requirements and benefits.
        </p>
      </div>
    </MinimalCard>
    
    <MinimalCard title="Interest Rates Explained (The True Cost of Borrowing)" expanded={interestRatesExpanded} onClick={() => setInterestRatesExpanded(!interestRatesExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          The interest rate is the percentage charged by the lender for the privilege of borrowing money. It is the primary factor influencing both your monthly loan payment and the total amount you will repay over the loan's lifetime.
        </p>
        
        <p className="text-slate-700">
          It's important to distinguish between:
        </p>
        
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Nominal Interest Rate</h5>
            <p className="text-slate-700 text-sm">
              The stated rate on your loan, used to calculate your monthly Principal & Interest (P&I) payment.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Annual Percentage Rate (APR)</h5>
            <p className="text-slate-700 text-sm">
              This provides a more comprehensive measure of the total cost of your loan. It includes the nominal interest rate plus certain other upfront fees and costs (like origination fees, discount points, and mortgage insurance premiums) converted into an annualized percentage. The APR is designed to help consumers compare the true cost of different loan offers.
            </p>
          </div>
        </div>
        
        <p className="text-slate-700">
          Several factors influence the interest rate you're offered, including broader economic conditions (like Federal Reserve policy and the bond market), your individual financial profile (credit score, Debt-to-Income ratio, Loan-to-Value ratio), and the specific type of loan you choose.
        </p>
        
        <p className="text-slate-700">
          Lenders may also offer "points" – a fee paid upfront, typically 1% of the loan amount per point, which can either reduce (discount points) or increase (origination points) your interest rate.
        </p>
      </div>
    </MinimalCard>
    
    <MinimalCard title="Understanding Closing Costs (The Essential Transaction Fees)" expanded={closingCostsExpanded} onClick={() => setClosingCostsExpanded(!closingCostsExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          Closing costs are a collection of fees and expenses beyond the actual purchase price of the property and your down payment, which are paid at the conclusion of a real estate transaction. They represent the various services required to process and close your loan and transfer property ownership legally.
        </p>
        
        <p className="text-slate-700">
          These costs typically range from 2% to 5% of the loan amount but can vary significantly based on state regulations, local taxes, lender fees, and the specific loan product.
        </p>
        
        <h5 className="font-semibold text-slate-800 mt-4 mb-2">Common categories of closing costs include:</h5>
        
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Lender Fees</h6>
            <p className="text-slate-700 text-sm">
              Origination fees, underwriting fees, application fees, discount points.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Third-Party Fees</h6>
            <p className="text-slate-700 text-sm">
              Appraisal fees, credit report fees, title search and insurance, attorney fees, survey fees, recording fees.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Prepaids/Escrow Setup</h6>
            <p className="text-slate-700 text-sm">
              Initial deposits for property taxes and homeowner's insurance (often held in an escrow account, discussed below), and prepaid interest.
            </p>
          </div>
        </div>
        
        <p className="text-slate-700">
          You will receive a Loan Estimate shortly after applying for a mortgage, detailing your estimated closing costs. A few days before closing, you'll receive a Closing Disclosure, which provides the final, confirmed list of all charges. Reviewing these documents meticulously is crucial.
        </p>
      </div>
    </MinimalCard>
    
    <MinimalCard title="What is Escrow? (Protecting Funds and Managing Property Bills)" expanded={escrowExpanded} onClick={() => setEscrowExpanded(!escrowExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          The term "escrow" refers to a neutral third party that holds funds and documents on behalf of the buyer and seller (or borrower and lender) to ensure all conditions of a transaction are met before completion. It's used in two primary contexts in real estate:
        </p>
        
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Escrow for Closing (Closing Escrow)</h5>
            <p className="text-slate-700 text-sm">
              During the home-buying process, an escrow agent (often a title company or attorney) holds important documents (like the deed) and funds (like your earnest money deposit) until all contingencies of the sale agreement are satisfied and the transaction can be finalized. This ensures a fair and secure transfer of ownership.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Escrow for Ongoing Property Expenses (Impound Account)</h5>
            <p className="text-slate-700 text-sm">
              After your loan closes, your mortgage lender may establish an "escrow account" (also known as an impound account). This account is where a portion of your monthly mortgage payment is specifically set aside by the lender to cover your future property taxes and homeowner's insurance premiums when they become due. This arrangement mitigates risk for the lender by ensuring these crucial payments are made on time, protecting their collateral. If you have Private Mortgage Insurance (PMI) or FHA Mortgage Insurance Premium (MIP), these costs are also typically collected and managed via this escrow account.
            </p>
          </div>
        </div>
      </div>
    </MinimalCard>
    
    <MinimalCard title="The Importance of Pre-Approval (Validating Your Buying Power)" expanded={preApprovalExpanded} onClick={() => setPreApprovalExpanded(!preApprovalExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          Pre-approval is a critical preliminary step in the home buying process where a mortgage lender evaluates your financial information and provides a conditional commitment outlining how much money you are qualified to borrow. It is more robust than a simple "pre-qualification" (which is often just a quick estimate based on verbal information) because it involves a review of your actual financial documentation.
        </p>
        
        <h5 className="font-semibold text-slate-800 mt-4 mb-2">Obtaining a pre-approval is crucial for several reasons:</h5>
        
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Establishes Your Budget</h6>
            <p className="text-slate-700 text-sm">
              It clearly defines your maximum affordable loan amount, allowing you to focus your home search within a realistic price range.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Shows Seriousness to Sellers</h6>
            <p className="text-slate-700 text-sm">
              When making an offer, having a pre-approval letter demonstrates to sellers that you are a serious and qualified buyer, making your offer more competitive.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Speeds Up the Process</h6>
            <p className="text-slate-700 text-sm">
              By completing much of the financial vetting upfront, pre-approval can expedite the subsequent steps of the loan application once you find a home.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-800 mb-2">Uncovers Potential Issues</h6>
            <p className="text-slate-700 text-sm">
              It helps identify any financial areas needing attention (e.g., credit discrepancies, DTI concerns) before you're deep into a transaction.
            </p>
          </div>
        </div>
        
        <p className="text-slate-700">
          During pre-approval, lenders typically review documentation such as pay stubs, W-2s, tax returns, and bank statements to verify your income, assets, and debts.
        </p>
      </div>
    </MinimalCard>
    
    <MinimalCard title="Fixed vs. Adjustable Rate Mortgages (Stability vs. Adaptability)" expanded={fixedVsAdjustableExpanded} onClick={() => setFixedVsAdjustableExpanded(!fixedVsAdjustableExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700">
          These are the two fundamental types of interest rate structures for mortgage loans, each offering distinct advantages and risks:
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-3">Fixed-Rate Mortgage (FRM)</h5>
            
            <div className="space-y-2">
              <div>
                <h6 className="font-semibold text-slate-700">Predictability</h6>
                <p className="text-slate-700 text-sm">
                  The interest rate remains constant for the entire duration of the loan term (e.g., 15 or 30 years).
                </p>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Stable Payments</h6>
                <p className="text-slate-700 text-sm">
                  Your Principal & Interest (P&I) payment will never change, offering predictable budgeting and protection against rising interest rates.
                </p>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Best For</h6>
                <p className="text-slate-700 text-sm">
                  Borrowers who plan to stay in their home for many years, prefer payment stability, or when current interest rates are low and expected to rise.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-3">Adjustable-Rate Mortgage (ARM)</h5>
            
            <div className="space-y-2">
              <div>
                <h6 className="font-semibold text-slate-700">Initial Period</h6>
                <p className="text-slate-700 text-sm">
                  ARMs begin with a fixed interest rate for an introductory period, typically 3, 5, 7, or 10 years (e.g., a "5/1 ARM" means fixed for 5 years, then adjusts annually).
                </p>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Adjustable Period</h6>
                <p className="text-slate-700 text-sm">
                  After the initial fixed period, the interest rate will adjust periodically (e.g., annually) based on a specific market index (like SOFR – Secured Overnight Financing Rate) plus a fixed margin set by the lender.
                </p>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Caps</h6>
                <p className="text-slate-700 text-sm">
                  ARMs have limits on how much the interest rate can change:
                </p>
                <ul className="text-slate-700 text-sm ml-4 mt-1 space-y-1">
                  <li><strong>Initial Adjustment Cap:</strong> Limits the first adjustment after the fixed period.</li>
                  <li><strong>Periodic Adjustment Cap:</strong> Limits how much the rate can change in any subsequent adjustment period.</li>
                  <li><strong>Lifetime Cap:</strong> The maximum the interest rate can ever go up over the life of the loan.</li>
                </ul>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Flexibility</h6>
                <p className="text-slate-700 text-sm">
                  ARMs typically offer a lower interest rate during the initial fixed period compared to a 30-year fixed-rate mortgage.
                </p>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-700">Best For</h6>
                <p className="text-slate-700 text-sm">
                  Borrowers who plan to sell or refinance before the fixed period ends, those who anticipate their income will increase, or in a declining interest rate environment. They involve more risk due to payment uncertainty after the initial fixed period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MinimalCard>

    <SectionDivider />

    {/* Second-Time Homebuyer Questions (FAQ) */}
    <SectionHeading>Second-Time Homebuyer Questions (FAQ): Understanding the Home Search and Property's Impact on Your Loan</SectionHeading>
    <MinimalCard title="II. The Home Search & Property's Impact on Your Loan" expanded={searchFaqExpanded} onClick={() => setSearchFaqExpanded(!searchFaqExpanded)}>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 mb-3">How does the type of property I choose (e.g., single-family, condo, multi-family) affect my mortgage options and requirements?</h4>
          <p className="text-slate-700 mb-3">
            The type of property significantly influences the available mortgage programs, down payment requirements, interest rates, and approval criteria:
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Single-Family Homes</h5>
              <p className="text-slate-700 text-sm">
                These are typically the most straightforward to finance, with the widest range of loan options (Conventional, FHA, VA, USDA). Down payment requirements can be as low as 3-3.5% depending on the program.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Condominiums</h5>
              <p className="text-slate-700 text-sm">
                Financing condos can be more complex. Lenders evaluate not just your financial profile but also the financial health and characteristics of the entire condo complex. The Homeowners Association (HOA) must often meet specific lender approval guidelines (e.g., owner-occupancy rates, litigation, budget stability) for conventional financing. FHA and VA loans also have specific condo approval lists. Down payment requirements might be higher if the complex isn't fully "approved."
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Multi-Family Homes (2-4 Units)</h5>
              <p className="text-slate-700 text-sm">
                You can often finance a 2-4 unit property with a residential mortgage if you plan to live in one of the units (owner-occupied). However, down payment requirements are usually higher (e.g., 5% to 15%+ for conventional, 3.5% for FHA), and lenders will scrutinize rental income projections and may require more cash reserves. The property's income-generating potential becomes part of the underwriting analysis.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Other Property Types</h5>
              <p className="text-slate-700 text-sm">
                These often have specialized loan programs or stricter requirements, as they carry different risks for lenders.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-3">What should I understand about property taxes and homeowner's insurance when looking at different areas?</h4>
          <p className="text-slate-700 mb-3">
            Property taxes and homeowner's insurance are crucial ongoing costs that directly impact your total monthly mortgage payment (as part of PITI) and, therefore, your Debt-to-Income (DTI) ratio and affordability.
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Property Taxes</h5>
              <p className="text-slate-700 text-sm">
                These are levied by local governments (county, city, school district, etc.) based on the assessed value of the property. Rates vary significantly by state, county, city, and even within different school districts of the same city. A higher property tax rate or higher assessed value means a higher monthly tax payment. You must factor these into your budget for any home you consider, as they can add hundreds or even thousands of dollars to your monthly housing expense.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Homeowner's Insurance (HOI)</h5>
              <p className="text-slate-700 text-sm">
                This policy protects your home and belongings against perils like fire, theft, and natural disasters. Like property taxes, HOI premiums vary widely based on location (e.g., coastal areas, tornado alley), the age and construction of the home, its replacement cost, and your chosen coverage. High-risk areas (e.g., flood zones, wildfire zones) may require additional insurance (like flood insurance) which adds to the cost.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Impact on DTI</h5>
              <p className="text-slate-700 text-sm">
                Both property taxes and HOI are mandatory components of your monthly housing payment used in DTI calculations. Even if you qualify for a specific loan amount, high taxes or insurance in a particular area can push your total housing payment beyond your affordable limits or DTI thresholds. Always research these costs for any specific property you are considering.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-3">What is a home appraisal, and how does it affect my loan amount and approval?</h4>
          <p className="text-slate-700 mb-3">
            A home appraisal is an independent, professional assessment of a property's market value, conducted by a licensed appraiser on behalf of the mortgage lender. Its purpose is to ensure that the value of the home supports the loan amount being requested.
          </p>
          
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Lender's Perspective</h5>
              <p className="text-slate-700 text-sm">
                The home serves as collateral for your loan. Lenders want to ensure that if you were to default, they could sell the property for at least the amount of the loan. Therefore, they will typically only lend up to the appraised value of the home, regardless of the agreed-upon purchase price.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Impact on Loan Amount</h5>
              <p className="text-slate-700 text-sm">
                If the appraisal comes in lower than the agreed-upon purchase price, it creates an "appraisal gap." In this scenario, the lender will base your loan amount on the lower appraised value. This means you would need to: negotiate with the seller to lower the price, bring additional cash to closing to cover the difference between the appraised value and the purchase price, or walk away from the deal (if your contract has an appraisal contingency).
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-2">Approval Condition</h5>
              <p className="text-slate-700 text-sm">
                The appraisal is a crucial contingency for almost all mortgage loans. Your loan approval is conditional upon the property appraising at a value sufficient to justify the loan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MinimalCard>
  </div>
);

export default Mortgage101Screen;
