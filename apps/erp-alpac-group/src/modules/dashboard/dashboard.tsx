import { Fragment } from "react";
import { Button, Modal } from "@alpac/design-system";
import { useState } from "react";
export const Dashboard = function () {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <div style={{ display: "flex", gap: 20 }}>
        Dashboard
        <Button label="Abrir modal" onClick={() => setOpen(true)} />
        <Modal isOpen={open} onClose={() => setOpen(false)} variant="default">
          <h2>test modal</h2>
          <p>test content</p>
        </Modal>
      </div>
    </Fragment>
  );
};
