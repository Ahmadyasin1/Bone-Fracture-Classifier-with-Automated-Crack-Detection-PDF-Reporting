import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Upload, AlertCircle, Check, Loader2, Download } from 'lucide-react';
import { FloatingBone } from './components/FloatingBone';
import { ConfidenceDisplay } from './components/ConfidenceDisplay';
import { ResultsPanel } from './components/ResultsPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Team } from './pages/Team';
import { Auth } from './pages/Auth';
import { Subscription } from './pages/Subscription';
import { getCurrentUser, getUserSubscription, updateUserFreeAnalysis, saveAnalysisHistory } from './lib/supabase';

interface Report {
  timestamp: string;
  diagnosis: {
    prediction: string;
    confidence: number;
    severity: string;
  };
  fracture_analysis: {
    number_of_fractures: number;
    total_fracture_size: number;
    fracture_locations: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      size: number;
    }>;
  };
  recovery_estimation: {
    min_weeks: number;
    max_weeks: number;
    notes: string[];
  };
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [markedImage, setMarkedImage] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const userSubscription = await getUserSubscription(currentUser.id);
        setSubscription(userSubscription);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
      setMarkedImage(null);
      setReport(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
      setMarkedImage(null);
      setReport(null);
    }
  };

  const checkAnalysisPermission = async () => {
    if (!user) {
      throw new Error('Please sign in to analyze X-rays');
    }

    if (subscription?.status === 'active') {
      return true;
    }

    if (!user.user_metadata.free_analysis_used) {
      await updateUserFreeAnalysis(user.id);
      return true;
    }

    throw new Error('Please subscribe to analyze more X-rays');
  };


  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if user can perform analysis
      await checkAnalysisPermission();

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred during prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setMarkedImage('http://localhost:5000/static/uploads/marked_image.jpg');
      setReport(data.report || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const downloadReport = async () => {
    const pdf_path = 'http://localhost:5000/static/uploads/fracture_report.pdf';
    const a = document.createElement('a');
    a.href = pdf_path;
    a.download = 'fracture_report.pdf';
    a.click();
    a.remove();
    
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Header user={user} />
        
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/team" element={<Team />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/" element={
            <main className="flex-1 container mx-auto px-4 py-24">
              <FloatingBone />
              <div className="relative z-10">
                <header className="text-center mb-16">
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Bone Fracture Detection
                  </h1>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                    Advanced AI-powered analysis for precise bone fracture detection
                  </p>
                </header>

                <div className="max-w-4xl mx-auto">
                  {/* Upload Section */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-all
                      ${!selectedFile ? 'border-slate-600 hover:border-amber-400' : 'border-amber-400'}
                      ${!isLoading ? 'bg-slate-800/50' : 'bg-slate-800/80'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {!selectedFile ? (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-amber-400" />
                        <div>
                          <p className="text-lg mb-2">Drag and drop your X-ray image here</p>
                          <p className="text-sm text-slate-400">or</p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 rounded-full transition-colors"
                          >
                            Browse Files
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {preview && (
                          <img
                            src={preview}
                            alt="Selected X-ray"
                            className="max-h-64 mx-auto rounded-lg"
                          />
                        )}
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setPreview(null);
                              setPrediction(null);
                              setMarkedImage(null);
                              setReport(null);
                            }}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                          >
                            Remove
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              'Analyze Image'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg mb-8">
                      <AlertCircle className="w-5 h-5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Results Section */}
                  {prediction && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="bg-slate-800/50 rounded-xl p-8 border border-amber-400/20">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            {prediction === "Fracture" ? (
                              <AlertCircle className="w-8 h-8 text-red-400" />
                            ) : (
                              <Check className="w-8 h-8 text-green-400" />
                            )}
                            <h2 className="text-2xl font-bold">
                              {prediction === "Fracture"
                                ? "Fracture Detected"
                                : "No Fracture Detected"}
                            </h2>
                          </div>

                          {/* Show Download Report button only if there is a marked image */}
                          {prediction === "Fracture" && markedImage && (
                            <button
                              onClick={downloadReport}
                              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download Report
                            </button>
                          )}
                        </div>

                        <ConfidenceDisplay confidence={confidence} />

                        <ResultsPanel
                          prediction={prediction}
                          confidence={confidence}
                          markedImage={prediction === "Fracture" && markedImage ? markedImage : undefined}
                          report={report || undefined}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </main>
          } />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;