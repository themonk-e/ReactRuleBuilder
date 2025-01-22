import { Button } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { SaveOutlined } from '@ant-design/icons';

import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Row, Col} from 'antd';

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

    const sendRuleJSON = (json: string) => {
      if (window.chrome?.webview) {
        console.log(json);
        window.chrome.webview.postMessage(json);
      } else {
        console.error('WebView is not available.');
      }
    };



    return (
      <div>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          margin: '20px',
          padding: '20px',
          backgroundColor: '#2e2e2e',
          borderRadius: '8px',
        }}
      >
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
              display: 'inline-block',
            }}
          >
            Rule JSON
          </a>
          :
          {(logicErrors?.length || 0) > 0 && (
            <div
              style={{
                marginTop: '10px',
                backgroundColor: '#ffdddd',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <SyntaxHighlighter language="json" style={customStyle}>
                {JSON.stringify(logicErrors, undefined, 2)}
              </SyntaxHighlighter>
            </div>
          )}
          {!!logic && (
            <div style={{ marginTop: '20px' }}>
              <SyntaxHighlighter language="json" style={customStyle}>
                {JSON.stringify(logic, undefined, 2)}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
        <hr />
      </div>
      <Row justify="end" style={{ marginTop: '20px', marginRight: '10px' }}>
        <Col>
        
          <Button type="primary" 
          icon={<SaveOutlined />}
          style={{ backgroundColor: 'green', borderColor: 'green' }}
          onClick={() => sendRuleJSON(JSON.stringify(logic, undefined, 2))}>
            Save Rules
          </Button>
        </Col>
      </Row>
    </div>
    );
  };
  
  export default JsonShowcase;