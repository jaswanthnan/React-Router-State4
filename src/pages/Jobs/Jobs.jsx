import { useContext, useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, DownloadOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { api } from '../../services/api';

const { confirm } = Modal;

const Jobs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [form] = Form.useForm();
  
  const gridRef = useRef();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const result = await api.get('/jobs');
      const formattedJobs = result.map(job => ({ ...job, id: job._id }));
      setData(formattedJobs);
    } catch (error) {
      message.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const seedDatabase = async () => {
    try {
      setLoading(true);
      await api.post('/seed');
      message.success('Test jobs seeded perfectly!');
      fetchJobs();
    } catch (err) {
      message.error('Failed to seed database');
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingJob(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingJob(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this job?',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: `Title: ${record.title}`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await api.delete(`/jobs/${record.id || record._id}`);
          message.success('Job formally deleted');
          fetchJobs();
        } catch (error) {
          message.error("Failed to delete job");
        }
      },
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: 'Are you sure you want to delete the selected jobs?',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: `This will permanently delete ${selectedRows.length} jobs.`,
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => api.delete(`/jobs/${row.id || row._id}`)));
          message.success(`${selectedRows.length} jobs deleted successfully`);
          setSelectedRows([]);
          fetchJobs();
        } catch (error) {
          message.error("Error bulk deleting jobs");
        }
      },
    });
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    const values = form.getFieldsValue();
    const isFull = values.title && values.department && values.location && values.type && values.status;

    if (isFull && form.isFieldsTouched()) {
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
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id || editingJob._id}`, values);
        message.success('Job updated successfully');
      } else {
        await api.post('/jobs', values);
        message.success('Job added successfully');
      }
      setIsModalVisible(false);
      fetchJobs();
    } catch (error) {
      message.error("Error saving job");
    }
  };

  const onExportClick = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({ 
        fileName: 'jobs_export.csv',
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
        onClick: () => handleDelete(params.data.id)
      }
    ];

    return (
      <div className="flex items-center h-full py-1">
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined style={{ fontSize: '18px' }} />} />
        </Dropdown>
      </div>
    );
  };

  const StatusRenderer = (params) => {
    const status = params.value;
    const colorClass = status === 'Active' ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' : 'text-slate-600 bg-slate-100 border border-slate-200';
    return (
      <div className="flex items-center h-full">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status}
        </span>
      </div>
    );
  };

  const columnDefs = useMemo(() => [
    { 
      field: 'title', 
      headerName: 'Job Title', 
      flex: 1, 
      minWidth: 250, 
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 150 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'status', headerName: 'Status', width: 130, cellRenderer: StatusRenderer },
    { 
      headerName: 'Actions', 
      width: 120, 
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800 fw-bold">Active Job Postings</h2>
        
        <Space size="middle">
          <Input 
            placeholder="Search jobs..." 
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
            Add Job
          </button>
        </Space>
      </div>
      
      <div className="bg-white rounded-md shadow-sm w-full flex flex-col pt-2 mb-6">
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
          />
        </div>
      </div>

      <Modal 
        title={<span className="text-lg font-bold">{editingJob ? "Edit Job" : "Add New Job"}</span>}
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={editingJob ? "Save Changes" : "Create Job"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Please enter job title' }]}>
            <Input placeholder="e.g. Senior Software Engineer" size="large" />
          </Form.Item>
          
          <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please enter the department' }]}>
            <Input placeholder="e.g. Engineering" size="large" />
          </Form.Item>
          
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
            <Input placeholder="e.g. Remote, New York" size="large" />
          </Form.Item>

          <Form.Item name="type" label="Employment Type" rules={[{ required: true, message: 'Please select type' }]}>
             <Select placeholder="Select Type" size="large">
              <Select.Option value="Full-time">Full-time</Select.Option>
              <Select.Option value="Part-time">Part-time</Select.Option>
              <Select.Option value="Contract">Contract</Select.Option>
              <Select.Option value="Internship">Internship</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="Current Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select placeholder="Select job status" size="large">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Closed">Closed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Jobs;
