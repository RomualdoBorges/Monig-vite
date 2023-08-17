import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  AreaChartOutlined,
  BankOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, path) {
  return {
    key,
    icon,
    children,
    label,
    path,
  };
}

const items = [
  getItem("Home", "/", <HomeOutlined />),
  getItem("Dashboard", "/dashboard", <AreaChartOutlined />),
  getItem("Escolas", "/escolas", <BankOutlined />),
  getItem("Eventos", "/eventos", <CalendarOutlined />),
  getItem("Configurações", "/configuracoes", <SettingOutlined />, [
    getItem("Usuário", "/usuario"),
    getItem("Tipo de Evento", "/tipo_evento"),
  ]),
  getItem("Sair", "/login", <LogoutOutlined />),
];

const MyMenu = () => {
  const navigate = useNavigate();

  function handleClick(item) {
    navigate(item.key);
  }

  return (
    <Menu
      onClick={handleClick}
      theme="dark"
      defaultSelectedKeys={[items.key]}
      mode="inline"
      items={items}
    />
  );
};

export default MyMenu;
