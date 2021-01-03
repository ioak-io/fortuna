import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import OakFooter from '../../oakui/OakFooter';
import OakModal from '../../oakui/OakModal';
import OakSection from '../../oakui/OakSection';
import OakTable from '../../oakui/OakTable';
import './ModalDemo.scss';

const ModalDemo = () => {
  const authorization = useSelector(state => state.authorization);
  const [visible, setVisible] = useState(false);
  const header = [
    {
      key: 'category',
      label: 'Category',
      dtype: 'input_select',
      elements: [
        { key: 'gr', value: 'Grocery' },
        { key: 'me', value: 'Meat' },
        { key: 'fr', value: 'Fruits' },
      ],
    },
    {
      key: 'amount',
      label: 'Amount',
      dtype: 'input_number',
    },
    {
      key: 'description',
      label: 'Description',
      dtype: 'input',
    },
    {
      key: 'comment',
      label: 'Comment',
      dtype: 'text',
    },
    {
      key: 'comment2',
      label: 'Comment',
      dtype: 'input_text',
    },
    // {
    //   key: 'comment3',
    //   label: 'Comment',
    //   dtype: 'text',
    // },
    // {
    //   key: 'comment4',
    //   label: 'Comment',
    //   dtype: 'text',
    // },
    // {
    //   key: 'comment5',
    //   label: 'Comment',
    //   dtype: 'text',
    // },
    // {
    //   key: 'comment6',
    //   label: 'Comment',
    //   dtype: 'text',
    // },
    // {
    //   key: 'comment7',
    //   label: 'Comment',
    //   dtype: 'text',
    // },
  ];

  const [data, setData] = useState([
    {
      id: 1,
      category: 'fr',
      description: 'repellendus rerum molestias perspiciatis neque',
      comment: 'laudantium aliquid',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 100,
    },
    {
      id: 2,
      category: 'gr',
      description: 'Velit laborum quam nisi',
      comment: 'commodi impedit',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 200,
    },
    {
      id: 3,
      category: 'me',
      description: 'perspiciatis neque',
      comment: 'laudantium aliquid',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 100,
    },
    {
      id: 4,
      category: 'me',
      description: 'Velit laborum quam nisi',
      comment: 'commodi impedit',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 200,
    },
    {
      id: 5,
      category: 'fr',
      description: 'repellendus rerum molestias perspiciatis neque',
      comment: 'laudantium aliquid',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 100,
    },
    {
      id: 6,
      category: 'gr',
      description: 'Velit laborum quam nisi',
      comment: 'commodi impedit',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 200,
    },
    {
      id: 7,
      category: 'fr',
      description: 'perspiciatis neque',
      comment: 'laudantium aliquid',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 100,
    },
    {
      id: 8,
      category: 'me',
      description: 'Velit laborum quam nisi',
      comment: 'commodi impedit',
      comment2: 'Voluptatem optio',
      comment3: 'Voluptatem optio',
      comment4: 'ducimus temporibus',
      comment5: 'Voluptatem optio',
      comment6: 'Voluptatem optio',
      comment7: 'ducimus temporibus',
      amount: 200,
    },
  ]);

  const handleDeleteRow = (actionName, row) => {
    console.log(actionName, row);
  };

  const actionColumn = {
    label: '',
    actions: [
      {
        label: 'Delete',
        icon: 'delete',
        actionHandler: handleDeleteRow,
        actionName: 'delete',
      },
      {
        label: 'Edit',
        theme: 'secondary',
        variant: 'regular',
        actionHandler: handleDeleteRow,
        actionName: 'edit',
      },
    ],
  };

  const handleCellDataChange = (row, column, value) => {
    console.log(row, column, value);
    const dataToUpdate = [...data];
    let matchData = dataToUpdate.find(item => item.id === row.id);
    if (matchData) {
      matchData[column] = value;
    }
    setData(dataToUpdate);
  };

  const onChangePage = (
    pageNo,
    rowsPerPage,
    sortField,
    sortAsc,
    searchText
  ) => {
    console.log(pageNo, rowsPerPage, sortField, sortAsc, searchText);
  };

  return (
    <>
    <div className="modal-demo">
      <OakModal visible={visible} toggleVisibility={() => setVisible(!visible)} label="Modal test dialog">
        <div className="modal-body">
          modal body slot
        </div>
        <div className="modal-footer">
        <OakButton action={() => setVisible(true)} theme="primary" variant="regular">Open modal</OakButton>
        <OakButton action={() => setVisible(true)} theme="primary" variant="regular">Open modal</OakButton>
        </div>
      </OakModal>
    </div>
    <OakSection outer>
    <OakFooter>
    <OakButton action={() => setVisible(true)} theme="primary" variant="regular">Open modal</OakButton>
    </OakFooter>
    </OakSection>
    </>
  );
};

export default ModalDemo;
