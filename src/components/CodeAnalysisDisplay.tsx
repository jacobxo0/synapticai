import React from 'react';

interface CodeAnalysisDisplayProps {
  content: string;
  fileName: string;
  startLine: number;
  endLine: number;
}

export const CodeAnalysisDisplay: React.FC<CodeAnalysisDisplayProps> = ({
  content,
  fileName,
  startLine,
  endLine,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Code Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">File:</h3>
          <p className="text-gray-600">{fileName}</p>
        </div>
        <div>
          <h3 className="font-medium">Lines:</h3>
          <p className="text-gray-600">{startLine} - {endLine}</p>
        </div>
        <div>
          <h3 className="font-medium">Code Preview:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}; 