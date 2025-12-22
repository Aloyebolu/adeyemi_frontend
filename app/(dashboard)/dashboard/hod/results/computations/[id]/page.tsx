// app/master-sheet/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Download, Printer, AlertCircle, ChevronDown, Eye, FileText, X } from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';

export default function MasterSheetPage() {
  const params = useParams();
  const id = params.id as string;
  const initialLevel = params.level as string || '100';
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel);
  const [availableLevels, setAvailableLevels] = useState<string[]>(['100', '200', '300', '400', '500']);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(240); // Default sidebar width
  
  const { fetchData } = useDataFetcher();

  // Detect sidebar width on mount
  useEffect(() => {
    const detectSidebar = () => {
      const sidebar = document.querySelector('aside, nav, [role="navigation"]');
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        setSidebarWidth(width);
      }
    };

    // Run after a small delay to ensure DOM is loaded
    setTimeout(detectSidebar, 100);
    window.addEventListener('resize', detectSidebar);
    
    return () => window.removeEventListener('resize', detectSidebar);
  }, []);

  // Fetch master sheet HTML from backend
  useEffect(() => {
    if (!id) return;

    const fetchMasterSheet = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Construct the path with id and level
        const pathWithLevel = `computation/summary/${id}/${selectedLevel}`;
        
        const response = await fetchData<string>(
          pathWithLevel as any,
          "GET",
          undefined,
          {
            returnFullResponse: true,
            headers: {
              'Accept': 'text/html',
            },
            cache: 'no-store',
            retries: 1,
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            await fetchAvailableLevels();
            throw new Error(`Level ${selectedLevel} not found.`);
          }
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        setHtmlContent(html);
        
        injectPrintStyles();
        
      } catch (err) {
        console.error('Error fetching master sheet:', err);
        setError(err instanceof Error ? err.message : 'Failed to load master sheet');
      } finally {
        setLoading(false);
      }
    };

    fetchMasterSheet();
  }, [id, selectedLevel]);

  // Fetch available levels for this computation
  const fetchAvailableLevels = async () => {
    try {
      const response = await fetchData<{levels: string[]}>(
        `computation/levels/${id}` as any,
        "GET",
        undefined,
        {
          cache: 'force-cache',
        }
      );
      
      if (response.data?.levels) {
        setAvailableLevels(response.data.levels);
      }
    } catch (err) {
      console.log('Could not fetch available levels, using defaults');
    }
  };

  // Handle level change
  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setIsLevelSelectorOpen(false);
    const newUrl = `./${id}/${level}`;
    window.history.pushState({}, '', newUrl);
  };

  // Inject custom styles to hide UI elements during print
  const injectPrintStyles = () => {
    const style = document.createElement('style');
    style.id = 'master-sheet-print-styles';
    style.textContent = `
      @media print {
        body > *:not(#master-sheet-container) {
          display: none !important;
        }
        
        #master-sheet-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          overflow: visible !important;
        }
        
        @page {
          size: A4 landscape !important;
          margin: 10mm 15mm 15mm 15mm !important;
        }
      }
    `;
    
    const existingStyle = document.getElementById('master-sheet-print-styles');
    if (existingStyle) existingStyle.remove();
    
    document.head.appendChild(style);
  };

  // Handle print functionality
  const handlePrint = () => {
    setIsPrinting(true);
    
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to print the document');
      setIsPrinting(false);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Master Sheet - ${id} - Level ${selectedLevel}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm 15mm 15mm 15mm;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: "Times New Roman", serif;
            font-size: 12pt;
            line-height: 1.3;
            color: #000;
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
            background-color: #fff;
          }
          
          @media print {
            .no-print { display: none !important; }
            .force-page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      
      printWindow.onafterprint = () => {
        printWindow.close();
        setIsPrinting(false);
      };
      
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
          setIsPrinting(false);
        }
      }, 5000);
    };
  };

  // Handle direct PDF download
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/master-sheet/${id}/${selectedLevel}/pdf`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `master-sheet-${id}-level-${selectedLevel}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        handlePrint();
      }
    } catch (err) {
      console.error('PDF download failed, falling back to print:', err);
      handlePrint();
    }
  };

  // Close level selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.level-selector')) {
        setIsLevelSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Master Sheet</h2>
          <p className="text-gray-500 mt-2">ID: {id} | Level: {selectedLevel}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Master Sheet</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Document ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code></p>
            <p className="text-sm text-gray-500">Selected Level: <code className="bg-gray-100 px-2 py-1 rounded">{selectedLevel}</code></p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main container with proper layout */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Master Sheet Viewer</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
            <span>Computation ID:</span>
            <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
            <span className="mx-2">•</span>
            <span>Academic Level:</span>
            <span className="font-medium text-blue-600">Level {selectedLevel}</span>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Level Selector */}
            <div className="level-selector flex-1 min-w-[200px] max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Academic Level
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsLevelSelectorOpen(!isLevelSelectorOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Level {selectedLevel}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLevelSelectorOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLevelSelectorOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Select Level</span>
                      <button
                        onClick={() => setIsLevelSelectorOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    {availableLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelChange(level)}
                        className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${selectedLevel === level ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                      >
                        Level {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPrinting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4" />
                )}
                {isPrinting ? 'Preparing...' : 'Print/PDF'}
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isPrinting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Print Warning */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                For best printing results, use the &quot;Print&quot; button above. Browser&apos;s print may not format correctly.
              </p>
            </div>
          </div>
        </div>

        {/* Master Sheet Content Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div id="master-sheet-container" className="p-0 m-0 overflow-x-auto">
            {htmlContent ? (
              <div 
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="master-sheet-content"
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No content available for Level {selectedLevel}</p>
                <p className="text-sm text-gray-400 mt-2">Try selecting a different level</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Master Sheet • Computation ID: {id} • Level {selectedLevel}</p>
          <p className="mt-1">URL format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/master-sheet/{id}/{selectedLevel}</code></p>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        /* Hide UI elements when printing */
        @media print {
          body > *:not(#master-sheet-container) {
            display: none !important;
          }
          
          #master-sheet-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          
          .master-sheet-content {
            width: 100% !important;
            height: 100% !important;
          }
        }
        
        /* Screen styles */
        @media screen {
          /* Adjust container padding based on sidebar */
          .container {
            transition: padding-left 0.3s ease;
          }
          
          @media (max-width: 1024px) {
            .container {
              padding-left: 1rem !important;
            }
          }
          
          #master-sheet-container {
            max-width: 100%;
            overflow-x: auto;
            min-height: 400px;
          }
          
          .master-sheet-content {
            background: white;
            margin: 0 auto;
            transform-origin: top left;
            min-width: 800px;
          }
          
          /* Scale for better viewing on screen */
          .master-sheet-content table {
            transform: scale(0.9);
            transform-origin: top left;
            width: 111.11%;
          }
          
          /* Ensure level selector dropdown has proper z-index */
          .level-selector .absolute {
            z-index: 50;
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .container {
              padding: 1rem !important;
            }
            
            .master-sheet-content table {
              transform: scale(0.8);
            }
          }
        }
      `}</style>
    </>
  );
}