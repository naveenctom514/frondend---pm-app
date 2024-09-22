import { Button, Form, Input, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useGetApi } from "../hooks/useGetApi";

import { Header } from "../components/Header";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { usePostApi } from "../hooks/usePostApi";
import { usePutApi } from "../hooks/usePutApi";
import { useDeleteApi } from "../hooks/useDeleteApi";
import AddIcon from "@mui/icons-material/Add";

const Customer = () => {
  const [customerForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
    getData: getCustomer,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/customers/`);

  const {
    data: postcustomerData,
    isLoading: postcustomerLoading,
    error: postcustomerError,
    postData: postCustomer,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/add/customers/`);

  const {
    data: putCustomerData,
    isLoading: putCustomerLoading,
    error: putCustomerError,
    putData: putCustomer, // Rename postData to putData
  } = usePutApi(`${process.env.REACT_APP_BASE_URL}/api/customers/`); // Change the URL for putData

  const {
    data: deleteCustomerData,
    isLoading: deleteCustomerLoading,
    error: deleteCustomerError,
    deleteData: deleteCustomer, // Add deleteData method
  } = useDeleteApi(`${process.env.REACT_APP_BASE_URL}/api/customers/`); // Change the URL for deleteData

  const handleAddCustomer = (values) => {
    if (editMode) {
      // If in edit mode, send PUT request
      putCustomer({ selectedCustomerId, values });
    } else {
      // Otherwise, send POST request
      postCustomer(values);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditMode(true);
    setSelectedCustomerId(customer.id);
    customerForm.setFieldsValue({
      name: customer.name,
      email: customer.email,
      company: customer.company,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customerId) => {
    deleteCustomer({ customerId });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedCustomerId(null);
    customerForm.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Action",
      key: "action",
      render: (_, customer) => (
        <div className="flex items-center gap-2">
          <Button type="text" onClick={() => handleEditCustomer(customer)}>
            <EditOutlined />
          </Button>
          <Button type="text" onClick={() => handleDeleteCustomer(customer.id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (postcustomerData || putCustomerData || deleteCustomerData) {
      getCustomer();
      handleCancel();
    }
  }, [postcustomerData, putCustomerData, deleteCustomerData]);

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div>Customer</div>
          <div>
            <Button type="primary" onClick={showModal} icon={<AddIcon />}>
              Add Customer
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <Table dataSource={customerData} columns={columns} />
      </div>

      <Modal
        title={editMode ? "Edit Customer" : "Add Customer"}
        visible={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          <Form
            form={customerForm}
            onFinish={handleAddCustomer}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
                {
                  max: 100,
                  message: "Name must not exceed 100 characters",
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Company"
              name="company"
              rules={[
                {
                  required: true,
                  message: "Please input your company!",
                },
              ]}
            >
              <Input placeholder="Company" />
            </Form.Item>
            <div className="flex justify-end mr-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={postcustomerLoading || putCustomerLoading}
              >
                {editMode ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Customer;
