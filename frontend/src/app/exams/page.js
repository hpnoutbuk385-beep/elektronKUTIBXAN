"use client";
import { useState } from "react";

export default function QuizInterface() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Result
  const [answers, setAnswers] = useState({});
  
  const sampleQuiz = {
    title: "Badiiy adabiyot bilimdoni",
    questions: [
      { id: 1, text: "'O'tkan kunlar' asari muallifi kim?", options: ["Hamza", "Abdulla Qodiriy", "Cho'lpon", "Oybek"], correct: 1 },
      { id: 2, text: "Kumushbibi qaysi shaharli bo'lgan?", options: ["Toshkent", "Marg'ilon", "Qo'qon", "Xiva"], correct: 1 },
    ]
  };

  const handleSelect = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  return (
    <div className="quiz-container animate-fade">
      {currentStep === 0 && (
        <div className="quiz-start glass-panel flex-center flex-col">
          <div className="quiz-icon-large">📝</div>
          <h1>{sampleQuiz.title}</h1>
          <p className="subtitle">Ushbu testda 10 ta savol bor. O'tish bali: 70%</p>
          <div className="quiz-info-grid">
            <div className="info-item"><span>⏱ Davomiyligi:</span> <span>15 min</span></div>
            <div className="info-item"><span>🌟 Mukofot:</span> <span>+50 PTS</span></div>
          </div>
          <button className="btn-primary mt-20" onClick={() => setCurrentStep(1)}>Testni boshlash</button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="quiz-active glass-panel">
          <div className="quiz-header">
            <h3>{sampleQuiz.title}</h3>
            <div className="timer">14:52</div>
          </div>
          
          <div className="question-section">
            <span className="q-num">Savol {sampleQuiz.questions[0].id} / 10</span>
            <h2 className="q-text">{sampleQuiz.questions[0].text}</h2>
            
            <div className="options-grid">
              {sampleQuiz.questions[0].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  className={`option-btn ${answers[sampleQuiz.questions[0].id] === idx ? 'selected' : ''}`}
                  onClick={() => handleSelect(sampleQuiz.questions[0].id, idx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-footer">
            <button className="btn-outline">Keyingisi ➡️</button>
            <button className="btn-primary" onClick={() => setCurrentStep(2)}>Tugatish</button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="quiz-result glass-panel flex-center flex-col">
          <div className="result-circle">
            <span className="result-score">85%</span>
          </div>
          <h2>Muvaffaqiyatli o'tdingiz!</h2>
          <p className="subtitle">Siz 50 bilim balli qo'lga kiritdingiz.</p>
          <button className="btn-primary mt-20" onClick={() => window.location.href = "/"}>Dashboardga qaytish</button>
        </div>
      )}

      <style jsx>{`
        .quiz-container { max-width: 800px; margin: 0 auto; padding-top: 40px; }
        .quiz-start, .quiz-active, .quiz-result { padding: 50px; min-height: 500px; }
        .quiz-icon-large { font-size: 80px; margin-bottom: 20px; }
        
        .quiz-info-grid { 
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; 
          margin-top: 30px; width: 300px; font-size: 0.9rem;
        }
        .info-item { display: flex; justify-content: space-between; }

        .quiz-header { 
          display: flex; justify-content: space-between; align-items: center; 
          margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
        }
        .timer { font-weight: 800; color: var(--accent); font-size: 1.2rem; }

        .q-num { color: var(--primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }
        .q-text { margin: 15px 0 30px 0; font-size: 1.4rem; }

        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .option-btn { 
          padding: 20px; background: var(--glass); border: 1px solid var(--border); 
          border-radius: 12px; color: white; cursor: pointer; text-align: left;
          display: flex; gap: 15px; align-items: center; transition: 0.3s;
        }
        .option-btn:hover { background: rgba(255,255,255,0.08); border-color: var(--primary); }
        .option-btn.selected { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
        
        .opt-letter { font-weight: 800; opacity: 0.5; }

        .quiz-footer { margin-top: 50px; display: flex; justify-content: space-between; }
        .btn-outline { background: none; border: 1px solid var(--border); color: white; padding: 10px 25px; border-radius: 10px; cursor: pointer; }

        .result-circle { 
          width: 150px; height: 150px; border: 8px solid #10b981; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin-bottom: 30px;
        }
        .result-score { font-size: 2.5rem; font-weight: 800; color: #10b981; }

        .mt-20 { margin-top: 20px; }
        .flex-col { flex-direction: column; }
      `}</style>
    </div>
  );
}
