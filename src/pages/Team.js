import { Button, Form, Input, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useGetApi } from "../hooks/useGetApi";
import { usePostApi } from "../hooks/usePostApi";
import { Header } from "../components/Header";
import { ShowMoreCell } from "../utils/ShowMoreCell";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { usePutApi } from "../hooks/usePutApi";
import { useDeleteApi } from "../hooks/useDeleteApi";
import AddIcon from "@mui/icons-material/Add";

const Team = () => {
  const [temsForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const {
    data: memberData,
    isLoading: memberLoading,
    error: memberError,
    getData: getmember,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/members/`);

  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
    getData: getTeams,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/teams/`);

  const {
    data: postTeamData,
    isLoading: postTeamLoading,
    error: postTeamError,
    postData: postTeam,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/add/team/`);

  const {
    data: putteamData,
    isLoading: putteamLoading,
    error: putteamError,
    putData: putteam, // Rename postData to putData
  } = usePutApi(`${process.env.REACT_APP_BASE_URL}/api/teams/`); // Change the URL for putData

  const {
    data: deleteteamData,
    isLoading: deleteteamLoading,
    error: deleteteamError,
    deleteData: deleteteam, // Add deleteData method
  } = useDeleteApi(`${process.env.REACT_APP_BASE_URL}/api/teams/`); // Change the URL for deleteData

  const handleAddTeam = (values) => {
    if (editMode) {
      // If in edit mode, send PUT request
      putteam({ selectedTeamId, values });
    } else {
      postTeam(values);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setEditMode(true);
    setSelectedTeamId(team.id);
    temsForm.setFieldsValue({
      name: team.name,
      members: team?.members?.map((member) => member.id),
    });
    setIsModalOpen(true);
  };

  const handleDeleteTeam = (teamId) => {
    deleteteam({ teamId });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedTeamId(null);
    temsForm.resetFields();
  };

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Members",
      dataIndex: "mebers",
      key: "mebers",
      render: (_, data) => (
        <>
          <ShowMoreCell
            data={data?.members?.map((member) => member.name)}
            maxItems={4}
          />
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, team) => (
        <div className="flex items-center gap-2">
          <Button type="text" onClick={() => handleEditTeam(team)}>
            <EditOutlined />
          </Button>
          <Button type="text" onClick={() => handleDeleteTeam(team.id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (postTeamData || putteamData || deleteteamData) {
      getTeams();
      handleCancel();
    }
  }, [postTeamData, putteamData, deleteteamData]);

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div>Teans</div>
          <div>
            <Button
              type="primary"
              onClick={() => showModal()}
              icon={<AddIcon />}
            >
              Add Tean
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <Table dataSource={teamsData} columns={columns} />
      </div>

      <Modal
        title="Add Customer"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          <Form
            form={temsForm}
            initialValues={{
              remember: true,
            }}
            onFinish={handleAddTeam}
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
              label="Members"
              name="members"
              rules={[
                {
                  required: true,
                  message: "Please select members!",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select members"
              >
                {memberData?.map((member) => (
                  <Select.Option key={member?.id} value={member?.id}>
                    {member?.name}
                  </Select.Option>
                ))}
              </Select>
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

export default Team;
