import React from "react";
import { Tabs } from "antd";

const ProfileTabs = ({ tabItems }) => {
  return (
    <Tabs defaultActiveKey="1" size={12} style={{ marginBottom: 32 }} items={tabItems} />
  );
};

export default ProfileTabs;
