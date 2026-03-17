import {
  Alert,
  Flex,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
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
  const [form] = Form.useForm();

  const [params, setParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "id",
    sortDescending: true,
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", sorter: true },
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
  ];

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
    } catch (err) {
      setErrors(err.message);
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

  const handleCreateCustomer = async (values) => {
    try {
      setLoading(true);

      await api.post("/Customers", values);

      form.resetFields();
      setOpen(false);
      fetchCustomers();
    } catch (err) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ margin: "50px" }}>
      <Flex gap="middle" vertical>
        {errors && <Alert type="error" message={errors} />}

        <Flex justify="space-between">
          <h2>Customers List ({data.totalCount})</h2>

          <Button type="primary" onClick={() => setOpen(true)}>
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
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />

        <Modal
          title="Create Customer"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateCustomer}>
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
              <Input maxLength={2} />
            </Form.Item>

            <Form.Item name="zip" label="Zip">
              <Input />
            </Form.Item>

            <Form.Item
              name="customerTypeId"
              label="Customer Type Id"
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
              Save Customer
            </Button>
          </Form>
        </Modal>
      </Flex>
    </section>
  );
};

export default Home;
