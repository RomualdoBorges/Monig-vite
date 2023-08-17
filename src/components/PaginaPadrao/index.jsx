import React from "react";
import { Layout } from "antd";
import MySider from "../../components/MySider";
import MyFooter from "../../components/MyFooter";
import { Outlet } from "react-router-dom";
const { Header, Content } = Layout;

const PaginaPadrao = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MySider />
      <Layout>
        <Header style={{ padding: "0", background: "#fff" }}></Header>
        <Content style={{ margin: "0 1rem" }}>
          <Outlet />
        </Content>
        <MyFooter />
      </Layout>
    </Layout>
  );
};

export default PaginaPadrao;
