import {
  Alert,
  Flex,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const [data, setData] = useState({
    items: [],
    totalCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form] = Form.useForm();

  const [params, setParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "id",
    sortDescending: true,
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/Customers", {
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
          SortBy: params.sortBy,
          SortDescending: params.sortDescending,
        },
      });

      setData(res.data);
    } catch ({ response }) {
      setErrors(response?.data?.errors?.State || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [params]);

  const handleTableChange = (pagination, filters, sorter) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || "id",
      sortDescending: sorter.order === "descend",
    }));
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (editingCustomer) {
        await api.put(`/Customers/${editingCustomer.id}`, values);
      } else {
        await api.post("/Customers", values);
      }

      form.resetFields();
      setEditingCustomer(null);
      setOpen(false);
      fetchCustomers();
    } catch ({ response }) {
      console.log({ response });
      setErrors(response?.data?.errors?.State || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingCustomer(record);

    form.setFieldsValue({
      name: record.name,
      description: record.description,
      address: record.address,
      city: record.city,
      state: record.state,
      zip: record.zip,
      customerTypeId: record.customerTypeId,
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      await api.delete(`/Customers/${id}`);

      fetchCustomers();
    } catch ({ response }) {
      setErrors(response?.data?.errors?.State || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text) => <u>{text}</u>,
    },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Customer Type Name",
      dataIndex: "customerTypeName",
      key: "customerTypeName",
    },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Zip", dataIndex: "zip", key: "zip" },
    { title: "Description", dataIndex: "description", key: "description" },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>

          <Popconfirm
            title="Delete customer?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <section style={{ margin: "50px" }}>
      <Flex gap="middle" vertical>
        {errors?.length > 0 && (
          <Alert type="error" message={errors?.join(", ")} closable />
        )}

        <Flex justify="space-between">
          <h2>Customers List ({data.totalCount})</h2>

          <Button
            type="primary"
            onClick={() => {
              setEditingCustomer(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            Add Customer
          </Button>
        </Flex>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={data.items}
          columns={columns}
          pagination={{
            current: params.pageNumber,
            pageSize: params.pageSize,
            total: data.totalCount,
          }}
          onChange={handleTableChange}
        />

        <Modal
          title={editingCustomer ? "Edit Customer" : "Create Customer"}
          open={open}
          onCancel={() => {
            setOpen(false);
            setEditingCustomer(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>

            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>

            <Form.Item name="zip" label="Zip">
              <Input />
            </Form.Item>

            <Form.Item
              name="customerTypeId"
              label="Customer Type"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Regular", value: 1 },
                  { label: "Premium", value: 2 },
                  { label: "Vip", value: 3 },
                ]}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingCustomer ? "Update Customer" : "Save Customer"}
            </Button>
          </Form>
        </Modal>
      </Flex>
    </section>
  );
};

export default Home;
