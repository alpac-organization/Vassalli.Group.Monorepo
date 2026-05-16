import { Fragment } from "react";

const DEFAULT_ENTITY_NAME = "Grupo Vasalli";

export type CopyRightProps = {
  entityName?: string;
};

export const CopyRight = function ({
  entityName = DEFAULT_ENTITY_NAME,
}: CopyRightProps) {
  return (
    <Fragment>
      <p
        suppressHydrationWarning
        className="text-center text-[10px]! md:text-[12px]! text-gray-400"
      >
        © {new Date().getFullYear()} {entityName}
      </p>
    </Fragment>
  );
};
