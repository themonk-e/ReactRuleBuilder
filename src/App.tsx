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
import { Col, Dropdown, MenuProps, Row, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";



// Define initial config and tree
const InitialConfig = AntdConfig;
const emptyJson: JsonSwitchGroup = { id: QbUtils.uuid(), type: "switch_group" };
const initialTree = QbUtils.loadTree(emptyJson);


interface Field {
  label: string;
  type: string;
  hideForSelect:boolean;
}

interface FieldObject {
  id: number;
  fields: Field[];
}

const fieldObjects: FieldObject[] = [
  {
    id: 1,
    fields: [
      { label: "[FIRSTNAME]", type: "text",hideForSelect:true},
      { label: "LastName", type: "text",hideForSelect:false },
      { label: "DateOfBirth", type: "text",hideForSelect:false },
      { label: "AidCode", type: "text",hideForSelect:false },
      { label: "Region", type: "text",hideForSelect:false },
    ],
  },
  {
    id: 2,
    fields: [
      { label: "FirstNM", type: "text",hideForSelect:true},
      { label: "LastNM", type: "text",hideForSelect:false },
      { label: "Benefit", type: "text",hideForSelect:false },
      { label: "AidCode", type: "text",hideForSelect:false },
      { label: "Region", type: "text",hideForSelect:false },
    ],
  },
];


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
          jsonLogic: "Concat",
          allowSelfNesting:true,
          args: {
            value1: {
              type: 'text',
              valueSources: ['value', 'field','func'],
              defaultValue:''
            },
            value2: {
              type: 'text',
              valueSources: ['value', 'field','func'],
               defaultValue:''
            },
            value3: {
              type: 'text',
              valueSources: ['value', 'field','func'],
               defaultValue:''
            },
            value4: {
              type: 'text',
              valueSources: ['value', 'field','func'],
              defaultValue:''
            },
            value5: {
              type: 'text',
              valueSources: ['value', 'field','func'],
               defaultValue:''
            }
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
      mainWidgetProps: {
        valueLabel: "Then",
        valuePlaceholder: "Then",
      },
    },
    canRegroupCases: true,
    maxNumberOfCases: 10,
  }
};





let updatedConfig = { ...config };
const DemoQueryBuilder: React.FC = () => {
  const [state, setState] = useState({
    tree: initialTree,
    config: config,
    spelStr: "",
    spelErrors: [] as string[]
  });

  const updateConfigFields = (fieldsFromWinForms: Field[],key:string): void => {
    const updatedFields = fieldsFromWinForms.reduce((acc: Record<string, Field>, field: Field) => {
      acc[field.label] = field;
      return acc;
    }, {});

    console.log(updatedFields);

    updatedConfig = {
      ...updatedConfig,
      fields: updatedFields
    };
    
    const ternaryJsonLogic ={
      "if": [
        {
          "and": [
            {
              "==": [
                {
                  "var": "LastName"
                },
                {
                  "var": "AidCode"
                }
              ]
            },
            {
              "==": [
                {
                  "var": "DateOfBirth"
                },
                {
                  "var": "LastName"
                }
              ]
            }
          ]
        },
        {
          "var": "Region"
        },
        {
          "var": "DateOfBirth"
        }
      ]
    }

    const ternaryLogic2={
      "if": [
        {
          "and": [
            {
              "==": [
                {
                  "toLowerCase": [
                    {
                      "var": "LastNM"
                    }
                  ]
                },
                {
                  "var": "Region"
                }
              ]
            },
            {
              "==": [
                {
                  "toUpperCase": [
                    {
                      "var": "LastNM"
                    }
                  ]
                },
                {
                  "toLeft": [
                    {
                      "var": "LastNM"
                    },
                    2
                  ]
                }
              ]
            }
          ]
        },
        "ThenValue",
        "DefaultValue"
      ]
    }    
    
    console.log(updatedConfig);

    console.log(key);

    setState(prevState => ({ ...prevState,updatedConfig: updatedConfig }));

     const treeFromJsonLogic: ImmutableTree = key==="1"? QbUtils.loadFromJsonLogic(ternaryJsonLogic, updatedConfig) as ImmutableTree : QbUtils.loadFromJsonLogic(ternaryLogic2, updatedConfig) as ImmutableTree  ;
    
      setState(prevState => ({ ...prevState,tree:treeFromJsonLogic }));

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


  //json
  const renderJsonLogicBlock = () => {
    const {logic, data: logicData, errors: logicErrors} = QbUtils.jsonLogicFormat(state.tree, state.config);

    return (
      <div>
        <JsonShower logicErrors={logicErrors} logic={logic} />
      </div>
    );
  }



  //dropdowns
  const [selectedObject, setSelectedObject] = useState<FieldObject | null>(null);

  const items: MenuProps['items'] = fieldObjects.map((obj) => ({
    key: obj.id.toString(),
    label: `ID ${obj.id}`, // Label displayed in the dropdown
  }));

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const selected = fieldObjects.find((obj) => obj.id.toString() === key);
    setSelectedObject(selected || null);
    console.log(selected); // Log the selected object to the console
    if(selected){
      updateConfigFields(selected.fields,key);
    }
   
  };

  return (
    <div>

   <Row justify="end" style={{ marginTop: '20px', marginRight: '40px', marginBottom:'100px'}}>
        <Col>
        <Dropdown menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['1'],
      onClick: handleMenuClick,
    }}>
            <Space>
        Select
        <DownOutlined />
      </Space>
  </Dropdown>
        </Col>
      </Row>

      {/* <MissingMappingAlert></MissingMappingAlert> */}
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
