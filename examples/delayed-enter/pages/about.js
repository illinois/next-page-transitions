import React from 'react'
import Link from 'next/link'

class About extends React.Component {
  static shouldDelayEnter = true

  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.props.onLoaded()
      this.setState({ loaded: true })
    }, 2000)
  }

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  }

  render() {
    if (!this.state.loaded) return null
    return (
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
    )
  }
}

export default About
