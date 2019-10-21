import React from 'react'
import Link from 'next/link'

class About extends React.PureComponent {
  render() {
    return (
      <div className="container-fluid bg-success page">
        <h1>About us</h1>
        <Link href="/">
          <a className="btn btn-light">Go back home</a>
        </Link>
        <style jsx>{`
          .page {
            height: 100vh;
          }
        `}</style>
      </div>
    )
  }
}

export default About
