import { Fragment } from "react";

const DEFAULT_ENTITY_NAME = "Grupo Vassalli";

export const CopyRight = function () {
  return (
    <Fragment>
      <p
        suppressHydrationWarning
        className="text-center text-[10px]! md:text-[12px]! text-gray-400"
      >
        © {new Date().getFullYear()} {DEFAULT_ENTITY_NAME}
      </p>
    </Fragment>
  );
};
