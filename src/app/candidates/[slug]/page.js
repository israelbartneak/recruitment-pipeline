import './profile.css';

// Exemplo de busca de dados (simulando retorno do seu backend Node.js)
async function getCandidateData(slug) {
  // Substitua pela sua chamada de API real ex: fetch(`http://seu-backend/api/candidates/${slug}`)
  return {
    id: 'ATS-BR-10254',
    firstName: 'Isabella',
    lastName: 'Silva',
    location: 'Curitiba, Paraná, Brazil',
    avatar: 'https://i.pravatar.cc/150?img=47',
    tags: ['APPLIED', 'LINKEDIN', 'ACTIVE SEARCH', 'TOP FIT', 'FOLLOW UP'],
    gender: 'Female',
    email: 'isabella.silva@email.com',
    phone: '+55 41 99876-5432',
    linkedin: 'https://www.linkedin.com/in/isabellasilva-hr',
    languages: 'Portuguese (Native)   English (Fluent)   Spanish (Professional)',
    createdDate: '2024-05-15',
    contractPreferences: {
      type: 'Full-time',
      modality: 'Hybrid (2 days in-office)',
      salaryExpectation: 'R$ 12.000,00 per Month'
    },
    skills: ['Project Management', 'Agile (Scrum)', 'Talent Acquisition', 'Recruitment', 'HR Tech', 'Portuguese', 'English']
  };
}

export default async function CandidateProfile({ params }) {
  const { slug } = params;
  const candidate = await getCandidateData(slug);

  return (
    <div className="profile-container">
      {/* Navegação Superior */}
      <header className="profile-header">
        <h2>Candidate Profile</h2>
        <nav className="profile-tabs">
          <button className="tab active">🏠 Summary</button>
          <button className="tab">📄 Resume</button>
          <button className="tab">💼 Jobs</button>
          <button className="tab">✔️ Follow Up</button>
          <button className="tab">🎙️ Interviews</button>
          <button className="tab">📝 Notes</button>
          <button className="tab">📄 Documents</button>
          <button className="tab">🕒 History</button>
        </nav>
      </header>

      {/* Cartão do Topo (Hero Header) */}
      <section className="profile-hero">
        <img src={candidate.avatar} alt={`${candidate.firstName} ${candidate.lastName}`} className="profile-avatar" />
        <div className="hero-info">
          <h1>{candidate.firstName} {candidate.lastName}</h1>
          <p className="location">Location: {candidate.location}</p>
          <div className="tags-container">
            <span className="tags-label">Tags:</span>
            {candidate.tags.map((tag, idx) => (
              <span key={idx} className={`tag tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                [{tag}]
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid do Conteúdo Principal */}
      <main className="profile-grid">
        {/* Coluna da Esquerda: Candidate Details */}
        <section className="card details-card">
          <h3>Candidate Details</h3>
          <div className="detail-group">
            <span className="label">Candidate ID</span>
            <span className="value">{candidate.id}</span>
          </div>
          <div className="detail-group">
            <span className="label">First Name</span>
            <span className="value">{candidate.firstName}</span>
          </div>
          <div className="detail-group">
            <span className="label">Last Name</span>
            <span className="value">{candidate.lastName}</span>
          </div>
          <div className="detail-group">
            <span className="label">Gender</span>
            <span className="value">{candidate.gender}</span>
          </div>
          <div className="detail-group">
            <span className="label">Email</span>
            <span className="value">{candidate.email}</span>
          </div>
          <div className="detail-group">
            <span className="label">Phone Number</span>
            <span className="value">{candidate.phone}</span>
          </div>
          <div className="detail-group">
            <span className="label">Linkedin</span>
            <span className="value"><a href={candidate.linkedin} target="_blank" rel="noreferrer">{candidate.linkedin}</a></span>
          </div>
          <div className="detail-group">
            <span className="label">Idiomas</span>
            <span className="value">{candidate.languages}</span>
          </div>
          <div className="detail-group">
            <span className="label">Created date</span>
            <span className="value">{candidate.createdDate}</span>
          </div>
        </section>

        {/* Coluna da Direita */}
        <div className="right-column">
          {/* Card: Video Introduction */}
          <section className="card video-card">
            <h3>Video Introduction</h3>
            <div className="video-box">
              <div className="play-button">▶</div>
              <div className="video-meta">
                <strong>Video Introduction</strong>
                <span>Watch Video</span>
                <small>0:52 min</small>
              </div>
            </div>
          </section>

          {/* Card: Contract Preferences */}
          <section className="card preferences-card">
            <h3>Contract Preferences</h3>
            <p><strong>Preferred Contract:</strong> {candidate.contractPreferences.type}</p>
            <p><strong>Hybrid/Remote:</strong> {candidate.contractPreferences.modality}</p>
            <br />
            <h4>Pretensão Salarial (Details)</h4>
            <p>{candidate.contractPreferences.salaryExpectation}</p>
          </section>

          {/* Card: Skills Portfolio */}
          <section className="card skills-card">
            <h3>Skills Portfolio</h3>
            <div className="skills-tags">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="skill-pill">🏷️ {skill}</span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}