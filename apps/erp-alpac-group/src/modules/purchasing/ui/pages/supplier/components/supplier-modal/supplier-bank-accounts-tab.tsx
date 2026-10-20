import { memo, type Dispatch, type SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type {
  CreateSupplierBankAccountPayload,
  SupplierBankAccount,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { BankAccountList } from "@app/modules/purchasing/ui/pages/supplier/components/bank-account-list/bank-account-list";
import type {
  CreateBankAccountMutationArgs,
  DeleteBankAccountMutationArgs,
  UpdateBankAccountMutationArgs,
} from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";

type SupplierBankAccountsTabProps = {
  isEditMode: boolean;
  accounts: (SupplierBankAccount | CreateSupplierBankAccountPayload)[];
  companyId: string;
  moduleCode: string;
  supplierId?: string;
  setLocalBankAccounts: Dispatch<
    SetStateAction<CreateSupplierBankAccountPayload[]>
  >;
  createBankAccount: UseMutationResult<
    SupplierBankAccount,
    ApiErrorResponse,
    CreateBankAccountMutationArgs
  >;
  updateBankAccount: UseMutationResult<
    void,
    ApiErrorResponse,
    UpdateBankAccountMutationArgs
  >;
  deleteBankAccount: UseMutationResult<
    void,
    ApiErrorResponse,
    DeleteBankAccountMutationArgs
  >;
  onRequestSuccess?: (message: string) => void;
  onRequestError?: (message?: string) => void;
  getMappedError: (error: ApiErrorResponse) => { description: string };
};

export const SupplierBankAccountsTab = memo(function SupplierBankAccountsTab({
  isEditMode,
  accounts,
  companyId,
  moduleCode,
  supplierId,
  setLocalBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  onRequestSuccess,
  onRequestError,
  getMappedError,
}: SupplierBankAccountsTabProps) {
  const handleAddLocalAccount = (acc: CreateSupplierBankAccountPayload) => {
    setLocalBankAccounts((prev) => {
      if (acc.is_primary) {
        return [...prev.map((item) => ({ ...item, is_primary: false })), acc];
      }
      if (prev.length === 0) {
        return [{ ...acc, is_primary: true }];
      }
      return [...prev, acc];
    });
  };

  const handleEditLocalAccount = (
    acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
    index: number,
  ) => {
    setLocalBankAccounts((prev) => {
      const next = [...prev];
      if (acc.is_primary) {
        next.forEach((item, i) => {
          if (i !== index) item.is_primary = false;
        });
      }
      next[index] = acc;
      return next;
    });
  };

  const handleDeleteLocalAccount = (
    _acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
    index: number,
  ) => {
    setLocalBankAccounts((prev) => {
      const wasPrimary = prev[index]?.is_primary;
      const filtered = prev.filter((_, i) => i !== index);
      if (wasPrimary && filtered.length > 0) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryLocalAccount = (
    _acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
    index: number,
  ) => {
    setLocalBankAccounts((prev) =>
      prev.map((item, i) => ({
        ...item,
        is_primary: i === index,
      })),
    );
  };

  const handleAddApiAccount = (acc: CreateSupplierBankAccountPayload) => {
    if (!supplierId) return;
    createBankAccount.mutate(
      {
        companyId,
        moduleCode,
        supplierId,
        payload: acc,
      },
      {
        onSuccess: () => {
          onRequestSuccess?.("Cuenta bancaria agregada exitosamente.");
        },
        onError: (err) => {
          const mapped = getMappedError(err);
          onRequestError?.(mapped.description);
        },
      },
    );
  };

  const handleEditApiAccount = (
    acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
  ) => {
    const bankAccountId = (acc as SupplierBankAccount).id;
    if (!supplierId || !bankAccountId) return;
    const payloadData = { ...(acc as SupplierBankAccount) };
    delete (payloadData as { id?: string }).id;
    updateBankAccount.mutate(
      {
        companyId,
        moduleCode,
        supplierId,
        bankAccountId,
        payload: payloadData,
      },
      {
        onSuccess: () => {
          onRequestSuccess?.("Cuenta bancaria actualizada exitosamente.");
        },
        onError: (err) => {
          const mapped = getMappedError(err);
          onRequestError?.(mapped.description);
        },
      },
    );
  };

  const handleSetPrimaryApiAccount = (
    acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
  ) => {
    const bankAccountId = (acc as SupplierBankAccount).id;
    if (!supplierId || !bankAccountId) return;
    updateBankAccount.mutate(
      {
        companyId,
        moduleCode,
        supplierId,
        bankAccountId,
        payload: { is_primary: true },
      },
      {
        onSuccess: () => {
          onRequestSuccess?.("Cuenta bancaria marcada como principal.");
        },
        onError: (err) => {
          const mapped = getMappedError(err);
          onRequestError?.(mapped.description);
        },
      },
    );
  };

  const handleDeleteApiAccount = (
    acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
  ) => {
    const bankAccountId = (acc as SupplierBankAccount).id;
    if (!supplierId || !bankAccountId) return;
    deleteBankAccount.mutate(
      {
        companyId,
        moduleCode,
        supplierId,
        bankAccountId,
      },
      {
        onSuccess: () => {
          onRequestSuccess?.("Cuenta bancaria eliminada exitosamente.");
        },
        onError: (err) => {
          const mapped = getMappedError(err);
          onRequestError?.(mapped.description);
        },
      },
    );
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <BankAccountList
        accounts={accounts}
        onAddAccount={isEditMode ? handleAddApiAccount : handleAddLocalAccount}
        onEditAccount={
          isEditMode ? handleEditApiAccount : handleEditLocalAccount
        }
        onSetPrimary={
          isEditMode ? handleSetPrimaryApiAccount : handleSetPrimaryLocalAccount
        }
        onDeleteAccount={
          isEditMode ? handleDeleteApiAccount : handleDeleteLocalAccount
        }
        isLoading={
          createBankAccount.isPending ||
          updateBankAccount.isPending ||
          deleteBankAccount.isPending
        }
      />
    </div>
  );
});
