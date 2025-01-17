import React, { useState, useCallback } from "react";
import { merge } from 'lodash'

// import type { JsonGroup, Config, ImmutableTree, BuilderProps } from '@react-awesome-query-builder/bootstrap'; // for TS example
// import { BootstrapConfig, BootstrapWidgets } from '@react-awesome-query-builder/bootstrap';
// import "bootstrap/dist/css/bootstrap.min.css";
// import '@react-awesome-query-builder/bootstrap/css/styles.css';

// import { Utils as QbUtils, Query, Builder, BasicFuncs,JsonSwitchGroup } from '@react-awesome-query-builder/bootstrap';
// import '@react-awesome-query-builder/ui/css/styles.css';
// const InitialConfig = BootstrapConfig;


// import type { JsonGroup, Config, ImmutableTree, BuilderProps } from '@react-awesome-query-builder/mui'; // for TS example
// import { Utils as QbUtils, Query, Builder, BasicConfig,BasicFuncs,JsonSwitchGroup  } from '@react-awesome-query-builder/mui';
// import { MuiConfig, MuiWidgets } from '@react-awesome-query-builder/mui';
// import '@react-awesome-query-builder/mui/css/styles.css';


import type { JsonGroup, Config, ImmutableTree, BuilderProps} from '@react-awesome-query-builder/antd'; // for TS example
import { Query, Builder, Utils as QbUtils,JsonSwitchGroup,BasicFuncs } from '@react-awesome-query-builder/antd';
import { AntdConfig, AntdWidgets } from '@react-awesome-query-builder/antd';



import '@react-awesome-query-builder/antd/css/styles.css';
import JsonShower from "./JsonShower";
const InitialConfig = AntdConfig;



const emptyJson: JsonSwitchGroup = { id: QbUtils.uuid(), type: "switch_group", };
const tree = QbUtils.loadTree(emptyJson);


const preStyle = { backgroundColor: "darkgrey", margin: "10px", padding: "10px" };
const preErrorStyle = { backgroundColor: "lightpink", margin: "10px", padding: "10px" };


// or import '@react-awesome-query-builder/ui/css/compact_styles.css';
// const InitialConfig = MuiConfig;
// <<<

// You need to provide your own config. See below 'Config format'
const config: Config = {
  ...InitialConfig,
  widgets:{
    ...InitialConfig.widgets
  },

  fields: {
    qty: {
      label: "Qty",
      type: "number",
      fieldSettings: {
        min: 0
      },
      valueSources: ["value"],
      preferWidgets: ["number"]
    },
    price: {
      label: "Price",
      type: "number",
      valueSources: ["value"],
      fieldSettings: {
        min: 10,
        max: 100
      },
      preferWidgets: ["slider", "rangeslider"]
    },
    name: {
      label: 'Name',
      type: 'text',
    },

    MedicarestatA: {
      label: 'Medicare stat A',
      type: 'text',
    },
    AidCode: {
      label: 'Aid Code',
      type: 'text',
    },


    MedicarestatB: {
      label: 'Medicare stat B',
      type: 'text',
    },
    empgrp: {
      label: 'EMPGROUP',
      type: 'text',
    },
    color: {
      label: "Color",
      type: "select",
      valueSources: ["value"],
      fieldSettings: {
        listValues: [
          { value: "yellow", title: "Yellow" },
          { value: "green", title: "Green" },
          { value: "orange", title: "Orange" }
        ]
      }
    },
    is_promotion: {
      label: "Promo?",
      type: "boolean",
      operators: ["equal"],
      valueSources: ["value"]
    }
  },
  funcs:{
     //...BasicFuncs
     string: {
      type: "!struct",
      label: "String",
      tooltip: "String functions",
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

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: JsonGroup = { id: QbUtils.uuid(), type: "group" };

























const DemoQueryBuilder: React.FC = () => {
  const [state, setState] = useState({
    tree: tree,
    config: config,
    spelStr: "",
    spelErrors: [] as string[]
  });

  const onChange = useCallback((immutableTree: ImmutableTree, config: Config) => {
    // Tip: for better performance you can apply `throttle` - see `packages/examples/src/demo`
    setState(prevState => ({ ...prevState, tree: immutableTree, config: config }));

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }, []);

  const renderBuilder = useCallback((props: BuilderProps) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  ), []);

  const renderQueryBuilder = () => (
    <Query
      {...config}
      value={state.tree}
      onInit={onChange}
      onChange={onChange}
      renderBuilder={renderBuilder}
    />
  );

  const renderJsonLogicBlock = () => {
    const {logic, data: logicData, errors: logicErrors} = QbUtils.jsonLogicFormat(state.tree, state.config);

    return (
      <div style={{ padding: '20px' }}>
        <JsonShower logicErrors={logicErrors} logic={logic} />
      </div>
    );
  };
  
  return (
    <div>
      {renderQueryBuilder()}
      <div className="query-builder-result">
        {renderJsonLogicBlock()}
      </div>
    </div>
  );
};
export default DemoQueryBuilder;


