import React, { useEffect, useState } from "react";
import { Breadcrumb, Spin } from "antd";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Breadcrumb style={{ margin: "1rem 0" }} items={[{ title: "Home" }]} />

      <div style={{ padding: "2rem", minHeight: "80vh", background: "#fff" }}>
        {loading ? (
          <Spin size="large" style={{ paddingTop: "20rem" }}>
            <div className="content" />
          </Spin>
        ) : (
          <h1>Conteúdo da Home</h1>
        )}
      </div>
    </>
  );
};

export default Home;
