import Link from 'next/link'

const Index = () => (
  <>
    <h1>Index page</h1>
    <p>Navigating to the index page will cause a slide transition.</p>
    <Link href="/about">
      <a>About us</a>
    </Link>
  </>
)
  
Index.getInitialProps = async function () {
  return { transitionType: 'slide' }
}

export default Index