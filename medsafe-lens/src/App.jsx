import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
    setResult(null);
  };

  const analyzePrescription = async () => {
    if (!file) {
      alert("Please select a prescription file first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();

    // IMPORTANT:
    // This name must match FastAPI:
    // uploaded_file: UploadFile = File(...)
    formData.append("uploaded_file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-prescription",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data);
    } catch (error) {
      console.error("Backend Error:", error);

      setResult({
        error:
          "Backend connection failed. Please make sure FastAPI is running on port 8000.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-8 py-5">
          <h1 className="text-2xl font-bold">
            🩺 MedSafe Lens
          </h1>

          <p className="text-sm text-slate-400">
            Medication Safety & Reconciliation
          </p>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-8 py-16">

        {/* HERO */}
        <div className="text-center">

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Medication Safety Assistant
          </span>

          <h2 className="mt-6 text-5xl font-bold">
            Check Your Prescription
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Upload a prescription and MedSafe Lens will extract
            medicines, detect duplicate medicines, and identify
            potential medication conflicts.
          </p>

        </div>

        {/* UPLOAD CARD */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-8">

          <label className="mb-3 block text-sm font-medium">
            Upload Prescription
          </label>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

          {/* SELECTED FILE */}
          {file && (
            <div className="mt-4 rounded-lg bg-slate-800 p-4">
              <p className="text-sm text-green-400">
                ✓ File selected
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {file.name}
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={analyzePrescription}
            disabled={!file || loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing Prescription..." : "Analyze Prescription"}
          </button>

        </div>

        {/* ERROR */}
        {result?.error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-red-800 bg-red-950/30 p-4 text-red-300">
            ❌ {result.error}
          </div>
        )}

        {/* RESULTS */}
        {result && !result.error && (

          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-8">

            <h3 className="text-2xl font-bold">
              📋 Analysis Result
            </h3>

            <p className="mt-2 text-sm text-green-400">
              ✓ Prescription analyzed successfully
            </p>

            {/* MEDICINES */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-blue-400">
                💊 Medicines Detected
              </h4>

              {result.medicines?.length > 0 ? (

                <div className="mt-4 flex flex-wrap gap-3">

                  {result.medicines.map((medicine, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-800 px-4 py-2 text-sm"
                    >
                      {medicine}
                    </span>
                  ))}

                </div>

              ) : (

                <p className="mt-3 text-slate-400">
                  No medicines detected.
                </p>

              )}

            </div>

            {/* DUPLICATES */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-yellow-400">
                ⚠️ Duplicate Medicines
              </h4>

              {result.duplicate_medicines?.length === 0 ? (

                <p className="mt-3 text-green-400">
                  ✓ No duplicate medicines detected.
                </p>

              ) : (

                <div className="mt-3 space-y-2">

                  {result.duplicate_medicines.map(
                    (medicine, index) => (
                      <p
                        key={index}
                        className="text-yellow-400"
                      >
                        ⚠️ {medicine}
                      </p>
                    )
                  )}

                </div>

              )}

            </div>

            {/* INTERACTIONS */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-red-400">
                🚨 Potential Interactions
              </h4>

              {result.interactions?.length === 0 ? (

                <div className="mt-3 rounded-lg bg-green-950/30 p-4">
                  <p className="text-green-400">
                    ✓ No potential interactions found in the
                    current demo dataset.
                  </p>
                </div>

              ) : (

                <div className="mt-4 space-y-4">

                  {result.interactions.map(
                    (interaction, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-red-900 bg-red-950/30 p-5"
                      >

                        <p className="text-lg font-semibold">
                          {interaction.drug1} +{" "}
                          {interaction.drug2}
                        </p>

                        <p className="mt-2 text-sm text-red-300">
                          ⚠️ {interaction.severity}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {interaction.message}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* EXTRACTED TEXT */}
            <div className="mt-8">

              <details className="rounded-lg bg-slate-800 p-4">

                <summary className="cursor-pointer font-semibold">
                  📄 View Extracted Prescription Text
                </summary>

                <pre className="mt-4 whitespace-pre-wrap text-sm text-slate-400">
                  {result.extracted_text}
                </pre>

              </details>

            </div>

          </div>

        )}

        {/* DISCLAIMER */}
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-slate-800 bg-slate-900/50 p-5 text-center">

          <p className="text-xs leading-6 text-slate-500">
            MedSafe Lens is a decision-support tool and does not
            replace a doctor or pharmacist. Potential medication
            interactions should be reviewed by a qualified
            healthcare professional.
          </p>

        </div>

      </main>

    </div>
  );
}

export default App;