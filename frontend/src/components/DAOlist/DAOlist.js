import React, { useState, useEffect } from "react";

import styles from "./DAOlist.module.css";
import THUBA from "@/temp_assets/THUBA_logo.png";
import Edu from "@/temp_assets/EduDAO_logo.png";
import Bit from "@/temp_assets/bitDAO_logo.jpg";

export default function DAOlist() {
  const tmp_DAO_list = {
    profileList: [
      {
        logoURL: Bit,
        // logoURL: "https://images.unsplash.com/photo-1598124146163-36819847286d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        name: "BIT DAO",
        introduction: "introduction here",
        treasuryAddress: "0xjasiejif",
        access: "admin",
      },
      {
        logoURL: THUBA,
        name: "THUBA DAO",
        introduction: "introduction here",
        treasuryAddress: "0xjasiejif",
        access: "member",
      },
      {
        logoURL: Edu,
        name: "Edu DAO",
        introduction: "introduction here",
        treasuryAddress: "0xjasiejif",
        access: "viewer",
      },
    ],
  };

  return (
    <div>
      {tmp_DAO_list.profileList.map((item) => {
        return (
          <div className={styles.circle}>
            <img src={item.logoURL.src} />
          </div>
        );
      })}
    </div>
  );
}
