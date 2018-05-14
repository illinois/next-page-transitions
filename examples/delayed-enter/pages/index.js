import React from 'react'
import Link from 'next/link'

const Index = () => (
  <div className="page">
    <h1>Hello, world!</h1>
    <Link href="/about">
      <a>About us</a>
    </Link>
    <style jsx>{`
      .page {
        background: green;
        height: 90vh;
      }
    `}</style>
  </div>
)

export default Index
