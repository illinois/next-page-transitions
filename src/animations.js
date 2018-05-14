import css from 'styled-jsx/css'

export const fadeIn = css`
.fade-appear,
.fade-enter {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
}
.fade-appear-active,
.fade-enter-active {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition: opacity 300ms, transform 300ms;
}`

export const fadeOut = css`
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
`
