import React, { useMemo, useState } from 'react';
import { Copy, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CommandOutputItem {
  id: string;
  success: boolean;
  message: string;
  timestamp?: Date;
  errorCode?: string;
}

interface CommandOutputProps {
  outputs: CommandOutputItem[];
  maxItems?: number;
  onClear?: () => void;
  className?: string;
}

export function CommandOutput({ 
  outputs, 
  maxItems = 50, 
  onClear, 
  className 
}: CommandOutputProps) {
  const [copied, setCopied] = useState(false);

  // Limit the number of displayed outputs
  const displayedOutputs = useMemo(() => 
    outputs.slice(-maxItems).reverse(), 
    [outputs, maxItems]
  );

  // Copy all outputs to clipboard
  const copyAllOutputs = () => {
    const outputText = outputs
      .map(output => 
        `[${output.success ? 'SUCCESS' : 'ERROR'}] ${output.message}`
      )
      .join('\n');
    
    navigator.clipboard.writeText(outputText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  // Utility function for conditional classes
  const conditionalClasses = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div 
      className={conditionalClasses(
        "bg-gray-900 text-gray-100 rounded-md p-4 font-mono text-sm",
        "h-64 overflow-y-auto relative",
        "border border-gray-700 shadow-lg",
        className
      )}
      aria-label="Command Output Console"
    >
      {/* Toolbar */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {onClear && (
          <button 
            onClick={onClear}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Clear Output"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
        <button 
          onClick={copyAllOutputs}
          className={conditionalClasses(
            "text-gray-400 hover:text-white transition-colors",
            copied ? "text-green-500" : ""
          )}
          aria-label="Copy All Outputs"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>

      {/* Copied Notification */}
      {copied && (
        <div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 
          bg-green-600 text-white px-3 py-1 rounded-md text-xs z-10"
        >
          Copied!
        </div>
      )}

      {/* No output message */}
      {outputs.length === 0 && (
        <div 
          className="text-gray-500 text-center py-8"
          aria-live="polite"
        >
          No command outputs yet
        </div>
      )}

      {/* Output Items */}
      {displayedOutputs.map((output) => (
        <div
          key={output.id}
          className={conditionalClasses(
            "flex items-start space-x-2 mb-2 p-2 rounded-md",
            output.success 
              ? "bg-green-900/30 border-l-4 border-green-500" 
              : "bg-red-900/30 border-l-4 border-red-500"
          )}
          role="status"
          aria-label={output.success ? "Successful output" : "Error output"}
        >
          {output.success ? (
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          )}
          <div className="flex-grow">
            <p 
              className={conditionalClasses(
                "text-sm",
                output.success ? "text-green-300" : "text-red-300"
              )}
            >
              {output.message}
            </p>
            {output.errorCode && (
              <small className="text-xs text-gray-500 mt-1 block">
                Error Code: {output.errorCode}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}