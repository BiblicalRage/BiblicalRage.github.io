import React, { useState } from 'react';

// Document categories for better organization
const DOCUMENT_CATEGORIES = {
  PERSONAL: 'Personal & Identification',
  INCOME: 'Income & Employment',
  ASSETS: 'Assets',
  DEBTS: 'Debts & Credit',
  PROPERTY: 'Property Specific'
};

// Document consent modal component
const DocumentConsentModal = ({ visible, onAccept, onDecline, documentName }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-semibold text-[#0077b6] mb-4">Document Sharing Consent</h3>
        <p className="mb-4 text-slate-700">You are about to share <strong className="text-[#0077b6]">{documentName}</strong>. By proceeding, you consent to:</p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-slate-600">
          <li>Share this document with selected professionals</li>
          <li>Allow temporary access for review purposes</li>
          <li>Receive confirmation of document access</li>
        </ul>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onDecline}
            className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition font-medium"
          >
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="px-6 py-2.5 bg-[#0077b6] text-white rounded-lg hover:bg-[#005f93] transition font-medium shadow-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

// DocumentsScreen component receives props from App.jsx
const DocumentsScreen = ({ uploadedDocuments, handleFileUpload, handleRemoveDocument, handleDownloadDocuments, isLoading, documentConsent, setDocumentConsent }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setShowConsentModal(true);
  };

  const handleConsentAccept = () => {
    setDocumentConsent(prev => ({
      ...prev,
      [selectedDocument.name]: true
    }));
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    setDocumentConsent(prev => ({
      ...prev,
      [selectedDocument.name]: false
    }));
    setShowConsentModal(false);
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? uploadedDocuments 
    : uploadedDocuments.filter(doc => doc.category === selectedCategory);

  return (
    <div className="flex-grow flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-[#0077b6] mb-3 text-center">Documents Required</h1>
        <p className="text-base text-slate-600 mb-8 text-center">Having these documents ready can significantly speed up your mortgage application process.</p>

        {/* Document Upload Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0077b6] mb-4 text-center">Your Secure Document Vault</h2>
          <p className="text-slate-600 mb-6 text-center">Upload personal documents (e.g., pay stubs, bank statements, tax returns). You can download them as a zip or, with your explicit consent, share them with a connected lender later.</p>

          <div className="mb-6">
            <label htmlFor="documentUpload" className="block text-base text-slate-700 font-medium mb-2">Upload Your Documents:</label>
            <div className="relative">
              <input
                type="file"
                id="documentUpload"
                multiple
                onChange={handleFileUpload}
                className="w-full text-slate-700 bg-slate-50 border border-slate-300 rounded-lg p-4 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-[#E0F7FA] file:text-[#0077b6] hover:file:bg-[#CFEEF2]
                         focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {uploadedDocuments.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Your Uploaded Documents</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077b6] bg-white"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3">
                {filteredDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-[#0077b6]/20 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-700 font-medium">{doc.name}</span>
                      <span className="text-sm text-slate-500">({(doc.size / 1024).toFixed(2)} KB)</span>
                      {documentConsent[doc.name] && (
                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                          Sharing Enabled
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleDocumentSelect(doc)}
                        className="text-[#0077b6] hover:text-[#005f93] text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-[#E0F7FA] transition duration-200"
                      >
                        {documentConsent[doc.name] ? 'Update Consent' : 'Enable Sharing'}
                      </button>
                      <button
                        onClick={() => handleRemoveDocument(doc.name)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={handleDownloadDocuments}
                  className="w-full py-3.5 bg-[#0077b6] hover:bg-[#005f93] text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <span>Download All Documents (Zip File)</span>
                  )}
                </button>
                
                <p className="text-sm text-slate-600 text-center">
                  Documents marked with "Sharing Enabled" will be included when connecting with professionals.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Document Consent Modal */}
        <DocumentConsentModal
          visible={showConsentModal}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
          documentName={selectedDocument?.name}
        />

        {/* Documents Required Checklist */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0077b6] mb-6 text-center">Required Documents Checklist</h2>
          <div className="space-y-6">
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, title]) => (
              <div key={key} className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0077b6] mb-4">{title}</h3>
                <ul className="space-y-2 text-slate-700">
                  {getDocumentsForCategory(key).map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#0077b6] mr-2">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get documents for each category
const getDocumentsForCategory = (category) => {
  const documents = {
    PERSONAL: [
      "Government-issued photo ID (Driver's License, Passport)",
      "Social Security Card",
      "Current address history for the past 2 years"
    ],
    INCOME: [
      "Pay stubs (most recent 30-60 days)",
      "W-2 forms (past two years)",
      "Federal Tax Returns (past two years, all schedules)",
      "For Self-Employed: Business Tax Returns and YTD P&L Statement",
      "Proof of other income (bonuses, commissions, pension, etc.)"
    ],
    ASSETS: [
      "Bank statements (checking, savings – all pages, past 2-3 months)",
      "Investment account statements (401K, IRA, brokerage accounts)",
      "Gift letters (if applicable)",
      "Proof of earnest money deposit"
    ],
    DEBTS: [
      "Credit report (pulled by the lender)",
      "Statements for all existing debts",
      "Letters of explanation for unusual activity"
    ],
    PROPERTY: [
      "Fully executed Purchase Agreement/Sales Contract",
      "Appraisal report",
      "Homeowners Insurance (HOI) quote or policy",
      "Title Commitment"
    ]
  };
  return documents[category] || [];
};

export default DocumentsScreen;
