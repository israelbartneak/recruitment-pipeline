// src/app/documents/page.js
"use client";
import { useState } from "react";
import { Search, Plus, Folder, Download, MoreVertical } from "lucide-react";
import { mockFolders, mockFiles, DOCUMENT_TYPE_COLORS } from "./mockDocuments";
import styles from "./documents.module.css";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const filteredFolders = mockFolders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredFiles = mockFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.pageTitle}>Documents</h1>
        <div className={styles.accentLine}></div>
      </div>

      <div className={styles.toolbarRow}>
        <div className={styles.searchWrapper}>
          <Search size={17} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addBtn}>
          <Plus size={16} /> Add Document
        </button>
      </div>

      <div className={styles.sectionLabel}>Folders</div>
      <div className={styles.foldersGrid}>
        {filteredFolders.map((folder) => (
          <div key={folder.id} className={styles.folderCard}>
            <div className={styles.folderIcon} style={{ backgroundColor: folder.bg }}>
              <Folder size={20} color={folder.color} />
            </div>
            <div>
              <div className={styles.folderName}>{folder.name}</div>
              <div className={styles.folderCount}>{folder.fileCount} files</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionLabel}>Files</div>
      <div className={styles.filesTableWrapper}>
        <table className={styles.filesTable}>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Type</th>
              <th>Created By</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => {
                const typeStyle = DOCUMENT_TYPE_COLORS[file.type] || DOCUMENT_TYPE_COLORS.Others;
                return (
                  <tr key={file.id}>
                    <td className={styles.fileNameCell}>{file.name}</td>
                    <td>
                      <span
                        className={styles.typeBadge}
                        style={{ color: typeStyle.color, backgroundColor: typeStyle.bg }}
                      >
                        {file.type}
                      </span>
                    </td>
                    <td>{file.createdBy}</td>
                    <td className={styles.dateCell}>{file.date}</td>
                    <td className={styles.actionsCell}>
                      <button className={styles.actionIcon} title="Download">
                        <Download size={14} />
                      </button>
                      <button className={styles.actionIcon} title="More options">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}