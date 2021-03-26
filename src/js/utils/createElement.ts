export default (
  tag: string,
  props?: object,
  children: Array<HTMLElement> | string = []
): HTMLElement => {
  const elem = document.createElement(tag);

  Object.keys(props).forEach((key: string) => {
    if (key.startsWith("data-")) {
      return elem.setAttribute(key, props[key]);
    }

    elem[key] = props[key];
  });

  if (typeof children === "string") {
    elem.textContent = children;
  } else {
    children.forEach((child) => {
      elem.append(child);
    });
  }
  return elem;
};
