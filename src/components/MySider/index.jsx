import React, { useState } from "react";
import { Layout } from "antd";
import Logo from "../../assets/logo.svg";
import Logo2 from "../../assets/logo2.svg";
import MyMenu from "../MyMenu";

const MySider = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      {collapsed ? (
        <img src={Logo2} alt="Logo" style={{ padding: "1.5rem 1.7rem" }} />
      ) : (
        <img src={Logo} alt="Logo" style={{ padding: "2rem 3rem" }} />
      )}
      <MyMenu />
    </Layout.Sider>
  );
};

export default MySider;
