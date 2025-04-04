import { ReactNode } from "react";

import classNames from "classnames";

interface GridProps {
  children?: ReactNode;
  className?: string;
  testId?: string;
}

const Grid = ({ children, className, testId }: GridProps) => {
  return (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  );
};

interface RowProps {
  children?: ReactNode;
  align?: "normal" | "top" | "middle" | "bottom";
  justify?:
    | "normal"
    | "start"
    | "center"
    | "end"
    | "space-around"
    | "space-between";
  className?: string;
  testId?: string;
}

export const Row = ({
  children,
  align = "normal",
  justify = "normal",
  className,
  testId,
}: RowProps) => {
  const alignMap = {
    normal: "items-stretch",
    top: "items-start",
    middle: "items-center",
    bottom: "items-end",
  };

  const justifyMap = {
    normal: "justify-start",
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    "space-around": "justify-around",
    "space-between": "justify-between",
  };

  return (
    <div
      className={classNames(
        "flex flex-wrap -mx-2",
        alignMap[align],
        justifyMap[justify],
        className,
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

interface ColProps {
  children?: ReactNode;
  w?: number;
  offset?: number;
  xs?: number;
  m?: number;
  l?: number;
  xl?: number;
  className?: string;
  testId?: string;
}

export const Col = ({
  children,
  w,
  xs,
  m,
  l,
  xl,
  className,
  testId,
}: ColProps) => {
  const getWidthClass = (size?: number, breakpoint?: string) => {
    if (!size) return "";
    const fractions: Record<number, string> = {
      1: "1/12",
      2: "1/6",
      3: "1/4",
      4: "1/3",
      6: "1/2",
      8: "2/3",
      9: "3/4",
      12: "full",
    };
    const fraction = fractions[size] || `${size}/12`;
    return breakpoint ? `${breakpoint}:w-${fraction}` : `w-${fraction}`;
  };

  const classes = classNames(
    "px-2",
    getWidthClass(w),
    getWidthClass(xs, "xs"),
    getWidthClass(m, "md"),
    getWidthClass(l, "lg"),
    getWidthClass(xl, "xl"),
    className,
  );

  return (
    <div className={classes} data-testid={testId}>
      {children}
    </div>
  );
};

export default Grid;
