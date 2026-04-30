export default function NotesArtifact({ notes, highlightedId, onHighlight }) {
  const activeSection = notes.outline.find((item) => item.id === highlightedId) || notes.outline[0];

  return (
    <div className="artifact-stack">
      <section className="artifact-band notes-layout">
        <div className="outline-nav">
          {notes.outline.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`outline-link ${highlightedId === item.id ? 'is-highlighted' : ''}`}
              onClick={() => onHighlight(item.id)}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {activeSection ? (
          <div className="note-section-detail">
            <div className="band-header">
              <h3>{activeSection.title}</h3>
              <p>{notes.summary}</p>
            </div>
            <ul className="clean-list emphasis-list">
              {activeSection.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="artifact-band">
        <div className="band-header">
          <h3>Key themes</h3>
          <p>Fast scan before revision.</p>
        </div>
        <div className="tag-cloud">
          {notes.keyThemes.map((theme) => (
            <span key={theme} className="meta-pill">
              {theme}
            </span>
          ))}
        </div>
      </section>

      <section className="artifact-band two-up">
        <div>
          <div className="band-header">
            <h3>Flashcards</h3>
            <p>Turn these into spaced repetition prompts.</p>
          </div>
          <div className="stacked-cards">
            {notes.flashcards.map((card) => (
              <article key={card.front} className="mini-card">
                <strong>{card.front}</strong>
                <p>{card.back}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="band-header">
            <h3>Quiz checks</h3>
            <p>Use active recall before reopening the source.</p>
          </div>
          <div className="stacked-cards">
            {notes.quiz.map((item) => (
              <article key={item.question} className="mini-card">
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="artifact-band">
        <div className="band-header">
          <h3>Next study moves</h3>
          <p>Athena keeps this short on purpose.</p>
        </div>
        <ul className="cadence-list">
          {notes.actionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

