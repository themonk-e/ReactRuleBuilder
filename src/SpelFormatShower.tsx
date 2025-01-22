import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Query, Builder, Utils as QbUtils,JsonSwitchGroup,BasicFuncs, ImmutableTree } from '@react-awesome-query-builder/antd';

interface SpelShowcaseProps {
    tree: ImmutableTree;  // Adjust this type if necessary
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
  
  const SpelShowcase: React.FC<SpelShowcaseProps> = ({ tree }) => {


    return (
      <div>
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
            SPEL Format
          </a>
          { 
            <div style={{ marginTop: '20px' }}>
              <SyntaxHighlighter language="json" style={customStyle}>
                 {JSON.stringify(QbUtils.TreeUtils.getSwitchValues(tree), undefined, 2)}
              </SyntaxHighlighter>
            </div>
          }
        </div>
        <hr />
      </div>

      </div>
    );
  };
  
  export default SpelShowcase;