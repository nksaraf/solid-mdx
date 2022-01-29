import { HTMLElements, SVGElements } from "./elements";

import {
  createContext,
  Component,
  mergeProps,
  useContext,
  createComponent,
  PropsWithChildren,
  JSX,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export const MDXContext = createContext(
  Object.fromEntries(
    [...HTMLElements, ...SVGElements.keys()].map((el) => [
      el,
      function (props: any) {
        props = mergeProps(props, {
          component: el,
        });
        return createComponent(Dynamic, props);
      },
    ])
  )
);

export const MDXProvider = (
  props: PropsWithChildren<{
    components: {
      [k: string]: (props: any) => JSX.Element;
    };
  }>
) => {
  const context = useContext(MDXContext);
  return createComponent(MDXContext.Provider, {
    get value() {
      return {
        ...context,
        ...(props.components ?? {}),
      };
    },
    get children() {
      return props.children;
    },
  });
};

export const useMDXComponents = () => {
  return useContext(MDXContext);
};
