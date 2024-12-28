import React, { useState, useEffect } from "react";
import { Tabs } from "antd";

import FoodMenuScreen from "./FoodMenuScreen.js";
import ViewOrderScreen from "./ViewOrderScreen.js";



const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function FoodManagerScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    console.log(user);
    if (!user || user.isManager === false) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="ml-3 mt-3 mr-3 bs">
      <h1 className="text-center">Food Manager Panel</h1>
      <Tabs defaultActiveKey="1" onChange={callback}>
       
        <TabPane tab="Menu Items" key="1">
          <FoodMenuScreen></FoodMenuScreen>
        </TabPane>
        <TabPane tab="View Orders" key="2">
          <ViewOrderScreen/>
        </TabPane>
        
        
      </Tabs>
    </div>
  );
}

export default FoodManagerScreen;
