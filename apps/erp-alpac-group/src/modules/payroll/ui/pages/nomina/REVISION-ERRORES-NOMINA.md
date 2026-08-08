# Revisión de posibles errores — Módulo de Nómina

Documento de hallazgos (solo análisis, sin cambios de código).  
Alcance: `apps/erp-alpac-group/src/modules/payroll` con foco en la página de nómina, hooks y servicios relacionados.

---

## Resumen

| Severidad | Cantidad |
|-----------|----------|
| Alta      | 10       |
| Media     | 15       |
| Baja      | 3        |

---

## Alta

| # | Error | Archivo | Línea(s) | Descripción | Posible solución |
|---|-------|---------|----------|-------------|------------------|
| 1 | Salario ordinario duplicado en recibo | `.../payment-receipts/components/standard-receipt.tsx` | 30, 63 | La línea `ORDINARIO` usa `biweekly_salary * 2` y también se calcula `monthlySalary` igual. En un recibo quincenal esto infla el ingreso ordinario frente al neto (`total_to_pay`). | Usar `biweekly_salary` en ORDINARIO (quincenal). Reservar `* 2` solo si el recibo es explícitamente mensual. |
| 2 | Feriado nunca se muestra en recibo | `.../payment-receipts/components/standard-receipt.tsx` | 33 | Se lee `item.feriado`, pero el contrato de nómina expone `holiday_pay` (`get-payroll.ts` ~42). El feriado queda siempre en 0. | Mapear `item.holiday_pay ?? 0` (o normalizar `feriado` al armar el documento). |
| 3 | Sanciones omitidas en recibo | `.../payment-receipts/components/standard-receipt.tsx` | 42–59 | `deductionLines` no incluye `Sanction` (sí existe en `AdditionalDeductions`). Una sanción no aparece y `totalEgresos` queda incompleto. | Agregar `{ label: "Sanción", value: deductions?.Sanction ?? 0 }` y alinear con todas las claves reales. |
| 4 | BAC usa salario base, no neto | `.../bac-report-pdf/utils/bac-report.utils.ts` | 13 | El reporte BAC mapea `biweekly_salary` como monto. Para transferencia bancaria normalmente se requiere `total_to_pay`. | Confirmar con negocio; si es depósito de nómina, usar `total_to_pay`. |
| 5 | `company_id` vs `companie_id` en listado de deducciones | `.../deduction-services/DeductionsServicesByPayroll.ts` | 21–24 | El servicio desestructura `companie_id`, pero `GetDeductionsRequest` extiende `BaseRequest` con `company_id`. Resultado: URL `/companies/undefined/...`. | Usar `company_id` de forma consistente en request, servicio y callers. |
| 6 | Detalle de deducción: callers vs servicio | `DeductionsServicesByPayroll.ts` + callers (`modal-details-payroll.tsx`, etc.) | 35–41 (servicio) | `GetDeductionDetailsAsync` usa `company_id`; algunos callers pasan `companie_id` → URL rota. | Unificar el nombre del campo en contrato y payloads de UI. |
| 7 | URL de reportes sin `/` inicial | `.../payroll-services/PayrollServices.ts` | 109 | Usa `` `companies/${company_id}/...` ``; el resto usa `` `/companies/...` ``. Con Axios puede resolverse mal respecto a `baseURL`. | Prefijar `/companies/...` como en los demás métodos. |
| 8 | Crash al mapear nómina cerrada | `.../payroll-services/PayrollServices.ts` | 204–206 | `raw.ordinary_payroll_data.map` / `professional_services_payroll_data.map` sin guardas. Si el API manda `null`/`undefined`, hay runtime crash. | Usar `(raw.ordinary_payroll_data ?? []).map(...)` (igual para professional). |
| 9 | Purísima Excel: `number_fortnights` puede ser `NaN` | `.../deductions/utils/parse-purisima-excel.ts` | 117–135 | Columna D vacía → `"empty"` → `Number("empty")` = `NaN`. `NaN ?? 0` no cae al 0. Se puede enviar payload inválido. | Validar quincenas como entero `> 0`; manejar `"empty"` explícitamente; no usar `??` tras `Number()`. |
| 10 | Filtro de área se pierde en exportaciones | `.../nomina/payroll-page.tsx` | 1774, 1845, 3129 | En Excel de ingresos/deducciones y plantilla se envía `work_area_id`, pero el request define `area_id`. Con filtro activo se exporta el universo completo. | Unificar a `area_id: workAreaFilter \|\| undefined` como en el resto de handlers. |

---

## Media

| # | Error | Archivo | Línea(s) | Descripción | Posible solución |
|---|-------|---------|----------|-------------|------------------|
| 11 | Check “sin datos” ignora salario base | `.../nomina/payroll-page.tsx` | 860–871 | `hasNoPayableData` solo mira `INCOME_KEYS` + deducciones adicionales. No considera `biweekly_salary`, `gross_salary` ni `total_to_pay`. Puede bloquear recibos válidos. | Basar el gate en `total_to_pay` / `gross_salary` (con `?? 0`). |
| 12 | `INCOME_KEYS` incompleto | `.../nomina/utils/payroll.utls.ts` | 12–20 | No incluye `holiday_pay` ni `lodging`. Gates de reportes pueden decir “no hay datos” cuando solo hay feriado. | Ampliar keys al set real de columnas/conceptos, o basar el check en `total_income`/`gross_salary`. |
| 13 | `DEDUCTION_KEYS` incompleto | `.../nomina/utils/payroll.utls.ts` | 21–29 | No incluye `Sanction`, `SalaryAdvance`, `ChristmasBonusAdvance`. Misma lógica de “sin datos” incompleta. | Incluir todas las claves de `AdditionalDeductions` usadas en UI. |
| 14 | Embargo: errores de UI mal cableados | `.../deductions/judicial-garnishment/judicial-garnishment.tsx` | 34, 67–69 | Error de moneda lee `errors.loans_payload?.currency`; monto lee `errors.purisima_information?...`. Las validaciones de embargo no se muestran. | Usar `errors.judicial_seizure_payload?.currency` y `?.total_amount_to_pay`. |
| 15 | Embargo: mensaje y % sin tope | `.../deductions/judicial-garnishment/judicial-garnishment.tsx` | 78–90 | `required` dice “Cantidad de días…”. No hay validación `<= 100` ni `setValueAs` numérico claro. | Mensaje correcto, `setValueAs` a number, validar rango `(0, 100]`. |
| 16 | Form de deducción no limpia embargo/sanción | `.../deductions/add-deduction-form/add-deduction-form.tsx` | ~133–141 | Al cambiar tipo se limpian late/purísima/préstamo, pero no `judicial_seizure_payload` ni `sansion_payload`. Valores fantasma afectan `isDirty`/`isValid`. | Limpiar también esos payloads (y child support si aplica) al cambiar tipo. |
| 17 | Pensión alimenticia sin submit | `.../deductions/add-deduction-form/add-deduction-form.tsx` + `child-support-garnishment.tsx` | form ~211–528 / submit ~855–869 | El tipo está en el enum y puede habilitar el botón, pero `handleSubmitDeduction` no maneja el caso (no-op / “en desarrollo”). | Excluirlo de opciones o forzar `isSubmitDisabled` hasta implementarlo. |
| 18 | Depreciación: submit sin colaborador | `.../incomes/create-income-form/create-income-form.tsx` | ~731–750, ~802–812 | Comisión/bono exigen `foundCollaborator`; depreciación solo valida montos. Puede enviar `identification_number: ""`. | Exigir colaborador también en depreciación y guardar en `onSubmit`. |
| 19 | Subsidio: fechas siempre truthy con dayjs | `.../subsidies/add-subsidy-form/add-subsidy-form.tsx` | 68–69 | `dayjs(x) ? … : null` siempre es truthy (objeto dayjs). Fechas inválidas pueden convertirse a ISO inválido. | `const d = dayjs(x); d.isValid() ? d.toISOString() : null`. |
| 20 | Subsidio: `type_subsidy_id` puede ir `undefined` | `.../subsidies/add-subsidy-form/add-subsidy-form.tsx` | 59–66 | El dropdown guarda un `value` (código); luego `find(...)?.id!`. Sin match se manda `undefined` con non-null assertion. | Guardar/usar el UUID (`id`) directamente, o abortar submit si `!type?.id`. |
| 21 | Recibo: período de diciembre usa “hoy” | `.../payment-receipts/components/standard-receipt.tsx` | 17–25, 87–93 | `isDecember` / `currentYear` salen de `new Date()`, no de `startDate`/`endDate`. Generar en diciembre un recibo de otro mes muestra leyenda incorrecta. | Derivar mes/año desde `endDate`/`startDate` del payroll. |
| 22 | Retención mensual = `biweekly_salary * 2` | `.../monthly-retention-report/utils/build-monthly-retention-report.utils.ts` | ~26–29 | Asume que el mensual es exactamente 2× la quincena actual. Si las quincenas difieren, base imponible e IR pueden quedar mal. | Usar ingreso mensual real del API o sumar ambas quincenas del mes. |
| 23 | `usePayrollStatus`: `enabled` no valida tipo | `.../hooks/payroll/usePayroll.ts` | 44 | Corre con `companie_id && module_code && branch_id` aunque el API usa `payrol_type`. Puede disparar status con tipo inválido. | Incluir `payrol_type` válido en `enabled`. |
| 24 | `useReports` crea un `QueryClient` nuevo | `.../hooks/reportes/useReports.ts` | 12–18 | `new QueryClient()` por render → `invalidateQueries` no toca el cache de la app. | Usar `useQueryClient()` del provider. |
| 25 | CreateIncome/Deduction/Subsidy invalidación frágil | `useIncomes.ts`, `useDeduction.ts`, `useSubsidy.ts` vs `usePayroll.ts` | varias | Invalidan con `variables.company_id`; la query de detalle usa `companie_id`. Funciona solo si el string coincide; es frágil. | Homogeneizar naming (`company_id` / `companie_id`) y documentar el prefijo de `queryKey`. |

---

## Baja / Consistencia

| # | Error | Archivo | Línea(s) | Descripción | Posible solución |
|---|-------|---------|----------|-------------|------------------|
| 26 | Excel vs PDF de deducciones desalineados | `.../deduction-review-pdf/constants/deduction-concepts.ts` y `deduction-review.pdf.tsx` | ~80–89 / ~104–114 | El PDF incluye conceptos (p. ej. embargo alimenticio) que el Excel no. Reportes inconsistentes. | Una sola fuente de conceptos compartida entre PDF y Excel. |
| 27 | Typo `sansion_payload` en contrato | `.../deduction-requests/create-deduction.request.ts` | 29, 75 | El body se envía como `sansion_payload`. Si el backend espera `sanction_payload`, la creación falla o se ignora. | Verificar contrato API y renombrar o adaptar en el servicio. |
| 28 | Typo `collaborato_fullname` en response | `.../deduction-responses/get-deductions.response.ts` | ~5 | Campo tipado como `collaborato_fullname`; si el API envía `collaborator_fullname`, la UI puede mostrar vacío. | Confirmar payload real y alinear tipo + UI (alias en mapper si hace falta). |

---

## Hallazgos adicionales (infra / historial)

| # | Error | Archivo | Línea(s) | Descripción | Posible solución |
|---|-------|---------|----------|-------------|------------------|
| 29 | Mapper de historial de periodos no se usa | `PayrollServices.ts` vs `payroll-periods-history.mapper.ts` | 158–164 (servicio) / 49–104 (mapper) | Existe normalizador con `items`, pero el servicio tipa y retorna array crudo. | Normalizar la respuesta en el servicio antes de devolverla al hook. |
| 30 | Paginación infinita asume array plano | `.../hooks/.../usePayrollPeriodsHistory.ts` | ~42–45 | `getNextPageParam` usa `lastPage.length`. Si el API devuelve `{ items, total_items }`, la paginación falla. | Trabajar sobre `items` (tras mapper) y usar `total_items` / page size. |
| 31 | `inss_patronal` no se mapea a `inssPatronal` | `PayrollServices.ts` + tipos closed/get-payroll | 196–201 | El raw trae `inss_patronal`; el DTO unificado declara `inssPatronal`. El mapper solo renombra colaborador. | En `mapItem`, mapear explícitamente `inssPatronal: item.inss_patronal`. |
| 32 | `mapPayrollTypeFromApi` no contempla `Prestacionado` | `payroll-periods-history.mapper.ts` | 7–13 | `PayrollType` incluye `"Prestacionado"`; el mapper lo degrada a `"None"`. | Mapear `prestacionado` → `"Prestacionado"`. |
| 33 | Merge ordinary + professional en cerradas | `PayrollServices.ts` | 204–229 | Concatena ambos arrays y reutiliza `total_items` del API. Totales/página pueden no cuadrar con `items.length`. | Definir contrato (un solo tipo por request) o paginar/totalizar en cliente de forma explícita. |

---

## Patrón dominante

La inconsistencia **`company_id` / `companie_id`** entre `BaseRequest`, servicios y UI es la causa más probable de 404 / URLs con `undefined` en reportes y deducciones.

En UI de recibos/reportes, el segundo patrón crítico es **usar campos incorrectos o incompletos** (`feriado` vs `holiday_pay`, `biweekly_salary * 2` vs quincena, keys de ingreso/deducción incompletas).

---

## Prioridad sugerida de corrección

1. Impacto financiero / legal: #1–4, #9, #11–13, #21–22  
2. Payloads / API rotas: #5–8, #10, #19–20  
3. UX de formularios: #14–18  
4. Consistencia / deuda técnica: #24–33  

---

*Generado como revisión estática del código. Validar con negocio los casos #4 (BAC) y #22 (retención mensual) antes de cambiar montos.*
