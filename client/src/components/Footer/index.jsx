import React from 'react';
import Link from 'next/link';
import { Container, Left, Right, Links } from './style';
import Twitter from '../../icons/Twitter';
import { color } from '../../utils/theme';

const Footer = () => (
  <Container>
    <Left>
      <span>
        {' '}
        A project made by{' '}
        <a
          href="https://twitter.com/_wooolfgang"
          target="_blank"
          rel="noopener noreferrer"
        >
          @_wooolfgang
        </a>{' '}
        and
        <a
          href="https://twitter.com/jansel369"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          @jansel369
        </a>
      </span>
      <span>© {new Date().getFullYear()}, all rights reserved</span>
    </Left>
    <Right>
      <Twitter fill={color.s2} />
      <Links>
        <Link href="/contact" passHref>
          <a href="/contact">Contact</a>
        </Link>
        <Link href="/aboutus" passHref>
          <a href="/aboutus">About Us</a>
        </Link>
        <Link href="/faqs" passHref>
          <a href="/faqs">FAQ's</a>
        </Link>
        <Link href="/support" passHref>
          <a href="/support">Support</a>
        </Link>
      </Links>
    </Right>
  </Container>
);

export default Footer;
