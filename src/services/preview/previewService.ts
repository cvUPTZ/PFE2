import { ThesisMetadata, Chapter } from '../../types';

export class PreviewService {
  static generatePreviewHTML(metadata: ThesisMetadata, chapters: Chapter[]): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${metadata.title}</title>
          <style>
            @page { size: 8.5in 11in; margin: 1in 1in 1in 1.5in; }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 2;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1in;
              counter-reset: page chapter section;
            }
            .title-page { text-align: center; margin-top: 2in; }
            .title-page h1 { font-size: 16pt; margin-bottom: 1.5in; }
            .title-page .author { margin-top: 1in; margin-bottom: 2in; }
            .title-page .university { margin-top: 2in; }
            
            .toc { margin-top: 2in; }
            .toc h2 { text-align: center; }
            .toc-entry {
              display: flex;
              align-items: baseline;
              margin: 0.5em 0;
            }
            .toc-entry::after {
              content: '';
              flex: 1;
              border-bottom: 1px dotted black;
              margin: 0 0.5em;
            }
            .toc-entry.section { margin-left: 2em; }
            
            .abstract { margin-top: 2in; }
            .abstract h2 { text-align: center; }
            
            .chapter {
              margin-top: 2in;
              counter-increment: chapter;
            }
            .chapter h2::before {
              content: "Chapter " counter(chapter) ". ";
            }
            .section {
              counter-increment: section;
              margin-top: 1em;
            }
            .section h3::before {
              content: counter(chapter) "." counter(section) " ";
            }
            
            @media print {
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="title-page">
            <h1>${metadata.title}</h1>
            <p class="author">by<br>${metadata.author || ''}</p>
            <p>A thesis submitted in partial fulfillment<br>
               of the requirements for the degree of</p>
            <p>${metadata.field || ''}</p>
            <p class="university">${metadata.university || ''}</p>
            <p>${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div class="page-break toc">
            <h2>Table of Contents</h2>
            <div class="toc-entry">Abstract<span>ii</span></div>
            ${chapters.map((chapter, index) => `
              <div class="toc-entry">Chapter ${index + 1}. ${chapter.title}<span>${index + 1}</span></div>
              ${chapter.sections.map((section, sIndex) => `
                <div class="toc-entry section">${section.title}<span>${index + 1}.${sIndex + 1}</span></div>
              `).join('')}
            `).join('')}
          </div>

          <div class="page-break abstract">
            <h2>Abstract</h2>
            <p>${metadata.abstract || 'No abstract provided.'}</p>
            <p><strong>Keywords:</strong> ${metadata.keywords?.join(', ') || 'None provided'}</p>
          </div>

          ${chapters.map(chapter => `
            <div class="page-break chapter">
              <h2>${chapter.title}</h2>
              ${chapter.sections.map(section => `
                <div class="section">
                  <h3>${section.title}</h3>
                  <p>${section.content}</p>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }

  static previewThesis(metadata: ThesisMetadata, chapters: Chapter[]): void {
    const html = this.generatePreviewHTML(metadata, chapters);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }
}