import css from 'styled-jsx/css'

export const fadeIn = css`
  .fade-enter {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: opacity 300ms, transform 300ms;
  }
`

export const fadeOut = css`
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 300ms;
  }
`

export const indicatorAniamtor = css`
  .indicator-fade-enter {
    opacity: 0;
  }
  .indicator-fade-appear-active,
  .indicator-fade-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }
`
