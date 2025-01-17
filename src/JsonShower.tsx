import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface JsonShowcaseProps {
    logicErrors?: any[];  
    logic?: any;  
  }


  const customStyle = {
    ...dracula, // Start with the default Dracula theme for overall background and text colors
    'hljs-keyword': {
      color: '#f39c12', // Orange for keys
    },
    'hljs-string': {
      color: '#2ecc71', // Green for values
    },
    'hljs-null': {
      color: '#3498db', // Blue for null values
    },
    'hljs-number': {
      color: '#f39c12', // Orange for numbers (optional, adjust if needed)
    },
    'hljs-attr': {
      color: '#f39c12', // Orange for attribute names
    }
  };
  
  const JsonShowcase: React.FC<JsonShowcaseProps> = ({ logicErrors, logic }) => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', padding: '20px', backgroundColor: '#2e2e2e', borderRadius: '8px' }}>
        <div>
          <a 
            href="http://jsonlogic.com/play.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              fontSize: '16px', 
              color: '#00d1b2', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'inline-block'
            }}
          >
            Rule JSON
          </a>
          : 
          { (logicErrors?.length || 0) > 0 && (
            <div style={{ marginTop: '10px', backgroundColor: '#ffdddd', padding: '10px', borderRadius: '5px' }}>
              <SyntaxHighlighter language="json" style={customStyle}>
                {JSON.stringify(logicErrors, undefined, 2)}
              </SyntaxHighlighter>
            </div>
          )}
          { !!logic && (
            <div style={{ marginTop: '20px' }}>
              <SyntaxHighlighter language="json" style={customStyle}>
                {JSON.stringify(logic, undefined, 2)}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
        <hr />
      </div>
    );
  };
  
  export default JsonShowcase;