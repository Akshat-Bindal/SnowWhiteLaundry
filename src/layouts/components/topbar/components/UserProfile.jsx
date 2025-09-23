"use client";

import { userDropdownItems } from "@/layouts/components/data";
import Link from "next/link";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { TbChevronDown, TbLogout } from "react-icons/tb";

const UserProfile = () => {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ Clear token from cookies + localStorage
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    // ✅ Redirect to sign-in
    router.push("/(auth)/auth-1/sign-in");
  };

  return (
    <div className="topbar-item nav-user">
      <Dropdown align="end">
        <DropdownToggle
          as={"a"}
          className="topbar-link dropdown-toggle drop-arrow-none px-2"
        >
          <div className="d-lg-flex align-items-center gap-1 d-none">
            <h5 className="my-0">Snow White</h5>
            <TbChevronDown className="align-middle" />
          </div>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          {userDropdownItems.map((item, idx) => (
            <Fragment key={idx}>
              {item.isHeader ? (
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">{item.label}</h6>
                </div>
              ) : item.isDivider ? (
                <DropdownDivider />
              ) : (
                <DropdownItem as={Link} href={item.url} className={item.class}>
                  {item.icon && <item.icon className="me-2 fs-17 align-middle" />}
                  <span className="align-middle">{item.label}</span>
                </DropdownItem>
              )}
            </Fragment>
          ))}

          {/* Divider before logout */}
          <DropdownDivider />

          {/* Logout Button */}
          <DropdownItem onClick={handleLogout} className="text-danger">
            <TbLogout className="me-2 fs-17 align-middle" />
            <span className="align-middle">Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UserProfile;
