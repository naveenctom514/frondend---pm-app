import { Badge, Menu } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: key.startsWith("header") ? (
      <>{label}</>
    ) : (
      <NavLink className="inline-flex gap-4" to={`/${key}`}>
        {label}
      </NavLink>
    ),
  };
}

const keysInitials = [ "customer", "task", "members", "team"];

const AdminNavigation = () => {
  const [selectedKey, setSelectedKey] = useState("assessments");
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let pathExists = false;
    keysInitials.forEach((key) => {
      if (pathname === `/${key}`) {
        setSelectedKey(key);
        pathExists = true;
      }
    });

    if (!pathExists) {
      setSelectedKey(null);
    }
  }, [pathname, dispatch]);

  const items = [
    getItem("Members", "members", <SettingOutlined />, null),
    getItem("Team", "team", <SettingOutlined />, null),
  ];

  return (
    <Menu
      style={{
        border: 0,
        background: "inherit",
        color: "inherit",
      }}
      selectedKeys={[selectedKey]}
      onClick={(item) => setSelectedKey(item.key)}
      mode={"inline"}
      theme={"light"}
      items={items}
    />
  );
};

export { AdminNavigation };
