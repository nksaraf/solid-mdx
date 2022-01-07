import { JSX } from 'solid-js';
  
type MDXComponents = {
  [key in keyof JSX.IntrinsicElements]: string | ((props: JSX.IntrinsicElements[key]) => JSX.Element);
}
interface MDXProps {
  components?: MDXComponents;
  children?: JSX.Element;
}

type MDXComponent = (props: MDXProps) => JSX.Element;

declare module '*.mdx' {
  const Comp: MDXComponent;
  export default Comp;
}
declare module '*.md' {
  const Comp: MDXComponent;
  export default Comp;
}
declare module '*.markdown' {
  const Comp: MDXComponent;
  export default Comp;
}