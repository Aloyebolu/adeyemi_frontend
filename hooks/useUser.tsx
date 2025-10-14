"use client";
import { useState } from "react";

export default function useUser() {

  const dev_mode = true
  const dev_data = {
    role: 'admin',
    access_token: 'dev_override',
    matric_no: '4353',
    name: "DevBreakthrough"
  }

  const role = localStorage.getItem("role");
  const access_token = localStorage.getItem("access_token")
  const matric_no = localStorage.getItem("matric_no");
  const name = localStorage.getItem("name");

  let user;
  dev_mode? user = dev_data : user = { role, access_token , matric_no, name};

  return { user};
}
