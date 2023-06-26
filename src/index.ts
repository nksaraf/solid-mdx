import { HTMLElements, SVGElements } from "./elements";

import {
  createContext,
  mergeProps,
  useContext,
  createComponent,
  JSX,
  splitProps,
  createMemo,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export type MDXComponents = {
  [key in keyof JSX.IntrinsicElements]: (
    props: JSX.IntrinsicElements[key]
  ) => JSX.Element;
};

export interface MDXProps {
  components?:
    | MDXComponents
    | {
        [k: string]: (props: any) => JSX.Element;
      };
  children?: JSX.Element;
}

export type MDXComponent = (props: MDXProps) => JSX.Element;

export const MDXContext = createContext<MDXComponents>(
  [...HTMLElements, ...SVGElements].reduce((acc, el) => {
    acc[el] = (props: JSX.IntrinsicElements[typeof el]) => {
      return createComponent(
        Dynamic,
        mergeProps(props, {
          component: el,
        })
      );
    };

    return acc;
  }, {} as MDXComponents)
);

export const MDXProvider: MDXComponent = (props) => {
  const context = useContext(MDXContext);
  const [local, other] = splitProps(props, ["children"]);
  const value = createMemo(() => ({ ...context, ...other.components }));

  return createComponent(MDXContext.Provider, {
    get value() {
      return value();
    },
    get children() {
      return local.children;
    },
  });
};

export const useMDXComponents = () => {
  return useContext(MDXContext);
};
