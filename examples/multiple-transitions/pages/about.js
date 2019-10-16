import Link from 'next/link'

const About = () => (
  <>
    <h1>About page</h1>
    <p>Navigating to the about page will cause a fade transition.</p>
    <Link href="/">
      <a>Back to home</a>
    </Link>
  </>
)
  
About.getInitialProps = async function () {
  return { transitionType: 'fade' }
}

export default About