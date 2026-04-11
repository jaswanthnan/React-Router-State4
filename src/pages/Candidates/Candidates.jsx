import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Tag, Avatar, Modal, Form, Input, Select, Button, Space, message, Dropdown } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, DownloadOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { api } from '../../services/api';

const { confirm } = Modal;

const Candidates = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [form] = Form.useForm();

  const gridRef = useRef();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const result = await api.get('/candidates');
      setData(result);
    } catch (error) {
      message.error("Failed to fetch candidates from MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const seedDatabase = async () => {
    try {
      await api.post('/seed');
      fetchCandidates();
      message.success("Database seeded successfully!");
    } catch (error) {
      message.error("Failed to seed database: " + error.message);
    }
  };

  const showAddModal = () => {
    setEditingCandidate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingCandidate(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this candidate?',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await api.delete(`/candidates/${id}`);
          message.success('Candidate deleted successfully');
          fetchCandidates();
        } catch (error) {
          message.error('Failed to delete candidate');
        }
      },
    });
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      confirm({
        title: 'Are you sure?',
        icon: <ExclamationCircleOutlined className="text-amber-500" />,
        content: 'You have unsaved changes. Are you sure you want to close and lose this data?',
        okText: 'Yes, Discard',
        okType: 'danger',
        cancelText: 'No, Keep Editable',
        onOk: () => setIsModalVisible(false),
      });
    } else {
      setIsModalVisible(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingCandidate) {
        await api.put(`/candidates/${editingCandidate._id}`, values);
        message.success("Candidate updated successfully!");
      } else {
        await api.post('/candidates', values);
        message.success("Candidate added successfully!");
      }
      setIsModalVisible(false);
      fetchCandidates();
    } catch (error) {
      message.error("Failed to save candidate");
    }
  };

  const onExportClick = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'candidates_export.csv',
        onlySelected: true
      });
    }
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      setSelectedRows(selectedData);
    }
  }, []);

  const handleBulkDelete = () => {
    confirm({
      title: `Are you sure you want to delete ${selectedRows.length} candidate(s)?`,
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => api.delete(`/candidates/${row._id}`)));
          message.success(`${selectedRows.length} candidates deleted successfully`);
          setSelectedRows([]);
          fetchCandidates();
        } catch (error) {
          message.error('Failed to delete some candidates');
          fetchCandidates(); // refresh anyway to get accurate state
        }
      },
    });
  };

  // AG Grid Cell Renderers
  const ActionCellRenderer = (params) => {
    const items = [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => showEditModal(params.data)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined className="text-red-500" />,
        label: <span className="text-red-500">Delete</span>,
        onClick: () => handleDelete(params.data._id)
      }
    ];

    return (
      <div className="flex items-center gap-2 h-full py-1">
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined style={{ fontSize: '18px' }} />} />
        </Dropdown>
      </div>
    );
  };

  const StatusRenderer = (params) => {
    const status = params.value;
    let color = status === 'Hired' ? 'green' : (status === 'In Review' || status === 'Pending') ? 'blue' : 'gray';
    if (status === 'Rejected') color = 'red';
    return (
      <div className="flex items-center h-full">
        <Tag color={color} className="rounded-full px-3 font-medium m-0">
          {status ? status.toUpperCase() : ''}
        </Tag>
      </div>
    );
  };

  const NameRenderer = (params) => {
    return (
      <div className="flex items-center gap-3 h-full">
        <Avatar icon={<UserOutlined />} className="bg-blue-500 shadow-sm" size="small" />
        <span className="font-semibold text-slate-700">{params.value}</span>
      </div>
    );
  };

  const columnDefs = useMemo(() => [
    {
      field: 'name',
      headerName: 'Candidate Name',
      flex: 1,
      minWidth: 250,
      cellRenderer: NameRenderer,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 150 },
    { field: 'experience', headerName: 'Experience', width: 130 },
    { field: 'status', headerName: 'Status', width: 150, cellRenderer: StatusRenderer },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false,
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="container-fluid py-2 h-full flex flex-col">
      <div className="w-full flex justify-end items-center mb-4">
        <Space size="middle">
          <Input
            placeholder="Search candidates..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="rounded-md shadow-sm"
            style={{ width: 250 }}
            allowClear
          />
          {selectedRows.length > 0 && (
            <>
              <Button icon={<DownloadOutlined />} onClick={onExportClick} className="shadow-sm rounded-md" style={{ borderColor: '#10b981', color: '#10b981' }}>
                Export CSV ({selectedRows.length})
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} className="shadow-sm rounded-md">
                Delete Selected ({selectedRows.length})
              </Button>
            </>
          )}
          <button className="btn btn-primary shadow-sm px-4 rounded-md" onClick={showAddModal}>
            Add Candidate
          </button>
        </Space>
      </div>

      {data.length === 0 && !loading && (
        <div className="p-4 text-center border-b border-gray-100">
          <p className="text-gray-500 mb-3">Database is empty.</p>
          <button className="btn btn-outline-primary btn-sm" onClick={seedDatabase}>Seed Test Data to MongoDB</button>
        </div>
      )}

      <div className="ag-theme-alpine w-full">
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          domLayout='autoHeight'
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          rowHeight={50}
          suppressCellFocus={true}
          overlayLoadingTemplate={loading ? '<span class="ag-overlay-loading-center">Fetching candidates...</span>' : null}
        />
      </div>

      <Modal
        title={<span className="text-lg font-bold">{editingCandidate ? "Edit Candidate" : "Add New Candidate"}</span>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingCandidate ? "Save Changes" : "Create Candidate"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your full name' }]}>
            <Input placeholder="e.g. John Doe" size="large" />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter the role' }]}>
            <Input placeholder="e.g. Frontend Engineer" size="large" />
          </Form.Item>

          <Form.Item name="experience" label="Experience" rules={[{ required: true, message: 'Please enter the years of experience' }]}>
            <Input placeholder="e.g. 3 Years" size="large" />
          </Form.Item>

          <Form.Item name="status" label="Current Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select placeholder="Select candidate status" size="large">
              <Select.Option value="In Review">In Review</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Hired">Hired</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Candidates;
