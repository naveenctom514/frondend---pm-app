import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useGetApi } from "../hooks/useGetApi";
import { usePostApi } from "../hooks/usePostApi";
import { Header } from "../components/Header";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { usePutApi } from "../hooks/usePutApi";
import { useDeleteApi } from "../hooks/useDeleteApi";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
export const disabledDate = (current) => {
  // Disable dates today and before today's date
  return current && current < moment().endOf("day");
};

const Task = () => {
  const [taskForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenProgress, setIsModalOpenProgress] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedtaskId, setSelectedtaskId] = useState(null);
  const [progressUpdates, setProgressUpdates] = useState(null);
  console.log(progressUpdates);
  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
    getData: getCustomer,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/customers/`);

  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    getData: getTasks,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/tasks/`);

  const {
    data: postTaskData,
    isLoading: postTaskLoading,
    error: postTaskError,
    postData: postTask,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/add/task/`);

  const {
    data: postProgressUpdateData,
    isLoading: postProgressUpdateLoading,
    error: postProgressUpdateError,
    postData: postProgressUpdate,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/add-progress-update/`);

  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
    getData: getTeams,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/teams/`);

  const {
    data: puttaskData,
    isLoading: puttaskLoading,
    error: puttaskError,
    putData: puttask, // Rename postData to putData
  } = usePutApi(`${process.env.REACT_APP_BASE_URL}/api/tasks/`); // Change the URL for putData

  const {
    data: deletetaskData,
    isLoading: deletetaskLoading,
    error: deletetaskError,
    deleteData: deletetask, // Add deleteData method
  } = useDeleteApi(`${process.env.REACT_APP_BASE_URL}/api/tasks/`); // Change the URL for deleteData

  const handleAddTask = (values) => {
    if (editMode) {
      // If in edit mode, send PUT request
      puttask({ selectedtaskId, values });
    } else {
      postTask(values);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    console.log(task);
    setEditMode(true);
    setSelectedtaskId(task.id);
    taskForm.setFieldsValue({
      title: task?.title,
      description: task?.description,
      customer: task?.customer?.id,
      team: task?.team?.id,
      submission_date: dayjs(task?.submission_date),
      budget: task?.budget,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    deletetask({ taskId });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedtaskId(null);
    taskForm.resetFields();
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer, data) => <>{data?.customer?.name}</>,
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (team, data) => <>{data?.team?.name}</>,
    },
    {
      title: "Submission Date",
      dataIndex: "submission_date",
      key: "submission_date",
      render: (submission_date) => moment(submission_date).format("DD/MM/YYYY"),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, team) => (
        <div className="flex items-center gap-2">
          <Button type="text" onClick={() => handleEditTask(team)}>
            <EditOutlined />
          </Button>
          <Button type="text" onClick={() => handleDeleteTask(team?.id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (postTaskData || puttaskData || deletetaskData) {
      getTasks();

      setIsModalOpen(false);
      taskForm.resetFields();
    }
  }, [postTaskData, puttaskData, deletetaskData]);

  useEffect(() => {
    if (postProgressUpdateData) {
      getTasks();
      setIsModalOpenProgress(false);
      setSelectedtaskId(null);
    }
  }, [postProgressUpdateData]);

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div>Tasks</div>
          <div>
            <Button
              type="primary"
              onClick={() => showModal()}
              icon={<AddIcon />}
            >
              Add Task
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <Table
          dataSource={tasksData}
          columns={columns}
          expandable={{
            expandedRowRender: (task) => (
              <div>
                <div className="flex justify-between">
                  <div className="font-semibold">Updates</div>
                  <Button
                    icon={<AddIcon />}
                    type="primary"
                    className="mr-2"
                    onClick={() => {
                      setIsModalOpenProgress(true);
                      setSelectedtaskId(task?.id);
                    }}
                  >
                    Progress Updates
                  </Button>
                </div>
                <ol className="list-decimal ml-4">
                  {task?.progress_reports?.map((progressReport, index) => (
                    <li key={index}>
                      {moment(progressReport?.date).format(
                        "DD/MM/YYYY hh:mm A"
                      )}{" "}
                      {"->  "}
                      {progressReport?.progress_details}
                    </li>
                  ))}
                </ol>
              </div>
            ),
          }}
        />
      </div>
      <Modal
        title="Add Progress Updates"
        open={isModalOpenProgress}
        onOk={() => {
          postProgressUpdate({
            task_id: selectedtaskId,
            progress_details: progressUpdates,
          });
        }}
        onCancel={() => {
          setIsModalOpenProgress(false);
          setSelectedtaskId(null);
        }}
        confirmLoading={postProgressUpdateLoading}
      >
        <Input.TextArea
          placeholder="Enter rogress updates"
          value={progressUpdates}
          onChange={(e) => setProgressUpdates(e?.target?.value)}
        />
      </Modal>
      <Modal
        title="Add Task"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
        width={800}
      >
        <div className="mt-4 ">
          <Form
            form={taskForm}
            initialValues={{
              remember: true,
            }}
            onFinish={handleAddTask}
            autoComplete="off"
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Title"
                labelCol={{
                  span: 24,
                }}
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input title!",
                  },
                  {
                    max: 100,
                    message: "Title must not exceed 100 characters",
                  },
                ]}
              >
                <Input placeholder="Title" />
              </Form.Item>
              <Form.Item
                label="Description"
                labelCol={{
                  span: 24,
                }}
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Description" />
              </Form.Item>
              <Form.Item
                label="Customer"
                name="customer"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Please select customer!",
                  },
                ]}
              >
                <Select placeholder="Please select customer">
                  {customerData?.map((customer) => (
                    <Select.Option key={customer?.id} value={customer?.id}>
                      {customer?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Team"
                name="team"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Please select team!",
                  },
                ]}
              >
                <Select placeholder="Please select members">
                  {teamsData?.map((team) => (
                    <Select.Option key={team?.id} value={team?.id}>
                      {team?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Submission Date"
                labelCol={{
                  span: 24,
                }}
                name="submission_date"
                rules={[
                  {
                    required: true,
                    message: "Please input submission date!",
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  className="w-full"
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
              <Form.Item
                label="Budget"
                labelCol={{
                  span: 24,
                }}
                name="budget"
                rules={[
                  {
                    required: true,
                    message: "Please input budget!",
                  },
                ]}
              >
                <Input placeholder="Budget" />
              </Form.Item>
            </div>
            <div className="flex justify-end mr-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={customerLoading}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Task;
