import { Button, Form, Input, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useGetApi } from "../hooks/useGetApi";
import { usePostApi } from "../hooks/usePostApi";
import { Header } from "../components/Header";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { usePutApi } from "../hooks/usePutApi";
import { useDeleteApi } from "../hooks/useDeleteApi";
import AddIcon from "@mui/icons-material/Add";

const Member = () => {
  const [memberForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const {
    data: memberData,
    isLoading: memberLoading,
    error: memberError,
    getData: getmember,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/members/`);

  const {
    data: postmemberData,
    isLoading: postmemberLoading,
    error: postmemberError,
    postData: postMember,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/add/member/`);

  const {
    data: putmemberData,
    isLoading: putmemberLoading,
    error: putmemberError,
    putData: putmember, // Rename postData to putData
  } = usePutApi(`${process.env.REACT_APP_BASE_URL}/api/members/`); // Change the URL for putData

  const {
    data: deletememberData,
    isLoading: deletememberLoading,
    error: deletememberError,
    deleteData: deletemember, // Add deleteData method
  } = useDeleteApi(`${process.env.REACT_APP_BASE_URL}/api/members/`); // Change the URL for deleteData

  const handleEditMember = (member) => {
    setEditMode(true);
    setSelectedMemberId(member.id);
    memberForm.setFieldsValue({
      name: member.name,
      email: member.email,
      role: member.role,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    deletemember({ memberId });
  };

  const handleAddMember = (values) => {
    if (editMode) {
      // If in edit mode, send PUT request
      putmember({ selectedMemberId, values });
    } else {
      postMember(values);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedMemberId(null);
    memberForm.resetFields();
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, member) => (
        <div className="flex items-center gap-2">
          <Button type="text" onClick={() => handleEditMember(member)}>
            <EditOutlined />
          </Button>
          <Button type="text" onClick={() => handleDeleteMember(member.id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (postmemberData || putmemberData || deletememberData) {
      getmember();
      handleCancel();
    }
  }, [postmemberData, putmemberData, deletememberData]);

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div>Members</div>
          <div>
            <Button
              type="primary"
              onClick={() => showModal()}
              icon={<AddIcon />}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <Table dataSource={memberData} columns={columns} />
      </div>

      <Modal
        title="Add Customer"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          <Form
            form={memberForm}
            initialValues={{
              remember: true,
            }}
            onFinish={handleAddMember}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input name!",
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
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Please input role!",
                },
              ]}
            >
              <Input placeholder="Role" />
            </Form.Item>
            <div className="flex justify-end mr-2">
              <Button type="primary" htmlType="submit" loading={memberLoading}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Member;
