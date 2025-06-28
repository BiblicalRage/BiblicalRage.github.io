import React from 'react';

const DocumentsScreen = ({
  uploadedDocuments,
  handleFileUpload,
  handleRemoveDocument,
  handleDownloadDocuments,
  isLoading,
  documentConsent,
  setDocumentConsent,
  user,
  requireLogin
}) => {
  const requiredDocuments = [
    {
      category: "PERSONAL",
      title: "Personal Identification",
      items: [
        "Government-issued photo ID (Driver's License or Passport)",
        "Social Security Card",
        "Birth Certificate"
      ]
    },
    {
      category: "INCOME",
      title: "Income Verification",
      items: [
        "Last 2 years of W-2s",
        "Last 2 years of tax returns",
        "Last 30 days of pay stubs",
        "Proof of additional income (if applicable)"
      ]
    },
    {
      category: "ASSETS",
      title: "Asset Documentation",
      items: [
        "Last 2 months of bank statements",
        "Investment account statements",
        "Retirement account statements",
        "Gift letter (if using gift funds)"
      ]
    },
    {
      category: "DEBTS",
      title: "Debt Information",
      items: [
        "Credit card statements",
        "Auto loan statements",
        "Student loan statements",
        "Other debt obligations"
      ]
    },
    {
      category: "PROPERTY",
      title: "Property Information",
      items: [
        "Purchase agreement (if under contract)",
        "Homeowners insurance quote",
        "Property tax information"
      ]
    }
  ];

  // Wrapper for file upload that checks login
  const handleFileInputChange = (e) => {
    if (!user) {
      // Ask for login, and after login, re-trigger file input
      requireLogin(() => {
        // After login, re-open file dialog
        document.getElementById('file-upload-input')?.click();
      });
      e.target.value = null; // Reset file input
      return;
    }
    handleFileUpload(e);
  };

  return (
    <div className="section flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Document Management</h1>
      <p className="mb-8 text-center max-w-2xl">
        Upload and manage your documents securely.<br />
        <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Your information is always private and secure.</span>
      </p>

      <div className="card w-full max-w-lg mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Required Documents</h2>
        <div className="space-y-6">
          {requiredDocuments.map((category, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{category.title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-slate-700">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card w-full max-w-lg bg-white/90 rounded-2xl shadow-md border border-slate-200 p-8 mb-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">Upload Documents</h2>
        <div className="flex flex-col items-center w-full">
          {user ? (
            <>
              <input
                id="file-upload-input"
                type="file"
                onChange={handleFileInputChange}
                className="input mb-4"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {uploadedDocuments.length > 0 && (
                <button
                  onClick={handleDownloadDocuments}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Download All Documents'}
                </button>
              )}
            </>
          ) : (
            <>
              <input
                id="file-upload-input"
                type="file"
                className="input mb-4 opacity-50 cursor-not-allowed rounded-xl"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled
              />
              <div className="w-full flex flex-col items-center my-6">
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition text-base"
                  onClick={() => requireLogin()}
                >
                  Log in to upload or download documents
                </button>
              </div>
            </>
          )}
        </div>
        <div className="border-t border-slate-200 my-6 w-full"></div>
        <h2 className="text-xl font-bold mb-4 text-center">Uploaded Documents</h2>
        {uploadedDocuments.length === 0 ? (
          <p className="text-center text-slate-400 italic">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {uploadedDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <span className="px-2 py-1 bg-slate-200 rounded-full">{doc.category}</span>
                    <span>{Math.round(doc.size / 1024)} KB</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={documentConsent[doc.name] || false}
                      onChange={(e) => setDocumentConsent(prev => ({
                        ...prev,
                        [doc.name]: e.target.checked
                      }))}
                      className="h-4 w-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm">Share</span>
                  </label>
                  <button
                    onClick={() => handleRemoveDocument(doc.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsScreen; 