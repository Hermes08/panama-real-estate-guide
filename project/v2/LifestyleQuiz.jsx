function LifestyleQuiz() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    timeline: null,
    lifestyle: null,
    budget: null,
  });
  const [results, setResults] = React.useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 0) setStep(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [step]);

  React.useEffect(() => {
    const handleLifestyleFilter = (event) => {
      if (event.detail && event.detail.lifestyle) {
        setAnswers((prev) => ({
          ...prev,
          lifestyle: event.detail.lifestyle,
        }));
        setStep(2);
      }
    };

    window.addEventListener('v2-lifestyle-filter', handleLifestyleFilter);
    return () =>
      window.removeEventListener('v2-lifestyle-filter', handleLifestyleFilter);
  }, []);

  const handleAnswer = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));

    if (question === 'timeline') setStep(2);
    if (question === 'lifestyle') setStep(3);
    if (question === 'budget') {
      const filtered = filterProjects({
        ...answers,
        [question]: value,
      });
      setResults(filtered);
      setStep(4);
    }
  };

  const filterProjects = (answers) => {
    if (!window.PANAMA_DATA || !window.PANAMA_DATA.projects) return [];

    let candidates = window.PANAMA_DATA.projects;

    // Filter by lifestyle (location/region match)
    if (answers.lifestyle) {
      const lifestyleMap = {
        city: ['Casco Viejo', 'Panama City', 'Panamá'],
        beach: ['Bocas', 'Coronado', 'San Blas', 'Boquete'],
        mountain: ['Boquete', 'Volcan', 'highlands'],
      };

      const regions = lifestyleMap[answers.lifestyle] || [];
      candidates = candidates.filter((p) =>
        regions.some(
          (r) =>
            (p.location && p.location.toLowerCase().includes(r.toLowerCase())) ||
            (p.region && p.region.toLowerCase().includes(r.toLowerCase()))
        )
      );
    }

    // Filter by budget (priceFrom match)
    if (answers.budget) {
      const budgetMap = {
        '200_400': { min: 200000, max: 400000 },
        '400_700': { min: 400000, max: 700000 },
        '700_1200': { min: 700000, max: 1200000 },
        '1200_plus': { min: 1200000, max: Infinity },
      };

      const range = budgetMap[answers.budget];
      if (range) {
        candidates = candidates.filter((p) => {
          const priceFrom = parseInt(p.priceFrom, 10);
          return !isNaN(priceFrom) && priceFrom >= range.min && priceFrom <= range.max;
        });
      }
    }

    // If no exact matches, relax and show closest
    if (candidates.length === 0 && answers.lifestyle) {
      candidates = window.PANAMA_DATA.projects.slice(0, 3);
    } else if (candidates.length > 3) {
      candidates = candidates.slice(0, 3);
    }

    return candidates;
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const restart = () => {
    setStep(1);
    setAnswers({ timeline: null, lifestyle: null, budget: null });
    setResults(null);
  };

  const styles = `
    .lifestyle-quiz {
      font-family: var(--font-display, 'Fraunces', Georgia, serif-apple-system, sans-serif);
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: var(--cream, #FFF9EC);
      border: 1px solid var(--paper, #FFFDF5);
      border-radius: 12px;
    }

    .quiz-header {
      margin-bottom: 2rem;
      animation: revealContent 0.6s ease-out;
    }

    .quiz-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--ink, #0B2733);
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.5px;
    }

    .quiz-header p {
      font-size: 16px;
      color: var(--ink, #0B2733);
      opacity: 0.7;
      margin: 0;
      font-family: var(--font-serif, serif);
    }

    .quiz-step {
      animation: fadeIn 0.5s ease-out;
    }

    .step-intro {
      text-align: center;
      padding: 2rem 0;
    }

    .step-intro p {
      font-size: 18px;
      font-weight: 500;
      color: var(--ink, #0B2733);
      margin: 0;
    }

    .step-question {
      margin-bottom: 2rem;
    }

    .step-question h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--ink, #0B2733);
      margin: 0 0 1.5rem 0;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .options-grid.four-col {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 720px) {
      .options-grid.four-col {
        grid-template-columns: 1fr 1fr;
      }
    }

    .option-button {
      padding: 1rem;
      border: 2px solid var(--paper, #FFFDF5);
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--ink, #0B2733);
      transition: all 0.2s ease;
      font-family: var(--font-display, 'Fraunces', Georgia, serif-apple-system, sans-serif);
    }

    .option-button:hover {
      border-color: var(--coral, #FF6B4A);
      background: rgba(212, 101, 93, 0.05);
    }

    .option-button.selected {
      border-color: var(--coral, #FF6B4A);
      background: var(--coral, #FF6B4A);
      color: white;
    }

    .results-container {
      animation: fadeIn 0.6s ease-out;
    }

    .results-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .results-header h3 {
      font-size: 22px;
      font-weight: 600;
      color: var(--ink, #0B2733);
      margin: 0 0 0.5rem 0;
    }

    .results-header p {
      font-size: 14px;
      color: var(--ink, #0B2733);
      opacity: 0.7;
      margin: 0;
      font-family: var(--font-serif, serif);
    }

    .project-card {
      padding: 1.5rem;
      border: 1px solid var(--paper, #FFFDF5);
      border-radius: 8px;
      margin-bottom: 1rem;
      background: white;
      transition: all 0.2s ease;
    }

    .project-card:hover {
      border-color: var(--coral, #FF6B4A);
      box-shadow: 0 4px 12px rgba(212, 101, 93, 0.1);
    }

    .project-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--ink, #0B2733);
      margin: 0 0 0.5rem 0;
    }

    .project-location {
      font-size: 14px;
      color: var(--ink, #0B2733);
      opacity: 0.7;
      margin: 0 0 0.75rem 0;
      font-family: var(--font-serif, serif);
    }

    .project-price {
      font-size: 16px;
      font-weight: 600;
      color: var(--coral, #FF6B4A);
      margin: 0 0 0.75rem 0;
      font-family: var(--font-mono, monospace);
    }

    .project-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(212, 101, 93, 0.1);
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--coral, #FF6B4A);
      margin-bottom: 0.75rem;
    }

    .project-disclaimer {
      font-size: 11px;
      color: var(--ink, #0B2733);
      opacity: 0.6;
      margin: 0.75rem 0 1rem 0;
      font-style: italic;
      font-family: var(--font-serif, serif);
    }

    .project-link {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: var(--coral, #FF6B4A);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .project-link:hover {
      background: #c5584f;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: center;
    }

    @media (max-width: 480px) {
      .button-group {
        flex-direction: column;
      }
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-display, 'Fraunces', Georgia, serif-apple-system, sans-serif);
    }

    .btn-primary {
      background: var(--coral, #FF6B4A);
      color: white;
    }

    .btn-primary:hover {
      background: #c5584f;
    }

    .btn-secondary {
      background: var(--paper, #FFFDF5);
      color: var(--ink, #0B2733);
    }

    .btn-secondary:hover {
      background: #dac7b0;
    }

    @keyframes revealContent {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .lifestyle-quiz {
        padding: 1.5rem;
        margin: 1rem;
      }

      .quiz-header h2 {
        font-size: 24px;
      }

      .step-question h3 {
        font-size: 18px;
      }

      .option-button {
        padding: 0.875rem;
        font-size: 13px;
      }

      .project-card {
        padding: 1rem;
      }

      .project-name {
        font-size: 16px;
      }
    }
  `;

  return (
    <div className="lifestyle-quiz">
      <style>{styles}</style>

      {step === 0 && (
        <div className="quiz-step step-intro">
          <p>Finding your perfect Panama lifestyle...</p>
        </div>
      )}

      {step === 1 && (
        <div className="quiz-step">
          <div className="quiz-header">
            <h2>When?</h2>
            <p>What's your timeline to move?</p>
          </div>
          <div className="step-question">
            <div className="options-grid">
              <button
                className={`option-button ${
                  answers.timeline === 'near' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('timeline', 'near')}
              >
                Soon (within 6 months)
              </button>
              <button
                className={`option-button ${
                  answers.timeline === 'mid' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('timeline', 'mid')}
              >
                Within 1-2 years
              </button>
              <button
                className={`option-button ${
                  answers.timeline === 'far' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('timeline', 'far')}
              >
                Just exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="quiz-step">
          <div className="quiz-header">
            <h2>Where?</h2>
            <p>What lifestyle calls to you?</p>
          </div>
          <div className="step-question">
            <div className="options-grid">
              <button
                className={`option-button ${
                  answers.lifestyle === 'city' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('lifestyle', 'city')}
              >
                City Energy
              </button>
              <button
                className={`option-button ${
                  answers.lifestyle === 'beach' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('lifestyle', 'beach')}
              >
                Beach Vibes
              </button>
              <button
                className={`option-button ${
                  answers.lifestyle === 'mountain' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('lifestyle', 'mountain')}
              >
                Mountain Peace
              </button>
            </div>
          </div>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={goBack}>
              Back
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="quiz-step">
          <div className="quiz-header">
            <h2>Budget?</h2>
            <p>What's your investment range? (USD)</p>
          </div>
          <div className="step-question">
            <div className="options-grid four-col">
              <button
                className={`option-button ${
                  answers.budget === '200_400' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('budget', '200_400')}
              >
                $200–400K
              </button>
              <button
                className={`option-button ${
                  answers.budget === '400_700' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('budget', '400_700')}
              >
                $400–700K
              </button>
              <button
                className={`option-button ${
                  answers.budget === '700_1200' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('budget', '700_1200')}
              >
                $700K–1.2M
              </button>
              <button
                className={`option-button ${
                  answers.budget === '1200_plus' ? 'selected' : ''
                }`}
                onClick={() => handleAnswer('budget', '1200_plus')}
              >
                $1.2M+
              </button>
            </div>
          </div>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={goBack}>
              Back
            </button>
          )}
        </div>
      )}

      {step === 4 && results && (
        <div className="quiz-step results-container">
          <div className="results-header">
            <h3>Your matches</h3>
            <p>Curated projects for your lifestyle</p>
          </div>

          {results.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-name">{project.name}</div>
              <div className="project-location">
                {project.location || project.region || 'Panama'}
              </div>
              <div className="project-price">
                ${parseInt(project.priceFrom, 10).toLocaleString()} USD+
              </div>
              {project.status && (
                <div className="project-status">{project.status}</div>
              )}
              <div className="project-disclaimer">
                *Precios inversor sujeto a disponibilidad
              </div>
              <a
                href={project.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                View project
              </a>
              <a
                href="#book-consultation"
                className="project-link"
                style={{ marginLeft: '0.5rem' }}
              >
                Send to inbox + book call
              </a>
            </div>
          ))}

          <div className="button-group">
            <button className="btn btn-primary" onClick={restart}>
              Restart quiz
            </button>
          </div>
        </div>
      )}

      {step === 4 && (!results || results.length === 0) && (
        <div className="quiz-step results-container">
          <div className="results-header">
            <h3>No direct matches</h3>
            <p>Let's find you the right fit</p>
          </div>
          <button className="btn btn-primary" onClick={restart}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
