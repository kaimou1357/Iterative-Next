import React, { useRef, useEffect } from "react";
import initializationPromise from "./esbuildInitializer";
import * as esbuild from "esbuild-wasm";

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
    let result = null;
    if (code == null) {
      return;
    }
    // await initializationPromise();
    result = await esbuild.transform(`export default ${code}`, {
      loader: "jsx",
      target: "es2015",
      format: "iife",
      globalName: "MyApp",
    });

    const cssHead = `
        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.7.6/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
      `;

    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
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
            ${result.code}
            ReactDOM.render(React.createElement(MyApp.default), document.getElementById('root'));
          </script>
        </body>
      </html>
    `);
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
