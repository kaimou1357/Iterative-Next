"use client";
import { Fragment, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useStytchUser, useStytch } from "@stytch/nextjs";
import { Button, Navbar } from "flowbite-react";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const { user } = useStytchUser();
  const stytchClient = useStytch();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    stytchClient.session.revoke();
  }, [stytchClient]);

  const isAuthenticated = user !== null;

  if (pathname.includes("/deployments/")) {
    return (
      <Navbar fluid className="flex justify-center">
        <Link href={"/tool"}>
          <Button>Build your Prototype</Button>
        </Link>
      </Navbar>
    );
  }
  return (
    <Navbar fluid>
      <Navbar.Brand href="/">
        <img
          src="/favicon.png"
          className="mr-3 h-6 sm:h-9"
          alt="Iterative Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Iterative
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {isAuthenticated ? (
          <Button onClick={handleLogout} href="">
            Sign Out
          </Button>
        ) : (
          <Button href="/login">Sign up</Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {isAuthenticated ? (
          <>
            <Navbar.Link href="/tool">Create</Navbar.Link>
            <Navbar.Link href="/projects">Projects</Navbar.Link>
            <Navbar.Link href="/deployments">Deployments</Navbar.Link>
          </>
        ) : null}
      </Navbar.Collapse>
    </Navbar>
  );
}
