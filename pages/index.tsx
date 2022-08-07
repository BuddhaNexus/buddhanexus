import React from "react";
import { Copyright } from "@components/Copyright";
import { Container, Description, Main, Title } from "@components/sharedStyles";

export default function Home() {
  return (
    <>
      <Container>
        <Main>
          <Title>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </Title>

          <Description>Get started by editing</Description>
          <Copyright />
        </Main>
      </Container>
    </>
  );
}
