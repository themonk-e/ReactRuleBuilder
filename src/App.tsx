import React, { useState, useCallback } from "react";
import { merge } from "lodash";
import {
  Query,
  Builder,
  Utils as QbUtils,
  JsonSwitchGroup,
  BasicFuncs,
  BuilderProps,
  ImmutableTree,
  Config
} from "@react-awesome-query-builder/antd";
import { AntdConfig } from "@react-awesome-query-builder/antd";
import "@react-awesome-query-builder/antd/css/styles.css";
import JsonShower from "./JsonShower";
import SpelShowcase from "./SpelFormatShower";
import MissingMappingAlert from "./MissingMappingAlert";


// Define initial config and tree
const InitialConfig = AntdConfig;
const emptyJson: JsonSwitchGroup = { id: QbUtils.uuid(), type: "switch_group" };
const initialTree = QbUtils.loadTree(emptyJson);

const preStyle = { backgroundColor: "darkgrey", margin: "10px", padding: "10px" };
const preErrorStyle = { backgroundColor: "lightpink", margin: "10px", padding: "10px" };


interface Field {
  label: string;
  type: string;
}



declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage: (message: any) => void;
      };
    };

    receiveMessageFromWinForms: (message: string) => void;
  }
}



const config: Config = {
  ...InitialConfig,
  widgets:{
    ...InitialConfig.widgets
  },

  fields: {},
  
  funcs:{
     //...BasicFuncs
     string: {
      type: "!struct",
      label: "String",
      subfields: {
        // LOWER: max length - 7
        // UPPER: max length - 6
        LOWER: merge({}, BasicFuncs.LOWER, {
          tooltip: "Convert to lower case",
          allowSelfNesting: true,
          validateValue: (s: string) => {
            return s.length <= 7 ? null : {
              error: "bad len",
              fixedValue: s.substring(0, 7)
            };
          },
          args: {
            str: {
              validateValue: (s: string) => {
                return s.length <= 7 ? null : {
                  error: { key: "custom:BAD_LEN", args: {val: s} },
                  fixedValue: s.substring(0, 7)
                };
              }
            },
          }
        }),
        UPPER: merge({}, BasicFuncs.UPPER, {
          tooltip: "Convert to upper case",
          allowSelfNesting: true,
          validateValue: (s: string) => {
            return s.length <= 6 ? null : {
              error: "bad len",
              fixedValue: s.substring(0, 6)
            };
          },
          args: {
            str: {
              validateValue: (s: string) => {
                return s.length <= 6 ? null : {
                  error: { key: "custom:BAD_LEN", args: {val: s} },
                  fixedValue: s.substring(0, 6)
                };
              }
            },
          }
        }),
        LEFT: {
          label: 'Left',
          sqlFunc: 'LEFT',
          mongoFunc: '$toLeft',
          returnType: 'text',
          allowSelfNesting:true,
          jsonLogic: "toLeft",
          args: {
            str: {
              type: 'text',
              valueSources: ['value', 'field','func'],
            },
            no_of_char: {
              type: 'number',
              valueSources: ['value'],
            }
          }
          
        },
        LEN: {
          label: 'Length',
          sqlFunc: 'LEN',
          mongoFunc: '$Len',
          returnType: 'number',
          allowSelfNesting:true,
          jsonLogic: "len",
          args: {
            str: {
              type: 'text',
              valueSources: ['value', 'field','func'],
            }
          }
        },
        SUBSTRING: {
          label: 'Substring',
          sqlFunc: 'SUBSTRING',
          mongoFunc: '$SUBSTRING',
          returnType: 'text',
          allowSelfNesting:true,
          jsonLogic: "substring",
          args: {
            str: {
              type: 'text',
              valueSources: ['value', 'field','func'],
            },
            start: {
              type: 'number',
              valueSources: ['value'],
            },
            length: {
              type: 'number',
              valueSources: ['value'],
            }
          }
        },
        CONCAT: {
          label: 'Concat',
          returnType: 'text',
          sqlFunc: 'Concat',
          tooltip:"Give values in this manner value , concatenation string+ value",
          jsonLogic: "toLeft",
          allowSelfNesting:true,
          args: {
            value1: {
              type: 'text',
              valueSources: ['value', 'field','func'],
            },
            value2: {
              type: 'text',
              valueSources: ['value', 'field','func'],
            },

          }
      },
    }
    },
  },
  settings: {
    ...InitialConfig.settings,

    fieldSources: ["field", "func"],
    caseValueField: {
      type: "text",
      valueSources: ["value","field","func"],
      fieldSettings: {
        listValues: [
          { value: "tag1", title: "Tag #1" },
          { value: "tag2", title: "Tag #2" },
        ],
      },
      mainWidgetProps: {
        valueLabel: "Then",
        valuePlaceholder: "Then",
      },
    },
    canRegroupCases: true,
    maxNumberOfCases: 10,
  }
};





const updatedConfig = { ...config };
const DemoQueryBuilder: React.FC = () => {
  const [state, setState] = useState({
    tree: initialTree,
    config: config,
    spelStr: "",
    spelErrors: [] as string[]
  });

  const updateConfigFields = (fieldsFromWinForms: Field[]): void => {
    const updatedFields = fieldsFromWinForms.reduce((acc: Record<string, Field>, field: Field) => {
      acc[field.label] = field;
      return acc;
    }, {});

    console.log(updatedFields);

    updatedConfig.fields = updatedFields;
    
  
    setState(prevState => ({ ...prevState,updatedConfig: updatedConfig }));
  };

  window.receiveMessageFromWinForms = (message: string|object) => {
    try {
      updateConfigFields(message as Field[]);
    } catch (error) {
      console.error("Error processing message from WinForms:", error);
    }
  };

  const onChange = useCallback((immutableTree: ImmutableTree, updatedConfig: Config) => {
    setState(prevState => ({ ...prevState, tree: immutableTree, updatedConfig: updatedConfig }));
    console.log(QbUtils.getTree(immutableTree));
  }, []);

  const renderBuilder = useCallback((props: BuilderProps) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  ), []);

  const renderJsonLogicBlock = () => {
    const {logic, data: logicData, errors: logicErrors} = QbUtils.jsonLogicFormat(state.tree, state.config);

    return (
      <div>
        <JsonShower logicErrors={logicErrors} logic={logic} />
      </div>
    );
  }

  const checkBoxChecked=()=>{
    console.log("checkbox checked");
  }

  return (
    <div>
      <MissingMappingAlert></MissingMappingAlert>
      <Query
        {...updatedConfig}
        value={state.tree}
        onInit={onChange}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <div className="query-builder-result">{renderJsonLogicBlock()}</div>

    </div>
  );
};

export default DemoQueryBuilder;
