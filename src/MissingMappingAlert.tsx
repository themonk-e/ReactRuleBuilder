import React, { useState, useEffect } from 'react';
//import {GroupContainer} from '@react-awesome-query-builder/ui/cjs/components/';
import { Checkbox, CheckboxChangeEvent, Col, Row } from 'antd';
import { after } from 'lodash';

const MyComponent = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsDisabled(e.target.checked);
  };


  useEffect(() => {
   
    const buttonGroup = document.querySelector('.ant-btn-group');

    if (buttonGroup) {
        const buttons = buttonGroup.querySelectorAll('button');

      if (buttons[1]) {
        buttons[1].disabled = isDisabled;
      }
    }

//     if (!isDisabled) {
//         if (buttonGroup) {
//             const buttons = buttonGroup.querySelectorAll('button');
    
//             // Create the new button element
//             const newButton = document.createElement('button');
//             newButton.type = 'button';
//             newButton.className = 'ant-btn css-nqoqt9 ant-btn-default ant-btn-color-default ant-btn-variant-outlined ant-btn-sm';
//             newButton.innerHTML = '<span class="ant-btn-icon"></span><span>Add default condition</span>';

//             newButton.onclick = function () {
//                 GroupContainer.addDefaultCaseGroup(); // Assuming 'existingMethod' is defined globally
//             };
    
//             // Insert the new button after the first button if there is only one button
//             if (buttons.length === 1) {
//                 buttons[0].insertAdjacentElement('afterend', newButton);
//             }
//         }
//     }

// const allGroups = document.querySelectorAll('.group-or-rule-container');

// allGroups.forEach(group => {
//   const groupHeader = group.querySelector('.group--header');
  
//   if (groupHeader && (groupHeader as HTMLElement).innerText.includes('Default')) {
//     if (group.parentNode) {
//       group.parentNode.removeChild(group);
//     }
//   }
// });


if (isDisabled) {
    
const allGroups = document.querySelectorAll('.group-or-rule-container');

allGroups.forEach(group => {
  const groupHeader = group.querySelector('.group--header');
  
  if (groupHeader && (groupHeader as HTMLElement).innerText.includes('Default')) {
    if (group.parentNode) {
       
    (group as HTMLElement).style.display = 'none';

    const previousGroup = group.previousElementSibling;

    console.log(previousGroup);
    // If the previous group exists, adjust its style
    if (previousGroup && previousGroup.querySelector('.group--header')) {
      const prevGroupHeader = previousGroup.querySelector('.group--header');

      // Adjust height of ::before element by modifying styles
      if (prevGroupHeader) {
        (prevGroupHeader as HTMLElement).style.setProperty('border-width', '0 0 0 0'); // Reset or remove height expansion
      }
    }

    }
  }
});
}
else{
    const allGroups = document.querySelectorAll('.group-or-rule-container');

allGroups.forEach(group => {
  const groupHeader = group.querySelector('.group--header');
  
  if (groupHeader && (groupHeader as HTMLElement).innerText.includes('Default')) {
    if (group.parentNode) {
       
    (group as HTMLElement).style.display = 'block';
    }
  }
});
}



    
  }, [isDisabled]); 


  return (
    <div>

    <Row justify="end" style={{ marginTop: '20px', marginRight: '10px' }}>
     <Col>
       <Checkbox checked={isDisabled} onChange={handleCheckboxChange}>
          Enable Missing Alert
        </Checkbox>
     </Col>
    </Row>
    </div>
  );
};

export default MyComponent;
