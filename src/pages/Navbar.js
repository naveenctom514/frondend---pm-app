import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, Switch } from "antd";
import { NavLink, useLocation } from "react-router-dom";

function getItem(label, key, icon, children) {
  console.log("key", key);

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

const items = [
  getItem("Home", "home", <MailOutlined />, null),
  getItem("Customer", "customer", <AppstoreOutlined />, null),
  getItem("Task", "task", <SettingOutlined />, null),
  getItem("Members", "members", <SettingOutlined />, null),
  getItem("Team", "team", <SettingOutlined />, null),
];
const keysInitials = ["home", "customer", "task", "members", "team"];
const Navbar = () => {
  const [selectedKey, setSelectedKey] = useState("customer");
  const { pathname } = useLocation();
  const [current, setCurrent] = useState("1");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

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
  }, [pathname]);

  return (
    <>
      <Menu
        theme={"light"}
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
      />
    </>
  );
};
export default Navbar;
