function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

export default function CollectionsArtifact({ items, onRemove }) {
  const grouped = items.reduce((accumulator, item) => {
    const key = item.type || 'other';
    return {
      ...accumulator,
      [key]: [...(accumulator[key] || []), item]
    };
  }, {});

  return (
    <div className="artifact-stack">
      {Object.entries(grouped).map(([group, entries]) => (
        <section key={group} className="artifact-band">
          <div className="band-header">
            <h3>{group}</h3>
            <p>{entries.length} saved artifact{entries.length > 1 ? 's' : ''}</p>
          </div>

          <div className="collection-grid">
            {entries.map((item) => (
              <article key={item.id} className="collection-card">
                <div className="collection-topline">
                  <span className="meta-pill">{formatDate(item.savedAt)}</span>
                  <button type="button" className="secondary-link" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </div>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
                <div className="tag-cloud">
                  {(item.tags || []).map((tag) => (
                    <span key={tag} className="meta-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

