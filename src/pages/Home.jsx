import { Alert, Flex, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState(null);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Customer Type Name",
      dataIndex: "customerTypeName",
      key: "customerTypeName",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Zip",
      dataIndex: "zip",
      key: "zip",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  useEffect(() => {
    api
      .get("/Customers")
      .then((res) => setData(res.data))
      .catch((err) => setErrors([err.message]));
  }, []);

  return (
    <section className="" style={{ margin: "50px" }}>
      <Flex gap="medium" vertical>
        {errors && <Alert>{errors ?? "An error occurred"}</Alert>}
        <h2>Customers List ({(data?.totalCount)})</h2>
        <Table dataSource={data.items} columns={columns} />;
      </Flex>
    </section>
  );
};

export default Home;
