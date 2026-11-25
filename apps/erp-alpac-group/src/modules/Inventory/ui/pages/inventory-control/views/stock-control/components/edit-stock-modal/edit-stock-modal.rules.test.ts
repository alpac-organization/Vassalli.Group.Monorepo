import {
   validateMaximumStock,
   validateMinimumStock,
} from "./edit-stock-modal.rules";

describe("edit_stock_modal_inline_rules", () => {
   it("validates minimum stock required, negative, decimals, and max bounds", () => {
      expect(validateMinimumStock("")).toBe("El stock mínimo es obligatorio.");
      expect(validateMinimumStock("-1")).toBe(
         "El stock mínimo no puede ser menor a 0.",
      );
      expect(validateMinimumStock("10.125")).toBe(
         "El stock mínimo solo permite hasta 2 decimales.",
      );
      expect(validateMinimumStock("100000")).toContain(
         "El stock mínimo no puede exceder",
      );
      expect(validateMinimumStock("0")).toBe(true);
      expect(validateMinimumStock("25.5")).toBe(true);
   });

   it("validates maximum stock inline against minimum stock and persisted max", () => {
      expect(
         validateMaximumStock({
            value: "10",
            minimumStockInput: "15",
            currentMinimumStock: 5,
            currentMaximumStock: 20,
         }),
      ).toBe("El stock máximo debe ser mayor al stock mínimo.");

      expect(
         validateMaximumStock({
            value: "",
            minimumStockInput: "25",
            currentMinimumStock: 5,
            currentMaximumStock: 20,
         }),
      ).toBe(
         "El stock máximo actual es menor o igual al nuevo stock mínimo; ingresa un nuevo stock máximo.",
      );

      expect(
         validateMaximumStock({
            value: "50.25",
            minimumStockInput: "25",
            currentMinimumStock: 5,
            currentMaximumStock: 20,
         }),
      ).toBe(true);
   });
});
