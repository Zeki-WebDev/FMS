import React, { useRef, useState } from 'react';
import './App.css';
import Login from './Login.jsx';
import Register from './Register.jsx';

export default function App() {
  // State to handle Workspace popup modal and workspace name
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [files, setFiles] = useState([
    
   
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState('all');
  const [recentIds, setRecentIds] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const fileInputRef = useRef(null);

  // -----------------------------
  // UPLOAD FILE
  // -----------------------------
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    const uploadedFiles = selectedFiles.map((file, index) => ({
  id: Date.now() + index,
  name: file.name,
  type: getFileType(file.name),
  size: formatFileSize(file.size),
  date: new Date().toISOString().split('T')[0],
  url: URL.createObjectURL(file), // <-- ADD THIS LINE HERE
  favorite: false,
  trashed: false
  }));

    setFiles((currentFiles) => [
      ...currentFiles,
      ...uploadedFiles
    ]);

    event.target.value = '';
  };

  // -----------------------------
  // FILE TYPE
  // -----------------------------
  const getFileType = (fileName) => {
    const extension = fileName
      .split('.')
      .pop()
      .toLowerCase();

    if (extension === 'pdf') return 'PDF';

    if (
      ['xlsx', 'xls', 'csv'].includes(extension)
    ) {
      return 'Spreadsheet';
    }

    if (
      ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)
    ) {
      return 'Image';
    }

    if (
      ['doc', 'docx', 'txt'].includes(extension)
    ) {
      return 'Document';
    }

    if (
      ['ppt', 'pptx'].includes(extension)
    ) {
      return 'Presentation';
    }

    return 'File';
  };

  // -----------------------------
  // FILE SIZE
  // -----------------------------
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // -----------------------------
  // FAVORITE
  // -----------------------------
  const toggleFavorite = (id) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              favorite: !file.favorite
            }
          : file
      )
    );
  };

  // -----------------------------
  // MOVE TO TRASH
  // -----------------------------
  const moveToTrash = (id) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              trashed: true
            }
          : file
      )
    );

    setRecentIds((current) =>
      current.filter((recentId) => recentId !== id)
    );
  };

  // -----------------------------
  // RESTORE FROM TRASH
  // -----------------------------
  const restoreFile = (id) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              trashed: false
            }
          : file
      )
    );
  };

  // -----------------------------
  // PERMANENT DELETE
  // -----------------------------
  const permanentlyDelete = (id) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== id)
    );

    setRecentIds((current) =>
      current.filter((recentId) => recentId !== id)
    );
  };

  // -----------------------------
  // OPEN FILE / RECENT
  // -----------------------------
  const openFile = (id) => {
    setRecentIds((current) => {
      const withoutCurrent = current.filter(
        (recentId) => recentId !== id
      );

      return [id, ...withoutCurrent].slice(0, 10);
    });
  };

  // -----------------------------
  // FILTER FILES
  // -----------------------------
  const getVisibleFiles = () => {
    let visibleFiles = [...files];

    if (activePage === 'all') {
      visibleFiles = visibleFiles.filter(
        (file) => !file.trashed
      );
    }

    if (activePage === 'favorites') {
      visibleFiles = visibleFiles.filter(
        (file) => file.favorite && !file.trashed
      );
    }

    if (activePage === 'recent') {
      visibleFiles = recentIds
        .map((id) =>
          files.find((file) => file.id === id)
        )
        .filter(
          (file) => file && !file.trashed
        );
    }

    if (activePage === 'trash') {
      visibleFiles = visibleFiles.filter(
        (file) => file.trashed
      );
    }

    if (searchTerm.trim() !== '') {
      visibleFiles = visibleFiles.filter((file) =>
        file.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return visibleFiles;
  };

  const visibleFiles = getVisibleFiles();

  // -----------------------------
  // STORAGE
  // -----------------------------
  const usedStorage = 4.5;
  const totalStorage = 10;
  const storagePercentage =
    (usedStorage / totalStorage) * 100;

  // -----------------------------
  // PAGE TITLE
  // -----------------------------
  const getPageTitle = () => {
    if (activePage === 'favorites') {
      return 'Favorites';
    }

    if (activePage === 'recent') {
      return 'Recent Files';
    }

    if (activePage === 'trash') {
      return 'Trash';
    }

    return 'Recent Files';
  };
  
if (!loggedIn && showRegister) {
  return (
    <Register
      onBackToLogin={() => setShowRegister(false)}
      onRegister={() => {
        alert(
          'Registration page is connected. Supabase registration is the next step.'
        );
      }}
    />
  );
}

if (!loggedIn) {
  return (
    <Login
      onLogin={(user) => {
        setCurrentUser(user);
        setLoggedIn(true);
      }}
      onShowRegister={() => setShowRegister(true)}
    />
  );
}


  return (
    <div className="file-app">
      

      {/* =========================
          SIDEBAR
      ========================== */}
      
      <aside className="sidebar">

        <div
          className="sidebar-brand"
          onClick={openFilePicker}
          title="Upload a file"
        >
          <h2>📁 File.org</h2>
        </div>

        <ul className="sidebar-menu">

          <li
            className={
              activePage === 'all'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('all')
            }
          >
            📁 All Files
          </li>

          <li
            className={
              activePage === 'favorites'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('favorites')
            }
          >
            ⭐ Favorites
          </li>

          <li
            className={
              activePage === 'recent'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('recent')
            }
          >
            🕘 Recent
          </li>

          <li
            className={
              activePage === 'trash'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('trash')
            }
          >
            🗑️ Trash
          </li>
           

        </ul>
        

        {/* STORAGE */}
        <div className="storage-box">

          <p>Storage Used</p>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${storagePercentage}%`
              }}
            ></div>
          </div>

          <small>
            {usedStorage} GB of {totalStorage} GB used
          </small>

        </div>
        

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="main-content">

        {/* TOP HEADER */}
        <header className="top-header">

          <div className="search-bar">

            <input
              type="text"
              placeholder="Search your files..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>
          <div 
  className="user-profile"
  onClick={() => setShowWorkspaceModal(true)}
  style={{ cursor: 'pointer' }}
>
  <span className="avatar">
    👤
  </span>
  <span>{workspaceName}</span>
</div>

          
          {/* TOP HEADER */}
<header className="top-header">
  {/* Your search bar code */}
  <div className="search-bar">
    {/* ... */}
  </div>

  {/* USER PROFILE & LOG OUT CONTAINER */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div className="user-profile">
    </div>

    {/* --> LOG OUT BUTTON <-- */}
    <button 
      onClick={() => {
        localStorage.removeItem('user');
        sessionStorage.clear();
        window.location.href = '/login';
        }}
        style={{
        padding: '8px 14px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
        }}
         >
        <i className="bx bx-log-out"></i> Log Out
        </button>
        </div>
        </header>

        </header>

        {/* =========================
            CONTENT BODY
        ========================== */}
        <div className="content-body">

          <div className="section-header">

            <h3>
              {getPageTitle()}
            </h3>

            {activePage !== 'trash' && (
              <button
                className="upload-btn"
                onClick={openFilePicker}
              >
                + Upload File
              </button>
            )}

            {activePage === 'trash' &&
              visibleFiles.length > 0 && (
                <button
                  className="upload-btn"
                  onClick={() => {
                    visibleFiles.forEach(
                      (file) =>
                        permanentlyDelete(file.id)
                    );
                  }}
                >
                  Empty Trash
                </button>
              )}

          </div>

          {/* HIDDEN FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {/* =========================
              FILE GRID
          ========================== */}
          <div className="file-grid">

            {visibleFiles.length > 0 ? (

              visibleFiles.map((file) => (

                <div
                  className="file-card"
                  key={file.id}
                  onClick={() => {setSelectedFile(file);
                 if (['all', 'favorites', 'recent'].includes(activePage)) {
                 setActiveFile(file);
                 openFile(file.id);
                 }
               }}
                    
                    
                  
                >

                  <div className="file-icon">
                    📄
                  </div>

                  <div className="file-details">

                    <h4>
                      {file.name}
                    </h4>

                    <p>
                      {file.size} • {file.date}
                    </p>

                  </div>

                  {/* FILE ACTIONS */}
                  <div
                    className="file-actions"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    {activePage !== 'trash' && (
                      <button
                        onClick={() =>
                          toggleFavorite(file.id)
                        }
                        title={
                          file.favorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                      >
                        {file.favorite
                          ? '★'
                          : '☆'}
                      </button>
                    )}

                    {activePage === 'trash' ? (

                      <>
                        <button
                          onClick={() =>
                            restoreFile(file.id)
                          }
                          title="Restore"
                        >
                          ↩
                        </button>

                        <button
                          onClick={() =>
                            permanentlyDelete(
                              file.id
                            )
                          }
                          title="Delete permanently"
                        >
                          🗑
                        </button>
                      </>

                    ) : (

                      <button
                        onClick={() =>
                          moveToTrash(file.id)
                        }
                        title="Move to trash"
                      >
                        🗑
                      </button>

                    )}

                  </div>

                </div>

              ))

            ) : (

              <div className="no-files">

                {activePage === 'favorites' &&
                  'No favorite files yet.'}

                {activePage === 'recent' &&
                  'No recently opened files.'}

                {activePage === 'trash' &&
                  'Trash is empty.'}

                {activePage === 'all' &&
                  'No files found.'}
                  {activeFile && (
                 <div className="file-viewer-overlay" onClick={() => setActiveFile(null)}>
                 <div className="file-viewer-content" onClick={(e) => e.stopPropagation()}>
                 <div className="file-viewer-header">
                 <h3>{activeFile.name}</h3>
                 <button onClick={() => setActiveFile(null)}>✕</button>
                 </div>
                 <div className="file-viewer-body">
                 <iframe src={activeFile.url || activeFile.path} title={activeFile.name} width="100%" height="100%" />
                 </div>
                 </div>
                 </div>
                 )}
                 

              </div>
              

            )}

          </div>

        </div>

      </main>
              {showWorkspaceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '360px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px' }}>Workspace Settings</h3>
              <button 
                onClick={() => setShowWorkspaceModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Workspace Name
              </label>
              <input 
                type="text" 
                value={workspaceName} 
                onChange={(e) => setWorkspaceName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => setShowWorkspaceModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#701a75',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
      {activeFile && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px',
      padding: '24px', width: '400px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeFile.name}
        </h3>
        <button onClick={() => setActiveFile(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
      </div>

      <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', marginBottom: '16px', maxHeight: '240px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activeFile.url ? (
          (activeFile.type?.startsWith('image/') || /\.(png|jpe?g|gif|svg|webp)$/i.test(activeFile.name)) ? (
            <img src={activeFile.url} alt={activeFile.name} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '6px' }} />
          ) : (
            <div>
              <span style={{ fontSize: '48px' }}>📄</span>
              <p style={{ margin: '8px 0 0 0', color: '#374151', fontSize: '14px', fontWeight: '600' }}>{activeFile.name}</p>
            </div>
          )
        ) : (
          <div>
            <span style={{ fontSize: '48px' }}>📁</span>
            <p style={{ margin: '8px 0 0 0', color: '#374151', fontSize: '14px', fontWeight: '600' }}>{activeFile.name}</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={() => setActiveFile(null)} style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
        {activeFile.url && (
          <a href={activeFile.url} target="_blank" rel="noopener noreferrer" download={activeFile.name} style={{ padding: '8px 16px', backgroundColor: '#701a75', color: '#ffffff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', display: 'inline-block' }}>Open / Download</a>
        )}
      </div>
    </div>
  </div>
)}
    </div>
        
  );
}