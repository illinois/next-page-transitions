import React, { Fragment } from 'react'
import Link from 'next/link'

const About = () => (
  <Fragment>
    <div className="page">
      <h1>About us</h1>
      <Link href="/">
        <a>Go back home</a>
      </Link>
      <style jsx>{`
        .page {
          background: red;
          height: 90vh;
        }
      `}</style>
    </div>
  </Fragment>
)

export default About
