import React from 'react';
import Link from 'next/link';

const Header = () => (
  <div>
    <Link href="/">
      <a href="/">Home</a>
    </Link>
    <Link href="/about">
      <a href="/about">About</a>
    </Link>
  </div>
);

export default Header;
