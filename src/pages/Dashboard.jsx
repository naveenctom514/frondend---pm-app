import { Card } from "antd";
import { Header } from "../components/Header";
import { useGetApi } from "../hooks/useGetApi";

export const Dashboard = () => {
  const {
    data: cardData,
    isLoading: cardLoading,
    error: cardError,
    getData: getcard,
  } = useGetApi(`${process.env.REACT_APP_BASE_URL}/api/cards/`);
  return (
    <div>
      <Header>Dashboard</Header>
      <div className="m-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card
          className="w-full"
          title={<div className="font-semibold text-xl">Customer</div>}
        >
          <div className="font-semibold text-lg">{cardData?.customer}</div>
        </Card>
        <Card
          className="w-full"
          title={<div className="font-semibold text-xl">Member</div>}
        >
          <div className="font-semibold text-lg">{cardData?.member}</div>
        </Card>
        <Card
          className="w-full"
          title={<div className="font-semibold text-xl">Team</div>}
        >
          <div className="font-semibold text-lg">{cardData?.team}</div>
        </Card>
        <Card
          className="w-full"
          title={<div className="font-semibold text-xl">Task</div>}
        >
          <div className="font-semibold text-lg">{cardData?.task}</div>
        </Card>
      </div>
    </div>
  );
};
