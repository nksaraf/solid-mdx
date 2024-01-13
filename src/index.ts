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

function convertCamelToKebab(obj: Record<string, string>): Record<string, string> {
  const kebabObj: Record<string, string> = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      kebabObj[kebabKey] = obj[key];
    }
  }

  return kebabObj;
}

export const MDXContext = createContext(
  Object.fromEntries(
    [...HTMLElements, ...SVGElements.keys()].map((el) => [
      el,
      function(props: any) {
        // Transform style
        if (props.style) {
          props.style = convertCamelToKebab(props.style)
        }

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
