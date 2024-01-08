import React, { useRef, useEffect } from "react";

interface LiveCodeEditorProps {
  code: string | null | undefined;
  css: string | null;
  cssFramework: string;
}

export const LiveCodeEditor = ({
  code,
  css,
  cssFramework,
}: LiveCodeEditorProps) => {
  const iframeRef = useRef<any>();

  const updateIframeContent = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    const iframeDoc = iframeRef.current.contentDocument;

    iframeDoc.open();
    if (code === null) {
      iframeDoc.write("");
    } else {
      const cssHead = `
        <script src="https://cdn.tailwindcss.com"></script>
      `;
      iframeDoc.write(`
        <html>
          <head>
            ${cssHead}
            <style>${css}</style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
          </head>
          <body>
            <div id="root"></div>
            <script>
              ${code}
              ReactDOM.render(React.createElement(MyApp.default), document.getElementById('root'));
            </script>
          </body>
        </html>
      `);
    }
    iframeDoc.close();
  };

  useEffect(() => {
    updateIframeContent();
  }, [code, css, cssFramework]);

  return (
    <div className="h-full max-h-full grow">
      <iframe ref={iframeRef} width="100%" height="100%" />
    </div>
  );
};
