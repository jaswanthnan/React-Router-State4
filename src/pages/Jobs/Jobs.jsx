import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Tag, Card, Row, Col, Typography, message, Space, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from '../../services/api';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Jobs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobs = await api.get('/jobs');
      setData(jobs);
    } catch (error) {
      message.error('Failed to fetch jobs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingJob(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (job) => {
    setEditingJob(job);
    form.setFieldsValue(job);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this job?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/jobs/${id}`);
          setData(data.filter(job => job._id !== id));
          message.success('Job deleted successfully');
        } catch (error) {
          message.error('Failed to delete job: ' + error.message);
        }
      },
    });
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      if (editingJob) {
        const updatedJob = await api.put(`/jobs/${editingJob._id}`, values);
        setData(data.map(job => job._id === editingJob._id ? updatedJob : job));
        message.success('Job updated successfully');
      } else {
        const newJob = await api.post('/jobs', values);
        setData([...data, newJob]);
        message.success('Job added successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save job: ' + error.message);
    }
  };

  const filteredJobs = useMemo(() => {
    return data.filter(job => {
      const titleMatches = (job.title || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const departmentMatches = (job.department || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchesSearch = titleMatches || departmentMatches;
      const matchesType = filterType === 'All' || job.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [data, searchTerm, filterType]);

  return (
    <div className="container-fluid py-4 min-vh-100 bg-light">
      <div className="w-full flex justify-end items-center mb-4">
        <Space size="middle">
          <Input
            placeholder="Search jobs..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md shadow-sm"
            style={{ width: 250 }}
            allowClear
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            className="shadow-sm"
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }} className="shadow-sm rounded-md">
            Post a Job
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <Col xs={24} sm={12} lg={8} key={job._id}>
                <Card 
                  hoverable 
                  className="h-100 shadow-sm border-0 rounded-3"
                  actions={[
                    <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(job)}>Edit</Button>,
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(job._id)}>Delete</Button>
                  ]}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Tag color={job.status === 'Active' ? 'green' : 'default'} className="rounded-pill px-3 py-1 m-0">
                      {job.status}
                    </Tag>
                    <Tag color="geekblue" className="rounded-pill m-0">{job.type}</Tag>
                  </div>
                  
                  <Title level={4} className="mt-3 mb-1 text-truncate" title={job.title}>{job.title}</Title>
                  <Text type="secondary" className="d-block mb-3">{job.department}</Text>
                  
                  <div className="d-flex align-items-center text-muted">
                    <EnvironmentOutlined className="me-2 text-danger" />
                    <span className="text-truncate">{job.location}</span>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="text-center py-5 text-muted bg-white border rounded">
                <h4 className="mb-2">No jobs found</h4>
                <p className="mb-0">Try adjusting your search term or filter criteria</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal
        title={<span className="fs-5 fw-bold">{editingJob ? 'Edit Job Listing' : 'Post New Job'}</span>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingJob ? "Save Changes" : "Create Job"}
        destroyOnClose
        centered
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Please enter job title' }]}>
            <Input placeholder="e.g. Senior Software Engineer" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please enter department' }]}>
                <Input placeholder="e.g. Engineering" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
                <Input placeholder="e.g. Remote, New York" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Employment Type" rules={[{ required: true, message: 'Please select employment type' }]}>
                <Select placeholder="Select Type" size="large">
                  <Select.Option value="Full-time">Full-time</Select.Option>
                  <Select.Option value="Part-time">Part-time</Select.Option>
                  <Select.Option value="Contract">Contract</Select.Option>
                  <Select.Option value="Internship">Internship</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Current Status" rules={[{ required: true, message: 'Please select status' }]}>
                <Select placeholder="Select status" size="large">
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Closed">Closed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Jobs;
