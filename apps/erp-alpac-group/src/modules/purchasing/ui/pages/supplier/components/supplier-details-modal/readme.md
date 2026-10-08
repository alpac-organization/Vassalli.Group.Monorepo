Flujo del módulo (qué hace cada servicio)

1. Registrar solicitud (producto existente o nuevo + suppliers)
   ↓
2. Manager/Admin: aprobar / rechazar / cancelar (process)
   ↓
3. Cotizar por ítem × supplier (precio, IVA, adjuntos, vínculo N:M)
   ↓
4. Aceptar cotización(es) para compra
   ↓
5. Enviar a revisión contable → comparativa de cotizaciones
   ↓
6. Enviar a gerencia
   ↓
7. Gerencia aprueba → genera OC(s) por supplier + IMI/IR si aplica
8. Registrar solicitud — RegisterPurchaseRequest
   Por cada ítem: producto existente (product_id) o producto nuevo (new_product).
   Si es nuevo: genera código, inserta en catálogo y crea vínculos SupplierProduct con los suppliers enviados.
   Imágenes del ítem (additional_data.images_product_to_changed en base64) → S3.
9. Cotización — RegisterQuotation / UpdateQuotation
   Por cada (purchase_request_item_id, supplier_id):
   Busca o crea SupplierProduct (create_supplier_product_if_missing, default true).
   Precio: tier preferencial (cantidad ≥ min_quantity y fechas vigentes) o unit_price.
   Si no hay precio en catálogo → exige price_unit en el request.
   price_total = cantidad × precio unitario.
   IVA solo si el producto no es exento (ValidityDeductions, TaxType.Iva).
   Sube imágenes/PDF a S3 y guarda URLs en additional_data.
   Helper interno: PurchaseTaxPricingService (precios, IVA, IMI/IR, tipo de cambio).

10. Detalle / revisiones
    Detalle de solicitud, productos, revisión contable y gerencia incluyen cotizaciones + supplier + supplier_products para la matriz comparativa.
11. Procesar OC — ProcessPurchaseOrder (aprobación gerencia)
    Agrupa cotizaciones aceptadas por supplier → una OC por supplier.
    Total NIO = Σ price_total + Σ iva.
    Si total ≥ 1000 y supplier no exento → IMI + IR desde ValidityDeductions.
    Metadata fiscal en comments con marcador ---TAX---{json}.
    Documentación para frontend (copiar a Docs)
    Archivos sugeridos:

Docs/PurchaseRequests/RegisterPurchaseRequestDocs.md
Docs/PurchaseRequests/RegisterQuotationDocs.md
Docs/PurchaseRequests/UpdateQuotationDocs.md
Docs/PurchaseRequests/ProcessPurchaseOrderTaxesDocs.md
Docs/PurchaseRequests/PurchaseFlowFrontendGuide.md
